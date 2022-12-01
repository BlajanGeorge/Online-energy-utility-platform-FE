import { Navigate } from "react-router-dom"

export const ClientRoute = ({ children }: { children: JSX.Element }) => {
    const logged = localStorage.getItem('logged')
    const admin = localStorage.getItem('admin')

    if (logged == 'true' && admin == 'false') {
        return children
    }

    return <Navigate to="/" />
}