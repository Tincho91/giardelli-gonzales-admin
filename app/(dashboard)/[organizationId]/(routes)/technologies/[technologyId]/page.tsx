import prismadb from "@/lib/prismadb";

import { TechnologyForm } from "./components/technology-form";

const TechnologyPage = async ({
  params
}: {
  params: { technologyId: string, organizationId: string }
}) => {
  const technology = await prismadb.technology.findUnique({
    where: {
      id: params.technologyId
    }
  });
  console.log('Technology:', technology);

  return ( 
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <TechnologyForm initialData={technology} />
      </div>
    </div>
  );
}

export default TechnologyPage;
