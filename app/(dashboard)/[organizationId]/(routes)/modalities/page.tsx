import { format } from "date-fns";

import prismadb from "@/lib/prismadb";

import { ModalityColumn } from "./components/columns"
import { ModalitiesClient } from "./components/client";

const ModalitiesPage = async ({
  params
}: {
  params: { organizationId: string }
}) => {
  const modalities = await prismadb.modality.findMany({
    where: {
      organizationId: params.organizationId
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  const formattedModalities: ModalityColumn[] = modalities.map((item) => ({
    id: item.id,
    name: item.name,
    createdAt: format(item.createdAt, 'MMMM do, yyyy'),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ModalitiesClient data={formattedModalities} />
      </div>
    </div>
  );
};

export default ModalitiesPage;
