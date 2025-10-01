
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
  data: Record<string, any>;
  createdDay: string;
  updatedAt: string;
}

interface DesvioData {
  coordenada: string;
  destinoInicial: string;
  destinoFinal: string;
  pronosticoBTU: number;
  btuReal?: number;
}

export interface IDesvioCargas {
  id: string;
  userId: string;
  turn: 'diurno' | 'nocturno';
  type: 'desvio_de_cargas';
  data: DesvioData;
  createdDay: string;
  updatedAt: string;
}

interface IInspeccionMantosData {
  coordenada: string;
  equipoCargue: string;
  toneladas: number;
  pronosticoBTU: number;
  btuReal?: number;
  comentarios?: string;
}

export interface IInspeccionMantos {
  id: string;
  userId: string;
  turn: 'diurno' | 'nocturno';
  type: 'inspeccion_mantos_carbon';
  data: IInspeccionMantosData;
  createdDay: string;
  updatedAt: string;
}

interface IInspeccionPilasData {
  pila: string;
  comentarios?: string;
  hot_point: string;
  auto_combustion: string;
}

export interface IInspeccionPilas {
  id: string;
  userId: string;
  turn: 'diurno' | 'nocturno';
  type: 'inspeccion_pilas';
  data: IInspeccionPilasData;
  createdDay: string;
  updatedAt: string;
}

interface ISondeosData {
  nombrePila: string;
  coordenada: string;
  porcentajeCeniza: number;
  cps: string;
}

export interface ISondeos {
  id: string;
  userId: string;
  turn: 'diurno' | 'nocturno';
  type: 'sondeo_cargas';
  data: ISondeosData;
  createdDay: string;
  updatedAt: string;
}
