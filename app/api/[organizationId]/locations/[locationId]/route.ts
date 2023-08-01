import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";

export async function GET(
  req: Request,
  { params }: { params: { locationId: string } }
) {
  try {
    if (!params.locationId) {
      return new NextResponse("location id is required", { status: 400 });
    }

    const location = await prismadb.location.findUnique({
      where: {
        id: params.locationId
      },
    });
  
    return NextResponse.json(location);
  } catch (error) {
    console.log('[LOCATION_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export async function DELETE(
  req: Request,
  { params }: { params: { locationId: string, organizationId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!params.locationId) {
      return new NextResponse("location id is required", { status: 400 });
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

    const location = await prismadb.location.delete({
      where: {
        id: params.locationId,
      }
    });
  
    return NextResponse.json(location);
  } catch (error) {
    console.log('[LOCATION_DELETE]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};


export async function PATCH(
  req: Request,
  { params }: { params: { locationId: string, organizationId: string } }
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

    if (!params.locationId) {
      return new NextResponse("location id is required", { status: 400 });
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

    const location = await prismadb.location.update({
      where: {
        id: params.locationId,
      },
      data: {
        name,
      }
    });
  
    return NextResponse.json(location);
  } catch (error) {
    console.log('[LOCATION_PATCH]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};
