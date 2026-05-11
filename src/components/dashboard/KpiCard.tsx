type Props = {
  label: string;
  value: string | number;
  tone?: "default" | "success" | "warning" | "danger";
};

export const KpiCard = ({
  label,
  value,
  tone = "default",
}: Props) => {
  return (
    <div className={`kpi-card ${tone}`}>
      <span>{label}</span>

      <strong>{value}</strong>
    </div>
  );
};