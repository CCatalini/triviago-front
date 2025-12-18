"use client"

import ResponsiveAppBar from "@/components/ResponsiveAppBar";
import React, {useEffect, useState} from "react";
import QuizQuestion from "@/components/QuizQuestion";
import styles from '../../styles/QuizCreatorPage.module.css';
import QuizCreatorInfo from "@/components/QuizCreatorInfo";
import Image from "next/image";
import {useRouter} from "next/navigation";
import {Button, IconButton, Slide, Snackbar} from "@mui/material";
import {Alert} from "@mui/material";
import {useRequestService} from "@/service/request.service";
import AddCircleIcon from "@mui/icons-material/AddCircle";


const CreationPage = () => {
    // const token = localStorage.getItem("token");
    const router = useRouter();
    const [id, setId] = useState();

    const [open, setOpen] = useState(false)
    const [message, setMessage] = useState('')
    const [creatingQuiz, setCreatingQuiz] = useState(false)

    const [quizData, setQuizData] = useState({
        "title": "",
        "description": "",
        "isPrivate": false,
        "labels": [],
        "questions": []
    });

    const validateQuiz = (quiz) => {
        // Verificar que el título y la descripción no son strings vacíos
        if (typeof quiz.title !== 'string' || quiz.title.trim() === '') {
            setMessage('El título del quiz no puede estar vacío');
            setOpen(true);
            return false;
        }

        if (typeof quiz.description !== 'string' || quiz.description.trim() === '') {
            setMessage('La descripción del quiz no puede estar vacía');
            setOpen(true);
            return false;
        }

        // Verificar que haya al menos una pregunta
        if (!Array.isArray(quiz.questions) || quiz.questions.length === 0) {
            setMessage('Debe haber al menos una pregunta en el quiz');
            setOpen(true);
            return false;
        }


        for (const question of quiz.questions) {
            // Verificar que cada pregunta tenga al menos dos respuestas
            if (!Array.isArray(question.answers) || question.answers.length < 2) {
                setMessage('Cada pregunta debe tener al menos dos opciones');
                setOpen(true);
                return false;
            }

            // Verificar que el contenido de la pregunta no esté vacío
            if (typeof question.content !== 'string' || question.content.trim() === '') {
                setMessage('El contenido de la pregunta no puede estar vacío');
                setOpen(true);
                return false;
            }

            // Verificar que cada pregunta tenga al menos una respuesta correcta
            const hasCorrectAnswer = question.answers.some((answer) => answer.isCorrect);
            if (!hasCorrectAnswer) {
                setMessage('Cada pregunta debe tener al menos una respuesta correcta');
                setOpen(true);
                return false;
            }
        }
        // Si todas las condiciones se cumplen, el quiz es valido para ser creado
        return true;
    };

    const service = useRequestService()

    const createQuiz = () => {
        setCreatingQuiz(true);
        // Si no se puede validar el quiz (o sea el validateQuiz da false), retorna, ya que no debe mandar la query.
        if (!validateQuiz(quizData)) {
            setCreatingQuiz(false);
            return
        }
        service.createQuiz(quizData)
            .then((response)=>{
                setCreatingQuiz(false);
                setId(response.id);
                router.push(`/quiz/${response.id}/details`)
            })
            .catch((error)=>{
                setCreatingQuiz(false);
                setMessage('Hubo un error al crear el quiz');
                setOpen(true);
                console.log(error)
            })
    }


    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    function addQuestion() {
        setQuizData((prevData) => ({
            ...prevData,
            questions: [
                ...prevData.questions,
                {
                    content: '', // Agrega la lógica necesaria para establecer el contenido
                    answers: [], // Inicializa las respuestas vacías
                },
            ],
        }));
    }

    function removeQuestion(pos) {
        setQuizData((prevData) => ({
            ...prevData,
            questions: prevData.questions.filter((_, index) => index !== pos),
        }));
    }

    const mappedQuestions = quizData.questions.map((question, index) =>
        {return (
            <div key={index} className={styles.answerField}>
                <QuizQuestion deleteFunction={removeQuestion} questionIndex={index} quizData={quizData} setQuizData={setQuizData}/>
            </div>
        )}

    )


    return (
        <div>
            <ResponsiveAppBar/>
            <br/>
            <div className={styles.quizQuestionContainer}>
                <QuizCreatorInfo quizData={quizData} setQuizData={setQuizData} setOpen={setOpen} setMessage={setMessage}/>
                {quizData.questions.length !== 0 ?
                    mappedQuestions
                    : null}
                <Button variant="outlined" startIcon={<AddCircleIcon/>} onClick={addQuestion} style={{color: '#00CC66', borderColor: '#00CC66'}}>
                    Agregar pregunta
                </Button>
                <Button
                    variant="contained"
                    startIcon={<AddCircleIcon/>}
                    onClick={createQuiz}
                    style={{backgroundColor: creatingQuiz ? '#0000001E' : '#00CC66'}}
                    disabled={creatingQuiz}
                >
                    Crear quiz
                </Button>
            </div>
            <Snackbar open={open} autoHideDuration={5000} onClose={handleClose} TransitionComponent={Slide} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                <Alert onClose={handleClose} severity="error">
                    {message}
                </Alert>
            </Snackbar>
        </div>
    )
}
export default CreationPage;