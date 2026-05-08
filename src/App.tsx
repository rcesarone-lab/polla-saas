import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import { Dashboard } from "./pages/Dashboard";
import { Jugadas } from "./pages/Jugadas";
import { Resultados } from "./pages/Resultados";
import { Historico } from "./pages/Historico";
import { Configuracion } from "./pages/Configuracion";
import { Admin } from "./pages/Admin";


function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/jugadas" element={<Jugadas />} />
          <Route path="/resultados" element={<Resultados />} />
          <Route path="/historico" element={<Historico />} />
          <Route path="/configuracion" element={<Configuracion />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;