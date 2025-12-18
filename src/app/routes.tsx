import { createBrowserRouter } from "react-router-dom";
import Home from "../presentation/pages/Home";
import Questionario from "@/presentation/pages/Questionario";
import Principal from "@/presentation/pages/Principal";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Principal />,
  },
  {
    path: "/mapa",
    element: <Home />,
  },
  {
    path: "/perguntas",
    element: <Questionario />,
  },
]);
