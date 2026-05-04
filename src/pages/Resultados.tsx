import { ResultadoForm } from "../components/resultados/ResultadoForm";
import { useJornada } from "../hooks/useJornada";
import { useResultados } from "../hooks/useResultados";

export const Resultados = () => {
  const { jornada } = useJornada();
  const { resultado, updateResultado } = useResultados(jornada?.id);

  if (!jornada) {
    return <p>Cargando jornada...</p>;
  }

  return (
    <div>
      <h1>Resultados</h1>

      <p>
        Jornada: {jornada.nombre} - {jornada.id}
      </p>

      <p>Carga manualmente el resultado final de cada carrera.</p>

      <ResultadoForm
        resultado={resultado}
        jornadaId={jornada.id}
        onSave={updateResultado}
      />
    </div>
  );
};