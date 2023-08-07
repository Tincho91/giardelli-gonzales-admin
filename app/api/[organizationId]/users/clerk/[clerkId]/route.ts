import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";

// Retrieve a user based on their clerkId
export async function GET(
  req: Request,
  { params }: { params: { organizationId: string, clerkId: string } }
) {
  try {
    const { organizationId, clerkId } = params;

    if (!organizationId || !clerkId) {
      return new NextResponse("Organization and Clerk IDs are required", { status: 400 });
    }

    const user = await prismadb.user.findUnique({
      where: {
        clerkId: clerkId
      },
      include: {
        cv: true
      }
    });
  
    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.log('[USER_BY_CLERKID_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

// Other potential methods like PATCH, DELETE, etc., can also be added here.
// Their implementations would be similar to the methods in the [userId] route,
// but use the clerkId for querying the database instead of the unique userId.
