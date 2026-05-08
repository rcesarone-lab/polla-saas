import type { ReactNode } from "react";
import { Link } from "react-router-dom";

type Props = {
  children: ReactNode;
};

const SIDEBAR_WIDTH = 135;

export const Layout = ({ children }: Props) => {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <aside
        style={{
          width: `${SIDEBAR_WIDTH}px`,
          boxSizing: "border-box",
          background: "#1e293b",
          color: "white",
          padding: "1rem",
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
        }}
      >
        <h2>Polla SaaS</h2>

        <nav style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <Link style={{ color: "white", textDecoration: "none" }} to="/">
            Panel
          </Link>
          <Link style={{ color: "white", textDecoration: "none" }} to="/jugadas">
            Jugadas
          </Link>
          <Link style={{ color: "white", textDecoration: "none" }} to="/resultados">
            Resultados
          </Link>
          <Link style={{ color: "white", textDecoration: "none" }} to="/historico">
            Histórico
          </Link>
          <Link style={{ color: "white", textDecoration: "none" }} to="/configuracion">
            Configuración
          </Link>
          <Link style={{ color: "white", textDecoration: "none" }} to="/admin">
            Administración
          </Link>
        </nav>
      </aside>

      <main
        style={{
          marginLeft: `${SIDEBAR_WIDTH}px`,
          padding: "1rem",
          minHeight: "100vh",
          background: "#f3f4f6",
          width: `calc(100% - ${SIDEBAR_WIDTH}px)`,
          boxSizing: "border-box",
        }}
      >
        {children}
      </main>
    </div>
  );
};