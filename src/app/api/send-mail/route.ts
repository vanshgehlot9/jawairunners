import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { rateLimit } from '@/lib/rate-limit';
import { escapeHtml, isValidEmail, sanitizeString } from '@/lib/security';

export async function POST(req: Request) {
  try {
    // 1. Enforce strict rate limiting: 5 emails per minute per IP
    const limiter = rateLimit(req, {
      maxRequests: 5,
      windowMs: 60 * 1000,
      identifier: 'send-mail',
    });

    if (!limiter.allowed && limiter.errorResponse) {
      return limiter.errorResponse;
    }

    const data = await req.json();
    const smtpPassword = process.env.HOSTINGER_SMTP_PASSWORD;

    if (!smtpPassword) {
      console.error('SMTP configuration error: HOSTINGER_SMTP_PASSWORD not set');
      return NextResponse.json({ error: 'Mail service unavailable' }, { status: 503 });
    }

    const {
      email,
      fullName,
      phone,
      city,
      activity = 'runner',
      startingPoint = 'jawai_bandh',
      runDistance,
      registrationId,
      paymentId,
      amount,
    } = data;

    // 2. Strict input validation
    if (!email || !isValidEmail(email)) {
      return NextResponse.json({ error: 'Valid email address is required' }, { status: 400 });
    }

    const safeFullName = escapeHtml(sanitizeString(fullName, 100));
    const safePhone = escapeHtml(sanitizeString(phone, 30));
    const safeCity = escapeHtml(sanitizeString(city, 80));
    const safeRegId = escapeHtml(sanitizeString(registrationId, 30));
    const safePaymentId = escapeHtml(sanitizeString(paymentId, 60));
    const safeAmount = Number(amount) > 0 ? Number(amount) : null;

    const activityLabel =
      activity === 'runner'
        ? `Jawai Trail Runner ${runDistance ? `(${escapeHtml(sanitizeString(runDistance, 20))})` : ''}`
        : activity === 'cyclist'
        ? 'Jawai Wilderness Cyclist'
        : activity === 'horse_rider'
        ? 'Jawai Guided Horse Rider'
        : escapeHtml(sanitizeString(activity, 40));

    const venueLabel =
      startingPoint === 'jawai_bandh'
        ? 'Jawai Bandh Start'
        : startingPoint === 'bera'
        ? 'Bera Start'
        : startingPoint === 'conservation'
        ? 'Conservation Community Site'
        : escapeHtml(sanitizeString(startingPoint, 50));

    // 3. Sanitized HTML Email Template
    const htmlContent = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #FAF8F5; border: 1px solid #E5E5E5; border-radius: 12px; overflow: hidden;">
        <div style="background-color: #18372B; padding: 40px 20px; text-align: center;">
          <h1 style="color: #C69A3A; margin: 0; font-size: 24px; letter-spacing: 2px; text-transform: uppercase;">Jawai Triathlon</h1>
          <p style="color: #FFFFFF; margin: 10px 0 0 0; opacity: 0.9; font-size: 13px; letter-spacing: 1.5px; text-transform: uppercase;">Official Registration Confirmed</p>
        </div>
        
        <div style="padding: 40px 30px;">
          <h2 style="color: #171717; margin-top: 0; font-size: 20px;">Hi ${safeFullName},</h2>
          <p style="color: #595959; line-height: 1.6; font-size: 15px;">
            Thank you for registering for the <strong>Jawai Triathlon — Jungle Pacho Lanao</strong>. Your participation directly supports our environmental and water sanctuary initiatives.
          </p>
          
          <div style="background-color: #FFFFFF; border: 1px solid #E5E5E5; border-radius: 8px; padding: 24px; margin: 28px 0;">
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #E5E5E5; padding-bottom: 12px; margin-bottom: 16px;">
              <span style="color: #294D3A; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">Registration Pass</span>
              <span style="color: #C69A3A; font-weight: bold; font-family: monospace; font-size: 14px;">${safeRegId || 'JT-PENDING'}</span>
            </div>
            
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px 0; color: #595959; font-size: 14px; border-bottom: 1px solid #F5F5F5;">Discipline</td>
                <td style="padding: 10px 0; color: #171717; font-weight: 600; font-size: 14px; text-align: right; border-bottom: 1px solid #F5F5F5;">${activityLabel}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #595959; font-size: 14px; border-bottom: 1px solid #F5F5F5;">Starting Venue</td>
                <td style="padding: 10px 0; color: #171717; font-weight: 600; font-size: 14px; text-align: right; border-bottom: 1px solid #F5F5F5;">${venueLabel}</td>
              </tr>
              ${safeAmount ? `
              <tr>
                <td style="padding: 10px 0; color: #595959; font-size: 14px; border-bottom: 1px solid #F5F5F5;">Fee Paid</td>
                <td style="padding: 10px 0; color: #171717; font-weight: 600; font-size: 14px; text-align: right; border-bottom: 1px solid #F5F5F5;">₹${safeAmount}</td>
              </tr>
              ` : ''}
              ${safePaymentId ? `
              <tr>
                <td style="padding: 10px 0; color: #595959; font-size: 14px; border-bottom: 1px solid #F5F5F5;">Payment ID</td>
                <td style="padding: 10px 0; color: #294D3A; font-family: monospace; font-size: 13px; text-align: right; border-bottom: 1px solid #F5F5F5;">${safePaymentId}</td>
              </tr>
              ` : ''}
              <tr>
                <td style="padding: 10px 0; color: #595959; font-size: 14px; border-bottom: 1px solid #F5F5F5;">City</td>
                <td style="padding: 10px 0; color: #171717; font-weight: 600; font-size: 14px; text-align: right; border-bottom: 1px solid #F5F5F5;">${safeCity}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #595959; font-size: 14px;">Contact Phone</td>
                <td style="padding: 10px 0; color: #171717; font-weight: 600; font-size: 14px; text-align: right;">${safePhone}</td>
              </tr>
            </table>
          </div>
          
          <p style="color: #595959; line-height: 1.6; font-size: 15px; margin-bottom: 5px;">See you at the starting line!</p>
          <p style="color: #171717; font-weight: 600; margin-top: 0; font-size: 15px;">- Stepwells Renovater Foundation</p>
        </div>
        
        <div style="background-color: #FAF8F5; padding: 24px; text-align: center; border-top: 1px solid #E5E5E5;">
          <p style="color: #8C6A43; margin: 0; font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 600;">Jungle Pacho Lanao • Stepwells Renovater Foundation</p>
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
        pass: smtpPassword,
      },
    });

    // Send confirmation to participant
    await transporter.sendMail({
      from: `"Jawai Triathlon" <${fromEmail}>`,
      to: email,
      subject: `Jawai Triathlon - Registration Confirmed (${safeRegId || 'JT-PASS'})`,
      html: htmlContent,
    });

    // Send copy to admin
    await transporter.sendMail({
      from: `"Jawai Triathlon" <${fromEmail}>`,
      to: 'stepwellsrenovaterfoundation@gmail.com',
      subject: `New Participant Registration: ${safeFullName} [${safeRegId || 'JT-PASS'}]`,
      html: htmlContent,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Email sending error:', error);
    return NextResponse.json({ error: 'Failed to dispatch email' }, { status: 500 });
  }
}
