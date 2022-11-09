import { Box, Button, TextField, Typography } from '@mui/material';
import classes from './signUp.module.css';
import LockIcon from '@mui/icons-material/Lock';
import PersonIcon from '@mui/icons-material/Person';
import BadgeIcon from '@mui/icons-material/Badge';
import { ErrorText, FrontEndRoutes } from '../constants/Constants';
import { useEffect, useState } from 'react';
import { CreateClient } from './utilities/Requests';

export function SignUp() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [signUpState, setSignUpState] = useState(2);

    useEffect(() => {
        if (signUpState === 0) {
            window.location.href = FrontEndRoutes.LOGIN_ROUTE
        }
    }, [signUpState])

    return (
        <Box className={classes.background_image}>
            <Box className={classes.signUp_container}>
                <Typography className={classes.title}>SignUp</Typography>
                <Typography className={classes.username_text}>Username</Typography>
                <PersonIcon className={classes.person_icon} color='disabled' />
                <TextField helperText={signUpState === 1 ? ErrorText.INVALID_SIGN_UP : ''} error={signUpState === 1} onChange={event => setUsername(event.target.value)} className={classes.username_field} label='Type your username' variant='standard' />
                <Typography className={classes.password_text}>Password</Typography>
                <LockIcon className={classes.password_icon} color='disabled' />
                <TextField helperText={signUpState === 1 ? ErrorText.INVALID_SIGN_UP : ''} error={signUpState === 1} onChange={event => setPassword(event.target.value)} className={classes.password_field} label='Type your password' variant='standard' type="password" />
                <Typography className={classes.fullName_text}>Full name</Typography>
                <BadgeIcon className={classes.fullName_icon} color='disabled' />
                <TextField helperText={signUpState === 1 ? ErrorText.INVALID_SIGN_UP : ''} error={signUpState === 1} onChange={event => setName(event.target.value)} className={classes.fullName_field} label='Type your name' variant='standard' />
                <Button onClick={async () => setSignUpState(await CreateClient(username, password, name, []))} className={classes.signup_button} size="small" variant="contained" style={{ backgroundColor: '#66B2FF' }}>SignUp</Button>
                <Typography className={classes.or_text}>OR</Typography>
                <Button onClick={() => window.location.href = FrontEndRoutes.LOGIN_ROUTE} className={classes.login_button} size="small" variant="contained" style={{ backgroundColor: '#FF99FF' }}>Login</Button>
            </Box>
        </Box>
    )
}