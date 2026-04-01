import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import prismadb from '@/lib/prismadb';

export async function POST(
  req: Request,
  { params }: { params: { organizationId: string } }
) {
  try {
    console.log("Received POST request with params:", params);

    const body = await req.json();

    console.log("Received body:", body);

    const { name, email, phoneNumber, cvUrl, clerkId, linkedinUrl, areaOfInterestId } = body;
    const requiredFields = ['name', 'email', 'phoneNumber', 'clerkId', 'cvUrl', 'areaOfInterestId'];
    
    const missingParams = requiredFields.filter(p => !body[p]);

    if (missingParams.length) {
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

    const normalizedEmail = email.trim().toLowerCase();

    const existingUserByClerk = await prismadb.user.findFirst({
      where: {
        organizationId: params.organizationId,
        clerkId,
      },
    });

    // Idempotent behavior for repeated submit/retry.
    if (existingUserByClerk) {
      return NextResponse.json(existingUserByClerk, { status: 200 });
    }

    const existingUserByEmail = await prismadb.user.findUnique({
      where: {
        email: normalizedEmail,
      },
    });

    if (existingUserByEmail) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }

    const areaOfInterest = await prismadb.areaOfInterest.findFirst({
      where: {
        id: areaOfInterestId,
        organizationId: params.organizationId,
      },
    });

    if (!areaOfInterest) {
      return NextResponse.json({ error: "Invalid area of interest" }, { status: 400 });
    }

    const user = await prismadb.user.create({
      data: {
        name,
        email: normalizedEmail,
        phoneNumber,
        clerkId,
        organizationId: params.organizationId,
        cvUrl,
        linkedinUrl,
        areaOfInterestId,
      },
    });
    console.log("Created user:", user);

    return NextResponse.json(user);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return NextResponse.json({ error: "Email already registered" }, { status: 409 });
      }

      if (error.code === 'P2003') {
        return NextResponse.json({ error: "Invalid related data" }, { status: 400 });
      }
    }

    console.log('[USERS_POST]', error);
    
    return NextResponse.json({error:  "Internal error"}, { status: 500 });
  }
};

export async function GET(
  req: Request,
  { params }: { params: { organizationId: string } }
) {
  try {
    if (!params.organizationId) {
      return new NextResponse("User id is required", { status: 400 });

    }

    const users = await prismadb.user.findMany({
      where: {
        organizationId: params.organizationId
      },
      include: {
        applications: true,
      }
    });

    return NextResponse.json(users);
  } catch (error) {
    console.log('[USER_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
