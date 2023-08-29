import { NextResponse } from 'next/server';
import prismadb from '@/lib/prismadb';
import setCorsHeaders from '@/lib/cors';

export async function POST(
  req: Request,
  { params }: { params: { organizationId: string } }
) {
  try {
    console.log("Received POST request with params:", params);

    const body = await req.json();

    console.log("Received body:", body);

    const { name, email, phoneNumber, cvUrl, clerkId, linkedinUrl } = body; // Included linkedinUrl

    const requiredFields = ['name', 'email', 'phoneNumber', 'clerkId', 'cvUrl']; // Added phoneNumber
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

    const user = await prismadb.user.create({
      data: {
        name,
        email,
        phoneNumber,
        clerkId,
        organizationId: params.organizationId,
        cvUrl,
        linkedinUrl: linkedinUrl || null,
      },
    });
    console.log("Created user:", user);

    return NextResponse.json(user);
  } catch (error) {
    console.log('[USERS_POST]', error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    
    return NextResponse.json({ error: "Internal error", details: errorMessage }, { status: 500 });
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
