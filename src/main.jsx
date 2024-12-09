import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './App.css'
import App from './App.jsx'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';


import FormLogin from './pages/auth/FormLogin';
import FormRegister from './pages/auth/FormRegister';
import Dashboard from './pages/auth/dashboard';
import FormUsuario from './pages/usuarios/FormUsuario.jsx'
import ListaUsuarios from './pages/usuarios/ListaUsuarios.jsx'
import FormContraseña from './pages/usuarios/FormContraseña.jsx'
import ListaTiposIncidentes from './pages/tipos-incidentes/ListaTiposIncidentes.jsx'
import FormTipoIncidente from './pages/tipos-incidentes/FormTipoIncidente.jsx'
import ListaMunicipios from './pages/municipios/ListaMunicipios.jsx'
import FormMunicipio from './pages/municipios/FormMunicipio.jsx'
import { APIProvider } from '@vis.gl/react-google-maps';
import ListaCarreteras from './pages/carreteras/ListaCarreteras.jsx'
import FormCarretera from './pages/carreteras/FormCarretera.jsx'
import ListaReporteIncidente from './pages/reporte-incidente/ListaReporteIncidente.jsx'
import ReporteIncidente from './pages/cliente/Reportes/ReporteIncidente.jsx'
import ListaIncidentes from './pages/incidentes/ListaIncidentes.jsx'
import FormIncidente from './pages/incidentes/FormIncidente.jsx'
import FotoFormIncidente from './pages/incidentes/FotoFormIncidente.jsx'
import Home from './pages/home/Home.jsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <FormLogin />,
  },
  {
    path: "/register",
    element: <FormRegister />,
  },
  {
    path: '/helloworld',
    element: <App />
  },
  {
    path: '/dashboard',
    element: <Dashboard />
  },
  {
    path: '/usuarios',
    element: <ListaUsuarios />
  },
  {
    path: '/usuarios/create',
    element: <FormUsuario />
  },
  {
    path: '/usuarios/:id',
    element: <FormUsuario />
  },
  {
    path: '/usuarios/:id/contraseña',
    element: <FormContraseña />
  },
  {
    path: '/tiposIncidentes',
    element: <ListaTiposIncidentes />
  },
  {
    path: '/tiposIncidentes/create',
    element: <FormTipoIncidente />
  },{
    path: '/tiposIncidentes/:id',
    element: <FormTipoIncidente />
  },
  {
    path: '/municipios',
    element: <ListaMunicipios />
  },
  {
    path: '/municipios/create',
    element: <FormMunicipio />
  },
  {
    path: '/municipios/:id',
    element: <FormMunicipio />
  },
  {
    path: '/carreteras',
    element: <ListaCarreteras />
  },
  {
    path: '/carreteras/create',
    element: <FormCarretera />
  },
  {
    path: '/carreteras/:id',
    element: <FormCarretera />
  },
  {
    path: '/reportesIncidentes',
    element: <ListaReporteIncidente />
  },
  {
    path: '/reportes',
    element: <ReporteIncidente />
  },
  {
    path: '/home',
    element: <Home />
  },
  {
    path: '/incidentes',
    element: <ListaIncidentes /> 
  },
  {
    path: '/incidentes/create',
    element: <FormIncidente />
  },
  {
    path: '/incidentes/:id',
    element: <FormIncidente />
  },
  {
    path: '/incidentes/:id/foto',
    element: <FotoFormIncidente />
  },


])

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
console.log('Tu api key de google maps: ', API_KEY);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <APIProvider apiKey={API_KEY}>
      <RouterProvider router={router} />
    </APIProvider>
  </StrictMode>,
)
