import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  try {
    const { email, subject, htmlContent } = await req.json();

    if (!email || !htmlContent) {
      return NextResponse.json({ success: false, message: "Email or content is missing" }, { status: 400 });
    }

    const emailResponse = await resend.emails.send({
      from: "onboarding@resend.dev",  
      to: email,
      subject,
      html: htmlContent,
    });

    console.log('Resend Email Response:', emailResponse);  

    return NextResponse.json({
      success: true,
      message: "Email sent successfully!",
      emailResponse,
    });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { success: false, message: "Failed to send email.", error },
      { status: 500 }
    );
  }
}
