import { getAuditoriaByJornada } from "../../services/auditoria.service";

type Props = {
  jornadaId: string;
};

export const AuditoriaPanel = ({ jornadaId }: Props) => {
  const eventos = getAuditoriaByJornada(jornadaId).slice(0, 8);

  return (
    <div className="card">
      <h2>Auditoría operacional</h2>

      {eventos.length === 0 ? (
        <p>No hay eventos registrados.</p>
      ) : (
        <div className="audit-list">
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