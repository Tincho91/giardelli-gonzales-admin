import { format } from "date-fns";
import { es } from "date-fns/locale";

import prismadb from "@/lib/prismadb";
import { formatter } from "@/lib/utils";

import { WorksClient } from "./components/client";
import { WorkColumn } from "./components/columns";

const WorksPage = async ({
  params
}: {
  params: { organizationId: string }
}) => {
  const works = await prismadb.work.findMany({
    where: {
      organizationId: params.organizationId
    },
    include: {
      category: true,
      availability: true,
      company: true,
      location: true,
      modality: true,
      technology: true,
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  const formattedWorks: WorkColumn[] = works.map((item) => ({
    id: item.id,
    name: item.name,
    isFeatured: item.isFeatured,
    isArchived: item.isArchived,
    createdAt: format(item.createdAt, 'd MMMM, yy', {locale: es}),
  }));

  console.log(works)

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <WorksClient data={formattedWorks} />
      </div>
    </div>
  );
};

export default WorksPage;
