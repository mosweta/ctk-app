// functions/api/send-email.js
import { Resend } from "resend";

export async function onRequestPost({ request, env }) {
  try {
    const { name, email, message, token } = await request.json();

    // Validate form fields
    if (!name || !email || !message || !token) {
      return new Response(
        JSON.stringify({ error: "All fields are required including reCAPTCHA" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ error: "Invalid email address" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // reCAPTCHA Verification
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
      console.error("reCAPTCHA failed:", captchaData);
      return new Response(JSON.stringify({ error: "Captcha failed" }), {
        status: 403,
        headers: { "Content-Type": "application/json" }
      });
    }

    const resend = new Resend(env.RESEND_API_KEY);

    // Escape HTML to prevent injection
    const escapeHtml = (str) => {
      if (!str) return '';
      return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
      }).replace(/\n/g, '<br>');
    };

    const escapedName = escapeHtml(name);
    const escapedEmail = escapeHtml(email);
    const escapedMessage = escapeHtml(message);

    // Admin Email HTML
    const adminMailHTML = `
      <div style="font-family: 'Poppins', Arial, sans-serif; background-color: #f8f9fb; padding: 30px; color: #333;">
        <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); overflow: hidden;">
          <div style="background: linear-gradient(90deg, #7E212E, #1D6B4C); color: white; text-align: center; padding: 25px;">
            <h2>📥 New Website Inquiry</h2>
            <p>Christ The King Catholic Parish, Embakasi</p>
          </div>
          <div style="padding: 25px;">
            <p><strong>Name:</strong> ${escapedName}</p>
            <p><strong>Email:</strong> ${escapedEmail}</p>
            <p><strong>Message:</strong></p>
            <blockquote style="background: #f5f5f5; padding: 15px; border-left: 4px solid #1D6B4C;">${escapedMessage}</blockquote>
            <p><strong>Received:</strong> ${new Date().toLocaleString()}</p>
          </div>
        </div>
      </div>
    `;

    // User Confirmation Email HTML
    const userMailHTML = `
      <div style="font-family: 'Poppins', Arial, sans-serif; background-color: #f8f9fb; padding: 30px;">
        <div style="max-width: 500px; margin: auto; background: #ffffff; border-radius: 12px; padding: 25px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h2 style="color: #1D6B4C;">Christ The King Catholic Parish</h2>
          </div>
          <h2 style="color: #1D6B4C;">Thank You, ${escapedName}!</h2>
          <p>We have received your message:</p>
          <blockquote style="background: #f5f5f5; padding: 15px; border-left: 4px solid #7E212E;">${escapedMessage}</blockquote>
          <p>We will reply to you within 24 hours at <strong>${escapedEmail}</strong>.</p>
          <p>May God bless you,<br><strong>Christ The King Catholic Parish</strong></p>
          <hr style="margin: 20px 0;" />
          <p style="font-size: 12px; color: #777; text-align: center;">Christ The King Catholic Parish, Embakasi, Nairobi</p>
        </div>
      </div>
    `;

    // Use Resend's default domain for testing
    // Option 1: Use Resend's default sender (recommended for testing)
    const fromEmail = "onboarding@resend.dev"; // Resend's default verified domain
    
    // Option 2: If you have verified a custom domain, use:
    // const fromEmail = "info@yourdomain.com";

    // Send emails in parallel
    const [adminEmail, userEmail] = await Promise.allSettled([
      resend.emails.send({
        from: `Christ The King Parish <${fromEmail}>`,
        to: [env.EMAIL_USER || "ctkcatholicparishemba@gmail.com"],
        subject: `📩 New Message from ${escapedName}`,
        html: adminMailHTML,
        reply_to: email,
      }),
      resend.emails.send({
        from: `Christ The King Parish <${fromEmail}>`,
        to: [email],
        subject: "🙏 Thank you for contacting Christ The King Parish",
        html: userMailHTML,
        reply_to: env.EMAIL_USER || "deomosweta265@gmail.com",
      })
    ]);

    // Check results
    if (adminEmail.status === 'rejected') {
      console.error("Admin email failed:", adminEmail.reason);
      return new Response(
        JSON.stringify({ error: "Failed to send notification" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    if (userEmail.status === 'rejected') {
      console.error("User email failed:", userEmail.reason);
      // Still return success since admin email worked
    }

    return new Response(
      JSON.stringify({ success: true, message: "Message sent successfully" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );

  } catch (err) {
    console.error("Email Error:", err);
    return new Response(
      JSON.stringify({ error: "Email sending failed. Please try again later." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}