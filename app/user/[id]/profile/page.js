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
import Alert from "@mui/material/Alert";
import {useRouter, useParams} from "next/navigation";

const Page = () => {
    const service = useRequestService();
    const router = useRouter();
    const params = useParams();
    
    const [userId, setUserId] = useState(null);
    const [tokenId, setTokenId] = useState(null);
    const [email, setEmail] = useState('');
    const [currentUser, setCurrentUser] = useState(null);
    const [quizzes, setQuizzes] = useState([]);
    const [savedQuizzes, setSavedQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState(0);
    
    // Snackbar state
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [severity, setSeverity] = useState("success");

    useEffect(() => {
        const id = params?.id;

        // Validar que el ID existe
        if (!id || id === 'undefined') {
            router.push('/home');
            return;
        }

        // Decodificar el token
        try {
            const token = Cookies.get('jwt');
            if (token) {
                const data = jwtDecode(token);
                setTokenId(data?.id?.toString() || null);
                setEmail(data?.sub || '');
            } else {
                router.push('/login');
                return;
            }
        } catch (error) {
            console.error('Error al decodificar token:', error);
            router.push('/login');
            return;
        }

        setUserId(id);

        // Obtener información del usuario
        service.getUserInformation(id).then(user => {
            setCurrentUser(user);
            setQuizzes(user.createdQuizzes || []);
            setSavedQuizzes(user.savedQuizzes || []);
            setLoading(false);
        }).catch(error => {
            setLoading(false);
            if (error.response && (error.response.status === 404 || error.response.status === 500)) {
                router.push("/home");
            }
            console.error("Error fetching user:", error);
        });
    }, [params?.id, router]);

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') return;
        setOpen(false);
    };

    // Loading state
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

    // No user found
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
            
            <UserProfile
                email={currentUser.email}
                firstName={currentUser.firstName}
                lastName={currentUser.lastName}
                birthDate={currentUser.birthDate}
                createdAt={currentUser.createdDate ?? [2023, 9, 10]}
                isCurrentUser={isCurrentUser}
                userId={userId}
            />

            {isCurrentUser ? (
                <>
                    <TabBar activeTab={activeTab} setActiveTab={setActiveTab} />
                    <div className={style.quizzesContainer}>
                        {activeTab === 0 && quizzes.map((quiz) => (
                            <QuizPreview
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
                                isMyQuiz={email === quiz.author?.email}
                            />
                        ))}
                        
                        {activeTab === 1 && savedQuizzes.map((quiz) => (
                            <QuizPreview
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
                                isMyQuiz={email === quiz.author?.email}
                                saved={true}
                                onRemoveSaved={() => {
                                    setSavedQuizzes(savedQuizzes.filter(q => q.id !== quiz.id));
                                    setMessage("Quiz removido de guardados");
                                    setSeverity('success');
                                    setOpen(true);
                                }}
                            />
                        ))}
                    </div>
                </>
            ) : (
                <div className={style.quizzesContainer}>
                    <TittleQuizzes/>
                    {quizzes.map((quiz) => (
                        <QuizPreview
                            key={quiz.id}
                            id={quiz.id}
                            title={quiz.title}
                            labels={quiz.labels}
                            creationDate={quiz.creationDate}
                            description={quiz.description}
                            rating={quiz.rating}
                            author={quiz.author}
                            questions={quiz.questions}
                            isMyQuiz={email === quiz.author?.email}
                        />
                    ))}
                </div>
            )}

            <Snackbar
                open={open}
                autoHideDuration={5000}
                onClose={handleClose}
                TransitionComponent={Slide}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={handleClose} severity={severity}>
                    {message}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default Page;
