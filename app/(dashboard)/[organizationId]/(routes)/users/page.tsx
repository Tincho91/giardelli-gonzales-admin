import { format } from "date-fns";

import prismadb from "@/lib/prismadb";

import { UserColumn } from "./components/columns"
import { UsersClient } from "./components/client";

const UsersPage = async ({
  params
}: {
  params: { organizationId: string }
}) => {
  const users = await prismadb.user.findMany({
    where: {
      organizationId: params.organizationId
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  const formattedUsers: UserColumn[] = users.map((item) => ({
    id: item.id,
    name: item.name,
    cvUrl: item.cvUrl,
    createdAt: format(item.createdAt, 'MMMM do, yyyy'),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <UsersClient data={formattedUsers} />
      </div>
    </div>
  );
};

export default UsersPage;
