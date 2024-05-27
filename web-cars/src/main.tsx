import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom';
import { router } from './App.tsx';
import "./index.css"
import { AuthProvider } from './contexts/AuthContext.tsx';

import { register } from "swiper/element-bundle";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

register();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <AuthProvider>
    <RouterProvider router={router} />
  </AuthProvider>,
)
