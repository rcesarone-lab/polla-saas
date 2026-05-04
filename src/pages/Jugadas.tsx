import { useJugadas } from "../hooks/useJugadas";
import { useResultados } from "../hooks/useResultados";
import type { Jugada } from "../domain/types";
import { JugadaForm } from "../components/jugadas/JugadaForm";
import { JugadaList } from "../components/jugadas/JugadaList";
import { Ranking } from "../components/jugadas/Ranking";
import { useJornada } from "../hooks/useJornada";
import { JornadaSelector } from "../components/jornada/JornadaSelector";

export const Jugadas = () => {
  const { jugadas, addJugada, deleteJugada } = useJugadas();
  const { jornada, jornadas, changeJornada, addJornada } = useJornada();
  const { resultado } = useResultados(jornada?.id);

  if (!jornada) {
    return <p>Cargando jornada...</p>;
  }

  const handleAdd = (data: {
    nombre: string;
    carrera1: number;
    carrera2: number;
    carrera3: number;
  }) => {
    const existeNombre = jugadas.some(
      (j) =>
        j.jornadaId === jornada.id &&
        j.nombre.toLowerCase() === data.nombre.trim().toLowerCase()
    );

    if (existeNombre) {
      alert("Ya existe una jugada con ese nombre en esta jornada");
      return;
    }

    const jugada: Jugada = {
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

    addJugada(jugada);
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
        Jornada: {jornada.nombre} - {jornada.id}
      </p>

      <div className="card">
        <JugadaForm onSubmit={handleAdd} />
      </div>

      <div className="card">
        <JugadaList
          jugadas={jugadasDeLaJornada}
          resultado={resultado}
          onDelete={deleteJugada}
        />
      </div>

      <div className="card">
        <Ranking jugadas={jugadasDeLaJornada} resultado={resultado} />
      </div>
    </div>
  );
};