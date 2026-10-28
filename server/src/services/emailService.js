import nodemailer from "nodemailer";

export const sendEnquiryEmailAlert = async (enquiryData) => {
  const { fullName, companyName, phone, email, city, quantity, selectedProducts, message } = enquiryData;

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
      <div style="background-color: #0f2b46; color: #ffffff; padding: 20px 24px;">
        <h2 style="margin: 0; font-size: 20px; font-weight: 700;">🚨 New Bulk Enquiry Received</h2>
        <p style="margin: 4px 0 0 0; color: #f97316; font-size: 14px; font-weight: 600;">Sri Salasar Marketing B2B Portal</p>
      </div>
      
      <div style="padding: 24px; background-color: #f8fafc;">
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <tr style="border-bottom: 1px solid #e2e8f0;">
            <td style="padding: 10px 0; font-weight: bold; color: #475569; width: 35%;">Client Name:</td>
            <td style="padding: 10px 0; color: #0f172a; font-weight: 600;">${fullName}</td>
          </tr>
          <tr style="border-bottom: 1px solid #e2e8f0;">
            <td style="padding: 10px 0; font-weight: bold; color: #475569;">Company Name:</td>
            <td style="padding: 10px 0; color: #0f172a;">${companyName || "N/A"}</td>
          </tr>
          <tr style="border-bottom: 1px solid #e2e8f0;">
            <td style="padding: 10px 0; font-weight: bold; color: #475569;">Mobile Phone:</td>
            <td style="padding: 10px 0; color: #2563eb; font-weight: bold;">
              <a href="tel:${phone}" style="color: #2563eb; text-decoration: none;">${phone}</a>
            </td>
          </tr>
          <tr style="border-bottom: 1px solid #e2e8f0;">
            <td style="padding: 10px 0; font-weight: bold; color: #475569;">Email:</td>
            <td style="padding: 10px 0; color: #0f172a;">${email || "N/A"}</td>
          </tr>
          <tr style="border-bottom: 1px solid #e2e8f0;">
            <td style="padding: 10px 0; font-weight: bold; color: #475569;">City / Location:</td>
            <td style="padding: 10px 0; color: #0f172a;">${city || "N/A"}</td>
          </tr>
          <tr style="border-bottom: 1px solid #e2e8f0;">
            <td style="padding: 10px 0; font-weight: bold; color: #475569;">Required Quantity:</td>
            <td style="padding: 10px 0; color: #ea580c; font-weight: bold;">${quantity || "Standard Batch"}</td>
          </tr>
          <tr style="border-bottom: 1px solid #e2e8f0;">
            <td style="padding: 10px 0; font-weight: bold; color: #475569;">Products Selected:</td>
            <td style="padding: 10px 0; color: #0f172a;">
              ${Array.isArray(selectedProducts) ? selectedProducts.join(", ") : (selectedProducts || "General Catalogue")}
            </td>
          </tr>
        </table>

        ${message ? `
          <div style="background-color: #ffffff; padding: 16px; border-left: 4px solid #ea580c; border-radius: 4px; margin-top: 15px;">
            <strong style="color: #334155;">Customer Message / Specs:</strong>
            <p style="margin: 8px 0 0 0; color: #1e293b; line-height: 1.5;">${message}</p>
          </div>
        ` : ""}

        <div style="margin-top: 25px; text-align: center;">
          <a href="https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(fullName)},%20thank%20you%20for%20contacting%20Sri%20Salasar%20Marketing.%20We%20received%20your%20enquiry." 
             style="background-color: #22c55e; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold; display: inline-block;">
             Reply on WhatsApp
          </a>
        </div>
      </div>
      
      <div style="background-color: #0f172a; color: #94a3b8; padding: 12px 24px; font-size: 12px; text-align: center;">
        Sri Salasar Marketing Automated Lead Dispatcher &bull; Chennai, Tamil Nadu
      </div>
    </div>
  `;

  // Try sending via Nodemailer if SMTP configured
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || "smtp.gmail.com",
      port: Number(process.env.EMAIL_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const info = await transporter.sendMail({
      from: `"Sri Salasar Portal" <${process.env.EMAIL_USER || "enquiries@srisalasarmarketing.in"}>`,
      to: process.env.EMAIL_TO || "info@srisalasarmarketing.in",
      subject: `🚨 [New Bulk Enquiry] ${companyName ? `${companyName} (${fullName})` : fullName} - ${quantity}`,
      html: htmlContent
    });

    console.log(`[Email Alert] Sent successfully to ${process.env.EMAIL_TO}: MessageID ${info.messageId}`);
    return true;
  } catch (error) {
    console.log(`[Email Alert Notification] (Simulated/Dev Mode - Real SMTP credentials not set):`);
    console.log(`- Lead: ${fullName} (${companyName}) | Phone: ${phone} | Products: ${selectedProducts}`);
    return false;
  }
};
