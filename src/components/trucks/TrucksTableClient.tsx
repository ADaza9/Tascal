
'use client';

import { useRouter } from 'next/navigation';
import TrucksTable from './TrucksTable';
import { useState } from 'react';
import { ITruck } from '@/app/models/truck';

interface TrucksTableClientProps {
  data: ITruck[];
}

export default function TrucksTableClient({ data }: TrucksTableClientProps) {
  const router = useRouter();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  const showToastMessage = (message: string, type: 'success' | 'error') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);

    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  const handleEdit = (truck: ITruck) => {
    // Redirigir a página de edición
    router.push(`/trucks/edit/${truck.id}`);
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/trucks/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        showToastMessage('Camión eliminado exitosamente', 'success');
        // Recargar la página después de eliminar
        setTimeout(() => {
          router.refresh();
        }, 1000);
      } else {
        showToastMessage('Error al eliminar el camión', 'error');
      }
    } catch (error) {
      showToastMessage('Error al conectar con el servidor', 'error');
    }
  };

  return (
    <>
      {/* Toast */}
      {showToast && (
        <div className="toast toast-top toast-end z-50">
          <div className={`alert ${toastType === 'success' ? 'alert-success' : 'alert-error'}`}>
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      <TrucksTable data={data}
      // onEdit={handleEdit} 
      onDelete={handleDelete} />
    </>
  );
}