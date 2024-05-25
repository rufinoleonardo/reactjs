import { createBrowserRouter } from "react-router-dom"
import { Layout } from "./components/Layout";

import { Dashboard } from "./pages/dashboard";
import { Login } from "./pages/login";
import { Register } from "./pages/register";
import { CarDetail } from "./pages/car";
import { Home } from "./pages/home";
import { NewCar } from "./pages/dashboard/new";

import { Private } from "./routes/Private";


const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/dashboard", element: <Private><Dashboard /></Private> },
      { path: "/dashboard/new", element: <Private><NewCar /></Private> },
      { path: "/car/:id", element: <CarDetail /> }
    ]
  },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> }
])

export { router };