import { Navigate } from "react-router-dom"

export const ClientRoute = ({ children }: { children: JSX.Element }) => {
    const logged = localStorage.getItem('logged')

    if (logged == 'true') {
        return children
    }

    return <Navigate to="/" />
}