"use client"

import styles from '../styles/QuizResults.module.css';
import Rater from "react-rater";
import 'react-rater/lib/react-rater.css'
import {useRequestService} from "@/service/request.service";
import React, {useState} from "react";
import {Button, Snackbar} from "@mui/material";
import {Alert} from "@mui/lab";
import {useRouter} from "next/navigation";

const QuizResults = ({quizId, quizTitle="Asd", quizQuestionNumber = 10, correctAnswers = 8}) => {

    const service = useRequestService();
    const [ratingSubmitted, setRatingSubmitted] = useState(false);
    const [errorSnackbarOpen, setErrorSnackbarOpen] = useState(false);
    const router = useRouter()

    function handleRate(event) {
        const rating = event.rating;
        if (quizId !== '0') {
            service.rateQuiz(quizId, rating)
                .then(response => {
                    setRatingSubmitted(true);
                })
                .catch(error => {
                    console.error('Hubo un error al calificar el quiz:', error);
                    setErrorSnackbarOpen(true);
                });
        } else {
            console.error('No se pudo obtener el ID del quiz desde el URL.');
        }
    }

    const handleCloseErrorSnackbar = () => {
        setErrorSnackbarOpen(false);
    };

    return (
        <div className={styles.componentBox} style={{paddingBottom: '8px'}}>
            <p className={styles.quizTitle}>{quizTitle}</p>
            <p className={styles.quizResultText}>Tu resultado fue
                <span className={styles.quizResultTextBold}> {correctAnswers} de {quizQuestionNumber} respuestas correctas</span></p>
            <div className={styles.rateBox} style={{margin: 0}}>
                <p className={styles.rateText}>¿Cómo calificarías este quiz?</p>
                <div className={styles.starsBox}>
                    <Rater style={{fontSize: '35px'}} onRate={handleRate} disabled={ratingSubmitted}/></div>
            </div>
            <div className={styles.buttonsContainer}>
                <Button
                    variant="contained"
                    style={{ backgroundColor: "#00CC66" }}
                    onClick={() => {
                        router.push("/home");
                    }}
                >
                    Volver a la Pagina Principal
                </Button>
                <Button
                    variant="contained"
                    style={{ backgroundColor: "#00CC66" }}
                    onClick={() => {
                        router.push(`/quiz/${quizId}/details`);
                    }}
                >
                    Volver a la Pagina del Quiz
                </Button>
            </div>
            <Snackbar
                open={errorSnackbarOpen}
                autoHideDuration={5000}
                onClose={handleCloseErrorSnackbar}
                anchorOrigin={{vertical: 'top', horizontal: 'center'}}
            >
                <Alert onClose={handleCloseErrorSnackbar} severity="error">
                    Hubo un error al calificar el quiz, por favor intenta más tarde.
                </Alert>
            </Snackbar>
        </div>
    )
}

export default QuizResults;