import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const formData = await request.formData();
  const name = String(formData.get("name") || "").trim();
  const phone = String(formData.get("phone") || "").trim();
  const propertyDetail = String(formData.get("propertyDetail") || "").trim();
  const expectedPrice = String(formData.get("expectedPrice") || "").trim();

  if (!name || !phone || !propertyDetail) {
    return NextResponse.json({ error: "Please fill in all required fields." }, { status: 400 });
  }

  await prisma.sellerSubmission.create({
    data: { name, phone, propertyDetail, expectedPrice: expectedPrice || undefined },
  });

  return NextResponse.json({ ok: true });
}
