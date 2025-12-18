"use client"

import styles from '../styles/QuizCreatorInfo.module.css';
import React, {useEffect, useState} from "react";
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import {Switch} from "@mui/material";
import {useRequestService} from "@/service/request.service";

const QuizCreatorInfo = ({ quizData, setQuizData, setMessage, setOpen }) => {

    const service = useRequestService();
    const [tags, setTags] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);

    useEffect(() => {
        service.getLabels()
            .then((response) => {
                setTags(response);
            })
            .catch((error) => {
                setMessage('Hubo un error al obtener las etiquetas');
                setOpen(true);
                console.log(error)
            });

    }, []);


    function changePrivacy(event) {
        setQuizData((prevData) => ({
            ...prevData,
            isPrivate: !quizData.isPrivate,
        }));
    }
    function handleTitle(event){
        setQuizData((prevData) => ({
            ...prevData,
            title: event.target.value,
        }));
    }
    function handleDescription(event){
        setQuizData((prevData) => ({
            ...prevData,
            description: event.target.value,
        }));
        event.target.style.height = '22px'
        event.target.style.height = (event.target.scrollHeight + 1)+'px'
    }

    const handleTag = (event) => {
        const selectedTags = event.target.value;
        setSelectedTags(selectedTags);
        const formatedTags = selectedTags.map(label => ({value: label.trim()}));
        setQuizData((prevData) => ({
            ...prevData,
            labels: formatedTags,
        }));
    };

    return(
        <div className={styles.componentBox}>
            <div className={styles.titleText}>Nuevo quiz</div>
            <div className={styles.labelsContainer}>

                <div className={styles.labelsInterior}>
                    <label htmlFor="title" className={styles.labelTitle}>Título *</label>
                    <input type="text" id="title" name="title" className={styles.inputText} placeholder="Agrega un título..." onChange={handleTitle}/>
                    <div className={styles.line}/>
                </div>

                <div className={styles.labelsInterior}>
                    <label htmlFor="title" className={styles.labelTitle}>Etiquetas</label>
                    <Select
                        id="tags"
                        multiple
                        className ={styles.inputTag}
                        value={selectedTags}
                        onChange={handleTag}
                        variant="standard"
                    >
                        {tags?.map((tag) => (
                            <MenuItem key={tag.value} value={String(tag.value)}>
                                {tag.value}
                            </MenuItem>
                        ))}
                    </Select>
                </div>

                <div className={styles.labelsInterior}>
                    <label htmlFor="title" className={styles.labelTitle}>Descripción *</label>
                    <textarea type="text" id="description" name="description" className={styles.textAreaInput} placeholder="Agrega una descripción..." onChange={handleDescription}/>
                    <div className={styles.line}/>
                </div>

                <div className={styles.labelsInterior}>
                    <label htmlFor="title" className={styles.labelTitle}>Visibilidad</label>
                    <div className={styles.privateContainer}>
                        <p className={styles.text}>Privado</p>
                        <Switch
                            sx={{
                                '& .MuiSwitch-switchBase': {
                                    '&.Mui-checked': {
                                        color: '#00CC66',
                                        '& + .MuiSwitch-track': {
                                            background: '#00CC66',
                                        },
                                    },
                                    '&.Mui-disabled.MuiSwitch-thumb': {
                                        color: '#FFFFFF',
                                    },
                                },
                                '& .MuiSwitch-thumb': {
                                    color: !(quizData.isPrivate) && '#FFFFFF',
                                },
                                '& .MuiSwitch-track': {
                                    backgroundColor: '#000000',
                                },
                            }}
                            checked={quizData.isPrivate}
                            onChange={changePrivacy}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
export default QuizCreatorInfo;