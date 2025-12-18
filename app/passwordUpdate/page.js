"use client";

import React, {useState} from 'react';
import {Box, Button, Container, Slide, Snackbar, TextField, Typography} from '@mui/material';
import {useRouter} from "next/navigation";
import {useRequestService} from "@/service/request.service";
import {Alert} from "@mui/lab";

const PasswordUpdateScreen = () => {
    const service = useRequestService()
    const router = useRouter();
    const token = (new URL(window.location)).searchParams.get('token')

    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [severity, setSeverity] = React.useState("error");

    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('');
    const [submittingForm, setSubmittingForm] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (newPassword.length < 8) {
            setSeverity("error")
            setMessage("La contraseña debe tener al menos 8 caracteres.")
            setOpen(true);
            return
        }
        if (newPassword !== confirmPassword) {
            setSeverity("error")
            setMessage("Ambos valores de contraseña no coinciden.")
            setOpen(true);
            return
        }

        const data = {newPassword: newPassword, token: token}
        setSubmittingForm(true);
        service.passwordUpdate(data)
            .then((status) => {
                setSubmittingForm(false);
                if (status === 404) {
                    setMessage('La token es inválida')
                    setSeverity('error')
                    setOpen(true)
                }
                if (status === 200) {
                    setMessage('Se actualizó la contraseña exitosamente. En breve se redirigirá al inicio de sesión')
                    setSeverity('success')
                    setOpen(true)
                    setTimeout(() => {
                        router.push('/login')
                    }, 3000);
                }
            }).catch((error) => {
            setSubmittingForm(false);
            console.log(error)
        });
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ marginTop: 4, textAlign: 'center' }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Triviago
                </Typography>

                <Typography variant="subtitle1" gutterBottom>
                    Actualizar contraseña
                </Typography>

                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Nueva Contraseña"
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />

                    <TextField
                        label="Confirmar Contraseña"
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />

                    <Button
                        variant="contained"
                        style={{
                            marginTop: 2,
                            backgroundColor: (newPassword === '' || confirmPassword === '' || submittingForm) ? '#0000001E' : '#0C6'
                        }}
                        onClick={handleSubmit}
                        disabled={newPassword === '' || confirmPassword === '' || submittingForm}
                    >
                        Enviar
                    </Button>
                </form>
            </Box>
            <Snackbar
                open={open}
                autoHideDuration={5000}
                onClose={handleClose}
                TransitionComponent={Slide} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={handleClose} severity={severity}>
                    {message}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default PasswordUpdateScreen
