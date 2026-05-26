import { Resend } from 'resend';

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;
const FROM_EMAIL = 'NextGen IT Institute <onboarding@resend.dev>'; // Usually this should be a verified domain

export async function sendWelcomeEmail(email: string, name: string) {
  const subject = 'Welcome to NextGen IT Institute!';
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
      <div style="background-color: #000E1F; padding: 24px; text-align: center;">
        <h1 style="color: #FF6B00; margin: 0;">NEXT<span style="color: white;">GEN</span></h1>
        <p style="color: #888; font-size: 12px; letter-spacing: 2px; margin-top: 4px; text-transform: uppercase;">IT Institute</p>
      </div>
      <div style="padding: 32px; background-color: #ffffff;">
        <h2 style="color: #333; margin-top: 0;">Welcome, ${name}! 🎉</h2>
        <p style="color: #555; line-height: 1.6;">
          We are thrilled to welcome you to the NextGen IT Institute! Your learning journey starts today. 
          Through our portal, you will be able to access premium courses, stay updated with announcements, and track your progress.
        </p>
        <p style="color: #555; line-height: 1.6;">
          If you have any questions, our support team is always here for you.
        </p>
        <div style="margin-top: 32px; text-align: center;">
          <a href="https://nextgen-it-institute-portal.vercel.app/dashboard" style="background-color: #FF6B00; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Go to Dashboard</a>
        </div>
      </div>
      <div style="background-color: #f9f9f9; padding: 16px; text-align: center; color: #888; font-size: 12px;">
        &copy; ${new Date().getFullYear()} NextGen IT Institute. All rights reserved.
      </div>
    </div>
  `;

  if (!resend) {
    console.log('\n[MOCK EMAIL SENT] - Welcome Email');
    console.log(`To: ${email}\nSubject: ${subject}\nHTML: [Skipped log]`);
    return { success: true };
  }

  try {
    const data = await resend.emails.send({
      from: FROM_EMAIL,
      to: [email],
      subject,
      html,
    });
    return { success: true, data };
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return { success: false, error };
  }
}

export async function sendFeeClearedEmail(email: string, amount: number, invoiceNumber: string) {
  const subject = 'Your Dues Have Been Cleared!';
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
      <div style="background-color: #000E1F; padding: 24px; text-align: center;">
        <h1 style="color: #FF6B00; margin: 0;">NEXT<span style="color: white;">GEN</span></h1>
      </div>
      <div style="padding: 32px; background-color: #ffffff;">
        <h2 style="color: #10B981; margin-top: 0;">Payment Received ✅</h2>
        <p style="color: #555; line-height: 1.6;">
          Thank you! We have received your payment of <strong>$${amount}</strong> for Invoice <strong>${invoiceNumber}</strong>.
        </p>
        <p style="color: #555; line-height: 1.6;">
          Your dues are now clear. You can now access all restricted features, including your Digital ID Card from the student dashboard.
        </p>
        <div style="margin-top: 32px; text-align: center;">
          <a href="https://nextgen-it-institute-portal.vercel.app/dashboard/id-card" style="background-color: #10B981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">View Digital ID Card</a>
        </div>
      </div>
    </div>
  `;

  if (!resend) {
    console.log('\n[MOCK EMAIL SENT] - Fee Cleared Email');
    console.log(`To: ${email}\nSubject: ${subject}\nHTML: [Skipped log]`);
    return { success: true };
  }

  try {
    const data = await resend.emails.send({
      from: FROM_EMAIL,
      to: [email],
      subject,
      html,
    });
    return { success: true, data };
  } catch (error) {
    console.error('Error sending fee cleared email:', error);
    return { success: false, error };
  }
}

export async function sendFeeReminderEmail(email: string, amount: number, invoiceNumber: string, dueDate: string) {
  const subject = 'Reminder: Pending Dues for NextGen IT Institute';
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
      <div style="background-color: #000E1F; padding: 24px; text-align: center;">
        <h1 style="color: #FF6B00; margin: 0;">NEXT<span style="color: white;">GEN</span></h1>
      </div>
      <div style="padding: 32px; background-color: #ffffff;">
        <h2 style="color: #EF4444; margin-top: 0;">Fee Reminder ⚠️</h2>
        <p style="color: #555; line-height: 1.6;">
          This is a friendly reminder that you have pending dues of <strong>$${amount}</strong> for Invoice <strong>${invoiceNumber}</strong>.
        </p>
        <p style="color: #555; line-height: 1.6;">
          The due date for this payment is/was <strong>${new Date(dueDate).toLocaleDateString()}</strong>. Please clear your dues at your earliest convenience to avoid any disruption to your learning or access to the Digital ID Card.
        </p>
        <div style="margin-top: 32px; text-align: center;">
          <a href="https://nextgen-it-institute-portal.vercel.app/dashboard/fee" style="background-color: #EF4444; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Pay Now</a>
        </div>
      </div>
    </div>
  `;

  if (!resend) {
    console.log('\n[MOCK EMAIL SENT] - Fee Reminder Email');
    console.log(`To: ${email}\nSubject: ${subject}\nHTML: [Skipped log]`);
    return { success: true };
  }

  try {
    const data = await resend.emails.send({
      from: FROM_EMAIL,
      to: [email],
      subject,
      html,
    });
    return { success: true, data };
  } catch (error) {
    console.error('Error sending fee reminder email:', error);
    return { success: false, error };
  }
}
