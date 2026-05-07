import { useEffect, useState } from "react";
import { useConfiguracion } from "../hooks/useConfiguracion";
import type { ConfiguracionPuntos } from "../domain/types";
import { useJornada } from "../hooks/useJornada";
import { useRetirados } from "../hooks/useRetirados";
import { RetiradosPanel } from "../components/retirados/RetiradosPanel";
import { useCarreras } from "../hooks/useCarreras";
import { CarrerasPanel } from "../components/carreras/CarrerasPanel";
import { useJugadas } from "../hooks/useJugadas";
import { useResultados } from "../hooks/useResultados";
import { obtenerSiguienteDisponible } from "../domain/reasignarCaballo";
import { getRetiradosByJornada } from "../services/retirados.service";
import { registrarAuditoria } from "../services/auditoria.service";
import { AuditoriaPanel } from "../components/auditoria/AuditoriaPanel";

export const Configuracion = () => {
  const { configuracion, updateConfiguracion, deleteConfiguracion } =
    useConfiguracion();

  const { jornada } = useJornada();

  const {
    carreras,
    agregarCarrera,
    eliminarCarrera,
    eliminarTodasCarreras,
  } = useCarreras(jornada?.id);

  const { retirados, agregarRetirado, eliminarRetirado } = useRetirados(
    jornada?.id
  );

  const { jugadas, updateJugada } = useJugadas();
  const [primerLugar, setPrimerLugar] = useState("");
  const [segundoLugar, setSegundoLugar] = useState("");
  const [tercerLugar, setTercerLugar] = useState("");

  const jornadaFinalizada = jornada?.estadoCierre === "FINALIZADA";

  useEffect(() => {
    setPrimerLugar("");
    setSegundoLugar("");
    setTercerLugar("");
  }, [configuracion]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (jornadaFinalizada) {
      alert("La jornada está finalizada. No se puede modificar la regla.");
      return;
    }

    const p1 = Number(primerLugar);
    const p2 = Number(segundoLugar);
    const p3 = Number(tercerLugar);

    if ([p1, p2, p3].some((p) => isNaN(p) || p < 0)) {
      alert("Los puntos deben ser números iguales o mayores a 0");
      return;
    }

    const nuevaConfig: ConfiguracionPuntos = {
      primerLugar: p1,
      segundoLugar: p2,
      tercerLugar: p3,
    };

    updateConfiguracion(nuevaConfig);

    registrarAuditoria({
      jornadaId: jornada?.id,
      accion: "GUARDAR_REGLA",
      descripcion: `Regla guardada: 1° ${p1} pts, 2° ${p2} pts, 3° ${p3} pts.`,
      severidad: "INFO",
    });

    setPrimerLugar("");
    setSegundoLugar("");
    setTercerLugar("");

    alert("Configuración guardada");
  };

  const handleEliminarRegla = () => {

    if (jornadaFinalizada) {
      alert("La jornada está finalizada. No se puede eliminar la regla.");
      return;
    }

    const confirmar = confirm("¿Eliminar la regla de puntuación?");

    if (!confirmar) return;

    deleteConfiguracion();

    registrarAuditoria({
      jornadaId: jornada?.id,
      accion: "ELIMINAR_REGLA",
      descripcion: "Se eliminó la regla de puntuación vigente.",
      severidad: "WARNING",
    });

    setPrimerLugar("");
    setSegundoLugar("");
    setTercerLugar("");
  };

  const handleAgregarRetirado = (carrera: number, caballo: number) => {
    if (!jornada) return;

    try {
      agregarRetirado(carrera, caballo);

      registrarAuditoria({
        jornadaId: jornada.id,
        accion: "AGREGAR_RETIRADO",
        descripcion: `Se agregó el caballo ${caballo} como retirado en la carrera ${carrera}.`,
        severidad: "WARNING",
      });

      const retiradosActualizados = getRetiradosByJornada(jornada.id);

      jugadas
        .filter((j) => j.jornadaId === jornada.id)
        .forEach((jugada) => {
          if (jugada.jugadas[carrera] !== caballo) return;

          const nuevoCaballo = obtenerSiguienteDisponible(
            caballo,
            carrera,
            carreras,
            retiradosActualizados
          );

          const mensajeCambio = `Carrera ${carrera}: ${caballo} → ${nuevoCaballo} por retirado`;

          registrarAuditoria({
            jornadaId: jornada.id,
            accion: "REASIGNAR_JUGADA",
            descripcion: `${jugada.nombre}: ${mensajeCambio}.`,
            severidad: "WARNING",
          });

          updateJugada({
            ...jugada,
            jugadas: {
              ...jugada.jugadas,
              [carrera]: nuevoCaballo,
            },
            cambiosAutomaticos: [
              ...(jugada.cambiosAutomaticos ?? []),
              mensajeCambio,
            ],
          });
        });
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("Error al agregar retirado");
      }
    }
  };

  const { resultado } = useResultados(jornada?.id);

  const tieneDatosAsociadosCarrera = (numeroCarrera: number) => {
    if (!jornada) return false;

    const tieneJugadas = jugadas.some(
      (j) =>
        j.jornadaId === jornada.id &&
        j.jugadas[numeroCarrera] !== undefined
    );

    const tieneResultado =
      resultado?.resultados[numeroCarrera] !== undefined;

    const tieneRetirados = retirados.some(
      (r) => r.carrera === numeroCarrera && r.caballos.length > 0
    );

    return tieneJugadas || tieneResultado || tieneRetirados;
  };

  const handleEliminarCarrera = (id: string) => {
    const carrera = carreras.find((c) => c.id === id);

    if (!carrera) {
      alert("Carrera no encontrada");
      return;
    }

    if (tieneDatosAsociadosCarrera(carrera.numeroCarrera)) {
      alert(
        `No se puede eliminar la carrera ${carrera.numeroCarrera} porque tiene datos asociados.`
      );
      return;
    }

    const confirmar = confirm(
      `¿Eliminar la carrera ${carrera.numeroCarrera}?`
    );

    if (confirmar) {
      eliminarCarrera(id);
    }
  };

  const handleEliminarTodasCarreras = () => {
    if (carreras.length === 0) return;

    const carrerasConDatos = carreras.filter((c) =>
      tieneDatosAsociadosCarrera(c.numeroCarrera)
    );

    if (carrerasConDatos.length > 0) {
      const numeros = carrerasConDatos
        .map((c) => c.numeroCarrera)
        .join(", ");

      alert(
        `No se pueden eliminar todas las carreras. Estas carreras tienen datos asociados: ${numeros}.`
      );

      return;
    }

    const confirmar = confirm(
      "¿Eliminar todas las carreras válidas de esta jornada?"
    );

    if (confirmar) {
      eliminarTodasCarreras();
    }
  };

  if (!jornada) {
    return (
      <div className="card">
        <h1>Configuración</h1>
        <p>No hay una jornada creada.</p>
        <p>Crea una jornada antes de configurar carreras válidas o retirados.</p>
      </div>
    );
  }

  return (
    <div className="grid">
      <h1>Configuración</h1>

      <div className="config-grid">
        <div className="card">
          <h2>Regla de puntuación</h2>

          {configuracion ? (
            <div className="score-summary-grid">
              <div className="score-badge">
                1° {configuracion.primerLugar} pts
              </div>
              <div className="score-badge">
                2° {configuracion.segundoLugar} pts
              </div>
              <div className="score-badge">
                3° {configuracion.tercerLugar} pts
              </div>
            </div>
          ) : (
            <p>No hay reglas cargadas.</p>
          )}

          <p className="score-edit-title">Editar regla</p>

          <form onSubmit={handleSubmit} className="compact-form">
            <div className="score-fields">
              <div className="form-field">
                <label>1°</label>
                <input
                  type="number"
                  disabled={jornadaFinalizada}
                  value={primerLugar}
                  onChange={(e) => setPrimerLugar(e.target.value)}
                />
              </div>

              <div className="form-field">
                <label>2°</label>
                <input
                  type="number"
                  disabled={jornadaFinalizada}
                  value={segundoLugar}
                  onChange={(e) => setSegundoLugar(e.target.value)}
                />
              </div>

              <div className="form-field">
                <label>3°</label>
                <input
                  type="number"
                  disabled={jornadaFinalizada}
                  value={tercerLugar}
                  onChange={(e) => setTercerLugar(e.target.value)}
                />
              </div>
            </div>

            <div className="actions-row">
              {!jornadaFinalizada && <button type="submit">Guardar</button>}

              {configuracion && (
                <button
                  type="button"
                  className="danger-button small"
                  onClick={handleEliminarRegla}
                >
                  Eliminar
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="card">
          <CarrerasPanel
            carreras={carreras}
            disabled={jornadaFinalizada}
            onAdd={
              jornadaFinalizada
                ? undefined
                : agregarCarrera
            }
            onDelete={
              jornadaFinalizada
                ? undefined
                : handleEliminarCarrera
            }
            onDeleteAll={
              jornadaFinalizada
                ? undefined
                : handleEliminarTodasCarreras
            }
          />
        </div>

        <div className="card">
          <RetiradosPanel
            retirados={retirados}
            carreras={carreras}
            disabled={jornadaFinalizada}
            onAdd={
              jornadaFinalizada
                ? undefined
                : handleAgregarRetirado
            }
            onDelete={
              jornadaFinalizada
                ? undefined
                : eliminarRetirado
            }
          />

          <AuditoriaPanel jornadaId={jornada.id} />

        </div>
      </div>
    </div>
  );
};