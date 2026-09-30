import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const smtpPassword = process.env.HOSTINGER_SMTP_PASSWORD || "Stepwell@admin/2025"; // Fallback to provided password

    if (!smtpPassword) {
      return NextResponse.json({ error: 'SMTP password not configured' }, { status: 500 });
    }

    const { email, fullName, runSeries, category, tshirtSize, phone, city } = data;

    const htmlContent = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #FDFBF7; border: 1px solid #E5E5E5; border-radius: 12px; overflow: hidden;">
        <div style="background-color: #18372B; padding: 40px 20px; text-align: center;">
          <h1 style="color: #D7B66A; margin: 0; font-size: 24px; letter-spacing: 2px; text-transform: uppercase;">Jawai Runners</h1>
          <p style="color: #FFFFFF; margin: 10px 0 0 0; opacity: 0.9; font-size: 14px; letter-spacing: 1px; text-transform: uppercase;">Registration Confirmed</p>
        </div>
        
        <div style="padding: 40px 30px;">
          <h2 style="color: #171717; margin-top: 0; font-size: 20px;">Hi ${fullName},</h2>
          <p style="color: #595959; line-height: 1.6; font-size: 15px;">Thank you for joining the Jawai Conservation Series. We are thrilled to have you run with us to save the native ecosystems of Jawai.</p>
          
          <div style="background-color: #FFFFFF; border: 1px solid #E5E5E5; border-radius: 8px; padding: 24px; margin: 30px 0;">
            <h3 style="color: #294D3A; margin-top: 0; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 20px; border-bottom: 1px solid #E5E5E5; padding-bottom: 10px;">Your Registration Details</h3>
            
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px 0; color: #595959; font-size: 14px; border-bottom: 1px solid #F5F5F5;">Event</td>
                <td style="padding: 10px 0; color: #171717; font-weight: 600; font-size: 14px; text-align: right; border-bottom: 1px solid #F5F5F5;">${runSeries}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #595959; font-size: 14px; border-bottom: 1px solid #F5F5F5;">Category</td>
                <td style="padding: 10px 0; color: #171717; font-weight: 600; font-size: 14px; text-align: right; border-bottom: 1px solid #F5F5F5;">${category}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #595959; font-size: 14px; border-bottom: 1px solid #F5F5F5;">T-Shirt Size</td>
                <td style="padding: 10px 0; color: #171717; font-weight: 600; font-size: 14px; text-align: right; border-bottom: 1px solid #F5F5F5;">${tshirtSize}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #595959; font-size: 14px; border-bottom: 1px solid #F5F5F5;">City</td>
                <td style="padding: 10px 0; color: #171717; font-weight: 600; font-size: 14px; text-align: right; border-bottom: 1px solid #F5F5F5;">${city}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #595959; font-size: 14px;">Contact</td>
                <td style="padding: 10px 0; color: #171717; font-weight: 600; font-size: 14px; text-align: right;">${phone}</td>
              </tr>
            </table>
          </div>
          
          <p style="color: #595959; line-height: 1.6; font-size: 15px; margin-bottom: 5px;">See you at the starting line!</p>
          <p style="color: #171717; font-weight: 600; margin-top: 0; font-size: 15px;">- Stepwells Renovater Foundation</p>
        </div>
        
        <div style="background-color: #FAF8F5; padding: 24px; text-align: center; border-top: 1px solid #E5E5E5;">
          <p style="color: #8C6A43; margin: 0; font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 600;">Run • Restore • Rewild</p>
        </div>
      </div>
    `;

    const fromEmail = 'support@stepwellsrenovaterfoundation.org';

    const transporter = nodemailer.createTransport({
      host: 'smtp.hostinger.com',
      port: 465,
      secure: true,
      auth: {
        user: fromEmail,
        pass: smtpPassword, // Using the actual password
      },
    });

    // Send to participant
    await transporter.sendMail({
      from: `"Jawai Runners" <${fromEmail}>`,
      to: email,
      subject: 'Jawai Runners - Registration Confirmed',
      html: htmlContent
    });

    // Send copy to admin
    await transporter.sendMail({
      from: `"Jawai Runners" <${fromEmail}>`,
      to: 'stepwellsrenovaterfoundation@gmail.com',
      subject: `New Jawai Runner Registration: ${fullName}`,
      html: htmlContent
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Email sending error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
