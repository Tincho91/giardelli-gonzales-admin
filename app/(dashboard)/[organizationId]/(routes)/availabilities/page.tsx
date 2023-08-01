import { format } from "date-fns";

import prismadb from "@/lib/prismadb";

import { AvailabilityColumn } from "./components/columns"
import { AvailabilitiesClient } from "./components/client";

const AvailabilitiesPage = async ({
  params
}: {
  params: { organizationId: string }
}) => {
  const availabilities = await prismadb.availability.findMany({
    where: {
      organizationId: params.organizationId
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  const formattedAvailabilities: AvailabilityColumn[] = availabilities.map((item) => ({
    id: item.id,
    name: item.name,
    createdAt: format(item.createdAt, 'MMMM do, yyyy'),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <AvailabilitiesClient data={formattedAvailabilities} />
      </div>
    </div>
  );
};

export default AvailabilitiesPage;
