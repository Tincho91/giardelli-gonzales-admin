import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";

export async function GET(
  req: Request,
  { params }: { params: { modalityId: string } }
) {
  try {
    if (!params.modalityId) {
      return new NextResponse("Modality id is required", { status: 400 });
    }

    const modality = await prismadb.modality.findUnique({
      where: {
        id: params.modalityId
      },
    });
  
    return NextResponse.json(modality);
  } catch (error) {
    console.log('[MODALITY_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export async function DELETE(
  req: Request,
  { params }: { params: { modalityId: string, organizationId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!params.modalityId) {
      return new NextResponse("Modality id is required", { status: 400 });
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

    const modality = await prismadb.modality.delete({
      where: {
        id: params.modalityId,
      }
    });
  
    return NextResponse.json(modality);
  } catch (error) {
    console.log('[MODALITY_DELETE]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};


export async function PATCH(
  req: Request,
  { params }: { params: { modalityId: string, organizationId: string } }
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

    if (!params.modalityId) {
      return new NextResponse("Modality id is required", { status: 400 });
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

    const modality = await prismadb.modality.update({
      where: {
        id: params.modalityId,
      },
      data: {
        name,
      }
    });
  
    return NextResponse.json(modality);
  } catch (error) {
    console.log('[MODALITY_PATCH]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};
