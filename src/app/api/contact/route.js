// import { NextResponse } from "next/server";
// import { Resend } from "resend";

// const resend = new Resend(process.env.RESEND_API_KEY);

// export async function POST(req) {
//   try {
//     const { userEmail, subject, message, htmlContent } = await req.json();

//     if (!userEmail || !subject || !message || !htmlContent) {
//       return NextResponse.json(
//         {
//           success: false,
//           message: "Missing required fields: 'userEmail', 'subject', 'message', or 'htmlContent'.",
//         },
//         { status: 400 }
//       );
//     }

//     // Send email to GoCar Express and the user
//     const mainRecipientResponse = await resend.emails.send({
//       from: "onboarding@resend.dev",
//       to: ["gocarexpress0608@gmail.com", userEmail],  // GoCar Express and the user
//       subject: `Message from ${userEmail} | Subject: ${subject}`,
//       html: htmlContent,  // The original message content
//     });

//     // Prepare the sender's copy email
//     const senderCopyHtml = `
//       <p><strong>Note:</strong> This is a copy of the message you sent to GoCar Express.</p>
//       <hr />
//       <p><strong>Subject:</strong> ${subject}</p>
//       <p><strong>Your Message:</strong></p>
//       <blockquote
//         style="margin: 20px 0; padding: 10px 20px; background-color: #fff; border-left: 4px solid #4A90E2; color: #555; font-style: italic;"
//       >
//         ${message}
//       </blockquote>
//       <p>We’ve received your message and will get back to you as soon as possible.</p>
//       <p>For any additional questions, feel free to contact us at <a href="mailto:gocarexpress0608@gmail.com" style="color: #4A90E2; text-decoration: none;">gocarexpress0608@gmail.com</a>.</p>
//       <p style="margin-top: 20px; font-weight: bold;">Best regards,</p>
//       <p>GoCar Express Team</p>
//     `;

//     // Send email to the sender with a copy of their message
//     const senderCopyResponse = await resend.emails.send({
//       from: "onboarding@resend.dev",  
//       to: userEmail,  // Send the copy to the user
//       subject: `Your Copy: ${subject}`,  
//       html: senderCopyHtml,  // Send the formatted message
//     });

//     return NextResponse.json({
//       success: true,
//       message: "Emails sent successfully.",
//       responses: {
//         mainRecipientResponse,
//         senderCopyResponse,
//       },
//     });
//   } catch (error) {
//     console.error("Error sending email:", error);

//     return NextResponse.json(
//       {
//         success: false,
//         message: "Failed to send email.",
//         error: error.message,
//       },
//       { status: 500 }
//     );
//   }
// }
