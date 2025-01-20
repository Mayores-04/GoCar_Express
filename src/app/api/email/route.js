import { NextResponse } from "next/server";
import { Resend } from "resend";
import EmailApprovalSender from "@/app/emails/EmailApprovalSender";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  try {
    const { to, subject, renterName } = await req.json();

    await resend.sendEmail({
      from: "jakemayores05@gmail.com",
      to,
      subject,
      react: EmailApprovalSender({ userFirstName: renterName }),
    });

    return NextResponse.json({ success: true, message: "Email sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json({ success: false, message: "Failed to send email.", error });
  }
}
