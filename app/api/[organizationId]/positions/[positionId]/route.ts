import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";

export async function GET(
  req: Request,
  { params }: { params: { positionId: string } }
) {
  try {
    if (!params.positionId) {
      return new NextResponse("Position id is required", { status: 400 });
    }

    const position = await prismadb.position.findUnique({
      where: {
        id: params.positionId,
      },
      include: {
        areaOfInterest: true,
        company: true,
        availability: true,
        modality: true,
        location: true,
      },
    });
  
    return NextResponse.json(position);
  } catch (error) {
    console.log('[Position_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export async function DELETE(
  req: Request,
  { params }: { params: { positionId: string, organizationId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!params.positionId) {
      return new NextResponse("position id is required", { status: 400 });
    }

    const organizationByUserId = await prismadb.organization.findFirst({
      where: {
        id: params.organizationId,
        userId
      }
    });

    if (!organizationByUserId) {
      return new NextResponse("Unauthorized", { status: 405 });
    }

    const position = await prismadb.position.delete({
      where: {
        id: params.positionId
      },
    });
  
    return NextResponse.json(position);
  } catch (error) {
    console.log('[position_DELETE]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};


export async function PATCH(
  req: Request,
  { params }: { params: { positionId: string, organizationId: string } }
) {
  try {
    const { userId } = auth();

    const body = await req.json();

    const { name, shortDescription, longDescription, areaOfInterestId, isArchived, isFeatured, companyId, availabilityId, modalityId, locationId } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!shortDescription) {
      return new NextResponse("Short description is required", { status: 400 });
    }

    if (!longDescription) {
      return new NextResponse("Category id is required", { status: 400 });
    }

    if (!locationId) {
      return new NextResponse("Size id is required", { status: 400 });
    }

    if (!areaOfInterestId) {
      return new NextResponse("Area de Interes id is required", { status: 400 });
    }

    if (!modalityId) {
      return new NextResponse("Size id is required", { status: 400 });
    }

    if (!availabilityId) {
      return new NextResponse("Size id is required", { status: 400 });
    }

    if (!companyId) {
      return new NextResponse("Size id is required", { status: 400 });
    }

    if (!params.organizationId) {
      return new NextResponse("organization id is required", { status: 400 });
    }

    const organizationByUserId = await prismadb.organization.findFirst({
      where: {
        id: params.organizationId,
        userId
      }
    });

    if (!organizationByUserId) {
      return new NextResponse("Unauthorized", { status: 405 });
    }

    await prismadb.position.update({
      where: {
        id: params.positionId,
      },
      data: {
        name,
        shortDescription,
        longDescription,
        isArchived,
        isFeatured,
        areaOfInterestId,
        companyId,
        availabilityId,
        modalityId,
        locationId,
      },
    });

    const position = await prismadb.position.update({
      where: {
        id: params.positionId
      },
      data: {
        name,
        shortDescription,
        longDescription,
        isArchived,
        isFeatured,
        areaOfInterestId,
        companyId,
        availabilityId,
        modalityId,
        locationId,
      },
    });
  
    return NextResponse.json(position);
  } catch (error) {
    console.log('[WORK_PATCH]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};
