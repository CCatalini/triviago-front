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
import {useRouter, useParams} from "next/navigation";

const Page = () => {

    const service = useRequestService()
    const router = useRouter()
    const params = useParams()
    const [userId, setUserId] = useState(null)
    const [quizzes, setQuizzes] = useState([]);
    const [tokenId, setTokenId] = useState(null)
    const [currentUser, setCurrentUser] = useState(null)
    const [loading, setLoading] = useState(true)

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

        // Obtener información del usuario
        service.getUserInformation(id).then(user => {
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
                    <TabBar/>
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
                    </div>
                </>
                ) : (
                <TittleQuizzes/>
                )
            }

        </div>
    );
};

export default Page;
