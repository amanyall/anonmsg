import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
   email: string,
   username: string,
   verifyCode: string,
): Promise<ApiResponse> {
   try {
      const response = await resend.emails.send({
         from: 'onboarding@resend.dev',
         to: email,
         subject: 'Anon msg | Verification code',
         react: VerificationEmail({ username, otp: verifyCode }),
      });

      // Check if response has a successful email ID
      if (response?.data?.id) {
         console.log("Email sent successfully. Email ID:", response.data.id);
         // If email was successfully sent, return success
         return { success: true, message: 'Verification email sent successfully' };
      } else {
         // If email ID is missing, it means something went wrong
         console.error("Failed to send email: No email ID returned", response);
         return { success: false, message: 'Failed to send verification email' };
      }
   } catch (emailError) {
      // Catch any unexpected errors and return failure
      console.error("Error sending verification email", emailError);
      return { success: false, message: 'Failed to send verification email' };
   }
}
