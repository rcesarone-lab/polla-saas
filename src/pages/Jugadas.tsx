import { useJugadas } from "../hooks/useJugadas";
import { useResultados } from "../hooks/useResultados";
import type { Jugada } from "../domain/types";
import { JugadaForm } from "../components/jugadas/JugadaForm";
import { JugadaList } from "../components/jugadas/JugadaList";
import { Ranking } from "../components/jugadas/Ranking";

export const Jugadas = () => {
  const { jugadas, addJugada } = useJugadas();
  const { resultado } = useResultados();

  const handleAdd = (data: {
    nombre: string;
    carrera1: number;
    carrera2: number;
    carrera3: number;
  }) => {

    const existeNombre = jugadas.some(
      (j) => j.nombre.toLowerCase() === data.nombre.trim().toLowerCase()
    );

    if (existeNombre) {
      alert("Ya existe una jugada con ese nombre");
      return;
    }

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
    <div className="grid">
      <h1>Jugadas</h1>

      <div className="card">
        <JugadaForm onSubmit={handleAdd} />
      </div>

      <div className="card">
        <JugadaList jugadas={jugadas} resultado={resultado} />
      </div>

      <div className="card">
        <Ranking jugadas={jugadas} resultado={resultado} />
      </div>
    </div>
  );
};