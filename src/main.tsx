import { StrictMode } from 'react'
import { runStorageMigrations } from "./storage/storage.migrations";
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import "./styles/global.css";

runStorageMigrations();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
