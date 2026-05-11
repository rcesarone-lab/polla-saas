import type { Jornada } from "../../domain/types";

type Props = {
  jornada: Jornada | null;
};

export const JornadaStatusCard = ({ jornada }: Props) => {
  if (!jornada) {
    return (
      <div className="jornada-status-card empty">
        <strong>Sin jornada activa</strong>
        <span>Crea o selecciona una jornada para operar.</span>
      </div>
    );
  }

  const estado = jornada.estadoCierre ?? "ABIERTA";

  return (
    <div className="jornada-status-card">
      <div>
        <span>Jornada activa</span>
        <strong>{jornada.fecha}</strong>
      </div>

      <div>
        <span>Estado</span>
        <strong className={`jornada-status-badge ${estado.toLowerCase()}`}>
          {estado}
        </strong>
      </div>

      <div>
        <span>Reaperturas</span>
        <strong>{jornada.reaperturas ?? 0}</strong>
      </div>
    </div>
  );
};