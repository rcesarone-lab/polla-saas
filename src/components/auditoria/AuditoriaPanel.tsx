import { getAuditoriaByJornada } from "../../services/auditoria.service";

type Props = {
  jornadaId: string;
  maxVisible?: number;
  compact?: boolean;
};

export const AuditoriaPanel = ({
  jornadaId,
  maxVisible = 3,
  compact = false,
}: Props) => {
  const eventos = getAuditoriaByJornada(jornadaId);

  return (
    <div className={compact ? "audit-card compact" : "audit-card"}>

      {eventos.length === 0 ? (
        <p>No hay eventos registrados.</p>
      ) : (
        <div
          className="audit-list scrollable"
          style={{
            maxHeight: `${maxVisible * 92}px`,
          }}
        >
          {eventos.map((evento) => (
            <div
              key={evento.id}
              className={`audit-item audit-${evento.severidad.toLowerCase()}`}
            >
              <strong>{evento.accion}</strong>
              <span>{new Date(evento.fecha).toLocaleString()}</span>
              <p>{evento.descripcion}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};