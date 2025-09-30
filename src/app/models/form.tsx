// Tipos para el formulario
export type Turn = "diurno" | "nocturno";
export type ActivityType =
  | "desvio_de_cargas"
  | "inspeccion_mantos_carbon"
  | "inspeccion_pilas"
  | "sondeo_cargas";
export type Zona = "Zona Norte" | "Zona Sur";
export type ZonaMantos = "Zona Norte" | "Zona Centro";
export type TajoNorte = "Annex" | "La Puente" | "Tabaco";
export type TajoSur = "EWP" | "Patilla" | "Tajo 100" | "Oreganal";
export type Destino =
  | "PILAS 20"
  | "PILAS 9S"
  | "PILAS 9N"
  | "PILAS 8S"
  | "PILAS 8N"
  | "PILAS 14"
  | "PILAS 12"
  | "PILAS 15B"
  | "PILAS 16"
  | "PILAS 21"
  | "PILAS 22"
  | "PILAS 01"
  | "PILAS 06"
  | "PILAS 25"
  | "PILAS 26"
  | "PILAS 27"
  | "PILAS 40"
  | "PILAS 279"
  | "PILAS 280"
  | "PILAS 290"
  | "PILAS 255"
  | "PILAS 250"
  | "PILAS 243"
  | "PILAS 302"
  | "PILAS 303"
  | "Silos"
  | "Planta de Lavado";
export type SondeoType = "sondeo_de_cargas" | "sondeo_de_pilas";

export interface DesvioData {
  zonaOrigen: Zona;
  tajo: TajoNorte | TajoSur;
  coordenada: string;
  destinoInicial: Destino;
  destinoFinal: Destino;
}

export interface InspeccionMantosData {
  zona: ZonaMantos;
  tajo: TajoNorte | string; // string para Zona Centro
  coordenada: string;
  pronosticoBTU: number;
}

export interface InspeccionPilasData {
  pila: string;
  comentario: string;
}

export interface SondeoData {
  tipo: SondeoType;
  nombrePila: string;
  porcentajeCeniza: number;
  cps: number;
  coordenada?: string; // Solo para sondeo_de_cargas
}

export type FormDataRegister =
  | DesvioData
  | InspeccionMantosData
  | InspeccionPilasData
  | SondeoData;
