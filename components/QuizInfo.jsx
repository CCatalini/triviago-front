"use client";
import React, {useEffect, useState} from 'react';
import {IconButton, Slide, Snackbar, Stack, Alert, Tooltip, Box, Typography, Chip} from '@mui/material';
import styles from '../styles/QuizInfo.module.css';
import RatingSection from './RatingSection';
import { Inter } from 'next/font/google';
import TurnedInIcon from '@mui/icons-material/TurnedIn';
import TurnedInNotIcon from '@mui/icons-material/TurnedInNot';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import LockIcon from '@mui/icons-material/Lock';
import {useRequestService} from "@/service/request.service";
import Cookies from "js-cookie";
import jwt from "jsonwebtoken";


const inter = Inter({ subsets: ['latin'] });

const QuizInfo = ({ id, title, labels, creationDate, description, rating, questions, author = "@example.com", saved, setSaved, invitationCode, isPrivate}) => {

    const service = useRequestService()
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("ERROR");
    const [comments, setComments] = useState([]);
    const [copied, setCopied] = useState(false);
    
    // Obtener el ID del usuario actual
    const token = Cookies.get('jwt');
    const currentUserId = token ? jwt.decode(token)?.id : null;
    const isAuthor = currentUserId && author?.id === currentUserId;
    
    const copyInvitationCode = () => {
        navigator.clipboard.writeText(invitationCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    useEffect(() => {
        service.fetchComments(id).then((commentsList) => {
            setComments(commentsList);
        }).catch((error) => {
            console.error('Error fetching comments:', error);
            setComments([]);
        });
    }, [id]);

    function formatDates(date) {
        const monthNames = [
            "enero", "febrero", "marzo", "abril",
            "mayo", "junio", "julio", "agosto",
            "septiembre", "octubre", "noviembre", "diciembre"
        ];
        if (date && date.length <= 3){
            const day = date[2].toString().padStart(2, '0');
            const month = monthNames[date[1] - 1];
            const year = date[0];
            return `${day} de ${month} de ${year}`;
        }
    }

    function handleSaveQuiz(quizId) {
        if (quizId !== null) {
            service.saveQuiz(quizId, saved)
                .then(() => {
                    setSaved(!saved)
                }).catch(error => {
                console.error("Error saving quiz:", error);
                setMessage("Error al guardar el quiz")
                setOpen(true)
            })
        } else {
            setMessage("Error al cargar el quiz");
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
        <>
            <div className={`${styles.container} ${inter.className}`} >
                <Stack spacing={1.75} sx={{ height: '100%' }}>
                    <div className={styles.info} >
                        <Stack spacing={0.75} sx={{ height: '100%' }}>
                            <div className={styles.header}>
                                <div className={styles.title}>
                                    {title}
                                    {isPrivate && (
                                        <Chip 
                                            icon={<LockIcon style={{fontSize: '14px'}}/>} 
                                            label="Privado" 
                                            size="small" 
                                            style={{marginLeft: '10px', backgroundColor: '#FFE0B2', color: '#E65100'}}
                                        />
                                    )}
                                </div>
                                <div className={styles.date}>
                                    <IconButton onClick={()=> handleSaveQuiz(id)}>
                                        {saved ? <TurnedInIcon/> : <TurnedInNotIcon/>}
                                    </IconButton>
                                </div>
                            </div>
                            {/* Mostrar código de invitación solo al autor si el quiz es privado */}
                            {isPrivate && isAuthor && invitationCode && (
                                <Box sx={{
                                    backgroundColor: '#E3F2FD',
                                    borderRadius: '8px',
                                    padding: '12px 16px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    marginTop: '8px',
                                    border: '1px solid #90CAF9'
                                }}>
                                    <Box>
                                        <Typography variant="caption" sx={{color: '#1565C0', fontWeight: 'bold'}}>
                                            Código de invitación:
                                        </Typography>
                                        <Typography variant="h6" sx={{color: '#0D47A1', fontFamily: 'monospace', letterSpacing: '3px'}}>
                                            {invitationCode}
                                        </Typography>
                                    </Box>
                                    <Tooltip title={copied ? "¡Copiado!" : "Copiar código"}>
                                        <IconButton onClick={copyInvitationCode} sx={{color: '#1565C0'}}>
                                            <ContentCopyIcon />
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                            )}
                            {labels && (<div className={styles.tags}>
                                {labels?.join(', ')}
                            </div>)}
                            <div className={styles.description}>
                                {description}
                            </div>
                        </Stack>
                    </div>
                    <div className={styles.divisor}/>
                    <div className={styles.ownerData}>
                        Creado el {formatDates(creationDate)} por {author?.email}
                    </div>
                    <div className={styles.divisor}/>
                    <div className={styles.rating}>
                        <RatingSection ratings={rating} questions={questions?.length} comments={comments?.length} showButton={true} id={id} author={author} quizTitle={title}/>            </div>
                </Stack>
            </div>
            <Snackbar open={open} autoHideDuration={5000} onClose={handleClose} TransitionComponent={Slide}
                      anchorOrigin={{vertical: 'top', horizontal: 'center'}}>
                <Alert onClose={handleClose} severity="error">
                    {message}
                </Alert>
            </Snackbar>
        </>
    );
};

export default QuizInfo;
