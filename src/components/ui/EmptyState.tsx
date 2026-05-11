type Props = {
  title: string;
  description: string;
};

export const EmptyState = ({
  title,
  description,
}: Props) => {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">∅</div>

      <strong>{title}</strong>

      <p>{description}</p>
    </div>
  );
};