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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method !== "POST") {
      res.status(405).json({ ok: false, error: "method_not_allowed" });
      return;
    }

    // Content-Type 체크(너무 엄격하면 통과 못할 수 있어 완화)
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

    // ✅ 프론트는 message에 "문의내용(details)"만 보내는 것을 전제로 함
    const name = String(body?.name || "").trim();
    const email = String(body?.email || "").trim();
    const message = String(body?.message || "").trim(); // details
    const company = String(body?.company || "").trim();
    const website = String(body?.website || "").trim();
    const phone = String(body?.phone || "").trim(); // ✅ 추가

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
    const secure = String(process.env.MAIL_SECURE || "true") === "true";
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

    await transporter.sendMail({
      from: `"Website Contact" <${user}>`, // 발송 계정 = MAIL_USER
      to, // 수신자 = MAIL_TO
      replyTo: email, // 답장은 사용자에게
      subject: `[GEONIX 웹문의] ${safeName} (${safeEmail})`,
      text: [
        `Name: ${name}`,
        `Email: ${email}`,
        company ? `Company: ${company}` : "",
        phone ? `Phone: ${phone}` : "",
        website ? `Website: ${website}` : "",
        "",
        "Message:",
        message,
      ]
        .filter(Boolean)
        .join("\n"),
    });

    res.status(200).json({ ok: true });
  } catch (e: any) {
    console.error("CONTACT_API_ERROR:", e?.message || e);
    return res.status(500).json({ ok: false, error: "send_failed" });
  }
}
