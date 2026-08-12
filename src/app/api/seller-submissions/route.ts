import { NextResponse } from "next/server";
import { createSellerSubmission } from "@/lib/db";

export async function POST(request: Request) {
  const formData = await request.formData();
  const name = String(formData.get("name") || "").trim();
  const phone = String(formData.get("phone") || "").trim();
  const propertyDetail = String(formData.get("propertyDetail") || "").trim();
  const expectedPrice = String(formData.get("expectedPrice") || "").trim();

  if (!name || !phone || !propertyDetail) {
    return NextResponse.json({ error: "Please fill in all required fields." }, { status: 400 });
  }

  await createSellerSubmission({
    name,
    phone,
    propertyDetail,
    expectedPrice: expectedPrice || null,
  });

  return NextResponse.json({ ok: true });
}
