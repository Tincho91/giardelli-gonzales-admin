import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";

export async function GET(
  req: Request,
  { params }: { params: { companyId: string } }
) {
  try {
    if (!params.companyId) {
      return new NextResponse("Category id is required", { status: 400 });
    }

    const company = await prismadb.company.findUnique({
      where: {
        id: params.companyId
      },
    });
  
    return NextResponse.json(company);
  } catch (error) {
    console.log('[COMPANY_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export async function DELETE(
  req: Request,
  { params }: { params: { companyId: string, organizationId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!params.companyId) {
      return new NextResponse("Category id is required", { status: 400 });
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

    const company = await prismadb.company.delete({
      where: {
        id: params.companyId,
      }
    });
  
    return NextResponse.json(company);
  } catch (error) {
    console.log('[COMPANY_DELETE]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};


export async function PATCH(
  req: Request,
  { params }: { params: { companyId: string, organizationId: string } }
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

    if (!params.companyId) {
      return new NextResponse("Category id is required", { status: 400 });
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

    const company = await prismadb.company.update({
      where: {
        id: params.companyId,
      },
      data: {
        name,
      }
    });
  
    return NextResponse.json(company);
  } catch (error) {
    console.log('[COMPANY_PATCH]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};
