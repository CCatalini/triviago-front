"use client";

import React, {useEffect, useState, useMemo} from 'react';
import {CircularProgress, Pagination} from '@mui/material';
import QuizPreview from '@/components/QuizPreview';
import styles from '@/styles/HomeScreen.module.css';
import ResponsiveAppBar from "@/components/ResponsiveAppBar";
import QuizFilter from "@/components/QuizFilter";
import PrivateQuizSearcher from "@/components/PrivateQuizSearcher";
import {useRouter} from "next/navigation";
import axios from "axios";

const HomeScreen = () => {
    const [fetchingQuizzes, setFetchingQuizzes] = useState(true);
    const [currentPage, setCurrentPage] = useState({ content: [], totalPages: 0, pageable: { pageNumber: 0 } });
    const [comments, setComments] = useState([]);
    const [sortOrder, setSortOrder] = useState(null);
    const router = useRouter();
    
    // Sorter ORDEN ALFABETICO
    const sortedQuizzes = useMemo(() => {
        if (!currentPage.content || sortOrder === null) return currentPage.content;
        
        return [...currentPage.content].sort((a, b) => {
            const comparison = a.title.localeCompare(b.title, 'es', { sensitivity: 'base' });
            return sortOrder === 'asc' ? comparison : -comparison;
        });
    }, [currentPage.content, sortOrder]);
    
    const handleSortClick = () => {
        if (sortOrder === null) setSortOrder('asc');
        else if (sortOrder === 'asc') setSortOrder('desc');
        else setSortOrder(null);
    };

    const fetchQuizzes = (pageNumber) => {
        setFetchingQuizzes(true);
        const apiUrl = `http://localhost:8080/quiz?page=${pageNumber}`;
        const token = localStorage.getItem('token');
        const axiosConfig = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        axios.get(apiUrl, axiosConfig)
            .then((response) => {
                setCurrentPage(response.data);
                setFetchingQuizzes(false);
            })
            .catch((error) => {
                setFetchingQuizzes(false);
                console.error('Error fetching data:', error);
            });
    }

    useEffect(() => {
        fetchQuizzes(0);
    }, []);

    const handlePageChange = (event, value) => {
        setCurrentPage((prevState) => ({
            ...prevState,
            pageable: {
                ...prevState.pageable,
                pageNumber: value - 1,
            },
        }));
        fetchQuizzes(value - 1);
    };

    return (
        <div className={styles.wrapper}>
            <ResponsiveAppBar />
            <div className={styles.content}>
                <button className={styles.button} onClick={() => { router.push("/quizcreation") }}>+</button>
                <div className={styles.columns}>
                    <div className={styles.left}>
                        <PrivateQuizSearcher />
                        <br />
                        <QuizFilter setFilteredQuizzes={setCurrentPage} setFetchingQuizzes={setFetchingQuizzes} />
                    </div>
                    <div className={styles.center}>
                        {/* Sorter */}
                        <div className={styles.sorterContainer}>
                            <button 
                                className={`${styles.sorterButton} ${sortOrder !== null ? styles.sorterActive : ''}`}
                                onClick={handleSortClick}
                            >
                                Alfabético {sortOrder === 'asc' ? '↑ A-Z' : sortOrder === 'desc' ? '↓ Z-A' : ''}
                            </button>
                        </div>
                        {
                            fetchingQuizzes
                                ?
                                <CircularProgress size="64px" style={{ color: '#00CC66' }} />
                                : <>
                                    <div className={styles.quizzes}>
                                        {sortedQuizzes.map((quiz, index) => (
                                            <div key={`${index}-${quiz.title}`} className={styles.quizItem}>
                                                <QuizPreview {...quiz} commentCount={comments.length} questionCount={quiz.questions?.length}/>
                                            </div>
                                        ))}
                                    </div>
                                    <div className={styles.pagination}>
                                        <Pagination
                                            count={currentPage.totalPages}
                                            page={currentPage.pageable.pageNumber + 1}
                                            onChange={handlePageChange}
                                            variant="outlined"
                                        />
                                    </div>
                                </>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomeScreen
