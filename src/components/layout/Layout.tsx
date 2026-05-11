import { useState } from "react";
import type { ReactNode } from "react";
import { NavLink, useLocation } from "react-router-dom";

type Props = {
  children: ReactNode;
};

type NavGroup = {
  label: string;
  to: string;
  children?: {
    label: string;
    to: string;
  }[];
};

const navGroups: NavGroup[] = [
  {
    label: "Panel ejecutivo",
    to: "/",
  },
  {
    label: "Operación",
    to: "/operacion",
    children: [
      { label: "Jugadas", to: "/jugadas" },
      { label: "Resultados", to: "/resultados" },
    ],
  },
  {
    label: "Administración",
    to: "/admin",
    children: [
      { label: "Configuración", to: "/configuracion" },
      { label: "Histórico", to: "/historico" },
    ],
  },
];

export const Layout = ({ children }: Props) => {
  const location = useLocation();

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem("sidebar_open_groups");

    if (!saved) {
      return {
        Operación: true,
        Administración: false,
      };
    }

    try {
      return JSON.parse(saved);
    } catch {
      return {
        Operación: true,
        Administración: false,
      };
    }
  });

  const toggleGroup = (label: string) => {
    setOpenGroups((prev) => {
      const willOpen = !prev[label];

      const next = {
        Operación: false,
        Administración: false,
        [label]: willOpen,
      };

      localStorage.setItem("sidebar_open_groups", JSON.stringify(next));

      return next;
    });
  };

  const isOperacionRoute =
    location.pathname === "/operacion" ||
    location.pathname === "/jugadas" ||
    location.pathname === "/resultados";

  const isAdministracionRoute =
    location.pathname === "/admin" ||
    location.pathname === "/configuracion" ||
    location.pathname === "/historico";

  return (
    <div className="app-shell">
      <aside className="app-sidebar">
        <div className="app-brand">
          <div className="app-brand-logo">PL</div>

          <div>
            <strong>Polla SaaS</strong>
            <span>Los Martínez</span>
          </div>
        </div>

        <nav className="app-nav">
          {navGroups.map((item) => {
            const hasChildren = Boolean(item.children?.length);

            const isOpen =
              item.label === "Operación"
                ? isOperacionRoute || openGroups[item.label]
                : item.label === "Administración"
                  ? isAdministracionRoute || openGroups[item.label]
                  : openGroups[item.label];

            const isActiveGroup =
              item.label === "Operación"
                ? isOperacionRoute
                : item.label === "Administración"
                  ? isAdministracionRoute
                  : false;

            return (
              <div
                key={item.to}
                className={
                  isActiveGroup
                    ? "app-nav-group active-group"
                    : "app-nav-group"
                }
              >
                <div className="app-nav-parent-row">
                  <NavLink
                    to={item.to}
                    end={item.to === "/"}
                    className={({ isActive }) => {
                      const isGroupActive =
                        item.label === "Operación"
                          ? isOperacionRoute
                          : item.label === "Administración"
                            ? isAdministracionRoute
                            : isActive;

                      return isGroupActive
                        ? "app-nav-link active"
                        : "app-nav-link";
                    }}
                  >
                    {item.label}
                  </NavLink>

                  {hasChildren && (
                    <button
                      type="button"
                      className="app-nav-toggle"
                      onClick={() => toggleGroup(item.label)}
                      aria-label={
                        isOpen
                          ? `Ocultar ${item.label}`
                          : `Mostrar ${item.label}`
                      }
                    >
                      {isOpen ? "▾" : "▸"}
                    </button>
                  )}
                </div>

                {hasChildren && isOpen && (
                  <div className="app-subnav">
                    {item.children?.map((child) => (
                      <NavLink
                        key={child.to}
                        to={child.to}
                        className={({ isActive }) =>
                          isActive
                            ? "app-subnav-link active"
                            : "app-subnav-link"
                        }
                      >
                        {child.label}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className="app-sidebar-footer">
          <span>Modo prototipo</span>
          <strong>LocalStorage</strong>
        </div>

        <div className="sidebar-signature">
          <strong>CRamirez</strong>
          <span>Consultor de Sistemas</span>
          <small>Legacy to SaaS</small>
        </div>
      </aside>

      <main className="app-main">
        <div className="app-topbar">
          <div>
            <span className="app-topbar-eyebrow">Operación</span>
            <strong>Polla Los Martínez</strong>
          </div>

          <div className="app-topbar-badge">MVP operacional</div>
        </div>

        <section className="app-content">{children}</section>
      </main>
    </div>
  );
};