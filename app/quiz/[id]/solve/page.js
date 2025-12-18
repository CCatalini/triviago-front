"use client";
import React, {useEffect, useState} from 'react';
import ResponsiveAppBar from "@components/ResponsiveAppBar";
import axios from "axios";
import API_URL from '@root/config';
import {Button, Slide, Snackbar} from "@mui/material";
import {Alert} from "@mui/lab";
import styles from '../../../../styles/QuizComents.module.css';
import modalStyles from '../../../../styles/QuizInfo.module.css';
import Cookies from "js-cookie";
import QuizPreview from "@/components/QuizPreview";
import QuizQuestionAnswer from "@/components/QuizQuestionAnswer";
import QuizResolutionModal from "@/components/QuizResolutionModal";
import {useParams} from "next/navigation";
import QuizResults from "@/components/QuizResults";

const quizSolve = () => {
    const [quizData, setQuizData] = useState(null);
    const token = Cookies.get("jwt") ? Cookies.get("jwt") : undefined;
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');
    const params = useParams();
    const id = params.id;
    const [showResolutionModal, setShowResolutionModal] = useState(false);
    const [questionsWithIsAnswered, setQuestionsWithIsAnswered] = useState([]);
    const [showResults, setShowResults] = useState(false);
    const [correctAnswersCount, setCorrectAnswersCount] = useState(0);

    const handleSendResolution = () => {
        const allAnswered = questionsWithIsAnswered.every((question) => question.is_answered);
        if (allAnswered) {
            setShowResolutionModal(true);
        } else {
            setMessage("Debe responder todas las preguntas para enviar la resolución");
            setOpen(true);
        }
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                };
                const response = await axios.get(API_URL + "/quiz/" + id, config);

                if (response.status === 200) {
                    setQuizData(response.data);

                    const initialQuestions = response.data?.questions?.map((question) => ({
                        ...question,
                        is_answered: false,
                        selectedAnswers: [],
                    }));

                    setQuestionsWithIsAnswered(initialQuestions);
                }
            } catch (error) {
                setMessage('Hubo un error al buscar la información del quiz');
                setOpen(true);
            }
        };
        fetchData();

    }, [id]);


    const handleCancelResolution = () => {
        setShowResolutionModal(false);
    }

    const sendQuizResult = async () => {
        setShowResolutionModal(false);

        const resolvedQuestions = questionsWithIsAnswered
            .map(question => ({
                questionId: question.id,
                selectedAnswersIds: question.selectedAnswers
            }));

        const jsonModel = {
            quizId: parseInt(id, 10),
            resolvedQuestions: resolvedQuestions
        };

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                },
            };
            const response = await axios.post(API_URL + "/quiz-resolution", jsonModel, config)
            if (response.status === 200) {
                setCorrectAnswersCount(response.data.correctAnswers);
                setShowResults(true);
            }
        } catch (e) {
            console.log(e)
        }

    }

    if (quizData === null) return (<div></div>);

    return (
        <div>
            <ResponsiveAppBar/>
            <br></br>
            <div className={styles.componentBox}>
                <QuizPreview {...quizData} />
                {questionsWithIsAnswered?.map((question) => {
                    return <QuizQuestionAnswer question={question}/>
                })}
            </div>
            <div style={{display: 'flex', justifyContent: 'center'}}>
                <Button
                    variant="contained"
                    style={{backgroundColor: '#00CC66', marginTop: '24px'}}
                    onClick={handleSendResolution} // Call the function to display the modal
                >
                    Enviar
                </Button>
            </div>
            <Snackbar open={open} autoHideDuration={2000} onClose={handleClose} TransitionComponent={Slide}
                      anchorOrigin={{vertical: 'top', horizontal: 'center'}}>
                <Alert onClose={handleClose} severity="error">
                    {message}
                </Alert>
            </Snackbar>

            {showResolutionModal && (
                <div className={modalStyles.modalBackdrop}>
                    <QuizResolutionModal handleClose={handleCancelResolution} quizId={id} handleSendQuiz={sendQuizResult}/>
                </div>
            )}

            {showResults && (
                <div className={modalStyles.modalBackdrop}>
                    <QuizResults quizId={id} quizTitle={quizData?.title} quizQuestionNumber={questionsWithIsAnswered?.length} correctAnswers={correctAnswersCount}></QuizResults>
                </div>
            )}

        </div>
    );
};

export default quizSolve;
