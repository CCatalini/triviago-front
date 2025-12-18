'use client';
import {Button, Dialog, DialogActions, DialogContent, DialogTitle} from "@mui/material";
import Typography from "@mui/material/Typography";
import React from "react";
import {useRequestService} from "@/service/request.service";

const DeleteQuizModal = ({ isOpen, onClose, showSnackbar, quizId, title}) => {
    const service = useRequestService();

    const handleDeleteClick = () => {
        service.deleteQuiz(quizId)
            .then(r => {
                if (r.status === 200) {
                    showSnackbar('Se eliminó exitosamente el quiz.', 'success')
                    window.location.reload()
                } else {
                    showSnackbar('Hubo un error al intentar eliminar el quiz.', 'error')
                }
            })
            .catch(e => {
                showSnackbar('Hubo un error al intentar eliminar el quiz.', 'error')
            });
    };

    return (
        <Dialog
            open={isOpen}
            onClose={onClose}
        >
            <DialogTitle>Eliminar quiz</DialogTitle>
            <DialogContent>
                <Typography>
                    {`¿Estás seguro que deseas eliminar el quiz titulado ${title}?`}
                </Typography>
            </DialogContent>
            <DialogActions style={{padding: '0px 20px 24px 24px'}}>
                <Button
                    // variant="contained"
                    // style={{backgroundColor: '#0C6'}}
                    disableRipple
                    onClick={onClose}
                    style={{color: '#000', backgroundColor: 'transparent'}}
                >
                    Cancelar
                </Button>
                <Button
                    variant="contained"
                    style={{backgroundColor: '#EA0E0E'}}
                    onClick={handleDeleteClick}
                >
                    Eliminar
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DeleteQuizModal;
