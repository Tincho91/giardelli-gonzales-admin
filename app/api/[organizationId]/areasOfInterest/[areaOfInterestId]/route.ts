import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";

export async function GET(
  req: Request,
  { params }: { params: { areaOfInterestId: string } }
) {
  try {
    if (!params.areaOfInterestId) {
      return new NextResponse("Area Of Interest id is required", { status: 400 });
    }

    const areaOfInterest = await prismadb.areaOfInterest.findUnique({
      where: {
        id: params.areaOfInterestId
      },
    });
  
    return NextResponse.json(areaOfInterest);
  } catch (error) {
    console.log('[AREAOFINTEREST_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export async function DELETE(
  req: Request,
  { params }: { params: { areaOfInterestId: string, organizationId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!params.areaOfInterestId) {
      return new NextResponse("areaOfInterest id is required", { status: 400 });
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

    const areaOfInterest = await prismadb.areaOfInterest.delete({
      where: {
        id: params.areaOfInterestId,
      }
    });
  
    return NextResponse.json(areaOfInterest);
  } catch (error) {
    console.log('[AREAOFINTEREST_DELETE]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};


export async function PATCH(
  req: Request,
  { params }: { params: { areaOfInterestId: string, organizationId: string } }
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

    if (!params.areaOfInterestId) {
      return new NextResponse("areaOfInterest id is required", { status: 400 });
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

    const areaOfInterest = await prismadb.areaOfInterest.update({
      where: {
        id: params.areaOfInterestId,
      },
      data: {
        name,
      }
    });
  
    return NextResponse.json(areaOfInterest);
  } catch (error) {
    console.log('[AREAOFINTEREST_PATCH]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};
