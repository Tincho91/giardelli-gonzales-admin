import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";

export async function GET(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    if (!params.userId) {
      const response = new NextResponse("User id is required", { status: 400 });
      return response;
    }

    const user = await prismadb.user.findUnique({
      where: {
        id: params.userId
      },
    });

    const response = new NextResponse(JSON.stringify(user), {status: 200});
    
    return response;
  } catch (error) {
    console.log('[USER_GET]', error);
    const response = new NextResponse("Internal error", { status: 500 });
    return response;
  }
}

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
}

export async function PATCH(
  req: Request,
  { params }: { params: { userId: string, organizationId: string } }
) {
  try {   
    const body = await req.json();

    if (!params.userId) {
      return new NextResponse("User id is required", { status: 400 });
    }

    const organizationByUserId = await prismadb.organization.findFirst({
      where: {
        id: params.organizationId,
      }
    });

    if (!organizationByUserId) {
      return new NextResponse("Unauthorized", { status: 405 });
    }

    const userId = params.userId; // User ID from route
    const { positionId, ...otherFields } = body;  // Destructure the body
    
    let applicationResponse = null;

    // If positionId is present, add a new application
    if (positionId) {
      applicationResponse = await prismadb.userApplication.create({
        data: {
          userId,  // Using the User's database ID from route
          positionId,
          status: 'HOLD' // initial status
        },
      });
    }

    // Update other user fields and updatedAt
    const user = await prismadb.user.update({
      where: { id: userId },
      data: {
        ...otherFields,
        updatedAt: new Date()
      },
    });
    
    // Respond with the user and potentially the new application
    return NextResponse.json({ user, application: applicationResponse });

  } catch (error) {
    console.log('[USER_PATCH]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

