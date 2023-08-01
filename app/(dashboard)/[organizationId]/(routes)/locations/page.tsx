import { format } from "date-fns";

import prismadb from "@/lib/prismadb";

import { LocationColumn } from "./components/columns"
import { LocationsClient } from "./components/client";

const LocationsPage = async ({
  params
}: {
  params: { organizationId: string }
}) => {
  const locations = await prismadb.location.findMany({
    where: {
      organizationId: params.organizationId
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  const formattedLocations: LocationColumn[] = locations.map((item) => ({
    id: item.id,
    name: item.name,
    createdAt: format(item.createdAt, 'MMMM do, yyyy'),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <LocationsClient data={formattedLocations} />
      </div>
    </div>
  );
};

export default LocationsPage;
