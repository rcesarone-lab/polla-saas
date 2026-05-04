export type Jugada = {
  id: string;
  nombre: string;
  jugadas: {
    carrera1: number;
    carrera2: number;
    carrera3: number;
  };
  fecha: string;
};

export type Resultado = {
  carrera1: {
    primero: number;
    segundo: number;
    tercero: number;
  };
  carrera2: {
    primero: number;
    segundo: number;
    tercero: number;
  };
  carrera3: {
    primero: number;
    segundo: number;
    tercero: number;
  };
};