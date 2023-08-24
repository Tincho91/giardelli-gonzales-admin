import { format } from "date-fns";
import { es } from "date-fns/locale";

import prismadb from "@/lib/prismadb";
import { formatter } from "@/lib/utils";

import { PositionsClient } from "./components/client";
import { PositionColumn } from "./components/columns";

const PositionsPage = async ({
  params
}: {
  params: { organizationId: string }
}) => {
  const positions = await prismadb.position.findMany({
    where: {
      organizationId: params.organizationId
    },
    include: {
      areaOfInterest: true,
      availability: true,
      company: true,
      location: true,
      modality: true,
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  const formattedPositions: PositionColumn[] = positions.map((item) => ({
    id: item.id,
    name: item.name,
    areaOfInterest: item.areaOfInterest.name,
    isFeatured: item.isFeatured,
    isArchived: item.isArchived,
    createdAt: format(item.createdAt, 'd MMMM, yy', {locale: es}),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <PositionsClient data={formattedPositions} />
      </div>
    </div>
  );
};

export default PositionsPage;
