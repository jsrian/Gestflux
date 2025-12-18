import { createBrowserRouter } from 'react-router-dom';
import Home from '../presentation/pages/Home'
import Questionario from '@/presentation/pages/Questionario'


export const router = createBrowserRouter([
  {
    path: "/mapa",
    element: <Home />,
  },
  {
    path: "/perguntas",
    element: <Questionario/>,
  },
]);