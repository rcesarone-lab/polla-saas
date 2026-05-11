import type { ReactNode } from "react";

type Props = {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
};

export const PageHeader = ({
  title,
  subtitle,
  actions,
}: Props) => {
  return (
    <div className="page-header">
      <div>
        <h1>{title}</h1>

        {subtitle && (
          <p className="page-header-subtitle">{subtitle}</p>
        )}
      </div>

      {actions && (
        <div className="page-header-actions-container">
          {actions}
        </div>
      )}
    </div>
  );
};