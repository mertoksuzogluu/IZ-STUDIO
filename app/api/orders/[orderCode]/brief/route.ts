import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(
  _req: NextRequest,
  { params }: { params: { orderCode: string } }
) {
  try {
    const order = await prisma.order.findUnique({
      where: { orderCode: params.orderCode },
      select: { physicalPackage: true },
    })
    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 })
    return NextResponse.json({ physicalPackage: order.physicalPackage })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { orderCode: string } }
) {
  try {
    const session = await auth()
    const orderCode = params.orderCode
    const body = await req.json()
    const {
      email,
      phoneNumber,
      names,
      occasion,
      tone,
      notes,
      urgency,
      shippingFullName,
      shippingAddressLine1,
      shippingAddressLine2,
      shippingCity,
      shippingDistrict,
      shippingPostalCode,
      shippingPhone,
    } = body

    const order = await prisma.order.findUnique({
      where: { orderCode },
    })

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    // Check authorization: either user owns order or it's a guest order
    if (order.userId && order.userId !== session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // For guest orders, create user if email provided and user doesn't exist
    if (!order.userId && email) {
      let user = await prisma.user.findUnique({
        where: { email },
      })

      if (!user) {
        // Create user for guest order
        user = await prisma.user.create({
          data: {
            email,
            role: "user",
          },
        })
      }

      // Link order to user
      await prisma.order.update({
        where: { id: order.id },
        data: { userId: user.id },
      })
    }

    await prisma.orderBrief.upsert({
      where: { orderId: order.id },
      update: {
        names,
        occasion,
        tone,
        notes,
        urgency,
      },
      create: {
        orderId: order.id,
        names,
        occasion,
        tone,
        notes,
        urgency,
      },
    })

    // Update order with guest email and phone number if needed
    if (!order.userId && (email || phoneNumber)) {
      await prisma.order.update({
        where: { id: order.id },
        data: {
          guestEmail: email || undefined,
          phoneNumber: phoneNumber || undefined,
        },
      })
    } else if (phoneNumber) {
      // Update phone number for logged-in users too
      await prisma.order.update({
        where: { id: order.id },
        data: { phoneNumber },
      })
    }

    // Fiziksel paket seçildiyse teslimat adresini kaydet
    if (order.physicalPackage) {
      if (
        !shippingFullName ||
        !shippingAddressLine1 ||
        !shippingCity ||
        !shippingDistrict ||
        !shippingPhone
      ) {
        return NextResponse.json(
          { error: "Fiziksel paket için teslimat adresi zorunludur" },
          { status: 400 }
        )
      }
      await prisma.orderShippingAddress.upsert({
        where: { orderId: order.id },
        update: {
          fullName: shippingFullName,
          addressLine1: shippingAddressLine1,
          addressLine2: shippingAddressLine2 || null,
          city: shippingCity,
          district: shippingDistrict,
          postalCode: shippingPostalCode || null,
          phone: shippingPhone,
        },
        create: {
          orderId: order.id,
          fullName: shippingFullName,
          addressLine1: shippingAddressLine1,
          addressLine2: shippingAddressLine2 || null,
          city: shippingCity,
          district: shippingDistrict,
          postalCode: shippingPostalCode || null,
          phone: shippingPhone,
        },
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Brief save error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

