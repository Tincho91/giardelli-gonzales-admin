import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";


export async function GET(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    if (!params.userId) {
      return new NextResponse("User id is required", { status: 400 });
    }

    const user = await prismadb.user.findUnique({
      where: {
        id: params.userId
      },
      include: {
        cv: true
      }
    });
  
    return NextResponse.json(user);
  } catch (error) {
    console.log('[USER_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};


export async function DELETE(
  req: Request,
  { params }: { params: { userId: string, organizationId: string } }
) {
  try {
    const { userId: currentUserId } = auth();

    if (!currentUserId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!params.userId) {
      return new NextResponse("User id is required", { status: 400 });
    }

    const organizationByUserId = await prismadb.organization.findFirst({
      where: {
        id: params.organizationId,
        userId: currentUserId,
      }
    });

    if (!organizationByUserId) {
      return new NextResponse("Unauthorized", { status: 405 });
    }

    const user = await prismadb.user.delete({
      where: {
        id: params.userId,
      }
    });
  
    return NextResponse.json(user);
  } catch (error) {
    console.log('[USER_DELETE]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};


export async function PATCH(
  req: Request,
  { params }: { params: { userId: string, organizationId: string } }
) {
  try {   
    const { userId: currentUserId } = auth();

    const body = await req.json();
    
    const { name, email, phoneNumber, cvUrl } = body; // Take other user details as needed
    
    if (!currentUserId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!params.userId) {
      return new NextResponse("User id is required", { status: 400 });
    }

    const organizationByUserId = await prismadb.organization.findFirst({
      where: {
        id: params.organizationId,
        userId: currentUserId,
      }
    });

    if (!organizationByUserId) {
      return new NextResponse("Unauthorized", { status: 405 });
    }

    const user = await prismadb.user.update({
      where: {
        id: params.userId,
      },
      data: {
        name,
        email,
        phoneNumber,
        cv: {
          update: {
            url: cvUrl
          }
        }
      }
    });
  
    return NextResponse.json(user);
  } catch (error) {
    console.log('[USER_PATCH]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};
