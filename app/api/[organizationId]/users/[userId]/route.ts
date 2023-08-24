import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";
import setCorsHeaders from '@/lib/cors';  // Import the setCorsHeaders function

export async function GET(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    if (!params.userId) {
      const response = new NextResponse("User id is required", { status: 400 });
      return setCorsHeaders(response);
    }

    const user = await prismadb.user.findUnique({
      where: {
        id: params.userId
      },
    });

    const response = new NextResponse(JSON.stringify(user), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    return setCorsHeaders(response);
  } catch (error) {
    console.log('[USER_GET]', error);
    const response = new NextResponse("Internal error", { status: 500 });
    return setCorsHeaders(response);
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { userId: string, organizationId: string } }
) {
  try {
    const { userId: currentUserId } = auth();

    if (!currentUserId) {
      return setCorsHeaders(new NextResponse("Unauthenticated", { status: 403 }));
    }

    if (!params.userId) {
      return setCorsHeaders(new NextResponse("User id is required", { status: 400 }));
    }

    const organizationByUserId = await prismadb.organization.findFirst({
      where: {
        id: params.organizationId,
        userId: currentUserId,
      }
    });

    if (!organizationByUserId) {
      return setCorsHeaders(new NextResponse("Unauthorized", { status: 405 }));
    }

    const user = await prismadb.user.delete({
      where: {
        id: params.userId,
      }
    });
  
    return setCorsHeaders(NextResponse.json(user));
  } catch (error) {
    console.log('[USER_DELETE]', error);
    return setCorsHeaders(new NextResponse("Internal error", { status: 500 }));
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { userId: string, organizationId: string } }
) {
  try {   
    const body = await req.json();
    const { name, email, phoneNumber, cvUrl } = body;

    if (!params.userId) {
      return setCorsHeaders(new NextResponse("User id is required", { status: 400 }));
    }

    const organizationByUserId = await prismadb.organization.findFirst({
      where: {
        id: params.organizationId,
      }
    });

    if (!organizationByUserId) {
      return setCorsHeaders(new NextResponse("Unauthorized", { status: 405 }));
    }

    const user = await prismadb.user.update({
      where: {
        id: params.userId,
      },
      data: {
        name,
        email,
        phoneNumber,
        cvUrl,
      }
    });
  
    return setCorsHeaders(NextResponse.json(user));
  } catch (error) {
    console.log('[USER_PATCH]', error);
    return setCorsHeaders(new NextResponse("Internal error", { status: 500 }));
  }
}
