'use client';

import React, { useState } from 'react';
import { useForm } from '@tanstack/react-form';
import { useRouter } from 'next/navigation';

interface RegisterTruckFormProps {
  userId: string;
}

const RegisterTruckForm: React.FC<RegisterTruckFormProps> = ({ userId }) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  const showToastMessage = (message: string, type: 'success' | 'error') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);

    setTimeout(() => {
      setShowToast(false);
      if (type === 'success') {
        router.back();
      }
    }, 3000);
  };

  const form = useForm({
    defaultValues: {
      truckNumber: '',
      kmInicial: '',
      kmFinal: '',
    },
    onSubmit: async ({ value }) => {
      setIsSubmitting(true);
      console.log({value});
      try {
        const response = await fetch('/api/trucks', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },          
          body: JSON.stringify({
            userId,
            truckNumber: value.truckNumber,
            kmInicial: value.kmInicial,
            kmFinal: value.kmFinal,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          showToastMessage('Camión registrado exitosamente', 'success');
        } else {
          showToastMessage(data.message || 'Error al registrar el camión', 'error');
        }
      } catch (error) {
        showToastMessage('Error al conectar con el servidor', 'error');
      } finally {
        setIsSubmitting(false);
      }
    },
  });

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

      {/* Formulario */}
      <div className="card bg-base-100 shadow-xl max-w-2xl mx-auto">
        <div className="card-body">
          <h2 className="card-title text-2xl mb-4">Registrar Camión</h2>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
          >
            {/* Número de Camión */}
            <form.Field
              name="truckNumber"
              validators={{
                onChange: ({ value }) => {
                  if (!value) return 'El número de camión es obligatorio';
                  if (!/^\d+$/.test(value)) return 'Debe ser un número válido';
                  return undefined;
                },
              }}
              children={(field) => (
                <div className="form-control w-full mb-4">
                  <label className="label">
                    <span className="label-text font-medium">
                      Número de Camión <span className="text-error">*</span>
                    </span>
                  </label>
                  <input
                    type="text"
                    placeholder="Ingresa el número de camión"
                    className={`input input-bordered w-full ${
                      field.state.meta.errors.length > 0 ? 'input-error' : ''
                    }`}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                  />
                  {field.state.meta.errors.length > 0 && (
                    <label className="label">
                      <span className="label-text-alt text-error">
                        {field.state.meta.errors[0]}
                      </span>
                    </label>
                  )}
                </div>
              )}
            />

            {/* Km Inicial */}
            <form.Field
              name="kmInicial"
              validators={{
                onChange: ({ value }) => {
                  if (!value) return 'El kilometraje inicial es obligatorio';
                  if (!/^\d+(\.\d+)?$/.test(value)) return 'Debe ser un número válido';
                  return undefined;
                },
              }}
              children={(field) => (
                <div className="form-control w-full mb-4">
                  <label className="label">
                    <span className="label-text font-medium">
                      Kilometraje Inicial <span className="text-error">*</span>
                    </span>
                  </label>
                  <input
                    type="text"
                    placeholder="Ingresa el kilometraje inicial"
                    className={`input input-bordered w-full ${
                      field.state.meta.errors.length > 0 ? 'input-error' : ''
                    }`}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                  />
                  {field.state.meta.errors.length > 0 && (
                    <label className="label">
                      <span className="label-text-alt text-error">
                        {field.state.meta.errors[0]}
                      </span>
                    </label>
                  )}
                </div>
              )}
            />

            {/* Km Final */}
            <form.Field
              name="kmFinal"
              validators={{
                onChange: ({ value, fieldApi }) => {
                  if (!value) return 'El kilometraje final es obligatorio';
                  if (!/^\d+(\.\d+)?$/.test(value)) return 'Debe ser un número válido';

                  const kmInicial = fieldApi.form.getFieldValue('kmInicial');
                  if (kmInicial && parseFloat(value) <= parseFloat(kmInicial)) {
                    return 'El Km final debe ser mayor que el Km inicial';
                  }

                  return undefined;
                },
              }}
              children={(field) => (
                <div className="form-control w-full mb-6">
                  <label className="label">
                    <span className="label-text font-medium">
                      Kilometraje Final <span className="text-error">*</span>
                    </span>
                  </label>
                  <input
                    type="text"
                    placeholder="Ingresa el kilometraje final"
                    className={`input input-bordered w-full ${
                      field.state.meta.errors.length > 0 ? 'input-error' : ''
                    }`}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                  />
                  {field.state.meta.errors.length > 0 && (
                    <label className="label">
                      <span className="label-text-alt text-error">
                        {field.state.meta.errors[0]}
                      </span>
                    </label>
                  )}
                </div>
              )}
            />

            {/* Botones */}
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => router.back()}
                disabled={isSubmitting}
              >
                Cancelar
              </button>
              <form.Subscribe
                selector={(state) => [state.canSubmit, state.isSubmitting]}
                children={([canSubmit, isSubmitting]) => (
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={!canSubmit || isSubmitting}
                  >
                    {isSubmitting && <span className="loading loading-spinner"></span>}
                    {isSubmitting ? 'Registrando...' : 'Registrar Camión'}
                  </button>
                )}
              />
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default RegisterTruckForm;