import { ResultadoForm } from "../components/resultados/ResultadoForm";
import { useResultados } from "../hooks/useResultados";

export const Resultados = () => {
  const { resultado, updateResultado } = useResultados();

  return (
    <div>
      <h1>Resultados</h1>
      <p>Carga manualmente el resultado final de cada carrera.</p>

      <ResultadoForm resultado={resultado} onSave={updateResultado} />
    </div>
  );
};