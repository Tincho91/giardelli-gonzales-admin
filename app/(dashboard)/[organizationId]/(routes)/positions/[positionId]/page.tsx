import prismadb from "@/lib/prismadb";

import { PositionForm } from "./components/position-form";

const PositionPage = async ({
  params
}: {
  params: { positionId: string, organizationId: string }
}) => {
  const position = await prismadb.position.findFirst({
    where: {
      id: params.positionId,
    },
  });

  const areasOfInterest = await prismadb.areaOfInterest.findMany({
    where: {
      organizationId: params.organizationId,
    },
  });

  const companies = await prismadb.company.findMany({
    where: {
      organizationId: params.organizationId,
    },
  });

  const availabilities = await prismadb.availability.findMany({
    where: {
      organizationId: params.organizationId,
    },
  });

  const modalities = await prismadb.modality.findMany({
    where: {
      organizationId: params.organizationId,
    },
  });

  const locations = await prismadb.location.findMany({
    where: {
      organizationId: params.organizationId,
    },
  });

  return ( 
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
      <PositionForm 
        areasOfInterest={areasOfInterest}
        companies={companies}
        availabilities={availabilities}
        modalities={modalities}
        locations={locations}
        initialData={position}
      />
      </div>
    </div>
  );
}

export default PositionPage;
