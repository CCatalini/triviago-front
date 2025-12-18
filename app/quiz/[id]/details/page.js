"use client"
import React, {useEffect, useState} from 'react';
import QuizComents from "../../../../components/QuizComents";
import QuizInfo from "../../../../components/QuizInfo";
import ResponsiveAppBar from "@/components/ResponsiveAppBar";
import styles from '../../../../styles/QuizComents.module.css';
import {useParams, useRouter} from 'next/navigation';
import {useRequestService} from "@/service/request.service";
import {CircularProgress, Slide, Snackbar, Alert} from "@mui/material";


const ResultPage = () => {
    const [quiz, setQuiz] = useState();
    const router = useRouter();
    const { id } = useParams();

    const service = useRequestService()
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("ERROR");
    const [saved, setSaved] = useState(false);

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    const getSavedQuizzes = () => {
        return service.getSavedQuizzes()
            .then(savedQuizzes => {
                return savedQuizzes.some(quiz => quiz.id === parseInt(id));
            })
            .catch(error => {
                console.error("Error getting saved quizzes:", error);
                throw error; // Re-lanzar el error para que se maneje en el useEffect.
            });
    }

    useEffect(() => {
        service.getQuiz(id)
            .then(quiz => {
                setQuiz(quiz);
                getSavedQuizzes().then(isSaved => {
                    setSaved(isSaved);
                })
                .catch(error => {
                    if(error.response && error.response.status === 404) {
                        router.push("/not-found")
                    }
                    setMessage("Error al cargar el quiz");
                    // setOpen(true);
                });
            }).catch(error => {
                if(error.response && error.response.status === 404) {
                    router.push("/not-found")
                }
                setMessage("Error al cargar el quiz");
                // setOpen(true);
        })
    }, [saved]);

    if (quiz === undefined) return (
        <>
            <ResponsiveAppBar/>
            <div style={{display: 'flex', justifyContent: 'center', marginTop: '24px'}}>
                <CircularProgress size="64px" style={{ color: '#00CC66' }} />
            </div>
        </>
    );

    // Si el quiz se cargó correctamente, el usuario tiene acceso
    // (ya sea porque es público, es el autor, o usó el código de invitación)
    return (
        <div>
            <ResponsiveAppBar/>
            <br></br>
            <div className={styles.componentBox}>
                <QuizInfo {...quiz} saved={saved} setSaved={setSaved}/>
            </div>
            <br></br>
            <QuizComents quiz={quiz}/>
            <Snackbar open={open} autoHideDuration={5000} onClose={handleClose} TransitionComponent={Slide}
                      anchorOrigin={{vertical: 'top', horizontal: 'center'}}>
                <Alert onClose={handleClose} severity="error">
                    {message}
                </Alert>
            </Snackbar>
        </div>
    );
};
export default ResultPage;
