import { NextResponse } from "next/server";
import { z } from "zod";
import { BUSINESS_INFO } from "@/data/gymData";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  plan: z.string().min(1, "Please select a plan"),
  slot: z.string().min(1, "Please select a preferred shift"),
  message: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = contactSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          errors: result.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { name, phone, plan, slot, message } = result.data;

    // Stub: In production this can send an SMS, email via Resend, or save to DB/CRM
    console.log(`[${BUSINESS_INFO.name} Contact Inquiry Received]:`, {
      timestamp: new Date().toISOString(),
      name,
      phone,
      plan,
      slot,
      message,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Thank you! Your trial session inquiry has been received. Our team will call you shortly at " + phone,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json(
      { success: false, message: `Internal server error. Please call us directly at ${BUSINESS_INFO.phone}.` },
      { status: 500 }
    );
  }
}
