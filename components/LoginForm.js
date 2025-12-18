'use client'

import React, {useState} from 'react';
import styles from '../styles/LoginForm.module.css';
import {Button, Slide, Snackbar} from "@mui/material";
import {Alert} from "@mui/lab"
import {useRequestService} from "@/service/request.service";
import {useRouter} from "next/navigation";
import ForgotPasswordModal from "@/components/ForgotPasswordModal";


const LoginForm = () => {

    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("ERROR");
    const [severity, setSeverity] = React.useState("error");
    const [isOpenForgotPasswordModal, setIsOpenForgotPasswordModal] = useState(false);
    const router = useRouter();


    function handlePassword(event) {
        setPassword(event.target.value)
    }

    function handleEmail(event) {
        setEmail(event.target.value)
    }


    const logInState = (event) => {
        event.preventDefault()
        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        if (!email.match(emailPattern)) {
            setSeverity("error");
            setMessage("El email no es valido.")
            setOpen(true);
            return
        }

        if (password.length < 8) {
            setSeverity("error");
            setMessage("La contraseña debe tener al menos 8 caracteres.")
            setOpen(true);
            return
        }

        const service = useRequestService()
        service.login({username: email, password: password})
            .then(() => router.push("/home"))
            .catch((e) => {
                setSeverity("error");
                if (e.response.status === 401) {
                    setMessage("Las credenciales son incorrectas.")
                } else {
                    setMessage(e.message)
                }
                setOpen(true)
            })

    }

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    return (
        <form className={styles['form-container']}>
            <div>
                <label htmlFor="email">Email</label>
                <input type="email" id="email" name="email" placeholder="Ingresa tu email" onChange={handleEmail}/>
            </div>
            <div>
                <label htmlFor="password">Contraseña</label>
                <input type="password" id="password" name="password" placeholder="Ingresa tu contraseña"
                       onChange={handlePassword}/>
            </div>

            <button className={styles.button} onClick={logInState}>Iniciar sesión</button>

            <p className={styles.text}>¿No tienes una cuenta? <a href="/signin" className={styles.link}>Regístrate</a>
            </p>
            <Button
                variant="text"
                onClick={() => setIsOpenForgotPasswordModal(true)}
                style={{color: 'black', textTransform: 'none', backgroundColor: 'transparent'}}
                disableRipple
            >
                ¿Olvidaste tu contraseña?
            </Button>

            <ForgotPasswordModal
                isOpen={isOpenForgotPasswordModal}
                onClose={() => setIsOpenForgotPasswordModal(false)}
                showSnackbar={(message, severity) => {
                    setSeverity(severity)
                    setMessage(message);
                    setOpen(true);
                }}
            />

            <Snackbar open={open} autoHideDuration={5000} onClose={handleClose} TransitionComponent={Slide}
                      anchorOrigin={{vertical: 'top', horizontal: 'center'}}>
                <Alert onClose={handleClose} severity={severity}>
                    {message}
                </Alert>
            </Snackbar>
        </form>
    );
};

export default LoginForm;