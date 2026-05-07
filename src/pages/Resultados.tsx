import { useEffect, useState } from "react";
import { ResultadoForm } from "../components/resultados/ResultadoForm";
import { useJornada } from "../hooks/useJornada";
import { useResultados } from "../hooks/useResultados";
import { useCarreras } from "../hooks/useCarreras";
import { useRetirados } from "../hooks/useRetirados";
import type { Resultado } from "../domain/types";
import { validarResultado } from "../domain/validarResultado";
import { calcularEstadoJornada } from "../domain/jornadaStatus";

export const Resultados = () => {
  const { jornada, closeJornada, reopenJornada } = useJornada();
  import { calcularRanking } from "../domain/scoring";
  import { useJugadas } from "../hooks/useJugadas";

  const { resultado, updateResultado, deleteResultado } = useResultados(
    jornada?.id
  );

  const { carreras } = useCarreras(jornada?.id);
  const { retirados } = useRetirados(jornada?.id);
  const { jugadas } = useJugadas();

  const jugadasDeLaJornada = jornada
    ? jugadas.filter((j) => j.jornadaId === jornada.id)
    : [];

  const rankingFinal = resultado
    ? calcularRanking(jugadasDeLaJornada, resultado)
    : [];

  const [preguntoCierre, setPreguntoCierre] = useState(false);

  const jornadaFinalizada = jornada?.estadoCierre === "FINALIZADA";

  const estadoDetectado = calcularEstadoJornada(carreras, resultado);

  const jornadaReabierta = (jornada?.reaperturas ?? 0) > 0;

  const puedeCerrar =
    jornada &&
    !jornadaFinalizada &&
    estadoDetectado === "FINALIZADA";

  const mostrarPreguntaCierre =
    puedeCerrar && !jornadaReabierta;


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
  }, [puedeCerrar, preguntoCierre, jornada, closeJornada]);

  if (!jornada) {
    return (
      <div className="card">
        <h1>Resultados</h1>
        <p>No hay una jornada creada.</p>
        <p>Crea una jornada antes de cargar resultados.</p>
      </div>
    );
  }

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

  return (
    <div className="grid">
      <h1>Resultados</h1>

      <div className="card">
        <h2>Jornada</h2>
        <p>
          {jornada.nombre} - {jornada.fecha}
        </p>

        {jornadaFinalizada && (
          <p className="status-ok">Jornada finalizada</p>
        )}

        {jornadaFinalizada && (
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
        )}
      </div>

      {puedeCerrar && (
        <div
          className="card"
          style={{ background: "#ecfdf5", color: "#065f46" }}
        >
          <h2>Jornada lista para finalizar</h2>
          <p>Todos los resultados están completos.</p>

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

      <div className="card">
        <p>
          Puedes cargar resultados parcialmente. Luego puedes volver y
          actualizarlos carrera por carrera.
        </p>

        {jornadaFinalizada && (
          <p className="status-ok">
            Esta jornada está finalizada. La carga de resultados está bloqueada.
          </p>
        )}

        <ResultadoForm
          resultado={resultado}
          jornadaId={jornada.id}
          carreras={carreras}
          disabled={jornadaFinalizada}
          onSave={handleSaveResultado}
        />

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
        <h2>Resultado cargado</h2>

        {!resultado ? (
          <p>No hay resultados cargados para esta jornada.</p>
        ) : (
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
        )}
      </div>
    </div>
  );
};