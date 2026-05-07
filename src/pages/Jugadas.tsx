import { useState } from "react";
import { useJugadas } from "../hooks/useJugadas";
import { useResultados } from "../hooks/useResultados";
import { useJornada } from "../hooks/useJornada";
import { useCarreras } from "../hooks/useCarreras";
import { useRetirados } from "../hooks/useRetirados";
import type { Jugada } from "../domain/types";
import { validarCaballoJugada, JugadaValidationError, } from "../domain/normalizarJugada";
import { JugadaForm } from "../components/jugadas/JugadaForm";
import { JugadaList } from "../components/jugadas/JugadaList";
import { Ranking } from "../components/jugadas/Ranking";
import { JornadaSelector } from "../components/jornada/JornadaSelector";

export const Jugadas = () => {
  const { jugadas, addJugada, updateJugada, deleteJugada } = useJugadas();
  const { jornada, jornadas, changeJornada, addJornada } = useJornada();
  const { resultado } = useResultados(jornada?.id);
  const { carreras } = useCarreras(jornada?.id);
  const { retirados } = useRetirados(jornada?.id);

  const [jugadaEditando, setJugadaEditando] = useState<Jugada | null>(null);
  const jornadaFinalizada = jornada?.estadoCierre === "FINALIZADA";

  const handleSubmitJugada = (data: {
    nombre: string;
    jugadas: Record<number, number>;
  }): { success: boolean; errorCarrera?: number } => {
    if (!jornada) {
      alert("Primero debes crear o seleccionar una jornada");
      return { success: false };
    }

    if (jornadaFinalizada) {
      alert("La jornada está finalizada. No se pueden modificar jugadas.");
      return { success: false };
    }

    const existeNombre = jugadas.some(
      (j) =>
        j.jornadaId === jornada.id &&
        j.id !== jugadaEditando?.id &&
        j.nombre.toLowerCase() === data.nombre.trim().toLowerCase()
    );

    if (existeNombre) {
      alert("Ya existe una jugada con ese nombre en esta jornada");
      return { success: false };
    }

    try {
      const jugadasValidadas: Record<number, number> = {};

      for (const carrera of carreras) {
        const caballo = data.jugadas[carrera.numeroCarrera];

        jugadasValidadas[carrera.numeroCarrera] =
          validarCaballoJugada(
            caballo,
            carrera.numeroCarrera as 1 | 2 | 3,
            carreras,
            retirados
          );
      }

      if (jugadaEditando) {
        updateJugada({
          ...jugadaEditando,
          nombre: data.nombre.trim(),
          jugadas: jugadasValidadas,
        });

        setJugadaEditando(null);

        return { success: true };
      }

      addJugada({
        id: Date.now().toString(),
        jornadaId: jornada.id,
        nombre: data.nombre.trim(),
        jugadas: jugadasValidadas,
        fecha: new Date().toISOString(),
      });

      return { success: true };
    } catch (error) {
      if (error instanceof JugadaValidationError) {
        alert(error.message);

        return {
          success: false,
          errorCarrera: error.carrera,
        };
      }

      alert("Error al validar jugada");

      return { success: false };
    }
  };

  const jugadasDeLaJornada = jornada
    ? jugadas.filter((j) => j.jornadaId === jornada.id)
    : [];

  return (
    <div className="grid">
      <JornadaSelector
        jornadas={jornadas}
        jornadaActual={jornada}
        onChange={changeJornada}
        onCreate={addJornada}
      />

      <h1>Jugadas</h1>

      {!jornada ? (
        <div
          className="card"
          style={{ background: "#fff7ed", color: "#9a3412" }}
        >
          <strong>No hay jornada seleccionada.</strong>

          <p>
            Debes crear o seleccionar una jornada antes de guardar jugadas.
          </p>
        </div>
      ) : (
        <p>
          Jornada: {jornada.nombre} - {jornada.fecha}
        </p>
      )}

      <div className="card">
        {!jornada ? (
          <p>Primero debes crear o seleccionar una jornada.</p>
        ) : carreras.length === 0 ? (
          <div>
            <h2>No hay carreras válidas configuradas</h2>

            <p>
              Antes de cargar jugadas, debes ir a Configuración y cargar las
              carreras válidas de esta jornada.
            </p>
          </div>
        ) : jornadaFinalizada ? (
          <p className="status-ok">
            Jornada finalizada: la carga y edición de jugadas está bloqueada.
          </p>
        ) : (
          <JugadaForm
            jugadaEditando={jugadaEditando}
            carreras={carreras}
            onSubmit={handleSubmitJugada}
            onCancelEdit={() => setJugadaEditando(null)}
          />
        )}
      </div>

      <div className="card">
        <JugadaList
          jugadas={jugadasDeLaJornada}
          carreras={carreras}
          resultado={resultado}
          onEdit={
            jornadaFinalizada
              ? undefined
              : (jugada) => {
                setJugadaEditando(jugada);
              }
          }
          onDelete={
            jornadaFinalizada
              ? undefined
              : (id) => {
                deleteJugada(id);
              }
          }
        />
      </div>

      <div className="card">
        <Ranking
          jugadas={jugadasDeLaJornada}
          resultado={resultado}
        />
      </div>
    </div>
  );
};