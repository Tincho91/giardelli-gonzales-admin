import { format } from "date-fns";
import prismadb from "@/lib/prismadb";
import { UserColumn } from "./components/columns";
import { UsersClient } from "./components/client";

import { getAreasOfInterestByOrganizationId } from '../../../../api/[organizationId]/areasOfInterest/route';



const UsersPage = async ({
  params
}: {
  params: { organizationId: string }
}) => {
  const usersResponse = await prismadb.user.findMany({
    where: {
      organizationId: params.organizationId
    },
    orderBy: {
      createdAt: 'desc'
    },
    include: {
      applications: {
        include: {
          position: true
        }
      }
    }
  });

  const users = usersResponse.map(user => {
    return {
      ...user,
      applications: user.applications.map(app => ({
        ...app,
        positionName: app.position?.name || 'N/A'
      }))
    };
  });

  const areasOfInterest = await getAreasOfInterestByOrganizationId(params.organizationId);
  
  const areasOfInterestMap = Object.fromEntries(
    areasOfInterest.map(area => [area.id, area.name])
  );

  // @ts-ignore 
  const formattedUsers: UserColumn[] = users.map((item) => ({
    id: item.id,
    name: item.name,
    cvUrl: item.cvUrl,
    areaOfInterest: item.areaOfInterestId ? areasOfInterestMap[item.areaOfInterestId] || 'N/A' : 'N/A',
    createdAt: format(item.createdAt, 'MMMM do, yyyy'),
    keywords: item.keywords ? item.keywords : [],
    applications: item.applications.map(app => ({
      positionName: app.positionName,
      status: app.status as any
    }))
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

