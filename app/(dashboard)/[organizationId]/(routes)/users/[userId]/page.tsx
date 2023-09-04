import prismadb from "@/lib/prismadb";

const UserPage = async ({
  params
}: {
  params: { UserId: string, organizationId: string }
}) => {
  const user = await prismadb.user.findUnique({
    where: {
      id: params.UserId
    }
  });

  console.log(user)

  return ( 
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        TODO: ADD USER DATA HERE
      </div>
    </div>
  );
}

export default UserPage;
