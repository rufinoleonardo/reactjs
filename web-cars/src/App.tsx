import { createBrowserRouter } from "react-router-dom"
import { Layout } from "./components/Layout";

import { Dashboard } from "./pages/dashboard";
import { Login } from "./pages/login";
import { Register } from "./pages/register";
import { CarDetail } from "./pages/car";
import { Home } from "./pages/home";
import { NewCar } from "./pages/car/new";


const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/dashboard", element: <Dashboard /> },
      { path: "/dashboard/new", element: <NewCar /> },
      { path: "/car/:id", element: <CarDetail /> }
    ]
  },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> }
])

export { router };