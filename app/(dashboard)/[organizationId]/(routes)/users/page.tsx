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
  const users = await prismadb.user.findMany({
    where: {
      organizationId: params.organizationId
    },
    orderBy: {
      createdAt: 'desc'
    },
    include: {
      applications: true
    }
  });

  // Obtén todas las áreas de interés
  const areasOfInterest = await getAreasOfInterestByOrganizationId(params.organizationId);
  
  // Convierte en un objeto para acceso rápido
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
      positionId: app.positionId,
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

