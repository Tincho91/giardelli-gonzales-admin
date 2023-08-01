import { format } from "date-fns";

import prismadb from "@/lib/prismadb";

import { TechnologyColumn } from "./components/columns"
import { TechnologiesClient } from "./components/client";

const TechnologiesPage = async ({
  params
}: {
  params: { organizationId: string }
}) => {
  const technologies = await prismadb.technology.findMany({
    where: {
      organizationId: params.organizationId
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  const formattedCategories: TechnologyColumn[] = technologies.map((item) => ({
    id: item.id,
    name: item.name,
    createdAt: format(item.createdAt, 'MMMM do, yyyy'),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <TechnologiesClient data={formattedCategories} />
      </div>
    </div>
  );
};

export default TechnologiesPage;
