'use client';

import React, { useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
} from '@tanstack/react-table';
import { ISondeos } from '@/app/models/activity.type';


const columnHelper = createColumnHelper<ISondeos>();

interface SondeosTableProps {
  data: ISondeos[];
}

const SondeosTable: React.FC<SondeosTableProps> = ({ data }) => {
  const columns = useMemo(() => [
    columnHelper.accessor('turn', {
      header: 'Turno',
      cell: info => (
        <span className="capitalize font-medium">
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.accessor('data.coordenadaOPila', {
      header: 'Coordenada o Pila',
      cell: info => (
        <span className="font-medium text-blue-600">
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.accessor('data.porcentajeCeniza', {
      header: 'Porcentaje de Ceniza',
      cell: info => (
        <div className="flex items-center gap-2">
          <span className="font-medium">{info.getValue()}%</span>
          <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-yellow-400 to-orange-500"
              style={{ width: `${Math.min(info.getValue(), 100)}%` }}
            />
          </div>
        </div>
      ),
    }),
    columnHelper.accessor('data.cps', {
      header: 'CPS',
      cell: info => (
        <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">
          {info.getValue()}
        </span>
      ),
    }),
  ], []);

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
      {/* Vista Desktop */}
      <div className="hidden lg:block overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full min-w-full">
          <thead className="bg-gray-50 border-b">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {table.getRowModel().rows.map(row => (
              <tr key={row.id} className="hover:bg-gray-50">
                {row.getVisibleCells().map(cell => (
                  <td
                    key={cell.id}
                    className="px-4 py-3 text-sm text-gray-900"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Vista Tablet */}
      <div className="hidden md:block lg:hidden overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Info</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Ceniza</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">CPS</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {table.getRowModel().rows.map(row => (
              <tr key={row.id} className="hover:bg-gray-50">
                <td className="px-3 py-3">
                  <div className="space-y-1">
                    <span className="capitalize font-medium text-sm">{row.original.turn}</span>
                    <div className="text-sm font-medium text-blue-600">{row.original.data.coordenadaOPila}</div>
                  </div>
                </td>
                <td className="px-3 py-3">
                  <div className="space-y-1">
                    <span className="font-medium text-sm">{row.original.data.porcentajeCeniza}%</span>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-yellow-400 to-orange-500"
                        style={{ width: `${Math.min(row.original.data.porcentajeCeniza, 100)}%` }}
                      />
                    </div>
                  </div>
                </td>
                <td className="px-3 py-3">
                  <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs font-medium">
                    {row.original.data.cps}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Vista Mobile */}
      <div className="md:hidden space-y-4">
        {table.getRowModel().rows.map(row => (
          <div key={row.id} className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="capitalize font-semibold text-gray-900">{row.original.turn}</span>
                <div className="text-lg font-bold text-blue-600 mt-1">{row.original.data.coordenadaOPila}</div>
              </div>
              <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-full">
                Sondeo
              </span>
            </div>

            <div className="space-y-4">
              <div className="p-3 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg">
                <span className="font-medium text-gray-700 text-sm">Porcentaje de Ceniza</span>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-2xl font-bold text-orange-600">{row.original.data.porcentajeCeniza}%</span>
                  <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 transition-all duration-300"
                      style={{ width: `${Math.min(row.original.data.porcentajeCeniza, 100)}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="p-3 bg-indigo-50 rounded-lg">
                <span className="font-medium text-gray-700 text-sm">CPS</span>
                <div className="text-xl font-bold text-indigo-600 mt-1">{row.original.data.cps}</div>
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
            {'<<'}
          </button>
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="px-2 sm:px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {'<'}
          </button>
          <span className="hidden sm:inline-block px-3 py-1 text-sm text-gray-700 bg-blue-50 border border-blue-200 rounded">
            {table.getState().pagination.pageIndex + 1}
          </span>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="px-2 sm:px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {'>'}
          </button>
          <button
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
            className="px-2 sm:px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {'>>'}
          </button>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-2 text-sm text-gray-700">
          <span>
            Página <strong className="text-blue-600">{table.getState().pagination.pageIndex + 1}</strong>
            {' '}de <strong className="text-blue-600">{table.getPageCount()}</strong>
          </span>
          <span className="hidden sm:inline">•</span>
          <span>
            <strong>{table.getRowModel().rows.length}</strong> de <strong>{data.length}</strong> registros
          </span>
        </div>
      </div>
    </div>
  );
};

export default SondeosTable;