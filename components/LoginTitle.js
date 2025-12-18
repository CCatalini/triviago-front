'use client'
import React from 'react';
import styles from '../styles/LoginTitle.module.css';
import Image from 'next/image';

const LoginTitle = () => {
    return (
        <div className={styles.bigContainer}>
            <div className={styles.logoContainer}>
                <Image
                    src="/assets/images/logo.png"
                    alt="Logo Triviago"
                    width={120}
                    height={120}
                    className={styles.logo}
                />
                <h1 className={styles.logoTriviago}>Triviago</h1>
            </div>
            <p className={styles.text}>
                La mejor plataforma para crear y resolver quizzes
            </p>
        </div>
    );
};

export default LoginTitle;

