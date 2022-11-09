import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AdminMainPanel } from './components/AdminBoard'
import { ClientBoard } from './components/ClientBoard'
import { Login } from './components/Login'
import { AdminRoute } from './components/security/AdminRoute'
import { ClientRoute } from './components/security/ClientRoute'
import { SignUp } from './components/SignUp'
import { FrontEndRoutes } from './constants/Constants'

export default function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path={FrontEndRoutes.LOGIN_ROUTE} element={<Login />} />
        <Route path={FrontEndRoutes.SIGN_UP_ROUTE} element={<SignUp />} />
        <Route path={FrontEndRoutes.CLIENT_BOARD_ROUTE} element={
          <ClientRoute>
            <ClientBoard />
          </ClientRoute>
        }
        />
        <Route path={FrontEndRoutes.ADMIN_BOARD_ROUTE} element=
          {<AdminRoute>
            <AdminMainPanel />
          </AdminRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}