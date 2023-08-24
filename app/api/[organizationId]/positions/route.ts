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

    const { name, shortDescription, longDescription, areaOfInterestId, isArchived, isFeatured, companyId, availabilityId, modalityId, locationId } = body;

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

    if (!locationId) {
      return new NextResponse("Size id is required", { status: 400 });
    }

    if (!modalityId) {
      return new NextResponse("Size id is required", { status: 400 });
    }

    if (!areaOfInterestId) {
      return new NextResponse("Area Of Interest id is required", { status: 400 });
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

    const position = await prismadb.position.create({
      data: {
        name,
        shortDescription,
        longDescription,
        areaOfInterestId,
        isArchived,
        isFeatured,
        companyId,
        availabilityId,
        modalityId,
        locationId,
        organizationId: params.organizationId,
      },
    });
  
    return NextResponse.json(position);
  } catch (error) {
    console.log('[WORKS_POST]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export async function GET(
  req: Request,
  { params }: { params: { organizationId: string } },
) {
  try {
    const { searchParams } = new URL(req.url)
    const modalityId = searchParams.get('modalityId') || undefined;
    const technologyId = searchParams.get('technologyId') || undefined;
    const areaOfInterestId = searchParams.get('areaOfInterestId') || undefined;
    const locationId = searchParams.get('locationId') || undefined;
    const availabilityId = searchParams.get('availabilityId') || undefined;
    const companyId = searchParams.get('companyId') || undefined;
    const isFeatured = searchParams.get('isFeatured');

    if (!params.organizationId) {
      return new NextResponse("Organization id is required", { status: 400 });
    }

    const positions = await prismadb.position.findMany({
      where: {
        organizationId: params.organizationId,
        modalityId,
        availabilityId,
        companyId,
        locationId,
        areaOfInterestId,
        isFeatured: isFeatured ? true : undefined,
      },
      include: {
        areaOfInterest: true,
        availability: true,
        company: true,
        location: true,
        modality: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(positions);
  } catch (error) {
    console.log('[WORKS_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};
