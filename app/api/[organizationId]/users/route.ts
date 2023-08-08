import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import prismadb from '@/lib/prismadb';
import setCorsHeaders from '@/lib/cors';

export async function POST(
  req: Request,
  { params }: { params: { organizationId: string } }
) {
  try {
    const body = await req.json();
    const { name, email, phoneNumber, cvUrl, clerkId } = body;

    if (!name || !email || !clerkId || !cvUrl) {
      const missingParams = ['name', 'email', 'clerkId', 'cvUrl'].filter(p => !body[p]);
      return new NextResponse(`${missingParams.join(', ')} are required`, { status: 400 });
    }

    const organizationByUserId = await prismadb.organization.findFirst({
      where: {
        id: params.organizationId
      }
    });

    if (!organizationByUserId) {
      return new NextResponse("Organization not found", { status: 404 });
    }

    const user = await prismadb.user.create({
      data: {
        name,
        email,
        phoneNumber: phoneNumber || null, // Handle optional phone number
        clerkId,
        organizationId: params.organizationId,
        cv: {
          create: {
            url: cvUrl
          }
        }
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.log('[USERS_POST]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

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
        clerkId: params.userId
      },
      include: {
        cv: true
      }
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
