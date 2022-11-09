import { Box, Button, TextField, Typography } from '@mui/material';
import classes from './login.module.css';
import LockIcon from '@mui/icons-material/Lock';
import PersonIcon from '@mui/icons-material/Person';
import { ErrorText, FrontEndRoutes } from '../constants/Constants';
import { LoginRequest } from './utilities/Requests';
import { useEffect, useState } from 'react';

export function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loginState, setLoginState] = useState(2);


    useEffect(() => {
        if (loginState === 0) {
            var isAdmin = localStorage.getItem('admin')
            if (isAdmin === 'false') {
                window.location.href = FrontEndRoutes.CLIENT_BOARD_ROUTE
            }
            else {
                window.location.href = FrontEndRoutes.ADMIN_BOARD_ROUTE
            }
        }
    }, [loginState])

    return (
        <Box className={classes.background_image}>
            <Box className={classes.login_container}>
                <Typography className={classes.title}>Login</Typography>
                <Typography className={classes.username_text}>Username</Typography>
                <PersonIcon className={classes.person_icon} color='disabled' />
                <TextField helperText={loginState === 1 ? ErrorText.INVALID_LOGIN : ''} error={loginState === 1} onChange={event => setUsername(event.target.value)} className={classes.username_field} label='Type your username' variant='standard' />
                <Typography className={classes.password_text}>Password</Typography>
                <LockIcon className={classes.password_icon} color='disabled' />
                <TextField helperText={loginState === 1 ? ErrorText.INVALID_LOGIN : ''} error={loginState === 1} onChange={event => setPassword(event.target.value)} className={classes.password_field} label='Type your password' variant='standard' type="password" />
                <Button onClick={async () => { setLoginState(await LoginRequest(username, password)) }} className={classes.login_button} size="small" variant="contained" style={{ backgroundColor: '#FF99FF' }}>Login</Button>
                <Typography className={classes.or_text}>OR</Typography>
                <Button onClick={() => window.location.href = FrontEndRoutes.SIGN_UP_ROUTE} className={classes.signup_button} size="small" variant="contained" style={{ backgroundColor: '#66B2FF' }}>SignUp</Button>
            </Box>
        </Box>
    )
}