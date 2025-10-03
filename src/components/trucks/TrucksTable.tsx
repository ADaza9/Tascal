'use client';

import React, { useState, useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
} from '@tanstack/react-table';
import { ITruck } from '@/app/models/truck';



const columnHelper = createColumnHelper<ITruck>();

interface TrucksTableProps {
  data: ITruck[];
  onEdit?: (truck: ITruck) => void;
  onDelete?: (id: string) => void;
}

const TrucksTable: React.FC<TrucksTableProps> = ({ data: initialData, onEdit, onDelete }) => {
  const [data, setData] = useState<ITruck[]>(initialData);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [truckToDelete, setTruckToDelete] = useState<string | null>(null);

  const handleDeleteClick = (id: string) => {
    setTruckToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (truckToDelete && onDelete) {
      onDelete(truckToDelete);
      setData(data.filter(truck => truck.id !== truckToDelete));
    }
    setShowDeleteModal(false);
    setTruckToDelete(null);
  };

  const columns = useMemo(() => [
    columnHelper.accessor('truckNumber', {
      header: 'Número de Camión',
      cell: info => (
        <span className="font-semibold text-primary">
          {info.getValue() || '-'}
        </span>
      ),
    }),
    columnHelper.accessor('kmInicial', {
      header: 'Km Inicial',
      cell: info => {
        const value = info.getValue();
        return value ? parseFloat(value).toLocaleString() : '-';
      },
    }),
    columnHelper.accessor('kmFinal', {
      header: 'Km Final',
      cell: info => {
        const value = info.getValue();
        return value ? parseFloat(value).toLocaleString() : '-';
      },
    }),
    columnHelper.display({
      id: 'recorrido',
      header: 'Recorrido (Km)',
      cell: ({ row }) => {
        const inicial = row.original.kmInicial;
        const final = row.original.kmFinal;
        if (!inicial || !final) return '-';
        const recorrido = parseFloat(final) - parseFloat(inicial);
        return (
          <span className="badge badge-info badge-lg">
            {recorrido.toLocaleString()}
          </span>
        );
      },
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Acciones',
      cell: ({ row }) => (
        <div className="flex gap-2">
          {/* <button
            className="btn btn-sm btn-ghost btn-square"
            onClick={() => onEdit && onEdit(row.original)}
            title="Editar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
            </svg>
          </button> */}
          <button
            className="btn btn-sm btn-ghost btn-square text-error"
            onClick={() => handleDeleteClick(row.original.id)}
            title="Eliminar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
            </svg>
          </button>
        </div>
      ),
    }),
  ], [onEdit]);

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
    <>
      <div className="w-full space-y-4">
        {/* Vista Desktop */}
        <div className="hidden lg:block overflow-x-auto bg-base-100 rounded-lg shadow-xl">
          <table className="table table-zebra w-full">
            <thead>
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th key={header.id} className="text-base">
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map(row => (
                <tr key={row.id} className="hover">
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Vista Tablet */}
        <div className="hidden md:block lg:hidden overflow-x-auto bg-base-100 rounded-lg shadow-xl">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>Camión</th>
                <th>Kilometraje</th>
                <th>Recorrido</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {table.getRowModel().rows.map(row => (
                <tr key={row.id} className="hover">
                  <td>
                    <span className="font-semibold text-primary">
                      {row.original.truckNumber || '-'}
                    </span>
                  </td>
                  <td>
                    <div className="space-y-1 text-sm">
                      <div><span className="font-medium">Inicial:</span> {row.original.kmInicial ? parseFloat(row.original.kmInicial).toLocaleString() : '-'}</div>
                      <div><span className="font-medium">Final:</span> {row.original.kmFinal ? parseFloat(row.original.kmFinal).toLocaleString() : '-'}</div>
                    </div>
                  </td>
                  <td>
                    {row.original.kmInicial && row.original.kmFinal ? (
                      <span className="badge badge-info badge-lg">
                        {(parseFloat(row.original.kmFinal) - parseFloat(row.original.kmInicial)).toLocaleString()}
                      </span>
                    ) : '-'}
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <button
                        className="btn btn-sm btn-ghost btn-square"
                        onClick={() => onEdit && onEdit(row.original)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                        </svg>
                      </button>
                      <button
                        className="btn btn-sm btn-ghost btn-square text-error"
                        onClick={() => handleDeleteClick(row.original.id)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                      </button>
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
            <div key={row.id} className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="card-title text-primary">
                      Camión {row.original.truckNumber || 'S/N'}
                    </h3>
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="btn btn-sm btn-ghost btn-square"
                      onClick={() => onEdit && onEdit(row.original)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                      </svg>
                    </button>
                    <button
                      className="btn btn-sm btn-ghost btn-square text-error"
                      onClick={() => handleDeleteClick(row.original.id)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm opacity-70">Km Inicial</p>
                    <p className="font-semibold">
                      {row.original.kmInicial ? parseFloat(row.original.kmInicial).toLocaleString() : '-'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm opacity-70">Km Final</p>
                    <p className="font-semibold">
                      {row.original.kmFinal ? parseFloat(row.original.kmFinal).toLocaleString() : '-'}
                    </p>
                  </div>
                </div>

                {row.original.kmInicial && row.original.kmFinal && (
                  <div className="divider my-2"></div>
                )}

                {row.original.kmInicial && row.original.kmFinal && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Recorrido Total:</span>
                    <span className="badge badge-info badge-lg">
                      {(parseFloat(row.original.kmFinal) - parseFloat(row.original.kmInicial)).toLocaleString()} km
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Paginación */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-base-100 p-4 rounded-lg shadow-xl">
          <div className="join">
            <button
              className="join-item btn btn-sm"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              «
            </button>
            <button
              className="join-item btn btn-sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              ‹
            </button>
            <button className="join-item btn btn-sm btn-active">
              Página {table.getState().pagination.pageIndex + 1}
            </button>
            <button
              className="join-item btn btn-sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              ›
            </button>
            <button
              className="join-item btn btn-sm"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              »
            </button>
          </div>

          <div className="text-sm">
            <span>
              Mostrando <strong>{table.getRowModel().rows.length}</strong> de{' '}
              <strong>{data.length}</strong> registros
            </span>
          </div>
        </div>
      </div>

      {/* Modal de Confirmación de Eliminación */}
      {showDeleteModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Confirmar Eliminación</h3>
            <p className="py-4">¿Estás seguro de que deseas eliminar este registro? Esta acción no se puede deshacer.</p>
            <div className="modal-action">
              <button className="btn" onClick={() => setShowDeleteModal(false)}>
                Cancelar
              </button>
              <button className="btn btn-error" onClick={confirmDelete}>
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TrucksTable;