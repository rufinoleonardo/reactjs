import LogoImg from "../../assets/logo.svg";
import { Link } from "react-router-dom";
import { FiUser, FiLogIn } from "react-icons/fi"

export function Header() {
    const signed = false;
    const loadingAuth = false;

    return <div className="w-full flex items-center justify-center bg-white h-16 mb-4 drop-shadow">
        <header className="flex w-full max-w-6xl px-4 items-center justify-between m-auto">
            <Link to="/">
                <img src={LogoImg} alt="Logo Image" />
            </Link>
            {(!loadingAuth && signed) &&
                <Link to="/dashboard">
                    <div className="border-2 rounded-full p-2 border-gray-900">
                        <FiUser size={22} color="#000000"></FiUser>
                    </div>
                </Link>
            }

            {(!loadingAuth && !signed) &&
                <Link to="/login">
                    <div className="border-2 rounded-full p-2 border-gray-900">
                        <FiLogIn size={22} color="#000000"></FiLogIn>
                    </div>
                </Link>}
        </header>
    </div>
}