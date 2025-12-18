import React, {useEffect, useState} from 'react';
import {IconButton, Slide, Snackbar, Stack} from '@mui/material';
import styles from '../styles/QuizPreview.module.css';
import RatingSection from './RatingSection';
import {Inter} from 'next/font/google';
import {useRouter} from "next/navigation";
import {useRequestService} from "@/service/request.service";
import CancelIcon from "@mui/icons-material/Cancel";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import {Alert} from "@mui/lab";
import DeleteQuizModal from "@/components/DeleteQuizModal";
import Tooltip from "@mui/material/Tooltip";
import TurnedInIcon from "@mui/icons-material/TurnedIn";

const inter = Inter({subsets: ['latin']});

const QuizPreview = ({
                         id,
                         title,
                         labels,
                         creationDate,
                         description,
                         rating,
                         questionCount = 10,
                         questions,
                         commentCount = 10,
                         authorizedUserIds,
                         // handleDeleteQuiz,
                         isMyQuiz,
                         isPrivate,
                         invitationCode,
                         saved = false,
                         onRemoveSaved
                     }) => {
    const router = useRouter()
    const service = useRequestService();
    const [comments, setComments] = useState([]);
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [severity, setSeverity] = useState("");
    const [showDeleteQuizModal, setShowDeleteQuizModal] = useState(false);


    useEffect(() => {
        service.fetchComments(id).then((commentsList) => {
            setComments(commentsList);
        }).catch((error) => {
            console.error('Error fetching comments:', error);
            setComments([]);
        });
    }, [id]);

    const handleQuizClick = (quizId) => {
        router.push(`/quiz/${quizId}/details`, authorizedUserIds)
    }

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    return (
        <div className={styles.containerGrandote}>
            <div className={`${styles.container} ${inter.className}`} onClick={() => {
                handleQuizClick(id)
            }}>
                <Stack spacing={0.75} sx={{height: '100%'}}>
                    <div className={styles.header}>
                        <div className={styles.title}>
                            {title}
                        </div>
                        <div className={styles.date}>
                            {creationDate?.toString().replace(/,/g, '/')}
                        </div>
                    </div>
                    <div className={styles.tags}>
                        {labels?.join(', ')}
                    </div>
                    <div className={styles.description}>
                        {description}
                    </div>
                    <div className={styles.rating}>
                        <RatingSection ratings={rating} comments={comments?.length} questions={questions?.length}
                                       id={id} showButton={false}/>
                    </div>

                </Stack>
            </div>
            {
                (isMyQuiz || (isMyQuiz && invitationCode !== null) || saved) &&
                <div style={{display: 'flex', flexDirection: 'column'}}>
                    {
                        isMyQuiz &&
                        <Tooltip title="Eliminar quiz">
                            <IconButton onClick={() => setShowDeleteQuizModal(true)}>
                                <CancelIcon sx={{ color: 'red' }}/>
                            </IconButton>
                        </Tooltip>
                    }
                    {
                        isMyQuiz && invitationCode !== null &&
                        <Tooltip title="Copiar código de invitación">
                            <IconButton onClick={() => {
                                navigator.clipboard.writeText(invitationCode);
                                setSeverity('success')
                                setMessage('Se copió el código de invitación al portapapeles.');
                                setOpen(true);
                            }}>
                                <ContentCopyIcon/>
                            </IconButton>
                        </Tooltip>
                    }
                    {
                        saved &&
                        <Tooltip title="Remover de lista de guardado">
                            <IconButton onClick={() => {
                                service.saveQuiz(id, true)
                                    .then(() => {
                                        setMessage("Se removió exitosamente el quiz de la lista de guardado.")
                                        setSeverity('success')
                                        setOpen(true)
                                        onRemoveSaved()
                                    })
                                    .catch(error => {
                                        setMessage("Hubo un error al remover el quiz de la lista de guardado.")
                                        setSeverity('error')
                                        setOpen(true)
                                    })
                            }}>
                                <TurnedInIcon/>
                            </IconButton>
                        </Tooltip>
                    }
                </div>
            }
            {
                showDeleteQuizModal &&
                <div className={styles.modalBackdrop}>
                    <DeleteQuizModal
                        onClose={() => setShowDeleteQuizModal(false)}
                        isOpen={showDeleteQuizModal}
                        // handleDeleteQuiz={handleDeleteQuiz}
                        showSnackbar={(message, severity) => {
                            setSeverity(severity)
                            setMessage(message);
                            setOpen(true);
                        }}
                        title={title}
                        quizId={id}
                    />
                </div>
            }
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
        </div>
    );
};

export default QuizPreview;
