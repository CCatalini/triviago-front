'use client'
import React, {useState} from 'react';
import styles from '../styles/SigninForm.module.css';
import {Slide, Snackbar, Alert} from "@mui/material";
import {useRequestService} from "@/service/request.service";
import {useRouter} from "next/navigation";


const SigninForm = () => {
    const currentDate = new Date();
    currentDate.setFullYear(2017);
    const formattedDate = currentDate.toISOString().split('T')[0];

    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [birthDate, setBirthDate] = useState(formattedDate)
    // const inputName = document.getElementById("name");
    const [open, setOpen] = React.useState(false);
    const [message, setMessage] = React.useState("ERROR");

    const router = useRouter()

    function handleName(event) {
        setName(event.target.value)
    }

    function handleSurname(event) {
        setSurname(event.target.value)
    }

    function handlePassword(event) {
        setPassword(event.target.value)
    }

    function handleEmail(event) {
        setEmail(event.target.value)
    }

    function handleConfirmPassword(event) {
        setConfirmPassword(event.target.value)
    }

    const handleBirthDate = (event) => {
        setBirthDate(event.target.value)
    }

    function signinState(event) {
        event.preventDefault()
        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

        if (name === "") {
            setMessage("El nombre no puede estar vacío.")
            setOpen(true);
            return
        }

        if (surname === "") {
            setMessage("El apellido no puede estar vacío.")
            setOpen(true);
            return
        }

        if (!email.match(emailPattern)) {
            setMessage("El formato del correo electrónico no es válido.")
            setOpen(true);
            return
        }
        if (password !== confirmPassword) {
            setMessage("Las contraseñas no coinciden.")
            setOpen(true);
            return
        }
        if (password.length < 8) {
            setMessage("La contraseña debe tener al menos 8 caracteres.")
            setOpen(true);
            return
        }

        // aca van los datos como los recibe el back
        const service = useRequestService()
        service.signUp({firstName: name, lastName: surname, birthDate: birthDate, email: email, password: password})
            .then(() => router.push("/home"))
            .catch((e) => {
                if (e.response.status === 500) {
                    setMessage("El correo electrónico ya está en uso.")
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
        <form className={styles.formContainer}>

            <div className={styles.labelContainer}>
                <label className={styles.label}>Nombre *</label>
                <input className={styles.input} type="text" id="name" name="name" placeholder="Ingresa tu nombre"
                       onChange={handleName}/>
            </div>

            <div className={styles.labelContainer}>
                <label className={styles.label}>Apellido *</label>
                <input className={styles.input} type="text" id="surname" name="surname"
                       placeholder="Ingresa tu apellido" onChange={handleSurname}/>
            </div>

            {/*CALENDARIO:*/}

            <div className={styles.labelContainer}>
                <label className={styles.label}>Fecha de nacimiento *</label>
                <input id="date" type="date" defaultValue={formattedDate} className={styles.inputCalendar}
                       max={formattedDate} onChange={handleBirthDate} onKeyDown={(e) => e.preventDefault()}/>
                <div className={styles.line}></div>
            </div>


            <div className={styles.labelContainer}>
                <label className={styles.label}>Email *</label>
                <input className={styles.input} type="email" id="email" name="email" placeholder="Ingresa tu email"
                       onChange={handleEmail}/>
            </div>

            <div className={styles.labelContainer}>
                <label className={styles.label}>Contraseña *</label>
                <input className={styles.input} type="password" id="password" name="password"
                       placeholder="Ingresa tu contraseña" onChange={handlePassword}/>
            </div>

            <div className={styles.labelContainer}>
                <label className={styles.label}>Confirmar contraseña *</label>
                <input className={styles.input} type="password" id="confirmPassword" name="confirmPassword"
                       placeholder="Ingresa tu contraseña" onChange={handleConfirmPassword}/>
            </div>

            <div className={styles.actionContainer}>
                <button className={styles.button} onClick={signinState}>Registrarte</button>
                <p className={styles.text}>¿Ya tienes una cuenta? <a href="/login" className={styles.link}>Inicia
                    sesión</a></p>
            </div>

            <Snackbar open={open} autoHideDuration={5000} onClose={handleClose} TransitionComponent={Slide}
                      anchorOrigin={{vertical: 'top', horizontal: 'center'}}>
                <Alert onClose={handleClose} severity="error">
                    {message}
                </Alert>
            </Snackbar>
        </form>
    );
};

export default SigninForm;