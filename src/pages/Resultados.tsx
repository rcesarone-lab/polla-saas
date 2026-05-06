import { ResultadoForm } from "../components/resultados/ResultadoForm";
import { useJornada } from "../hooks/useJornada";
import { useResultados } from "../hooks/useResultados";
import { useCarreras } from "../hooks/useCarreras";
import { useRetirados } from "../hooks/useRetirados";
import type { Resultado } from "../domain/types";
import { validarResultado } from "../domain/validarResultado";

export const Resultados = () => {
  const { jornada } = useJornada();

  const { resultado, updateResultado, deleteResultado } = useResultados(
    jornada?.id
  );

  const { carreras } = useCarreras(jornada?.id);
  const { retirados } = useRetirados(jornada?.id);

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
      </div>

      <div className="card">
        <p>
          Puedes cargar resultados parcialmente. Luego puedes volver y
          actualizarlos carrera por carrera.
        </p>

        <ResultadoForm
          resultado={resultado}
          jornadaId={jornada.id}
          carreras={carreras}
          onSave={handleSaveResultado}
        />

        {resultado && (
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
                const numeroCarrera = carrera.numeroCarrera;
                const resultadoCarrera = resultado.resultados[numeroCarrera];

                return (
                  <tr key={carrera.id}>
                    <td>Carrera {numeroCarrera}</td>
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