import { useEffect, useState } from "react";
import { PageHeader } from "../components/layout/PageHeader";
import { ResultadoForm } from "../components/resultados/ResultadoForm";
import { JornadaStatusCard } from "../components/jornada/JornadaStatusCard";
import { EmptyState } from "../components/ui/EmptyState";
import { useJornada } from "../hooks/useJornada";
import { useResultados } from "../hooks/useResultados";
import { useCarreras } from "../hooks/useCarreras";
import { useRetirados } from "../hooks/useRetirados";
import { useJugadas } from "../hooks/useJugadas";
import { calcularRanking } from "../domain/scoring";
import type { Resultado } from "../domain/types";
import { validarResultado } from "../domain/validarResultado";
import {
  calcularEstadoJornada,
  calcularProgresoJornada,
  getCarrerasPendientes,
} from "../domain/jornadaStatus";

export const Resultados = () => {
  const { jornada, closeJornada, reopenJornada } = useJornada();

  const { resultado, updateResultado, deleteResultado } = useResultados(
    jornada?.id
  );

  const { carreras } = useCarreras(jornada?.id);
  const { retirados } = useRetirados(jornada?.id);
  const { jugadas } = useJugadas();

  const [preguntoCierre, setPreguntoCierre] = useState(false);

  const jornadaFinalizada = jornada?.estadoCierre === "FINALIZADA";

  const jugadasDeLaJornada = jornada
    ? jugadas.filter((j) => j.jornadaId === jornada.id)
    : [];

  const rankingFinal = resultado
    ? calcularRanking(jugadasDeLaJornada, resultado)
    : [];

  const estadoDetectado = calcularEstadoJornada(carreras, resultado);

  const progresoJornada = calcularProgresoJornada(carreras, resultado);

  const carrerasPendientes = getCarrerasPendientes(carreras, resultado);

  const jornadaReabierta = (jornada?.reaperturas ?? 0) > 0;

  const puedeCerrar =
    jornada &&
    !jornadaFinalizada &&
    estadoDetectado === "FINALIZADA";

  const mostrarPreguntaCierre = puedeCerrar && !jornadaReabierta;

  useEffect(() => {
    if (!jornada) return;
    if (!mostrarPreguntaCierre) return;
    if (preguntoCierre) return;

    const confirmar = confirm(
      "Todos los resultados están cargados. ¿Deseas finalizar la jornada?"
    );

    setPreguntoCierre(true);

    if (confirmar) {
      closeJornada(jornada.id, {
        ganador: rankingFinal[0]?.nombre ?? "Sin ganador",
        puntosGanador: rankingFinal[0]?.puntos ?? 0,
        ranking: rankingFinal.map((r) => ({
          nombre: r.nombre,
          puntos: r.puntos,
        })),
      });
    }
  }, [
    puedeCerrar,
    preguntoCierre,
    jornada,
    closeJornada,
    mostrarPreguntaCierre,
    rankingFinal,
  ]);

  const handleSaveResultado = (nuevoResultado: Resultado) => {
    if (jornadaFinalizada) {
      alert("La jornada está finalizada. No se pueden modificar resultados.");

      return;
    }

    try {
      validarResultado(nuevoResultado, carreras, retirados);
      updateResultado(nuevoResultado);
      alert("Resultados guardados");
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("Error al validar resultados");
      }
    }
  };

  if (!jornada) {
    return (
      <div>
        <PageHeader
          title="Resultados"
          subtitle="Carga progresiva de posiciones por carrera y control de resultados parciales."
        />

        <EmptyState
          title="No hay jornada activa"
          description="Crea o selecciona una jornada antes de cargar resultados."
        />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Resultados"
        subtitle="Carga progresiva de posiciones por carrera y control de resultados parciales."
      />

      <JornadaStatusCard jornada={jornada} />

      <div className="kpi-grid">
        <div className="card compact-card">
          <span className="mini-label">Carreras completas</span>
          <strong className="mini-value">
            {progresoJornada.completadas}/{progresoJornada.total}
          </strong>
        </div>

        <div className="card compact-card">
          <span className="mini-label">Pendientes</span>
          <strong className="mini-value">
            {carrerasPendientes.length}
          </strong>
        </div>

        <div className="card compact-card">
          <span className="mini-label">Jugadas</span>
          <strong className="mini-value">
            {jugadasDeLaJornada.length}
          </strong>
        </div>
      </div>

      {puedeCerrar && (
        <div className="card ready-card">
          <div>
            <h2>Jornada lista para finalizar</h2>
            <p>Todos los resultados están completos.</p>
          </div>

          <button
            type="button"
            onClick={() => {
              closeJornada(jornada.id, {
                ganador: rankingFinal[0]?.nombre ?? "Sin ganador",
                puntosGanador: rankingFinal[0]?.puntos ?? 0,
                ranking: rankingFinal.map((r) => ({
                  nombre: r.nombre,
                  puntos: r.puntos,
                })),
              });
            }}
          >
            Finalizar jornada
          </button>
        </div>
      )}

      {jornadaFinalizada && (
        <div className="card locked-card">
          <div>
            <h2>Jornada finalizada</h2>
            <p>Los resultados están bloqueados para preservar el snapshot.</p>
          </div>

          <button
            type="button"
            className="secondary-button"
            onClick={() => {
              const confirmar = confirm(
                "¿Deseas reabrir esta jornada para modificar resultados?"
              );

              if (confirmar) {
                reopenJornada(jornada.id);
              }
            }}
          >
            Reabrir jornada
          </button>
        </div>
      )}

      <div className="card">
        <div className="section-header-inline">
          <div>
            <h2>Carga de resultados</h2>

            <p className="section-description">
              Puedes guardar resultados parciales y completarlos carrera por
              carrera.
            </p>
          </div>
        </div>

        {jornadaFinalizada ? (
          <EmptyState
            title="Resultados bloqueados"
            description="La jornada está finalizada. No se muestran campos de carga para evitar edición accidental."
          />
        ) : (
          <ResultadoForm
            resultado={resultado}
            jornadaId={jornada.id}
            carreras={carreras}
            disabled={jornadaFinalizada}
            onSave={handleSaveResultado}
          />
        )}

        {resultado && !jornadaFinalizada && (
          <button
            type="button"
            className="danger-button"
            onClick={() => {
              const confirmar = confirm(
                "¿Seguro que quieres eliminar los resultados de esta jornada?"
              );

              if (confirmar) {
                deleteResultado();
              }
            }}
          >
            Resetear resultados
          </button>
        )}
      </div>

      <div className="card">
        <h2>Resultados x Carrera</h2>

        {!resultado ? (
          <EmptyState
            title="No hay resultados cargados"
            description="Carga resultados para ver el detalle por carrera."
          />
        ) : (
          <div className="table-fit">
            <table className="table">
              <thead>
                <tr>
                  <th>Carrera</th>
                  <th>1er lugar</th>
                  <th>2do lugar</th>
                  <th>3er lugar</th>
                </tr>
              </thead>

              <tbody>
                {carreras.map((carrera) => {
                  const numero = carrera.numeroCarrera;
                  const resultadoCarrera = resultado.resultados[numero];

                  return (
                    <tr key={carrera.id}>
                      <td>Carrera {numero}</td>
                      <td>{resultadoCarrera?.primero ?? "-"}</td>
                      <td>{resultadoCarrera?.segundo ?? "-"}</td>
                      <td>{resultadoCarrera?.tercero ?? "-"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};