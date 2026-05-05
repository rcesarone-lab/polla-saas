import type { ReactNode } from "react";
import { Link } from "react-router-dom";

type Props = {
  children: ReactNode;
};

const SIDEBAR_WIDTH = 160;

export const Layout = ({ children }: Props) => {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <aside
        style={{
          width: "160px",
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
        </nav>
      </aside>

      <main
        style={{
          marginLeft: "160px",
          padding: "2rem 3rem", // más aire horizontal
          minHeight: "100vh",
          background: "#f3f4f6",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
          }}
        >
          {children}
        </div>
      </main>
    </div>
  );
};