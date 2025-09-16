import { NextRequest, NextResponse } from "next/server";
import { MercadoPagoConfig, Preference } from "mercadopago";

// Initialize Mercado Pago
const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
  options: { timeout: 5000 },
});

const preference = new Preference(client);

export async function POST(request: NextRequest) {
  try {
    // Validate environment variables
    if (!process.env.MP_ACCESS_TOKEN) {
      return NextResponse.json(
        { error: "Mercado Pago access token not configured" },
        { status: 500 },
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const { title, quantity, unit_price } = body;

    // Input validation
    if (!title || typeof title !== "string") {
      return NextResponse.json(
        { error: "Title is required and must be a string" },
        { status: 400 },
      );
    }

    if (!quantity || typeof quantity !== "number" || quantity <= 0) {
      return NextResponse.json(
        { error: "Quantity is required and must be a positive number" },
        { status: 400 },
      );
    }

    if (!unit_price || typeof unit_price !== "number" || unit_price <= 0) {
      return NextResponse.json(
        { error: "Unit price is required and must be a positive number" },
        { status: 400 },
      );
    }

    // Create payment preference
    const preferenceData = {
      items: [
        {
          title,
          quantity,
          unit_price,
          currency_id: "ARS", // Default to Argentine Peso, can be made configurable
          id: "1",
        },
      ],
      back_urls: {
        success: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/success`,
        failure: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/failure`,
        pending: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/pending`,
      },
      auto_return: "approved",
    };

    const response = await preference.create({ body: preferenceData });

    return NextResponse.json({
      id: response.id,
      init_point: response.init_point,
      sandbox_init_point: response.sandbox_init_point,
    });
  } catch (error) {
    console.error("Error creating Mercado Pago preference:", error);
    return NextResponse.json(
      { error: "Failed to create payment preference" },
      { status: 500 },
    );
  }
}
