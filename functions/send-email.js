import { Resend } from "resend";

export async function onRequestPost({ request, env }) {
  try {
    const { name, email, message, token } = await request.json();

    // -----------------------------
    // Validate form fields
    // -----------------------------
    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ error: "All fields are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // -----------------------------
    // ✅ ReCAPTCHA Verification
    // -----------------------------
    const captchaRes = await fetch(
      "https://www.google.com/recaptcha/api/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `secret=${env.RECAPTCHA_SECRET}&response=${token}`
      }
    );

    const captchaData = await captchaRes.json();

    if (!captchaData.success) {
      return new Response(JSON.stringify({ error: "Captcha failed" }), {
        status: 403
      });
    }

    const resend = new Resend(env.RESEND_API_KEY);

    // -----------------------------
    // 📩 ADMIN EMAIL
    // -----------------------------
    const adminMailHTML = `
      <div style="font-family: 'Poppins', Arial, sans-serif; background-color: #f8f9fb; padding: 30px; color: #333;">
        <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); overflow: hidden;">
          <div style="background: linear-gradient(90deg, #7E212E, #1D6B4C); color: white; text-align: center; padding: 25px;">
            <img src="https://christthekingemba.pages.dev/logo.png" style="width: 90px; border-radius: 50%; margin-bottom: 10px;" />
            <h2>📥 New Website Inquiry</h2>
            <p>Christ The King Catholic Parish, Embakasi</p>
          </div>
          <div style="padding: 25px;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Message:</strong></p>
            <blockquote>${message}</blockquote>
          </div>
        </div>
      </div>
    `;

    // -----------------------------
    // 📤 USER CONFIRMATION EMAIL
    // -----------------------------
    const userMailHTML = `
      <div style="font-family: Poppins, Arial; padding: 20px;">
        <h2>Thank you for contacting Christ The King Parish</h2>
        <p>Dear ${name},</p>
        <p>We have received your message:</p>
        <blockquote>${message}</blockquote>
        <p>We shall reply shortly.</p>
      </div>
    `;

    // -----------------------------
    // SEND EMAILS
    // -----------------------------
    // Admin email to your Gmail (forwarded)
    await resend.emails.send({
      from: "Christ The King Parish <info@christthekingembakasi.top>",
      to: env.EMAIL_USER, // your Gmail
      subject: `📩 New Message from ${name}`,
      html: adminMailHTML,
      reply_to: email // so you can reply directly to the user
    });

    // User confirmation email
    await resend.emails.send({
      from: "Christ The King Parish <info@christthekingembakasi.top>",
      to: email,
      subject: "🙏 Thank you for contacting Christ The King Parish",
      html: userMailHTML,
      reply_to: env.EMAIL_USER // optional: reply goes back to your Gmail
    });

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" }
    });

  } catch (err) {
    console.error("Email Error:", err);
    return new Response(JSON.stringify({ error: "Email sending failed" }), {
      status: 500
    });
  }
}
