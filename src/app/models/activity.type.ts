
export interface ActivityOperationData {
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

export interface IActivityOperation {
  id: string;
  userId: string;
  turn: 'diurno' | 'nocturno';
  type: 'desvio_de_cargas' | 'inspeccion_mantos_carbon' | 'inspeccion_pilas' | 'sondeo_cargas';
  data: ActivityOperationData;
  createdDay: string;
  updatedAt: string;
}