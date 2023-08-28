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
        <p>ver cv</p>
        <Clipboard />
      </a>
    ) : null,
    header: "CV",
  },
  {
    accessorKey: "applications",
    cell: ({ row }) => {
      const applications = row.original.applications;
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
    header: "Applications",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
    header: "Acciones",
  },
];
