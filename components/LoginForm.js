'use client'

import React, {useState} from 'react';
import styles from '../styles/LoginForm.module.css';
import {Button, Slide, Snackbar} from "@mui/material";
import Alert from "@mui/material/Alert";
import {useRouter} from "next/navigation";
import Cookies from "js-cookie";

const LoginForm = () => {
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("ERROR");
    const [severity, setSeverity] = useState("error");
    const router = useRouter();

    function handlePassword(event) {
        setPassword(event.target.value)
    }

    function handleEmail(event) {
        setEmail(event.target.value)
    }

    const logInState = async (event) => {
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

        try {
            const response = await fetch("http://localhost:8080/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username: email,
                    password: password
                })
            });
            
            if (response.ok) {
                const data = await response.json();
                localStorage.setItem("token", data.token);
                Cookies.set("jwt", data.token, {expires: 7});
                router.push("/home");
            } else if (response.status === 401) {
                setSeverity("error");
                setMessage("Las credenciales son incorrectas.");
                setOpen(true);
            } else {
                setSeverity("error");
                setMessage("Error al iniciar sesión");
                setOpen(true);
            }
        } catch (e) {
            setSeverity("error");
            setMessage(e.message || "Error de conexión");
            setOpen(true);
        }
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

            <p className={styles.text}>¿No tienes una cuenta? <a href="/signin" className={styles.link}>Regístrate</a></p>

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
