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

    const { name, email, phoneNumber, cvUrl } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!email) {
      return new NextResponse("Email is required", { status: 400 });
    }

    if (!cvUrl) {
      return new NextResponse("CV URL is required", { status: 400 });
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

    const user = await prismadb.user.create({
      data: {
        name,
        email,
        phoneNumber,
        clerkId: userId,
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
  { params }: { params: { organizationId: string } }
) {
  try {
    if (!params.organizationId) {
      return new Response("Organization id is required", {
        status: 400,
        headers: {
          'Access-Control-Allow-Origin': 'http://localhost:3000'
        }
      });
    }

    const users = await prismadb.user.findMany({
      where: {
        organizationId: params.organizationId
      },
      include: {
        cv: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return new Response(JSON.stringify(users), {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': 'http://localhost:3000',
        'Content-Type': 'application/json'
      }
    });

  } catch (error) {
    console.log('[USERS_GET]', error);
    return new Response("Internal error", {
      status: 500,
      headers: {
        'Access-Control-Allow-Origin': 'http://localhost:3000'
      }
    });
  }
}
