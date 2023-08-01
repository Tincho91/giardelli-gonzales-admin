import prismadb from "@/lib/prismadb";

import { AvailabilityForm } from "./components/availability-form";

const AvailabilityPage = async ({
  params
}: {
  params: { availabilityId: string, organizationId: string }
}) => {
  const availability = await prismadb.availability.findUnique({
    where: {
      id: params.availabilityId
    }
  });

  return ( 
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <AvailabilityForm initialData={availability} />
      </div>
    </div>
  );
}

export default AvailabilityPage;
