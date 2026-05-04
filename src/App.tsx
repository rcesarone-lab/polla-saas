import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import { Dashboard } from "./pages/Dashboard";
import { Jugadas } from "./pages/Jugadas";
import { Resultados } from "./pages/Resultados";

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/jugadas" element={<Jugadas />} />
          <Route path="/resultados" element={<Resultados />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;