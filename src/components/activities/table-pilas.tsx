'use client';

import React, { useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
} from '@tanstack/react-table';
import { IInspeccionPilas } from '@/app/models/activity.type';


const columnHelper = createColumnHelper<IInspeccionPilas>();

interface InspeccionPilasTableProps {
  data: IInspeccionPilas[];
}

const InspeccionPilasTable: React.FC<InspeccionPilasTableProps> = ({ data }) => {
  const columns = useMemo(() => [
    columnHelper.accessor('turn', {
      header: 'Turno',
      cell: info => (
        <span className="capitalize font-medium">
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.accessor('data.pila', {
      header: 'Pila',
      cell: info => (
        <span className="font-medium text-blue-600">
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.accessor('data.comentarios', {
      header: 'Comentarios',
      cell: info => (
        <div className="max-w-md" title={info.getValue() || ''}>
          {info.getValue() || '-'}
        </div>
      ),
    }),
    columnHelper.accessor('data.puntosCalientes', {
      header: 'Puntos Calientes',
      cell: info => (
        <div className="max-w-xs">
          {info.getValue() || '-'}
        </div>
      ),
    }),
    columnHelper.accessor('data.autoCombustiones', {
      header: 'Auto Combustiones',
      cell: info => (
        <div className="max-w-xs">
          {info.getValue() || '-'}
        </div>
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
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Observaciones</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {table.getRowModel().rows.map(row => (
              <tr key={row.id} className="hover:bg-gray-50">
                <td className="px-3 py-3">
                  <div className="space-y-1">
                    <span className="capitalize font-medium text-sm">{row.original.turn}</span>
                    <div className="text-sm font-medium text-blue-600">{row.original.data.pila}</div>
                  </div>
                </td>
                <td className="px-3 py-3">
                  <div className="text-sm text-gray-900">
                    {row.original.data.comentarios || '-'}
                  </div>
                </td>
                <td className="px-3 py-3">
                  <div className="space-y-1 text-sm">
                    <div>
                      <span className="font-medium text-gray-600">P. Calientes:</span>
                      <div className="text-gray-900">{row.original.data.puntosCalientes || '-'}</div>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">A. Combustiones:</span>
                      <div className="text-gray-900">{row.original.data.autoCombustiones || '-'}</div>
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
        {table.getRowModel().rows.map(row => (
          <div key={row.id} className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
            <div className="flex justify-between items-start mb-3">
              <div>
                <span className="capitalize font-semibold text-gray-900">{row.original.turn}</span>
                <div className="text-lg font-bold text-blue-600 mt-1">Pila {row.original.data.pila}</div>
              </div>
              <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                Inspección Pilas
              </span>
            </div>

            {row.original.data.comentarios && (
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-600 text-sm">Comentarios:</span>
                <div className="text-gray-900 text-sm mt-1">{row.original.data.comentarios}</div>
              </div>
            )}

            <div className="space-y-3">
              <div className="border-t pt-3">
                <span className="font-medium text-gray-600 text-sm">Puntos Calientes:</span>
                <div className="text-gray-900 mt-1 bg-orange-50 p-2 rounded">
                  {row.original.data.puntosCalientes || 'No reportados'}
                </div>
              </div>

              <div>
                <span className="font-medium text-gray-600 text-sm">Auto Combustiones:</span>
                <div className="text-gray-900 mt-1 bg-red-50 p-2 rounded">
                  {row.original.data.autoCombustiones || 'No reportadas'}
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

export default InspeccionPilasTable;