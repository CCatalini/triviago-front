'use client'
import React, {useEffect, useState} from 'react';
import UserProfile from '@/components/UserProfile';
import ResponsiveAppBar from "@/components/ResponsiveAppBar";
import style from '@/styles/UserPage.module.css';
import TabBar from "@/components/TabBar";
import QuizPreview from "@/components/QuizPreview";
import {useRequestService} from "@/service/request.service";
import jwtDecode from "jwt-decode";
import Cookies from "js-cookie";
import TittleQuizzes from "@/components/TittleQuizzes";
import {Slide, Snackbar} from "@mui/material";
import FollowedUser from "@/components/FollowedUser";
import {Alert} from "@mui/lab";
import {useRouter, useParams} from "next/navigation";

const Page = () => {

    const service = useRequestService()
    const router = useRouter()
    const params = useParams()
    const [userId, setUserId] = useState(null)
    const [quizzes, setQuizzes] = useState([]);
    const [tokenId, setTokenId] = useState(null)
    const [savedQuizzes, setSavedQuizzes] = useState([]);
    const [followUsers, setFollowUsers] = useState([]);
    const [tokenId, setTokenId] = useState('1')
    const [currentUser, setCurrentUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [email, setEmail] = useState('')
    const [activeTab, setActiveTab] = useState(0);
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [severity, setSeverity] = useState("");

    useEffect(() => {
        // Obtener el ID de la URL usando useParams
        const id = params?.id;

        // Validar que el ID existe y no es "undefined"
        if (!id || id === 'undefined') {
            router.push('/home');
            return;
        }

        // Decodificar el token para obtener el ID del usuario logueado
        try {
            const token = Cookies.get('jwt');
            if (token) {
                const data = jwtDecode(token);
                setTokenId(data?.id?.toString() || null);
            }
        } catch (error) {
            console.error('Error al decodificar token:', error);
        }

        setUserId(id);
        const id = window.location.pathname.split('/')[2]
        const data = jwt.decode(Cookies.get('jwt'))
        // const quizUserFilter = {
        //     userId: id
        // }
        setUserId(id)
        setTokenId(data.id)
        setEmail(data.sub)

        // Obtener información del usuario
        service.getUserInformation(id).then(user => {
            setCurrentUser(user)
            setQuizzes(user.createdQuizzes)
            setSavedQuizzes(user.savedQuizzes)
            }).catch(error => {
                if(error.response && (error.response.status === 404 || error.response.status === 500)) {
                    router.push("/not-found")
                }
                console.error("Error", error);
            })

        service.getUserFollowers(id).then(response => {
            console.log("following",response.followingList)
            setFollowUsers(response.followingList)
            }).catch(error => {
                if(error.response && (error.response.status === 404 || error.response.status === 500)) {
                    router.push("/not-found")
                }
                console.error("Error", error);
        })
        console.log("id",id)
        console.log("data",data)

        if (id != data.id) {
            console.log("ejecutandose")
            service.getUserQuizzes(id).then(response => {
                setQuizzes(response.content)
            }).catch(error => {
                console.error("Error", error);
            })
        }
    }, [userId]);
            setCurrentUser(user);
            setLoading(false);
        }).catch(error => {
            setLoading(false);
            if(error.response && (error.response.status === 404 || error.response.status === 500)) {
                router.push("/home");
            }
            console.error("Error", error);
        });
    }, [params?.id]);

    // Mostrar loading mientras se carga
    if (loading) {
        return (
            <div className={style.wrapper}>
                <ResponsiveAppBar/>
                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh'}}>
                    <p>Cargando perfil...</p>
                </div>
            </div>
        );
    }
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    if(currentUser === null) return (<div></div>)

    // Si no hay usuario, mostrar mensaje
    if (!currentUser) {
        return (
            <div className={style.wrapper}>
                <ResponsiveAppBar/>
                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh'}}>
                    <p>No se encontró el usuario</p>
                </div>
            </div>
        );
    }

    const isCurrentUser = tokenId && userId && tokenId.toString() === userId.toString();

    return (
        <div className={style.wrapper}>
            <ResponsiveAppBar/>
            { currentUser && <UserProfile
                                        myId ={tokenId}
                                        email={currentUser.email}
                                        firstName={currentUser.firstName}
                                        lastName={currentUser.lastName}
                                        birthDate={currentUser.birthDate}
                                        createdAt={currentUser.createdDate?? [2023, 9, 10]}
                                        isCurrentUser={tokenId.toString() === userId}
                                        userId={userId}
            <UserProfile
                email={currentUser.email}
                firstName={currentUser.firstName}
                lastName={currentUser.lastName}
                birthDate={currentUser.birthDate}
                createdAt={currentUser.createdDate ?? [2023, 9, 10]}
                isCurrentUser={isCurrentUser}
                userId={userId}
            />

            { isCurrentUser ? (
                <>
                    <TabBar activeTab={activeTab} setActiveTab={(activeTab) => {setActiveTab(activeTab)}} />
                    <div className={style.quizzesContainer}>
                        {quizzes.map((quiz, index) => (
                            <QuizPreview
                                key={quiz.id || index}
                                id={quiz.id}
                                title={quiz.title}
                                labels={quiz.labels}
                                creationDate={quiz.creationDate}
                                description={quiz.description}
                                rating={quiz.rating}
                                author={quiz.author}
                                questions={quiz.questions}
                            />
                        ))}
                        {activeTab === 0 && (
                            quizzes.map((quiz) => {
                                return <QuizPreview
                                    key={quiz.id}
                                    id={quiz.id}
                                    title={quiz.title}
                                    labels={quiz.labels}
                                    creationDate={quiz.creationDate}
                                    description={quiz.description}
                                    rating={quiz.rating}
                                    author={quiz.author}
                                    questions={quiz.questions}
                                    isPrivate={quiz.isPrivate}
                                    invitationCode={quiz.invitationCode}
                                    // handleDeleteQuiz={() => handleDeleteQuiz(quiz.id)}
                                    isMyQuiz={email === quiz.author.email}
                                />
                            })
                        )}
                        {activeTab === 1 && (
                            savedQuizzes.map((quiz) => {
                                return <QuizPreview
                                    key={quiz.id}
                                    id={quiz.id}
                                    title={quiz.title}
                                    labels={quiz.labels}
                                    creationDate={quiz.creationDate}
                                    description={quiz.description}
                                    rating={quiz.rating}
                                    author={quiz.author}
                                    questions={quiz.questions}
                                    isPrivate={quiz.isPrivate}
                                    invitationCode={quiz.invitationCode}
                                    // handleDeleteQuiz={() => handleDeleteQuiz(quiz.id)}
                                    isMyQuiz={email === quiz.author.email}
                                    saved={true}
                                    onRemoveSaved={() => {
                                        const updatedSavedQuizzes = savedQuizzes.filter(q => q.id !== quiz.id);
                                        setSavedQuizzes(updatedSavedQuizzes);
                                        setMessage("Se removió exitosamente el quiz de la lista de guardado.")
                                        setSeverity('success')
                                        setOpen(true)
                                    }}
                                />
                            })
                        )}
                        {activeTab === 2 && (
                            followUsers?.map((user) => (
                                <FollowedUser email={user.email} lastname={user.lastName} name={user.firstName} id={user.id}/>
                            ))
                        )}
                    </div>
                </>
            ) : (
                <div className={style.quizzesContainer}>
                    <TittleQuizzes/>
                    {quizzes?.map((quiz) => {
                        return <QuizPreview
                            key={quiz.id}
                            id={quiz.id}
                            title={quiz.title}
                            labels={quiz.labels}
                            creationDate={quiz.creationDate}
                            description={quiz.description}
                            rating={quiz.rating}
                            author={quiz.author}
                            questions={quiz.questions}
                            handleDeleteQuiz={() => handleDeleteQuiz(quiz.id)}
                            isMyQuiz={email === quiz.author?.email}
                        />
                    })}
                </div>
            )
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

export default Page;
