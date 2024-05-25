import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom';
import { router } from './App.tsx';
import "./index.css"
import { AuthProvider } from './contexts/AuthContext.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <AuthProvider>
    <RouterProvider router={router} />
  </AuthProvider>,
)
