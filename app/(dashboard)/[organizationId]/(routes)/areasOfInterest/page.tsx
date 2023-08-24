import { format } from "date-fns";

import prismadb from "@/lib/prismadb";

import { AreaOfInterestColumn } from "./components/columns"
import { AreasOfInterestClient } from "./components/client";

const AreasOfInterestPage = async ({
  params
}: {
  params: { organizationId: string }
}) => {
  const areasOfInterest = await prismadb.areaOfInterest.findMany({
    where: {
      organizationId: params.organizationId
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  const formattedCategories: AreaOfInterestColumn[] = areasOfInterest.map((item) => ({
    id: item.id,
    name: item.name,
    createdAt: format(item.createdAt, 'MMMM do, yyyy'),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <AreasOfInterestClient data={formattedCategories} />
      </div>
    </div>
  );
};

export default AreasOfInterestPage;
