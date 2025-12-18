import React, { useState , useEffect} from "react";
import styles from '../styles/QuizQuestionAnswer.module.css';
import FormControl from '@mui/material/FormControl';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from "@mui/material/Checkbox";
import {Card, CardContent, Typography} from "@mui/material";

const QuizQuestionAnswer = ({ question }) => {
    const [selectedAnswers, setSelectedAnswers] = useState([]); // Track the selected answers

    const textStyle = {
        color: '#000',
        fontFamily: 'Inter, sans-serif',
        fontSize: '18px',
        fontStyle: 'normal',
        fontWeight: 400,
        flexShrink: 0,
        overflowY: 'hidden',
        resize: 'none',
        border: 'none',
        lineHeight: 'normal',
        wordWrap: 'break-word',
        wordBreak: 'break-word',
        maxWidth: '100%',
        width: '100%',
    };
    useEffect(() => {
        isCheckboxChecked()
    }, [selectedAnswers])

    const handleRadioChange = (event) => {
        const selectedValue = event.target.value;
        question.is_answered = true;
        // convert selectedValue to number

        isAnswerSelected(parseInt(selectedValue,10));
        // question.selectedAnswers = selectedValue;
        setSelectedAnswers(selectedValue);
    };

    const handleCheckboxChange = (event, answerID) => {
        const selectedValue = event.target.value;
        if (selectedAnswers.includes(selectedValue)) {
            setSelectedAnswers(prevAnswers => prevAnswers.filter(answer => answer !== selectedValue));
        } else {
            setSelectedAnswers(prevAnswers => [...prevAnswers, selectedValue]);
        }

        isAnswerSelected(answerID);


    };
    const isAnswerSelected = (answerID) => {
        if (question.selectedAnswers.includes(answerID)) {
            question.selectedAnswers = question.selectedAnswers.filter(answer => answer !== answerID);
        } else {
            question.selectedAnswers.push(answerID);
        }
    }
    const isCheckboxChecked = () => {
        question.is_answered = selectedAnswers.length > 0;
    }

    return (
        <Card style={{marginTop: '24px', padding: '16px 24px'}}>
            <CardContent style={{display: 'flex', flexDirection: 'column', width: '700px'}}>
                <Typography variant="h5" component="h1" gutterBottom>{question?.content}</Typography>
                <div>
                    {question?.multipleCorrectAnswers ?
                        (question?.answers.map((answer) => {
                                return (
                                    <div key={answer.id} className={styles.answerRow}>
                                        <Checkbox
                                            id={answer.id}
                                            value={answer.content}
                                            onChange={(event) =>handleCheckboxChange(event, answer.id)}
                                        />
                                        <p className={styles.answerOptionText}>{answer.content}</p>
                                    </div>
                                );
                            })
                        ) : (
                            <FormControl>
                                <RadioGroup
                                    aria-labelledby="demo-radio-buttons-group-label"
                                    name="radio-buttons-group"
                                    value={selectedAnswers}
                                    onChange={handleRadioChange}
                                >
                                    {question?.answers.map((answer) => (
                                        <FormControlLabel
                                            key={answer.id}
                                            value={answer.id}
                                            control={<Radio />}
                                            label={answer.content}
                                            slotProps={{ typography: textStyle }}
                                        />
                                    ))}
                                </RadioGroup>
                            </FormControl>
                        )}
                </div>
            </CardContent>
        </Card>
    );
};

export default QuizQuestionAnswer;
