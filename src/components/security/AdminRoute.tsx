import { Navigate } from "react-router-dom"

export const AdminRoute = ({ children }: { children: JSX.Element }) => {
    const admin = localStorage.getItem('admin')
    const logged = localStorage.getItem('logged')

    if (admin == 'true' && logged == 'true') {
        return children
    }

    return <Navigate to="/" />
}