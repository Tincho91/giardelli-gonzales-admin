import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";


export async function PATCH(
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

    const organization = await prismadb.organization.updateMany({
      where: {
        id: params.organizationId,
        userId,
      },
      data: {
        name
      }
    });
  
    return NextResponse.json(organization);
  } catch (error) {
    console.log('[ORGANIZATION_PATCH]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};


export async function DELETE(
  req: Request,
  { params }: { params: { organizationId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!params.organizationId) {
      return new NextResponse("Organization id is required", { status: 400 });
    }

    const organization = await prismadb.organization.deleteMany({
      where: {
        id: params.organizationId,
        userId
      }
    });
  
    return NextResponse.json(organization);
  } catch (error) {
    console.log('[ORGANIZATION_DELETE]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};
