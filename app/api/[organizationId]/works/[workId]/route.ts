import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";

export async function GET(
  req: Request,
  { params }: { params: { workId: string } }
) {
  try {
    if (!params.workId) {
      return new NextResponse("work id is required", { status: 400 });
    }

    const work = await prismadb.work.findUnique({
      where: {
        id: params.workId,
      },
      include: {
        category: true,
        technology: true,
        company: true,
        availability: true,
        modality: true,
        location: true,
      },
    });
  
    return NextResponse.json(work);
  } catch (error) {
    console.log('[work_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export async function DELETE(
  req: Request,
  { params }: { params: { workId: string, organizationId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!params.workId) {
      return new NextResponse("work id is required", { status: 400 });
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

    const work = await prismadb.work.delete({
      where: {
        id: params.workId
      },
    });
  
    return NextResponse.json(work);
  } catch (error) {
    console.log('[work_DELETE]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};


export async function PATCH(
  req: Request,
  { params }: { params: { workId: string, organizationId: string } }
) {
  try {
    const { userId } = auth();

    const body = await req.json();

    const { name, shortDescription, longDescription, categoryId, isArchived, isFeatured, technologyId, companyId, availabilityId, modalityId, locationId } = body;

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

    if (!technologyId) {
      return new NextResponse("Color id is required", { status: 400 });
    }

    if (!locationId) {
      return new NextResponse("Size id is required", { status: 400 });
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

    await prismadb.work.update({
      where: {
        id: params.workId,
      },
      data: {
        name,
        shortDescription,
        longDescription,
        isArchived,
        isFeatured,
        categoryId,
        technologyId,
        companyId,
        availabilityId,
        modalityId,
        locationId,
      },
    });

    const work = await prismadb.work.update({
      where: {
        id: params.workId
      },
      data: {
        name,
        shortDescription,
        longDescription,
        isArchived,
        isFeatured,
        categoryId,
        technologyId,
        companyId,
        availabilityId,
        modalityId,
        locationId,
      },
    });
  
    return NextResponse.json(work);
  } catch (error) {
    console.log('[WORK_PATCH]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};
