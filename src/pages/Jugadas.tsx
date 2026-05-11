import { useState } from "react";
import { PageHeader } from "../components/layout/PageHeader";
import { JornadaSelector } from "../components/jornada/JornadaSelector";
import { JornadaStatusCard } from "../components/jornada/JornadaStatusCard";
import { EmptyState } from "../components/ui/EmptyState";
import { JugadaForm } from "../components/jugadas/JugadaForm";
import { JugadaList } from "../components/jugadas/JugadaList";
import { Ranking } from "../components/jugadas/Ranking";

import { useJugadas } from "../hooks/useJugadas";
import { useResultados } from "../hooks/useResultados";
import { useJornada } from "../hooks/useJornada";
import { useCarreras } from "../hooks/useCarreras";
import { useRetirados } from "../hooks/useRetirados";

import type { Jugada } from "../domain/types";

import {
  validarCaballoJugada,
  JugadaValidationError,
} from "../domain/normalizarJugada";

export const Jugadas = () => {
  const { jugadas, addJugada, updateJugada, deleteJugada } =
    useJugadas();

  const { jornada, jornadas, changeJornada, addJornada } =
    useJornada();

  const { resultado } = useResultados(jornada?.id);

  const { carreras } = useCarreras(jornada?.id);

  const { retirados } = useRetirados(jornada?.id);

  const [jugadaEditando, setJugadaEditando] =
    useState<Jugada | null>(null);

  const jornadaFinalizada =
    jornada?.estadoCierre === "FINALIZADA";

  const handleSubmitJugada = (data: {
    nombre: string;
    jugadas: Record<number, number>;
  }): { success: boolean; errorCarrera?: number } => {
    if (!jornada) {
      alert("Primero debes crear o seleccionar una jornada");

      return { success: false };
    }

    if (jornadaFinalizada) {
      alert(
        "La jornada está finalizada. No se pueden modificar jugadas."
      );

      return { success: false };
    }

    const existeNombre = jugadas.some(
      (j) =>
        j.jornadaId === jornada.id &&
        j.id !== jugadaEditando?.id &&
        j.nombre.toLowerCase() ===
          data.nombre.trim().toLowerCase()
    );

    if (existeNombre) {
      alert(
        "Ya existe una jugada con ese nombre en esta jornada"
      );

      return { success: false };
    }

    try {
      const jugadasValidadas: Record<number, number> = {};

      for (const carrera of carreras) {
        const caballo = data.jugadas[carrera.numeroCarrera];

        jugadasValidadas[carrera.numeroCarrera] =
          validarCaballoJugada(
            caballo,
            carrera.numeroCarrera,
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
    <div>
      <PageHeader
        title="Gestión de jugadas"
        subtitle="Carga, edición y seguimiento de jugadas por jornada."
      />

      <JornadaSelector
        jornadas={jornadas}
        jornadaActual={jornada}
        onChange={changeJornada}
        onCreate={addJornada}
      />

      {jornada && (
        <JornadaStatusCard jornada={jornada} />
      )}

      {!jornada ? (
        <EmptyState
          title="Sin jornada activa"
          description="Crea o selecciona una jornada para comenzar a registrar jugadas."
        />
      ) : (
        <>
          <div className="kpi-grid">
            <div className="card compact-card">
              <span className="mini-label">
                Participantes
              </span>

              <strong className="mini-value">
                {jugadasDeLaJornada.length}
              </strong>
            </div>

            <div className="card compact-card">
              <span className="mini-label">
                Carreras
              </span>

              <strong className="mini-value">
                {carreras.length}
              </strong>
            </div>

            <div className="card compact-card">
              <span className="mini-label">
                Estado
              </span>

              <strong
                className={
                  jornadaFinalizada
                    ? "status-ok"
                    : "status-warn"
                }
              >
                {jornadaFinalizada
                  ? "Finalizada"
                  : "Abierta"}
              </strong>
            </div>
          </div>

          <div className="operacion-grid">
            <div className="card">
              <h2>
                {jugadaEditando
                  ? "Editar jugada"
                  : "Nueva jugada"}
              </h2>

              {carreras.length === 0 ? (
                <EmptyState
                  title="Sin carreras válidas"
                  description="Configura las carreras antes de registrar jugadas."
                />
              ) : jornadaFinalizada ? (
                <EmptyState
                  title="Jornada finalizada"
                  description="La jornada está cerrada y no admite modificaciones."
                />
              ) : (
                <JugadaForm
                  jugadaEditando={jugadaEditando}
                  carreras={carreras}
                  onSubmit={handleSubmitJugada}
                  onCancelEdit={() =>
                    setJugadaEditando(null)
                  }
                />
              )}
            </div>

            <div className="card">
              <Ranking
                jugadas={jugadasDeLaJornada}
                resultado={resultado}
              />
            </div>
          </div>

          <div className="card">
            <div className="section-header-inline">
              <div>
                <h2>Jugadas registradas</h2>

                <p className="section-description">
                  Participantes cargados para la jornada actual.
                </p>
              </div>
            </div>

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
        </>
      )}
    </div>
  );
};