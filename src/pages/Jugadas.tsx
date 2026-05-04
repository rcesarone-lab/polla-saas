import { useJugadas } from "../hooks/useJugadas";
import { useResultados } from "../hooks/useResultados";
import type { Jugada } from "../domain/types";
import { JugadaForm } from "../components/jugadas/JugadaForm";
import { JugadaList } from "../components/jugadas/JugadaList";

export const Jugadas = () => {
  const { jugadas, addJugada } = useJugadas();
  const { resultado } = useResultados();

  const handleAdd = (data: {
    nombre: string;
    carrera1: number;
    carrera2: number;
    carrera3: number;
  }) => {
    const jugada: Jugada = {
      id: Date.now().toString(),
      nombre: data.nombre,
      jugadas: {
        carrera1: data.carrera1,
        carrera2: data.carrera2,
        carrera3: data.carrera3,
      },
      fecha: new Date().toISOString(),
    };

    addJugada(jugada);
  };

  return (
    <div>
      <h1>Jugadas</h1>

      <JugadaForm onSubmit={handleAdd} />

      <JugadaList jugadas={jugadas} resultado={resultado} />
    </div>
  );
};