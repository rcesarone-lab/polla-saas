import { useJugadas } from "../hooks/useJugadas";
import { useResultados } from "../hooks/useResultados";
import type { Jugada } from "../domain/types";
import { JugadaForm } from "../components/jugadas/JugadaForm";
import { JugadaList } from "../components/jugadas/JugadaList";
import { Ranking } from "../components/jugadas/Ranking";
import { useJornada } from "../hooks/useJornada";
import { JornadaSelector } from "../components/jornada/JornadaSelector";
import { useState } from "react";

export const Jugadas = () => {
  const { jugadas, addJugada, updateJugada, deleteJugada } = useJugadas();
  const { jornada, jornadas, changeJornada, addJornada } = useJornada();
  const { resultado } = useResultados(jornada?.id);
  const [jugadaEditando, setJugadaEditando] = useState<Jugada | null>(null);

  if (!jornada) {
    return <p>Cargando jornada...</p>;
  }

  const handleSubmitJugada = (data: {
    nombre: string;
    carrera1: number;
    carrera2: number;
    carrera3: number;
  }) => {
    const existeNombre = jugadas.some(
      (j) =>
        j.jornadaId === jornada.id &&
        j.id !== jugadaEditando?.id &&
        j.nombre.toLowerCase() === data.nombre.trim().toLowerCase()
    );

    if (existeNombre) {
      alert("Ya existe una jugada con ese nombre en esta jornada");
      return;
    }

    if (jugadaEditando) {
      const jugadaActualizada: Jugada = {
        ...jugadaEditando,
        nombre: data.nombre.trim(),
        jugadas: {
          carrera1: data.carrera1,
          carrera2: data.carrera2,
          carrera3: data.carrera3,
        },
      };

      updateJugada(jugadaActualizada);
      setJugadaEditando(null);
      return;
    }

    const nuevaJugada: Jugada = {
      id: Date.now().toString(),
      jornadaId: jornada.id,
      nombre: data.nombre.trim(),
      jugadas: {
        carrera1: data.carrera1,
        carrera2: data.carrera2,
        carrera3: data.carrera3,
      },
      fecha: new Date().toISOString(),
    };

    addJugada(nuevaJugada);
  };

  const jugadasDeLaJornada = jugadas.filter(
    (j) => j.jornadaId === jornada.id
  );

  return (
    <div className="grid">

      <JornadaSelector
        jornadas={jornadas}
        jornadaActual={jornada}
        onChange={changeJornada}
        onCreate={addJornada}
      />

      <h1>Jugadas</h1>

      <p>
        Jornada: {jornada.nombre} - {jornada.fecha}
      </p>

      <div className="card">
        <JugadaForm
          jugadaEditando={jugadaEditando}
          onSubmit={handleSubmitJugada}
          onCancelEdit={() => setJugadaEditando(null)}
        />
      </div>

      <div className="card">
        <JugadaList
          jugadas={jugadasDeLaJornada}
          resultado={resultado}
          onEdit={setJugadaEditando}
          onDelete={deleteJugada}
        />
      </div>

      <div className="card">
        <Ranking jugadas={jugadasDeLaJornada} resultado={resultado} />
      </div>
    </div>
  );
};