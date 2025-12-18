"use client";
import React, {useState} from 'react';
import {Box, Button, Card, CardContent, IconButton, Slide, Snackbar, Typography, Alert} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import {useRequestService} from "@/service/request.service";
import styles from '../styles/CommentComponent.module.css';
import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";
import AddCircleIcon from "@mui/icons-material/AddCircle";

const CommentComponent = ({
                              comment,
                              handleEditComment,
                              handleDeleteComment,
                              quizId,
                              showReplyInput
                          }) => {

    const service = useRequestService()
    const [replyText, setReplyText] = useState('');
    const [open, setOpen] = React.useState(false);
    const [message, setMessage] = React.useState("ERROR");
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState('');
    const jwt = Cookies.get("jwt") ? Cookies.get("jwt") : undefined;
    const jwtDecoded = jwt_decode(jwt)
    const actualUserEmail = jwtDecoded.sub
    const [currentComment, setCurrentComment] = useState(comment);



    const handleLikeClick = async () => {
        if (currentComment.isLikedByUser === true) {
            // If the user already liked the comment and clicks the like icon again, we remove the like
            try {
                service.removeLikeComment(currentComment.id).then(response => {
                    setCurrentComment(prevState => ({
                        ...prevState,
                        likes: response.totalLikes,
                        isLikedByUser: response.isLikedByUser
                    }))
                });
            } catch (error) {
                console.error('Hubo un error, por favor intenta más tarde', error);
            }
        } else {
            try {
                service.likeComment(currentComment.id).then(response => {
                    setCurrentComment(prevState => ({
                        ...prevState,
                        likes: response.totalLikes,
                        isLikedByUser: response.isLikedByUser
                    }))
                });
            } catch (error) {
                console.error('Hubo un error, por favor intenta más tarde', error);
            }
        }
    };

    const handleDislikeClick = async () => {
        if (currentComment.isLikedByUser === false) {
            // If the user already disliked the comment and clicks the like icon again, we remove the dislike
            try {
                service.removeLikeComment(currentComment.id).then(response => {
                    setCurrentComment(prevState => ({
                        ...prevState,
                        likes: response.totalLikes,
                        isLikedByUser: response.isLikedByUser
                    }))
                });
            } catch (error) {
                console.error('Hubo un error, por favor intenta más tarde', error);
            }
        } else {
            try {
                service.dislikeComment(currentComment.id).then(response => {
                    setCurrentComment(prevState => ({
                        ...prevState,
                        likes: response.totalLikes,
                        isLikedByUser: response.isLikedByUser
                    }))
                });
            } catch (error) {
                console.error('Hubo un error, por favor intenta más tarde', error);
            }
        }
    };

    const handleCancel = () => {
        setReplyText('');
        document.getElementById(`comment_${currentComment.id}`).style.height = '22px'
    };

    const handleReply = async () => {
        const trimmedReplyText = replyText.trim();
        if (trimmedReplyText !== '') {
            if (trimmedReplyText.length <= 255) {
                try {
                    const aux = await service.logComment({
                        parentCommentId: currentComment.id,
                        content: replyText,
                        quizId: quizId
                    })
                    setCurrentComment(prevState => ({...prevState, responses: [...prevState.responses, aux]}))
                    setReplyText('');
                    document.getElementById(`comment_${currentComment.id}`).style.height = '22px'
                } catch (e) {
                    console.error(e)
                }
            } else {
                setMessage("La respuesta no puede tener mas de 255 caracteres");
                setOpen(true);
            }
        }
    };

    function handleDeleteReply(id) {
        service.deleteComment(id).then(() => {
            window.location.reload(false);        })
    }

    function handleAnswer(event) {
        setReplyText(event.target.value)
        event.target.style.height = '22px'
        event.target.style.height = (event.target.scrollHeight + 1) + 'px'
    }

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    return (
        <>
            <div className={styles.componentBox}>
                <div style={{padding: '0 24px 0 24px'}}>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Box>
                            <Typography variant="username" className={styles.userNameText}>
                                {currentComment.author.email}
                            </Typography>
                            <Typography variant="date" className={styles.dateText}>
                                {new Date(currentComment.creationDate).toLocaleDateString("en-US")}
                            </Typography>
                        </Box>
                        <Box>
                            {actualUserEmail === currentComment.author.email &&
                                <>
                                    <IconButton
                                        aria-label="Editar comentario"
                                        color="#667085;"
                                        sx={{position: 'relative', zIndex: 0}}
                                        onClick={() => {
                                            setIsEditing(true)
                                            setEditedContent(currentComment.content)
                                        }}
                                    >
                                        <EditIcon/>
                                    </IconButton>
                                    <IconButton
                                        aria-label="Eliminar comentario"
                                        color="error"
                                        sx={{position: 'relative', zIndex: 0}}
                                        onClick={() => handleDeleteComment(currentComment.id)}
                                    >
                                        <DeleteIcon/>
                                    </IconButton>
                                </>
                            }
                        </Box>
                    </Box>
                    {
                        isEditing
                            ? <div>
                                <input
                                    type="text"
                                    value={editedContent}
                                    onChange={(e) => {
                                        setEditedContent(e.target.value)
                                    }}
                                    className={styles.editInput}
                                />
                                <button
                                    onClick={() => {
                                        setIsEditing(false);
                                        setEditedContent('');
                                    }}
                                    className={styles.cancelButton}
                                >
                                    Cancelar
                                </button>
                                <button
                                    className={styles.editButton}
                                    onClick={() => {
                                        if (editedContent.trim() !== '') { // Check if editedContent is not empty or only spaces
                                            handleEditComment(currentComment.id, editedContent);
                                            setCurrentComment((prevState) => ({
                                                ...prevState,
                                                content: editedContent,
                                            }));
                                            setIsEditing(false);
                                        }
                                    }}
                                    disabled={editedContent.trim() === ''} // Disable the button if content is empty or only spaces
                                >
                                    Editar
                                </button>
                            </div>
                            : <textarea className={styles.text}>
                                {currentComment.content}
                            </textarea>
                    }
                    <div
                        className={`${styles.likesContainer} ${currentComment.likes.length > 2 ? styles.expanded : ''}`}>
                        <IconButton aria-label="Me gusta" onClick={handleLikeClick}>
                            {
                                currentComment.isLikedByUser === null || !currentComment.isLikedByUser
                                    ? <ThumbUpOffAltIcon/>
                                    : <ThumbUpIcon/>
                            }
                        </IconButton>
                        <Typography variant="body2" className={styles.likeCount}>
                            {currentComment.likes}
                        </Typography>
                        <IconButton aria-label="No me gusta" onClick={handleDislikeClick}>
                            {
                                currentComment.isLikedByUser === null || currentComment.isLikedByUser
                                    ? <ThumbDownOffAltIcon/>
                                    : <ThumbDownIcon/>
                            }
                        </IconButton>
                    </div>
                </div>
                {
                    showReplyInput &&
                    <>
                        <div className={styles.commentBox}>
                            <textarea
                                type="text"
                                id={`comment_${currentComment.id}`}
                                name={`comment_${currentComment.id}`}
                                placeholder="Agrega un comentario..."
                                className={styles.inputComment}
                                onChange={handleAnswer}
                                value={replyText}
                            />
                            <div className={styles.line}/>
                        </div>
                        <Box className={styles.buttonsContainers}>
                            <Button variant="outlined" style={{color: '#000000', borderColor: '#000000'}} onClick={handleCancel}>Cancelar</Button>
                            <Button variant="contained" style={{backgroundColor: '#00CC66'}} onClick={handleReply}>Responder</Button>
                        </Box>
                    </>
                }
                {currentComment.responses?.map((response, index) => {
                    return <div style={{
                        paddingLeft: '24px',
                        // backgroundColor: '#f5f5f5',
                        border: '0px solid #e0e0e0',
                        // borderRadius: '5px',
                        marginTop: '5px',
                    }}>
                        <CommentComponent
                            comment={response}
                            handleDeleteComment={() => handleDeleteReply(response.id)}
                            handleEditComment={(id, newContent) => handleEditComment(id, newContent)}
                            quizId={quizId}
                            showReplyInput={false}
                        />
                    </div>
                })}
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

export default CommentComponent;
