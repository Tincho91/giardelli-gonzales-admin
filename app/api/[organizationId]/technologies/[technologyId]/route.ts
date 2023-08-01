import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";

export async function GET(
  req: Request,
  { params }: { params: { technologyId: string } }
) {
  try {
    if (!params.technologyId) {
      return new NextResponse("Technology id is required", { status: 400 });
    }

    const technology = await prismadb.technology.findUnique({
      where: {
        id: params.technologyId
      },
    });
  
    return NextResponse.json(technology);
  } catch (error) {
    console.log('[TECHNOLOGY_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export async function DELETE(
  req: Request,
  { params }: { params: { technologyId: string, organizationId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!params.technologyId) {
      return new NextResponse("technology id is required", { status: 400 });
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

    const technology = await prismadb.technology.delete({
      where: {
        id: params.technologyId,
      }
    });
  
    return NextResponse.json(technology);
  } catch (error) {
    console.log('[TECHNOLOGY_DELETE]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};


export async function PATCH(
  req: Request,
  { params }: { params: { technologyId: string, organizationId: string } }
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

    if (!params.technologyId) {
      return new NextResponse("technology id is required", { status: 400 });
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

    const technology = await prismadb.technology.update({
      where: {
        id: params.technologyId,
      },
      data: {
        name,
      }
    });
  
    return NextResponse.json(technology);
  } catch (error) {
    console.log('[TECHNOLOGY_PATCH]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};
