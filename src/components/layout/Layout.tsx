import type { ReactNode } from "react";
import { Link } from "react-router-dom";

type Props = {
  children: ReactNode;
};

export const Layout = ({ children }: Props) => {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <aside
        style={{
          width: "220px",
          background: "#1e293b",
          color: "white",
          padding: "1rem",
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
        </nav>
      </aside>

      <main style={{ flex: 1, padding: "2rem" }}>{children}</main>
    </div>
  );
};