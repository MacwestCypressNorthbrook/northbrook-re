import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

const SERVICE_LABELS: Record<string, string> = {
  "ship-agency": "Ship Agency & Husbandry",
  freight: "Air & Sea Freight",
  bunkering: "Bunkering",
  warehousing: "Warehousing & Cargo Consolidation",
  documentation: "Import & Export Documentation",
  "crew-management": "Crew Management",
  customs: "Customs Clearance",
  haulage: "Haulage Services",
  "marine-technical": "Marine Technical Services",
  general: "General Inquiry",
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, company, email, phone, service, message, consent } = body;

    // Validate fields
    if (!name || !company || !email || !service || !message) {
      return NextResponse.json(
        { error: "Missing required fields in the request body." },
        { status: 400 }
      );
    }

    const serviceName = SERVICE_LABELS[service] || service;

    // Compile email body - Auth & Professional North-Brook layout
    const emailSubject = `[Inquiry] New Client Brief from ${company} - ${serviceName}`;

    const plainText = `
============================================================
NORTH-BROOK LTD. - CLIENT INQUIRY BRIEF
============================================================
Date: ${new Date().toISOString()}
Interest: ${serviceName}

CLIENT PROFILE:
- Contact Name: ${name}
- Company: ${company}
- Email: ${email}
- Phone: ${phone || "N/A"}

BRIEF DETAILS:
${message}

------------------------------------------------------------
Consent: Client agreed to the privacy policy data terms: ${consent ? "YES" : "NO"}
============================================================
    `.trim();

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>North-Brook Inquiry Brief</title>
  <style>
    body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f7f7f7; color: #1a1615; margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e8e3e3; border-top: 4px solid #E31E24; }
    .header { padding: 30px; background-color: #0D0D0D; text-align: left; }
    .header h1 { color: #ffffff; margin: 0; font-size: 18px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; }
    .content { padding: 40px; }
    .section-title { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.2em; color: #E31E24; border-bottom: 1px solid #e8e3e3; padding-bottom: 10px; margin-bottom: 20px; margin-top: 30px; }
    .grid { width: 100%; border-collapse: collapse; }
    .grid td { padding: 8px 0; vertical-align: top; font-size: 14px; }
    .grid td.label { font-weight: bold; width: 140px; color: #4a4645; }
    .message-box { background-color: #f9f9f9; border-left: 3px solid #E31E24; padding: 20px; font-size: 14px; line-height: 1.6; color: #2d2a29; margin-top: 15px; white-space: pre-wrap; }
    .footer { background-color: #f9f9f9; padding: 20px 40px; font-size: 11px; color: #7a7675; text-align: center; border-top: 1px solid #e8e3e3; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>North-Brook Ltd. Operations</h1>
    </div>
    <div class="content">
      <div style="font-size: 18px; font-weight: 700; color: #0D0D0D; margin-bottom: 5px;">New Client Inquiry</div>
      <div style="font-size: 12px; color: #7a7675;">Submitted via the digital portal on ${new Date().toLocaleDateString("en-GH", { dateStyle: "long" })}</div>

      <div class="section-title">Client Details</div>
      <table class="grid">
        <tr>
          <td class="label">Contact Name:</td>
          <td>${name}</td>
        </tr>
        <tr>
          <td class="label">Company Name:</td>
          <td><strong>${company}</strong></td>
        </tr>
        <tr>
          <td class="label">Email Address:</td>
          <td><a href="mailto:${email}" style="color: #E31E24; text-decoration: none;">${email}</a></td>
        </tr>
        <tr>
          <td class="label">Phone Number:</td>
          <td>${phone ? `<a href="tel:${phone}" style="color: #1a1615; text-decoration: none;">${phone}</a>` : "N/A"}</td>
        </tr>
        <tr>
          <td class="label">Service Focus:</td>
          <td><span style="background-color: #E31E24; color: #ffffff; padding: 3px 8px; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.1em; border-radius: 2px;">${serviceName}</span></td>
        </tr>
      </table>

      <div class="section-title">Operations Brief</div>
      <div class="message-box">${message}</div>
    </div>
    <div class="footer">
      This is an automated dispatch from the North-Brook Ltd website contact form. <br />
      Data storage consent: ${consent ? "Approved" : "Not Provided"}.
    </div>
  </div>
</body>
</html>
    `.trim();

    // Check for SMTP config
    const host = process.env.SMTP_HOST;
    const port = parseInt(process.env.SMTP_PORT || "587");
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASSWORD;
    const fromEmail = process.env.SMTP_FROM || "no-reply@northbrook.com.gh";

    const toEmail = "info@northbrook.com.gh";

    if (host && user && pass) {
      // Setup mail transporter
      const transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: { user, pass },
      });

      // Send mail
      await transporter.sendMail({
        from: `"North-Brook Portal" <${fromEmail}>`,
        to: toEmail,
        replyTo: email,
        subject: emailSubject,
        text: plainText,
        html: htmlContent,
      });

      return NextResponse.json({ success: true, message: "Email sent successfully." });
    } else {
      // Fallback: log for developers and simulate local successful receipt
      console.log("==========================================");
      console.log("SMTP Environment variables not configured.");
      console.log(`Simulating email dispatch to: ${toEmail}`);
      console.log(`Subject: ${emailSubject}`);
      console.log("------------------------------------------");
      console.log(plainText);
      console.log("==========================================");

      return NextResponse.json({
        success: true,
        mocked: true,
        message: "SMTP configuration not active. Inquiry compiled and logged to operations desk.",
      });
    }
  } catch (error: any) {
    console.error("Error handling contact form submission:", error);
    return NextResponse.json(
      { error: "Failed to compile or submit operations brief." },
      { status: 500 }
    );
  }
}
