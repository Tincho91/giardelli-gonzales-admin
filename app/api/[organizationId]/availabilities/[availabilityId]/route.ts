import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";

export async function GET(
  req: Request,
  { params }: { params: { availabilityId: string } }
) {
  try {
    if (!params.availabilityId) {
      return new NextResponse("Availability id is required", { status: 400 });
    }

    const availability = await prismadb.availability.findUnique({
      where: {
        id: params.availabilityId
      },
    });
  
    return NextResponse.json(availability);
  } catch (error) {
    console.log('[AVAILABILITY_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export async function DELETE(
  req: Request,
  { params }: { params: { availabilityId: string, organizationId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!params.availabilityId) {
      return new NextResponse("availability id is required", { status: 400 });
    }

    const organizationByUserId = await prismadb.organization.findFirst({
      where: {
        id: params.organizationId,
        userId,
      }
    });

    if (!organizationByUserId) {
      return new NextResponse("Unauthorized", { status: 405 });
    }

    const availability = await prismadb.availability.delete({
      where: {
        id: params.availabilityId,
      }
    });
  
    return NextResponse.json(availability);
  } catch (error) {
    console.log('[AVAILABILITY_DELETE]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};


export async function PATCH(
  req: Request,
  { params }: { params: { availabilityId: string, organizationId: string } }
) {
  try {   
    const { userId } = auth();

    const body = await req.json();
    
    const { name } = body;
    
    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!params.availabilityId) {
      return new NextResponse("Availability id is required", { status: 400 });
    }

    const organizationByUserId = await prismadb.organization.findFirst({
      where: {
        id: params.organizationId,
        userId,
      }
    });

    if (!organizationByUserId) {
      return new NextResponse("Unauthorized", { status: 405 });
    }

    const availability = await prismadb.availability.update({
      where: {
        id: params.availabilityId,
      },
      data: {
        name,
      }
    });
  
    return NextResponse.json(availability);
  } catch (error) {
    console.log('[AVAILABILITY_PATCH]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};
