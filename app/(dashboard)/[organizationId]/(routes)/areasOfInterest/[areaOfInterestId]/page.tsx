import prismadb from "@/lib/prismadb";

import { AreaOfInterestForm } from "./components/areaOfInterest-form";

const AreaOfInterestPage = async ({
  params
}: {
  params: { areaOfInterestId: string, organizationId: string }
}) => {
  const areaOfInterest = await prismadb.areaOfInterest.findUnique({
    where: {
      id: params.areaOfInterestId
    }
  });

  return ( 
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <AreaOfInterestForm initialData={areaOfInterest} />
      </div>
    </div>
  );
}

export default AreaOfInterestPage;
