"use client";

import React, { useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import { IDesvioCargas } from "@/app/models/activity.type";
import { json } from "zod";

const columnHelper = createColumnHelper<IDesvioCargas>();

interface DesvioTableProps {
  data: IDesvioCargas[];
}

const DesvioCargas = ({ data: initialData }: DesvioTableProps) => {
  const [data, setData] = useState<IDesvioCargas[]>(initialData);

  const columns = useMemo(
    () => [
      columnHelper.accessor("turn", {
        header: "Turno",
        cell: (info) => (
          <span className="capitalize font-medium">{info.getValue()}</span>
        ),
      }),
      columnHelper.accessor("data.coordenada", {
        header: "Coordenada",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("data.destinoInicial", {
        header: "Destino Inicial",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("data.destinoFinal", {
        header: "Destino Final",
        cell: (info) => info.getValue(),
      }),
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 15,
      },
    },
  });

  return (
    <div className="w-full space-y-4">
      {/* Vista Tablet */}
      <div className="hidden md:block overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                Info
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                Destinos
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50">
                <td className="px-3 py-3">
                  <div className="space-y-1 text-gray-800">
                    <span className="capitalize font-medium text-sm">
                      {row.original.turn}
                    </span>
                    <div className="text-sm ">
                      {row.original.data.coordenada}
                    </div>
                  </div>
                </td>
                <td className="px-3 py-3">
                  <div className="space-y-1 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">Inicial:</span>{" "}
                      {row.original.data.destinoInicial.match("Silos") || row.original.data.destinoInicial.match("Planta de Lavado")
                        ? null
                        : "Pilas "}
                      {row.original.data.destinoInicial}
                    </div>
                    <div>
                      <span className="font-medium">Final:</span>{" "}
                      {row.original.data.destinoFinal.match("Silos") || row.original.data.destinoFinal.match("Planta de Lavado")
                        ? null
                        : "Pilas "}
                      {row.original.data.destinoFinal}
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Vista Mobile */}
      <div className="md:hidden space-y-4">
        {table.getRowModel().rows.map((row) => (
          <div
            key={row.id}
            className="bg-white rounded-lg shadow-md p-4 border border-gray-200"
          >
            <div className="flex justify-between items-start mb-3">
              <span className="capitalize font-semibold text-gray-900">
                {row.original.turn}
              </span>
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                Desvío de Cargas
              </span>
            </div>

            <div className="space-y-2 mb-4 text-sm">
              <div>
                <span className="font-medium text-gray-600">Coordenada:</span>
                <div className="text-gray-900">
                  {row.original.data.coordenada}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="font-medium text-gray-600">Origen:</span>
                  <div className="text-gray-900">
                    {row.original.data.destinoInicial}
                  </div>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Destino:</span>
                  <div className="text-gray-900">
                    {row.original.data.destinoFinal}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Paginación */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-lg shadow">
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
            className="px-2 sm:px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {"<<"}
          </button>
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="px-2 sm:px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {"<"}
          </button>
          <span className="hidden sm:inline-block px-3 py-1 text-sm text-gray-700 bg-blue-50 border border-blue-200 rounded">
            {table.getState().pagination.pageIndex + 1}
          </span>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="px-2 sm:px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {">"}
          </button>
          <button
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
            className="px-2 sm:px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {">>"}
          </button>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-2 text-sm text-gray-700">
          <span>
            Página{" "}
            <strong className="text-blue-600">
              {table.getState().pagination.pageIndex + 1}
            </strong>{" "}
            de <strong className="text-blue-600">{table.getPageCount()}</strong>
          </span>
          <span className="hidden sm:inline">•</span>
          <span>
            <strong>{table.getRowModel().rows.length}</strong> de{" "}
            <strong>{data.length}</strong> registros
          </span>
        </div>
      </div>
    </div>
  );
};

export default DesvioCargas;
