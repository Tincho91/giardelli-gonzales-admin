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

    const { name } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }
    

    if (!params.organizationId) {
      return new NextResponse("Organization id is required", { status: 400 });
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

    const location = await prismadb.location.create({
      data: {
        name,
        organizationId: params.organizationId,
      }
    });
  
    return NextResponse.json(location);
  } catch (error) {
    console.log('[LOCATIONS_POST]', error);
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

    const locations = await prismadb.location.findMany({
      where: {
        organizationId: params.organizationId
      }
    });
  
    return NextResponse.json(locations);
  } catch (error) {
    console.log('[LOCATIONS_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};
