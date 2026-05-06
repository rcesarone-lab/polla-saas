import { useEffect, useState } from "react";
import { useConfiguracion } from "../hooks/useConfiguracion";
import type { ConfiguracionPuntos } from "../domain/types";
import { useJornada } from "../hooks/useJornada";
import { useRetirados } from "../hooks/useRetirados";
import { RetiradosPanel } from "../components/retirados/RetiradosPanel";
import { useCarreras } from "../hooks/useCarreras";
import { CarrerasPanel } from "../components/carreras/CarrerasPanel";
import { useJugadas } from "../hooks/useJugadas";
import { obtenerSiguienteDisponible } from "../domain/reasignarCaballo";
import { getRetiradosByJornada } from "../services/retirados.service";

export const Configuracion = () => {
  const { configuracion, updateConfiguracion, deleteConfiguracion } =
    useConfiguracion();

  const { jornada } = useJornada();

  const { carreras, agregarCarrera, eliminarCarrera } = useCarreras(
    jornada?.id
  );

  const { retirados, agregarRetirado, eliminarRetirado } = useRetirados(
    jornada?.id
  );

  const { jugadas, updateJugada } = useJugadas();

  const [primerLugar, setPrimerLugar] = useState("");
  const [segundoLugar, setSegundoLugar] = useState("");
  const [tercerLugar, setTercerLugar] = useState("");

  useEffect(() => {
    setPrimerLugar("");
    setSegundoLugar("");
    setTercerLugar("");
  }, [configuracion]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

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

    setPrimerLugar("");
    setSegundoLugar("");
    setTercerLugar("");

    alert("Configuración guardada");
  };

  const handleEliminarRegla = () => {
    const confirmar = confirm("¿Eliminar la regla de puntuación?");

    if (!confirmar) return;

    deleteConfiguracion();

    setPrimerLugar("");
    setSegundoLugar("");
    setTercerLugar("");
  };

  const handleAgregarRetirado = (carrera: number, caballo: number) => {
    if (!jornada) return;

    try {
      agregarRetirado(carrera, caballo);

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
                  value={primerLugar}
                  onChange={(e) => setPrimerLugar(e.target.value)}
                />
              </div>

              <div className="form-field">
                <label>2°</label>
                <input
                  type="number"
                  value={segundoLugar}
                  onChange={(e) => setSegundoLugar(e.target.value)}
                />
              </div>

              <div className="form-field">
                <label>3°</label>
                <input
                  type="number"
                  value={tercerLugar}
                  onChange={(e) => setTercerLugar(e.target.value)}
                />
              </div>
            </div>

            <div className="actions-row">
              <button type="submit">Guardar</button>

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
            onAdd={agregarCarrera}
            onDelete={eliminarCarrera}
          />
        </div>

        <div className="card">
          <RetiradosPanel
            retirados={retirados}
            carreras={carreras}
            onAdd={handleAgregarRetirado}
            onDelete={eliminarRetirado}
          />
        </div>
      </div>
    </div>
  );
};