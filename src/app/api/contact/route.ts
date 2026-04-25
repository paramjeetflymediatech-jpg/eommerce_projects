import { NextRequest } from "next/server";
import { sendContactInquiryEmail, sendContactConfirmationEmail } from "@/lib/mailer";
import { apiResponse, apiError } from "@/lib/utils";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { firstName, lastName, email, subject, message } = body;

    if (!firstName || !lastName || !email || !subject || !message) {
      return apiError("All fields are required", 400);
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return apiError("Please provide a valid email address", 400);
    }

    // 1. Send the inquiry email to the business owner (Admin)
    await sendContactInquiryEmail({
      firstName,
      lastName,
      email,
      subject,
      message,
    });

    // 2. Send a confirmation email to the customer
    await sendContactConfirmationEmail(email, `${firstName} ${lastName}`);

    return apiResponse({ message: "Message sent successfully" });
  } catch (error: any) {
    console.error("Contact form error:", error);
    return apiError("Failed to send message. Please try again later.", 500);
  }
}
