import { ReactNode, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { Navigate } from "react-router-dom";

interface RouterProps {
    children: ReactNode
}

export function Private({ children }: RouterProps): any {
    const { loadingAuth, signed } = useContext(AuthContext);

    if (loadingAuth) {
        return <div></div>
    }

    if (!signed) {
        return <Navigate to="/login" />
    }

    console.log("signed: ", signed)

    return children;
}