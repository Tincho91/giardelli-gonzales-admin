import { NextResponse } from 'next/server';
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
      return NextResponse.json({ error: `${missingParams.join(', ')} are required` }, { status: 400 });
    }

    const organizationByUserId = await prismadb.organization.findFirst({
      where: {
        id: params.organizationId
      }
    });

    if (!organizationByUserId) {
      return NextResponse.json({ error: "Organization not found" }, { status: 404 });
    }

    const user = await prismadb.user.create({
      data: {
        name,
        email,
        phoneNumber: phoneNumber || null,
        clerkId,
        organizationId: params.organizationId,
        cvUrl,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.log('[USERS_POST]', error);
    return NextResponse.json("Internal error", { status: 500 });
  }
};

export async function GET(
  req: Request,
  { params }: { params: { organizationId: string } }
) {
  try {
    if (!params.organizationId) {
      const response = new NextResponse("User id is required", { status: 400 });
      return setCorsHeaders(response);
    }

    const users = await prismadb.user.findMany({
      where: {
        organizationId: params.organizationId
      },
    });

    return NextResponse.json(users);
  } catch (error) {
    console.log('[USER_GET]', error);
    const response = new NextResponse("Internal error", { status: 500 });
    return setCorsHeaders(response);
  }
}
