import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';

import prismadb from '@/lib/prismadb';

export async function POST(
  req: Request,
  { params }: { params: { organizationId: string } }
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
      return new NextResponse("Price is required", { status: 400 });
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

    const work = await prismadb.work.create({
      data: {
        name,
        shortDescription,
        longDescription,
        isArchived,
        isFeatured,
        technologyId,
        companyId,
        availabilityId,
        modalityId,
        locationId,
        organizationId: params.organizationId,
        categoryId,
      },
    });
  
    return NextResponse.json(work);
  } catch (error) {
    console.log('[WORKS_POST]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export async function GET(
  req: Request,
  { params }: { params: { organizationId: string } }
) {
  try {
    if (!params.organizationId) {
      return new NextResponse("Organization id is required", { status: 400 });
    }

    const works = await prismadb.work.findMany({
      where: {
        organizationId: params.organizationId
      },
      include: {
        category: true,
        availability: true,
        company: true,
        location: true,
        modality: true,
        technology: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(works);
  } catch (error) {
    console.log('[WORKS_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};
