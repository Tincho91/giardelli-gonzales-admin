"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Clipboard } from "lucide-react"
import { CellAction } from "./cell-action"

enum ApplicationStatus {
  APPROVED = "APPROVED",
  DISAPPROVED = "DISAPPROVED",
  HOLD = "HOLD",
}

export type UserColumn = {
  id: string;
  name: string;
  createdAt: string;
  cvUrl: string;
  areaOfInterest: string | null; // Updated
  keywords: string[];
  applications: {
    positionId: string;
    status: ApplicationStatus;
  }[];
};


export const columns: ColumnDef<UserColumn>[] = [
  {
    accessorKey: "name",
    header: "Nombre",
  },
  {
    accessorKey: "cvUrl",
    cell: ({ row }) => row.original.cvUrl ? (
      <a
        href={row.original.cvUrl}
        target="_blank"
        rel="noopener noreferrer"
        title="View CV"
      >
        <p>Ver CV</p>
        <Clipboard />
      </a>
    ) : null,
    header: "CV",
  },
  {
    accessorKey: "applications",
    cell: ({ row }) => {
      const applications = row.original.applications;
      if (!applications || applications.length === 0) {
        return "N/A";
      }
      return (
        <div>
          {applications.map(app => (
            <div key={app.positionId}>
              Position ID: {app.positionId} - Status: {app.status}
            </div>
          ))}
        </div>
      );
    },
    header: "Applicaciones",
  },
  {
    accessorKey: "areaOfInterest",
    header: "Área de Interés",
  },
  {
    accessorKey: "keywords",
    cell: ({ row }) => {
      const keywords = row.original.keywords;
      if (!keywords || keywords.length === 0) {
        return "N/A";
      }
      return keywords.join(", ");
    },
    header: "Palabras clave",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
    header: "Acciones",
  },
];
