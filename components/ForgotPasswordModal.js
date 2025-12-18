"use client";
import React, {useState} from 'react';
import {useRequestService} from "@/service/request.service";
import Typography from "@mui/material/Typography";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField} from "@mui/material";

const ForgotPasswordModal = ({isOpen, onClose, showSnackbar}) => {

    const service = useRequestService()
    const [mail, setMail] = useState('');
    const [submittingForm, setSubmittingForm] = useState(false);
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

    const submitForm = () => {
        if (!mail.match(emailPattern)) {
            showSnackbar('El formato del correo electrónico no es válido', 'error')
            return
        }

        setSubmittingForm(true);
        service.passwordReset(mail)
            .then((status) => {
                setSubmittingForm(false);
                if (status === 404) showSnackbar('No existe un usuario con el correo proporcionado', 'error')
                if (status === 409) showSnackbar('Ya se envió un link para actualizar la contraseña al correo proporcionado', 'error')
                if (status === 200) {
                    onClose()
                    showSnackbar('En breve se enviará un correo para actualizar la contraseña', 'success')
                }
            }).catch((error) => {
                setSubmittingForm(false);
                console.log(error)
            });
    }

    if (!isOpen) return null;

    return (
        <Dialog
            open={isOpen}
            onClose={onClose}
        >
            <DialogTitle>Correo de recuperación</DialogTitle>
            <DialogContent>
                <Typography style={{marginBottom: '20px'}}>
                    Ingresa el correo electrónico de tu cuenta, en donde recibirás un link para actualizar tu contraseña.
                </Typography>
                <TextField
                    label="Correo"
                    variant="outlined"
                    fullWidth
                    onChange={(event) => setMail(event.target.value)}
                    value={mail}
                />
            </DialogContent>
            <DialogActions style={{padding: '0px 20px 24px 24px'}}>
                <Button
                    variant="contained"
                    style={{backgroundColor: (mail === '' || submittingForm) ? '#0000001E' : '#0C6'}}
                    onClick={submitForm}
                    disabled={mail === '' || submittingForm}
                >
                    Enviar
                </Button>
            </DialogActions>
        </Dialog>
    );

};

export default ForgotPasswordModal;
