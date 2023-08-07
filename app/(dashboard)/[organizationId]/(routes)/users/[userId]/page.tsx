import prismadb from "@/lib/prismadb";

import { UserForm } from "./components/user-form";

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

  return ( 
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <UserForm initialData={user} />
      </div>
    </div>
  );
}

export default UserPage;