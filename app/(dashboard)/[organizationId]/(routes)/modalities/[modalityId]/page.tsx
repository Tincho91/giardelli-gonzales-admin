import prismadb from "@/lib/prismadb";

import { ModalityForm } from "./components/modality-form";

const ModalityPage = async ({
  params
}: {
  params: { modalityId: string, organizationId: string }
}) => {
  const modality = await prismadb.modality.findUnique({
    where: {
      id: params.modalityId
    }
  });

  return ( 
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ModalityForm initialData={modality} />
      </div>
    </div>
  );
}

export default ModalityPage;
