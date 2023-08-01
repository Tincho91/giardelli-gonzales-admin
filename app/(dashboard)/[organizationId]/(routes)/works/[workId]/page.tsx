import prismadb from "@/lib/prismadb";

import { WorkForm } from "./components/work-form";

const WorkPage = async ({
  params
}: {
  params: { workId: string, organizationId: string }
}) => {
  const work = await prismadb.work.findFirst({
    where: {
      id: params.workId,
    },
  });

  const categories = await prismadb.category.findMany({
    where: {
      organizationId: params.organizationId,
    },
  });

  const technologies = await prismadb.technology.findMany({
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
      <WorkForm 
        categories={categories}
        technologies={technologies}
        companies={companies}
        availabilities={availabilities}
        modalities={modalities}
        locations={locations}
        initialData={work}
      />
      </div>
    </div>
  );
}

export default WorkPage;
