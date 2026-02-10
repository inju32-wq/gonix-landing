import type { VercelRequest, VercelResponse } from "@vercel/node";
import nodemailer from "nodemailer";

// --- 간단 레이트리밋(서버리스 best-effort) ---
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 3;
const ipBucket = new Map<string, { count: number; resetAt: number }>();

function rateLimit(ip: string) {
  const now = Date.now();
  const cur = ipBucket.get(ip);
  if (!cur || now > cur.resetAt) {
    ipBucket.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return { ok: true };
  }
  if (cur.count >= RATE_LIMIT_MAX) return { ok: false, retryAfterMs: cur.resetAt - now };
  cur.count += 1;
  ipBucket.set(ip, cur);
  return { ok: true };
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function escapeHeaderText(s: string) {
  return String(s || "").replace(/[\r\n]+/g, " ").trim();
}

function escapeHtml(s: string) {
  return String(s || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}


function toBool(v?: string) {
  if (!v) return false;
  return ["true", "1", "yes", "y"].includes(v.toLowerCase());
}

function makeTicket(prefix = "GEONIX") {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase(); // 6 chars
  return `${prefix}-${y}${m}${day}-${rand}`;
}

// 서버리스가 UTC일 수 있어서 표시만 KST로 보이게(간단 KST)
function formatKST(dt = new Date()) {
  const kst = new Date(dt.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, "0");
  const d = String(kst.getUTCDate()).padStart(2, "0");
  const hh = String(kst.getUTCHours()).padStart(2, "0");
  const mm = String(kst.getUTCMinutes()).padStart(2, "0");
  const ss = String(kst.getUTCSeconds()).padStart(2, "0");
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`;
}

// 아주 간단한 언어 감지: 한글 비율로 KO/EN/BOTH
function detectLang(input: string): "ko" | "en" | "both" {
  const s = (input || "").trim();
  if (!s) return "both";
  const hangul = (s.match(/[가-힣]/g) || []).length;
  const letters = (s.match(/[A-Za-z]/g) || []).length;
  const total = hangul + letters;
  if (total === 0) return "both";

  const hangulRatio = hangul / total;

  if (hangulRatio >= 0.25) return "ko";     // 한글이 눈에 띄면 KO
  if (hangulRatio <= 0.05) return "en";     // 거의 없으면 EN
  return "both";                             // 애매하면 둘 다
}

function row(label: string, value: string) {
  return `
    <tr>
      <td style="padding:10px 0; width:140px; color:#666; border-bottom:1px solid #efefef;">${escapeHtml(label)}</td>
      <td style="padding:10px 0; color:#111; border-bottom:1px solid #efefef;">${escapeHtml(value)}</td>
    </tr>
  `;
}

function buildMailplugStyleBase(params: {
  brandText: string;     // 텍스트 로고
  brandColor: string;
  titleKo: string;
  titleEn: string;
  introKo: string;
  introEn: string;
  tableRowsHtml: string;
  messageLabelKo: string;
  messageLabelEn: string;
  messageHtml: string;   // 이미 escape + prewrap 적용된 영역
  footerKo: string;
  footerEn: string;
}) {
  const {
    brandText,
    brandColor,
    titleKo,
    titleEn,
    introKo,
    introEn,
    tableRowsHtml,
    messageLabelKo,
    messageLabelEn,
    messageHtml,
    footerKo,
    footerEn,
  } = params;

  return `
<!doctype html>
<html>
  <body style="margin:0; padding:0; background:#ffffff;">
    <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
      <tr>
        <td align="center" style="padding:24px 12px;">
          <table width="680" cellpadding="0" cellspacing="0" style="border-collapse:collapse; width:680px; max-width:680px;">
            <!-- header -->
            <tr>
              <td style="padding:0 0 10px 0;">
                <div style="font-family:Arial, sans-serif; font-size:20px; font-weight:800; color:${brandColor};">
                  ${escapeHtml(brandText)}
                </div>
              </td>
            </tr>

            <!-- thin line -->
            <tr><td style="border-top:2px solid ${brandColor}; padding:0;"></td></tr>

            <!-- title (KO/EN both in header area for admin; for user we control via content) -->
            <tr>
              <td style="padding:22px 0 12px 0; font-family:Arial, sans-serif; text-align:center;">
                <div style="font-size:18px; font-weight:800; color:${brandColor};">${escapeHtml(titleKo)}</div>
                <div style="font-size:13px; font-weight:700; color:#666; margin-top:4px;">${escapeHtml(titleEn)}</div>
              </td>
            </tr>

            <!-- intro -->
            <tr>
              <td style="padding:0 0 14px 0; font-family:Arial, sans-serif; font-size:13px; color:#333; line-height:1.7;">
                <div>${introKo}</div>
                <div style="margin-top:8px; color:#444;">${introEn}</div>
              </td>
            </tr>

            <tr><td style="border-top:1px solid #e6e6e6; padding:0;"></td></tr>

            <!-- table -->
            <tr>
              <td style="padding:14px 0 0 0;">
                <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse; font-family:Arial, sans-serif; font-size:13px;">
                  ${tableRowsHtml}
                </table>
              </td>
            </tr>

            <!-- message -->
            <tr>
              <td style="padding:12px 0 0 0;">
                <div style="font-family:Arial, sans-serif; font-size:13px; color:#333; padding:10px 0 6px 0; font-weight:800;">
                  ${escapeHtml(messageLabelKo)}
                  <span style="font-weight:600; color:#666; margin-left:8px;">${escapeHtml(messageLabelEn)}</span>
                </div>
                <div style="border:1px solid #e6e6e6; background:#fafafa; padding:12px; font-family:Arial, sans-serif; font-size:13px; color:#333; line-height:1.7;">
                  ${messageHtml}
                </div>
              </td>
            </tr>

            <!-- footer -->
            <tr>
              <td style="padding:16px 0 0 0; font-family:Arial, sans-serif; font-size:12px; color:#777; line-height:1.6;">
                <div>${footerKo}</div>
                <div style="margin-top:6px;">${footerEn}</div>
              </td>
            </tr>

            <tr><td style="padding:18px 0 0 0; border-top:1px solid #efefef;"></td></tr>
            <tr>
              <td style="padding:10px 0 0 0; font-family:Arial, sans-serif; font-size:11px; color:#999;">
                © ${new Date().getFullYear()} ${escapeHtml(brandText)}. All rights reserved.
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
  `.trim();
}

function buildAdminHtml(params: {
  brandText: string;
  brandColor: string;
  ticket: string;
  submittedAt: string;
  name: string;
  email: string;
  company?: string;
  phone?: string;
  website?: string;
  message: string;
}) {
  const { brandText, brandColor, ticket, submittedAt, name, email, company, phone, website, message } = params;

  const rowsHtml = [
    row("접수번호 / Ticket", ticket),
    row("이름 / Name", name),
    row("이메일 / Email", email),
    row("회사 / Company", company || "-"),
    row("연락처 / Phone", phone || "-"),
    row("Website", website || "-"),
    row("문의 접수일 / Submitted at", submittedAt),
  ].join("");

  const messageHtml = `<div style="white-space:pre-wrap;">${escapeHtml(message)}</div>`;

  return buildMailplugStyleBase({
    brandText,
    brandColor,
    titleKo: "문의사항 접수 (관리자)",
    titleEn: "New inquiry received (Admin)",
    introKo: `아래 내용으로 문의가 접수되었습니다. (답장은 ReplyTo로 사용자에게 연결됩니다.)`,
    introEn: `A new inquiry has been received. (Reply will go to the user via Reply-To.)`,
    tableRowsHtml: rowsHtml,
    messageLabelKo: "문의 내용",
    messageLabelEn: "Message",
    messageHtml,
    footerKo: "※ 본 메일은 시스템 자동 발송입니다.",
    footerEn: "※ This is an automated message.",
  });
}

function buildUserHtml(params: {
  brandText: string;
  brandColor: string;
  lang: "ko" | "en" | "both";
  ticket: string;
  submittedAt: string;
  name: string;
  company?: string;
  phone?: string;
  summary: string;
}) {
  const { brandText, brandColor, lang, ticket, submittedAt, name, company, phone, summary } = params;

  const rowsHtml = [
    row(lang === "en" ? "Ticket" : "접수번호 / Ticket", ticket),
    row(lang === "en" ? "Name" : "이름 / Name", name),
    row(lang === "en" ? "Submitted at" : "문의 접수일 / Submitted at", submittedAt),
    row(lang === "en" ? "Company" : "회사 / Company", company || "-"),
    row(lang === "en" ? "Phone" : "연락처 / Phone", phone || "-"),
  ].join("");

  const messageHtml = `<div style="white-space:pre-wrap;">${escapeHtml(summary)}</div>`;

  if (lang === "ko") {
    return buildMailplugStyleBase({
      brandText,
      brandColor,
      titleKo: "문의사항 접수",
      titleEn: "",
      introKo: `안녕하세요. <b>${escapeHtml(brandText)}</b>입니다.<br/>문의가 정상적으로 접수되었습니다. 아래 내용으로 확인 부탁드립니다.`,
      introEn: "",
      tableRowsHtml: rowsHtml,
      messageLabelKo: "접수 내용(요약)",
      messageLabelEn: "",
      messageHtml,
      footerKo: "※ 본 메일은 발신전용입니다. 회신이 필요한 경우, 홈페이지 문의를 다시 작성해 주세요.",
      footerEn: "",
    });
  }

  if (lang === "en") {
    return buildMailplugStyleBase({
      brandText,
      brandColor,
      titleKo: "We’ve received your inquiry",
      titleEn: "",
      introKo: `Hello <b>${escapeHtml(name)}</b>,<br/>We’ve received your inquiry successfully. Please find the details below.`,
      introEn: "",
      tableRowsHtml: rowsHtml,
      messageLabelKo: "Message (summary)",
      messageLabelEn: "",
      messageHtml,
      footerKo: "※ This email is sent from a no-reply address. If you need assistance, please submit the inquiry again via our website.",
      footerEn: "",
    });
  }

  // both
  return buildMailplugStyleBase({
    brandText,
    brandColor,
    titleKo: "문의사항 접수",
    titleEn: "We’ve received your inquiry",
    introKo: `안녕하세요. <b>${escapeHtml(brandText)}</b>입니다.<br/>문의가 정상적으로 접수되었습니다. 아래 내용으로 확인 부탁드립니다.`,
    introEn: `Hello <b>${escapeHtml(name)}</b>,<br/>We’ve received your inquiry successfully. Please find the details below.`,
    tableRowsHtml: rowsHtml,
    messageLabelKo: "접수 내용(요약)",
    messageLabelEn: "Message (summary)",
    messageHtml,
    footerKo: "※ 본 메일은 발신전용입니다. 회신이 필요한 경우, 홈페이지 문의를 다시 작성해 주세요.",
    footerEn: "※ This email is sent from a no-reply address. If you need assistance, please submit the inquiry again via our website.",
  });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method !== "POST") {
      res.status(405).json({ ok: false, error: "method_not_allowed" });
      return;
    }

    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;

    // honeypot: 봇 방지 (값 있으면 성공처럼 응답)
    if (body?.hp && String(body.hp).trim() !== "") {
      res.status(200).json({ ok: true });
      return;
    }

    // rate limit
    const ip =
      (req.headers["x-forwarded-for"] as string | undefined)?.split(",")[0]?.trim() ||
      (req.socket?.remoteAddress ?? "unknown");
    const rl = rateLimit(ip);
    if (!rl.ok) {
      res.setHeader("Retry-After", String(Math.ceil((rl.retryAfterMs ?? 0) / 1000)));
      res.status(429).json({ ok: false, error: "rate_limited" });
      return;
    }

    const name = String(body?.name || "").trim();
    const email = String(body?.email || "").trim();
    const message = String(body?.message || "").trim();
    const company = String(body?.company || "").trim();
    const website = String(body?.website || "").trim();
    const phone = String(body?.phone || "").trim();

    if (!name || !email || !message) {
      res.status(400).json({ ok: false, error: "missing_fields" });
      return;
    }
    if (!isValidEmail(email)) {
      res.status(400).json({ ok: false, error: "invalid_email" });
      return;
    }
    if (name.length > 80 || company.length > 120 || website.length > 200 || phone.length > 80) {
      res.status(400).json({ ok: false, error: "field_too_long" });
      return;
    }
    if (message.length > 5000) {
      res.status(400).json({ ok: false, error: "message_too_long" });
      return;
    }

    const host = process.env.MAIL_HOST;
    const port = Number(process.env.MAIL_PORT || 465);
    const secure = toBool(process.env.MAIL_SECURE || "true");
    const user = process.env.MAIL_USER;
    const pass = process.env.MAIL_PASS;
    const to = process.env.MAIL_TO;

    if (!host || !user || !pass || !to) {
      res.status(500).json({ ok: false, error: "server_not_configured" });
      return;
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: { user, pass },
    });

    const safeName = escapeHeaderText(name);
    const safeEmail = escapeHeaderText(email);

    const ticket = makeTicket("GEONIX");
    const submittedAt = formatKST(new Date());
    const brandText = "geonix";
    const brandColor = "#ff6a00"; // 예시(메일플러그 느낌). 원하면 GEONIX 메인 컬러로 교체

    // 관리자 메일 (HTML + text)
    const adminSubject = `[GEONIX][CONTACT][TICKET:${ticket}] ${safeName} <${safeEmail}>`;
    const adminText = [
      `[접수번호] ${ticket}`,
      `SubmittedAt: ${submittedAt}`,
      "",
      `Name: ${name}`,
      `Email: ${email}`,
      company ? `Company: ${company}` : "Company: -",
      phone ? `Phone: ${phone}` : "Phone: -",
      website ? `Website: ${website}` : "Website: -",
      "",
      "Message:",
      message,
    ].join("\n");

    const adminHtml = buildAdminHtml({
      brandText,
      brandColor,
      ticket,
      submittedAt,
      name,
      email,
      company,
      phone,
      website,
      message,
    });

    await transporter.sendMail({
      from: `"Website Contact" <${user}>`,
      to,
      replyTo: email,
      subject: adminSubject,
      text: adminText,
      html: adminHtml,
    });

    // 사용자 자동회신 (언어 감지)
    const lang = detectLang(`${name} ${company} ${message}`);
    const summary = message.length > 400 ? `${message.slice(0, 400)}...` : message;

    const userSubject =
      lang === "en"
        ? `We’ve received your inquiry (Ticket: ${ticket})`
        : lang === "ko"
          ? `문의가 접수되었습니다 (접수번호: ${ticket})`
          : `문의가 접수되었습니다 / We’ve received your inquiry (Ticket: ${ticket})`;

    const userTextKo = [
      `안녕하세요 ${name}님,`,
      `문의가 정상적으로 접수되었습니다.`,
      "",
      `- 접수번호: ${ticket}`,
      `- 문의 접수일: ${submittedAt}`,
      `- Company: ${company || "-"}`,
      `- Phone: ${phone || "-"}`,
      "",
      `접수 내용(요약):`,
      summary,
      "",
      `담당자가 확인 후 회신드리겠습니다. 감사합니다.`,
    ].join("\n");

    const userTextEn = [
      `Hello ${name},`,
      `We’ve received your inquiry successfully.`,
      "",
      `- Ticket: ${ticket}`,
      `- Submitted at: ${submittedAt} (KST)`,
      `- Company: ${company || "-"}`,
      `- Phone: ${phone || "-"}`,
      "",
      `Message (summary):`,
      summary,
      "",
      `Our team will get back to you as soon as possible. Thank you.`,
    ].join("\n");

    const userText =
      lang === "ko" ? userTextKo : lang === "en" ? userTextEn : `${userTextKo}\n\n------------------------------\n\n${userTextEn}`;

    const userHtml = buildUserHtml({
      brandText,
      brandColor,
      lang,
      ticket,
      submittedAt,
      name,
      company,
      phone,
      summary,
    });

    await transporter.sendMail({
      from: `"geonix" <${user}>`,
      to: email,
      replyTo: to, // 사용자가 회신하면 관리자에게
      subject: userSubject,
      text: userText,
      html: userHtml,
    });

    res.status(200).json({ ok: true, ticket });
  } catch (e: any) {
    console.error("CONTACT_API_ERROR:", e?.message || e);
    return res.status(500).json({ ok: false, error: "send_failed" });
  }
}
