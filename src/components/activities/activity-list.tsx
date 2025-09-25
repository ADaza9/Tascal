'use client';

import React, { useState, useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
} from '@tanstack/react-table';

interface ActivityOperationData {
  tajo?: string;
  coordenada?: string;
  destinoInicial?: string;
  destinoFinal?: string;
  pronosticoBTU?: number;
  btuReal?: number;
  ubicacion?: string;
  estado?: string;
  observaciones?: string;
  numeroPila?: string;
  altura?: number;
  profundidad?: number;
  temperatura?: number;
  resultados?: string;
}

interface ActivityOperation {
  id: string;
  userId: string;
  turn: 'diurno' | 'nocturno';
  type: 'desvio_de_cargas' | 'inspeccion_mantos_carbon' | 'inspeccion_pilas' | 'sondeo_cargas';
  data: ActivityOperationData;
  createdDay: string;
  updatedAt: string;
}

const columnHelper = createColumnHelper<ActivityOperation>();

interface ActivityOperationTableProps {
  data: ActivityOperation[];
}

const ActivityOperationTable: React.FC<ActivityOperationTableProps> = ({ data: initialData }) => {
  const [data, setData] = useState<ActivityOperation[]>(initialData);
  const [editingBtuReal, setEditingBtuReal] = useState<{ [key: string]: string }>({});

  // Mock function para actualizar el registro - reemplazar con API real
  const updateBtuReal = async (id: string, btuReal: number) => {
    console.log(`Actualizando registro ${id} con btuReal: ${btuReal}`);
    // TODO: Implementar llamada a API
    // await updateActivityOperation(id, { data: { ...existingData, btuReal } });
  };

  const handleBtuRealSubmit = async (row: ActivityOperation) => {
    const inputValue = editingBtuReal[row.id];
    if (!inputValue || inputValue.trim() === '') return;

    const btuRealValue = parseFloat(inputValue);
    if (isNaN(btuRealValue)) {
      alert('Por favor ingresa un valor numérico válido');
      return;
    }

    try {
      // Actualizar localmente
      setData(prevData =>
        prevData.map(item =>
          item.id === row.id
            ? {
                ...item,
                data: { ...item.data, btuReal: btuRealValue }
              }
            : item
        )
      );

      // Limpiar el input de edición
      setEditingBtuReal(prev => {
        const newState = { ...prev };
        delete newState[row.id];
        return newState;
      });

      // Llamar a la API (mock por ahora)
      await updateBtuReal(row.id, btuRealValue);
      
    } catch (error) {
      console.error('Error actualizando btuReal:', error);
      alert('Error al actualizar el registro');
    }
  };

  const handleInputChange = (rowId: string, value: string) => {
    setEditingBtuReal(prev => ({
      ...prev,
      [rowId]: value
    }));
  };

  const columns = useMemo(() => [
    columnHelper.accessor('turn', {
      header: 'Turno',
      cell: info => (
        <span className="capitalize font-medium">
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.accessor('type', {
      header: 'Tipo de Actividad',
      cell: info => (
        <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
          {info.getValue().replace(/_/g, ' ')}
        </span>
      ),
    }),
    columnHelper.accessor('data.tajo', {
      header: 'Tajo',
      cell: info => info.getValue() || '-',
    }),
    columnHelper.accessor('data.coordenada', {
      header: 'Coordenada',
      cell: info => info.getValue() || '-',
    }),
    columnHelper.accessor('data.destinoInicial', {
      header: 'Destino Inicial',
      cell: info => info.getValue() || '-',
    }),
    columnHelper.accessor('data.destinoFinal', {
      header: 'Destino Final',
      cell: info => info.getValue() || '-',
    }),
    columnHelper.accessor('data.pronosticoBTU', {
      header: 'Pronóstico BTU',
      cell: info => {
        const value = info.getValue();
        return value ? value.toLocaleString() : '-';
      },
    }),
    columnHelper.accessor('data.btuReal', {
      header: 'BTU Real',
      cell: info => {
        const value = info.getValue();
        return value ? value.toLocaleString() : '-';
      },
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Acción',
      cell: ({ row }) => {
        const hasRealBtu = row.original.data.btuReal !== undefined;
        const currentInput = editingBtuReal[row.original.id] || '';

        if (hasRealBtu) {
          return (
            <span className="text-green-600 font-medium text-sm">
              ✓ BTU Real agregado
            </span>
          );
        }

        return (
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="BTU Real"
              value={currentInput}
              onChange={(e) => handleInputChange(row.original.id, e.target.value)}
              className="w-24 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleBtuRealSubmit(row.original);
                }
              }}
            />
            <button
              onClick={() => handleBtuRealSubmit(row.original)}
              disabled={!currentInput || currentInput.trim() === ''}
              className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Agregar
            </button>
          </div>
        );
      },
    }),
  ], [editingBtuReal]);

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
                    className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
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
                    className="px-4 py-3 whitespace-nowrap text-sm text-gray-900"
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
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Ubicación</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">BTU</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Acción</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {table.getRowModel().rows.map(row => (
              <tr key={row.id} className="hover:bg-gray-50">
                <td className="px-3 py-3">
                  <div className="space-y-1">
                    <span className="capitalize font-medium text-sm text-gray-700 mr-2">{row.original.turn}</span>
                    <div className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full inline-block">
                      {row.original.type.replace(/_/g, ' ')}
                    </div>
                  </div>
                </td>
                <td className="px-3 py-3">
                  <div className="space-y-1 text-sm text-gray-700 ">
                    {row.original.data.tajo && <div><span className="font-medium">Tajo:</span> {row.original.data.tajo}</div>}
                    {row.original.data.coordenada && <div><span className="font-medium">Coord:</span> {row.original.data.coordenada}</div>}
                    {row.original.data.destinoInicial && <div><span className="font-medium">Origen:</span> {row.original.data.destinoInicial}</div>}
                    {row.original.data.destinoFinal && <div><span className="font-medium">Destino:</span> {row.original.data.destinoFinal}</div>}
                  </div>
                </td>
                <td className="px-3 py-3">
                  <div className="space-y-1 text-sm text-gray-700 ">
                    {row.original.data.pronosticoBTU && (
                      <div><span className="font-medium">Pronóstico:</span> {row.original.data.pronosticoBTU.toLocaleString()}</div>
                    )}
                    {row.original.data.btuReal && (
                      <div><span className="font-medium ">Real:</span> {row.original.data.btuReal.toLocaleString()}</div>
                    )}
                  </div>
                </td>
                <td className="px-3 py-3">
                  {row.original.data.btuReal !== undefined ? (
                    <span className="text-green-600 font-medium text-sm text-gray-700 ">✓ Agregado</span>
                  ) : (
                    <div className="space-y-2">
                      <input
                        type="number"
                        placeholder="BTU Real"
                        value={editingBtuReal[row.original.id] || ''}
                        onChange={(e) => handleInputChange(row.original.id, e.target.value)}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleBtuRealSubmit(row.original);
                          }
                        }}
                      />
                      <button
                        onClick={() => handleBtuRealSubmit(row.original)}
                        disabled={!editingBtuReal[row.original.id] || editingBtuReal[row.original.id].trim() === ''}
                        className="w-full px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 transition-colors"
                      >
                        Agregar
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Vista Mobile - Cards */}
      <div className="md:hidden space-y-4">
        {table.getRowModel().rows.map(row => (
          <div key={row.id} className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
            {/* Header */}
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-2">
                <span className="capitalize font-semibold text-gray-900">{row.original.turn}</span>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                  {row.original.type.replace(/_/g, ' ')}
                </span>
              </div>
            </div>

            {/* Data Fields */}
            <div className="grid grid-cols-2 gap-2 mb-4 text-sm text-gray-700 ">
              {row.original.data.tajo && (
                <div>
                  <span className="font-medium text-gray-600">Tajo:</span>
                  <div className="text-gray-900">{row.original.data.tajo}</div>
                </div>
              )}
              {row.original.data.coordenada && (
                <div>
                  <span className="font-medium text-gray-600">Coordenada:</span>
                  <div className="text-gray-900 text-xs">{row.original.data.coordenada}</div>
                </div>
              )}
              {row.original.data.destinoInicial && (
                <div>
                  <span className="font-medium text-gray-600">Origen:</span>
                  <div className="text-gray-900">{row.original.data.destinoInicial}</div>
                </div>
              )}
              {row.original.data.destinoFinal && (
                <div>
                  <span className="font-medium text-gray-600">Destino:</span>
                  <div className="text-gray-900">{row.original.data.destinoFinal}</div>
                </div>
              )}
            </div>

            {/* BTU Section */}
            <div className="border-t pt-3">
              <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
                {row.original.data.pronosticoBTU && (
                  <div>
                    <span className="font-medium text-gray-600">Pronóstico BTU:</span>
                    <div className="text-gray-900 font-medium">
                      {row.original.data.pronosticoBTU.toLocaleString()}
                    </div>
                  </div>
                )}
                {row.original.data.btuReal && (
                  <div>
                    <span className="font-medium text-gray-600">BTU Real:</span>
                    <div className="text-gray-900 font-medium">
                      {row.original.data.btuReal.toLocaleString()}
                    </div>
                  </div>
                )}
              </div>

              {/* Action */}
              {row.original.data.btuReal !== undefined ? (
                <div className="flex items-center gap-2 text-green-600">
                  <span className="text-xl">✓</span>
                  <span className="font-medium">BTU Real agregado</span>
                </div>
              ) : (
                <div className="space-y-2">
                  <input
                    type="number"
                    placeholder="Ingresa BTU Real"
                    value={editingBtuReal[row.original.id] || ''}
                    onChange={(e) => handleInputChange(row.original.id, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleBtuRealSubmit(row.original);
                      }
                    }}
                  />
                  <button
                    onClick={() => handleBtuRealSubmit(row.original)}
                    disabled={!editingBtuReal[row.original.id] || editingBtuReal[row.original.id].trim() === ''}
                    className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
                  >
                    Agregar BTU Real
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Paginación Responsive */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-lg shadow">
        {/* Controles de paginación */}
        <div className="flex items-center gap-1 sm:gap-2 text-gray-700 ">
          <button
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
            className="px-2 sm:px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Primera página"
          >
            {'<<'}
          </button>
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="px-2 sm:px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Página anterior"
          >
            {'<'}
          </button>
          
          {/* Indicador de página actual - solo en desktop */}
          <span className="hidden sm:inline-block px-3 py-1 text-sm text-gray-700 bg-blue-50 border border-blue-200 rounded">
            {table.getState().pagination.pageIndex + 1}
          </span>
          
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="px-2 sm:px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Página siguiente"
          >
            {'>'}
          </button>
          <button
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
            className="px-2 sm:px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Última página"
          >
            {'>>'}
          </button>
        </div>

        {/* Info de página - adaptada para móvil */}
        <div className="flex flex-col sm:flex-row items-center gap-2 text-sm text-gray-700">
          <span>
            Página{' '}
            <strong className="text-blue-600">
              {table.getState().pagination.pageIndex + 1}
            </strong>
            {' '}de{' '}
            <strong className="text-blue-600">
              {table.getPageCount()}
            </strong>
          </span>
          <span className="hidden sm:inline">•</span>
          <span>
            <strong>{table.getRowModel().rows.length}</strong> de{' '}
            <strong>{data.length}</strong> registros
          </span>
        </div>
      </div>
    </div>
  );
};

export default ActivityOperationTable;