import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, positionId } = body;

    if (!userId || !positionId) {
      return new NextResponse("Both user ID and position ID are required.", { status: 400 });
    }

    // Create a new UserApplication record
    const application = await prismadb.userApplication.create({
      data: {
        userId,
        positionId,
        status: 'HOLD' // default status
      },
    });

    return NextResponse.json(application);

  } catch (error) {
    console.log('[APPLY_POST]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
}