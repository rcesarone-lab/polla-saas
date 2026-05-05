import { ResultadoForm } from "../components/resultados/ResultadoForm";
import { useJornada } from "../hooks/useJornada";
import { useResultados } from "../hooks/useResultados";

export const Resultados = () => {
  const { jornada } = useJornada();
  const { resultado, updateResultado, deleteResultado } = useResultados(
    jornada?.id
  );

  if (!jornada) {
    return <p>Cargando jornada...</p>;
  }

  return (
    <div>
      <h1>Resultados</h1>

      <p>
        Jornada: {jornada.nombre} - {jornada.fecha}
      </p>

      <p>Carga manualmente el resultado final de cada carrera.</p>

      <ResultadoForm
        resultado={resultado}
        jornadaId={jornada.id}
        onSave={updateResultado}
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
  );
};