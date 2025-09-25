'use client';

import React, { useState } from 'react';
import { useForm, useStore } from '@tanstack/react-form';
import { Turn, ActivityType, Zona, Destino, ZonaMantos, SondeoType, FormDataRegister } from '@/app/models/form';
import { UserWithRole } from '@/lib/session';
import { useRouter } from 'next/navigation';


interface FormState {
  turn: Turn;
  type: ActivityType;
  data: FormDataRegister;
}

const StepperForm = ({user, isDevelopment}: {user: UserWithRole, isDevelopment: boolean}) => {
  const [currentStep, setCurrentStep] = useState(1);

  const router = useRouter();
  
  const form = useForm({
    defaultValues: {
      turn: 'diurno',
      type: 'desvio_de_cargas',
      data: {} as FormDataRegister,
    },
    onSubmit: async ({ value }) => {
    

     await fetch('/api/activity', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({...value, userId: user.id}),
      })
      .then(response => response.json())
      .then(data => {
         if (data.activity) {
          router.push('/dashboard/list');
         }
      })
      .catch((error) => {
        console.error('Error al enviar el formulario:', error);
      });
    },
  });

  const watchedType = useStore(form.store, (state) => state.values.type);
  const watchedTurn = useStore(form.store,(state) => state.values.turn);

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 3));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const canProceed = () => {
    if (currentStep === 1) return watchedTurn;
    if (currentStep === 2) return watchedType;
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    form.handleSubmit();
  };

  // Render Step 1: Turno
  const renderStep1 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Selecciona el turno</h3>
      <form.Field name="turn">
        {(field) => (
          <div className="flex row gap-5 justify-center items-center"> 
            <div className="form-control">
              <label className="label cursor-pointer">
                <span className="label-text">Diurno</span>
                <input
                  type="radio"
                  name="turn"
                  className="radio checked:bg-blue-500"
                  value="diurno"
                  checked={field.state.value === 'diurno'}
                  onChange={(e) => field.handleChange(e.target.value as Turn)}
                />
              </label>
            </div>
            <div className="form-control">
              <label className="label cursor-pointer">
                <span className="label-text">Nocturno</span>
                <input
                  type="radio"
                  name="turn"
                  className="radio checked:bg-blue-500"
                  value="nocturno"
                  checked={field.state.value === 'nocturno'}
                  onChange={(e) => field.handleChange(e.target.value as Turn)}
                />
              </label>
            </div>
          </div>
        )}
      </form.Field>
    </div>
  );

  // Render Step 2: Tipo de actividad
  const renderStep2 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Selecciona el tipo de actividad</h3>
      <form.Field name="type">
        {(field) => (
          <div className="space-y-2">
            {[
              { value: 'inspeccion_mantos_carbon', label: 'Inspección de mantos de carbón' },
              { value: 'inspeccion_pilas', label: 'Inspección de pilas' },
              { value: 'sondeo_cargas', label: 'Sondeo de cargas' },
              { value: 'desvio_de_cargas', label: 'Desvío de cargas' }
            ].map((option) => (
              <div key={option.value} className="form-control">
                <label className="label cursor-pointer">
                  <span className="label-text">{option.label}</span>
                  <input
                    type="radio"
                    name="type"
                    className="radio checked:bg-blue-500"
                    value={option.value}
                    checked={field.state.value === option.value}
                    onChange={(e) => {
                      field.handleChange(e.target.value as ActivityType);
                      // Reset data when changing type
                      form.setFieldValue('data', {} as FormDataRegister);
                    }}
                  />
                </label>
              </div>
            ))}
          </div>
        )}
      </form.Field>
    </div>
  );

  // Render Step 3: Campos específicos según el tipo
  const renderStep3 = () => {
    switch (watchedType) {
      case 'desvio_de_cargas':
        return <DesvioFields />;
      case 'inspeccion_mantos_carbon':
        return <InspeccionMantosFields />;
      case 'inspeccion_pilas':
        return <InspeccionPilasFields />;
      case 'sondeo_cargas':
        return <SondeoFields />;
      default:
        return <div>Selecciona un tipo de actividad</div>;
    }
  };

  // Componente para Desvío de cargas
  const DesvioFields: React.FC = () => {
    const [zona, setZona] = React.useState<Zona>('Zona Norte');
    
    const tajos = zona === 'Zona Norte' 
      ? ['Annex', 'La Puente', 'Tabaco']
      : ['EWP', 'Patilla', 'Tajo 100', 'Oreganal'];

    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Desvío de cargas</h3>
        
        {/* Zona de Origen */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Zona de Origen</span>
          </label>
          <select 
            className="select select-bordered w-full"
            value={zona}
            onChange={(e) => {
              setZona(e.target.value as Zona);
              form.setFieldValue('data.zonaOrigen', e.target.value as Zona);
              form.setFieldValue('data.tajo', '');
            }}
          >
            <option value="Zona Norte">Zona Norte</option>
            <option value="Zona Sur">Zona Sur</option>
          </select>
        </div>

        {/* Tajo */}
        <form.Field name="data.tajo">
          {(field) => (
            <div className="form-control">
              <label className="label">
                <span className="label-text">Tajo</span>
              </label>
              <select 
                className="select select-bordered w-full"
                value={field.state.value || ''}
                onChange={(e) => field.handleChange(e.target.value)}
              >
                <option value="">Selecciona un tajo</option>
                {tajos.map(tajo => (
                  <option key={tajo} value={tajo}>{tajo}</option>
                ))}
              </select>
            </div>
          )}
        </form.Field>

        {/* Coordenada */}
        <form.Field name="data.coordenada">
          {(field) => (
            <div className="form-control">
              <label className="label">
                <span className="label-text">Coordenada (Formato: F-30-45-160)</span>
              </label>
              <input
                type="text"
                placeholder="F-30-45-160"
                className="input input-bordered w-full"
                value={field.state.value || ''}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            </div>
          )}
        </form.Field>

        {/* Destino Inicial */}
        <form.Field name="data.destinoInicial">
          {(field) => (
            <div className="form-control">
              <label className="label">
                <span className="label-text">Destino Inicial</span>
              </label>
              <select 
                className="select select-bordered w-full"
                value={field.state.value || ''}
                onChange={(e) => field.handleChange(e.target.value as Destino)}
              >
                <option value="">Selecciona destino inicial</option>
                <option value="Pilas">Pilas</option>
                <option value="Silos">Silos</option>
                <option value="Planta de Lavado">Planta de Lavado</option>
              </select>
            </div>
          )}
        </form.Field>

        {/* Destino Final */}
        <form.Field name="data.destinoFinal">
          {(field) => (
            <div className="form-control">
              <label className="label">
                <span className="label-text">Destino Final</span>
              </label>
              <select 
                className="select select-bordered w-full"
                value={field.state.value || ''}
                onChange={(e) => field.handleChange(e.target.value as Destino)}
              >
                <option value="">Selecciona destino final</option>
                <option value="Pilas">Pilas</option>
                <option value="Silos">Silos</option>
                <option value="Planta de Lavado">Planta de Lavado</option>
              </select>
            </div>
          )}
        </form.Field>

        {/* Pronóstico de BTU */}
        <form.Field name="data.pronosticoBTU">
          {(field) => (
            <div className="form-control">
              <label className="label">
                <span className="label-text">Pronóstico de BTU</span>
              </label>
              <input
                type="number"
                placeholder="Ingresa el pronóstico de BTU"
                className="input input-bordered w-full"
                value={field.state.value || ''}
                onChange={(e) => field.handleChange(parseFloat(e.target.value))}
              />
            </div>
          )}
        </form.Field>

      </div>
    );
  };

  // Componente para Inspección de mantos de carbón
  const InspeccionMantosFields: React.FC = () => {
    const [zona, setZona] = React.useState<ZonaMantos>('Zona Norte');
    
    const tajos = zona === 'Zona Norte' 
      ? ['Annex', 'La Puente', 'Tabaco']
      : []; // Para Zona Centro, dejamos que el usuario escriba

    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Inspección de mantos de carbón</h3>
        
        {/* Zona */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Zona</span>
          </label>
          <select 
            className="select select-bordered w-full"
            value={zona}
            onChange={(e) => {
              setZona(e.target.value as ZonaMantos);
              form.setFieldValue('data.zona', e.target.value as ZonaMantos);
              form.setFieldValue('data.tajo', '');
            }}
          >
            <option value="Zona Norte">Zona Norte</option>
            <option value="Zona Centro">Zona Centro</option>
          </select>
        </div>

        {/* Tajo */}
        <form.Field name="data.tajo">
          {(field) => (
            <div className="form-control">
              <label className="label">
                <span className="label-text">Tajo</span>
              </label>
              {zona === 'Zona Norte' ? (
                <select 
                  className="select select-bordered w-full"
                  value={field.state.value || ''}
                  onChange={(e) => field.handleChange(e.target.value)}
                >
                  <option value="">Selecciona un tajo</option>
                  {tajos.map(tajo => (
                    <option key={tajo} value={tajo}>{tajo}</option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  placeholder="Ingresa el nombre del tajo"
                  className="input input-bordered w-full"
                  value={field.state.value || ''}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              )}
            </div>
          )}
        </form.Field>

        {/* Coordenada */}
        <form.Field name="data.coordenada">
          {(field) => (
            <div className="form-control">
              <label className="label">
                <span className="label-text">Coordenada</span>
              </label>
              <input
                type="text"
                placeholder="F-30-45-160"
                className="input input-bordered w-full"
                value={field.state.value || ''}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            </div>
          )}
        </form.Field>

        {/* Pronóstico de BTU */}
        <form.Field name="data.pronosticoBTU">
          {(field) => (
            <div className="form-control">
              <label className="label">
                <span className="label-text">Pronóstico de BTU</span>
              </label>
              <input
                type="number"
                placeholder="Ingresa el pronóstico de BTU"
                className="input input-bordered w-full"
                value={field.state.value || ''}
                onChange={(e) => field.handleChange(parseFloat(e.target.value))}
              />
            </div>
          )}
        </form.Field>
      </div>
    );
  };

  // Componente para Inspección de pilas
  const InspeccionPilasFields: React.FC = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Inspección de pilas</h3>
      
      <form.Field name="data.pila">
        {(field) => (
          <div className="form-control">
            <label className="label">
              <span className="label-text">Pila</span>
            </label>
            <input
              type="text"
              placeholder="Nombre de la pila"
              className="input input-bordered w-full"
              value={field.state.value || ''}
              onChange={(e) => field.handleChange(e.target.value)}
            />
          </div>
        )}
      </form.Field>

      <form.Field name="data.comentario">
        {(field) => (
          <div className="form-control">
            <label className="label">
              <span className="label-text">Comentario</span>
            </label>
            <textarea
              placeholder="Ingresa tu comentario"
              className="textarea textarea-bordered w-full"
              value={field.state.value || ''}
              onChange={(e) => field.handleChange(e.target.value)}
            />
          </div>
        )}
      </form.Field>
    </div>
  );

  // Componente para Sondeo de cargas
  const SondeoFields: React.FC = () => {
    const [sondeoType, setSondeoType] = React.useState<SondeoType>('sondeo_de_pilas');

    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Sondeo de cargas</h3>
        
        {/* Tipo de sondeo */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Tipo de sondeo</span>
          </label>
          <select 
            className="select select-bordered w-full"
            value={sondeoType}
            onChange={(e) => {
              setSondeoType(e.target.value as SondeoType);
              form.setFieldValue('data.tipo', e.target.value as SondeoType);
            }}
          >
            <option value="sondeo_de_pilas">Sondeo de pilas</option>
            <option value="sondeo_de_cargas">Sondeo de cargas</option>
          </select>
        </div>

        {/* Nombre de la pila */}
        <form.Field name="data.nombrePila">
          {(field) => (
            <div className="form-control">
              <label className="label">
                <span className="label-text">Nombre de la pila</span>
              </label>
              <input
                type="text"
                placeholder="Nombre de la pila"
                className="input input-bordered w-full"
                value={field.state.value || ''}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            </div>
          )}
        </form.Field>

        {/* % de ceniza */}
        <form.Field name="data.porcentajeCeniza">
          {(field) => (
            <div className="form-control">
              <label className="label">
                <span className="label-text">% de ceniza</span>
              </label>
              <input
                type="number"
                placeholder="Porcentaje de ceniza"
                className="input input-bordered w-full"
                step="0.01"
                value={field.state.value || ''}
                onChange={(e) => field.handleChange(parseFloat(e.target.value))}
              />
            </div>
          )}
        </form.Field>

        {/* CPS */}
        <form.Field name="data.cps">
          {(field) => (
            <div className="form-control">
              <label className="label">
                <span className="label-text">Conteos por segundo (CPS)</span>
              </label>
              <input
                type="number"
                placeholder="CPS"
                className="input input-bordered w-full"
                value={field.state.value || ''}
                onChange={(e) => field.handleChange(parseFloat(e.target.value))}
              />
            </div>
          )}
        </form.Field>

        {/* Coordenada - solo para sondeo de cargas */}
        {sondeoType === 'sondeo_de_cargas' && (
          <form.Field name="data.coordenada">
            {(field) => (
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Coordenada</span>
                </label>
                <input
                  type="text"
                  placeholder="F-30-45-160"
                  className="input input-bordered w-full"
                  value={field.state.value || ''}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </div>
            )}
          </form.Field>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-base-100">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          {/* Progress Steps */}
          <div className="steps w-full mb-8">
            <div className={`step ${currentStep >= 1 ? 'step-primary' : ''}`}>
              Turno
            </div>
            <div className={`step ${currentStep >= 2 ? 'step-primary' : ''}`}>
              Actividad
            </div>
            <div className={`step ${currentStep >= 3 ? 'step-primary' : ''}`}>
              Detalles
            </div>
          </div>

          {/* Step Content */}
          <div className="min-h-96">
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <button
              type="button"
              className="btn btn-outline"
              onClick={prevStep}
              disabled={currentStep === 1}
            >
              Anterior
            </button>

            {currentStep < 3 ? (
              <button
                type="button"
                className="btn btn-primary"
                onClick={nextStep}
                disabled={!canProceed()}
              >
                Siguiente
              </button>
            ) : (
              <button
                type="button"
                className="btn btn-success"
                onClick={handleSubmit}
              >
                Enviar Formulario
              </button>
            )}
          </div>

          {/* Debug Info */}
          {isDevelopment && <div className="mt-8 p-4 bg-base-200 rounded-lg">
            <h4 className="font-semibold mb-2">Datos actuales:</h4>
            <pre className="text-xs overflow-auto">
              {JSON.stringify(form.state.values, null, 2)}
            </pre>
          </div>}
          
        </div>
      </div>
    </div>
  );
};

export default StepperForm;