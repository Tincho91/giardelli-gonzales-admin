"use client"

import { useEffect, useState } from 'react';
import axios from 'axios';

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface UserDataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[],
  searchKey: string;
}

interface AreaOfInterest {
  name: string;
}

export function UserDataTable<TData, TValue>({
  columns,
  data,
  searchKey,
}: UserDataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnFilters,
    }
  });

  const [areasOfInterest, setAreasOfInterest] = useState<AreaOfInterest[]>([]);

  useEffect(() => {
    // Supongo que tienes acceso al organizationId de alguna manera
    const organizationId = '3837bf53-42bf-4731-9b4e-c0ebe6fabfe2';

    const fetchAreasOfInterest = async () => {
      try {
        const res = await axios.get(`/api/${organizationId}/areasOfInterest`);
        setAreasOfInterest(res.data);
      } catch (error) {
        console.log('Error fetching areas of interest:', error);
      }
    };

    fetchAreasOfInterest();
  }, []);

  return (
    <div>
      <div className="flex items-center py-4 space-x-4">
        <Input
          placeholder="Buscar"
          value={(table.getColumn(searchKey)?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn(searchKey)?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <Input
          placeholder="Palabras clave"
          value={(table.getColumn('keywords')?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn('keywords')?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <select
          onChange={(event) =>
            table.getColumn('areaOfInterest')?.setFilterValue(event.target.value)
          }
          className="max-w-sm flex h-10 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="" className='text-black '>Todas las Áreas</option>
          {areasOfInterest.map((area, index) => (
            <option key={index} value={area.name} className='text-black '>
              {area.name}
            </option>
          ))}
        </select>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Anterior
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Siguiente
        </Button>
      </div>
    </div>
  )
}