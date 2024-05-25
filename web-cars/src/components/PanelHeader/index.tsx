import { Link } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../services/firebaseConnection";

export function DashboardHeader() {
    async function handleLogout() {
        await signOut(auth);
        console.log("Usuario deslogado.")
    }

    return (
        <div className="w-full flex items-center h-10 bg-red-500 text-white font-medium gap-4 px-4 rounded-lg mb-2">
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/dashboard/new">Cadastrar Carro</Link>

            <button onClick={handleLogout} className="ml-auto">Sair da conta</button>
        </div>
    )
}