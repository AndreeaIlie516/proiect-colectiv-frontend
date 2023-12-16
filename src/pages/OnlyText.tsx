import React, { useState, useEffect } from 'react';
import { Box, Button, DialogContentText, DialogTitle } from '@mui/material';
import background from '../../resources/background.png';
import Header from '../components/Header';
import { Question, Answer } from '../interfaces/Question';
import { shufleArray } from '../utils/shuffleArr';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogActions, DialogContent } from '@mui/material';


const BASE_API_URL = import.meta.env.VITE_API_URL;
const QUESTION_ENDPOINTS: string[] = [
    `${BASE_API_URL}/Questions/randomPersonSumary`,
]

export const OnlyText: React.FC = () => {
    const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [answers, setAnswers] = useState<Answer[]>([]);
    const [selectedAnswer, setSelectedAnswer] = useState<Answer | null>(null);
    const [hasAnswered, setHasAnswered] = useState<boolean>(false);
    const [score, setScore] = useState<number>(0);
    const [timer, setTimer] = useState<number>(10);
    const [gameOver, setGameOver] = useState<boolean>(false);

    const navigate = useNavigate();

    useEffect(() => {
        const interval = setInterval(() => {
            setTimer((prevTimer) => {
                if (prevTimer === 1) {
                    setGameOver(true);
                }
                return prevTimer > 0 ? prevTimer - 1 : 0;
            })
        }, 1000)
        return () => clearInterval(interval);
    }, []);

    const fetchQuestions = async (): Promise<void> => {
        if (gameOver) {
            return;
        }
        setIsLoading(true);
        setSelectedAnswer(null);
        setAnswers([]);
        setHasAnswered(false);
        const randomPosition = Math.floor(Math.random() * QUESTION_ENDPOINTS.length);
        console.log(`random pos is ${randomPosition}`)
        const randomEndpoint = QUESTION_ENDPOINTS[randomPosition];
        const attemptFetch = async (): Promise<void> => {
            try {
                const response = await fetch(randomEndpoint, {
                    method: 'POST'
                })
                if (!response.ok) {
                    throw new Error("ups");
                }
                const data: Question = await response.json();
                const allAnswers: Answer[] = [];
                allAnswers.push({
                    answer: data.name,
                    isCorrect: true,
                });
                data.otherPeople.forEach((otherPerson) => {
                    allAnswers.push({
                        answer: otherPerson,
                        isCorrect: false
                    });
                });
                setCurrentQuestion(data);
                shufleArray(allAnswers);
                setAnswers(allAnswers);
            } catch (error) {
                await attemptFetch();
            }
        };
        attemptFetch();
        setIsLoading(false);
    }

    useEffect(() => {
        fetchQuestions();
    }, []);

    const handleAnswer = (answer: Answer): void => {
        if (gameOver) {
            return;
        }
        setSelectedAnswer(answer);
        setHasAnswered(true);
        if (answer.isCorrect) {
            console.log('bravo');
        }
        else {
            console.log('no');

        }
        setTimeout(() => {
            fetchQuestions();
        }, 2000);
    }

    if (isLoading) {
        return <h1>is loading..</h1>
    }


    const renderAnswers = (answers: Answer[]) => {
        return answers.map((answer, index) => {
            let style = {
                textTransform: 'none',
                width: '350px',
                height: '100px',
                fontFamily: "'Chalkduster', sans-serif",
                fontSize: '25px',
                backgroundColor: '#1095e0',
                borderRadius: '10px',
                marginTop: '20px',
                marginRight: '10px',
                marginLeft: '10px',
                color: 'white',
                padding: '10px 0',
                border: '3px solid transparent'
            };

            if (hasAnswered) {
                if (answer.isCorrect) {
                    style.border = '3px solid green';
                } else {
                    style.border = '3px solid red';
                }
            }

            return (
                <Button
                    key={`answer-${index}`}
                    onClick={() => handleAnswer(answer)}
                    style={style}
                    variant='contained'
                    disabled={hasAnswered}
                >
                    {answer.answer}
                </Button>
            );
        });
    };

    return (<>
        <Box style={{
            color: 'white',

        }}>
            <Header />

            <Box style={{
                backgroundImage: `url(${background})`,
                backgroundSize: "cover",
                height: "100vh",
                color: 'white',
                flexDirection: 'column',
            }}>
                <Box style={{
                    display: 'flex',
                    justifyContent: 'center',
                    height: '100vh',
                    paddingTop: '100px'
                }}>
                    <Box style={{
                        width: '800px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        paddingTop: '60px',
                        height: '50vh',
                        backgroundColor: 'transparent',
                        fontFamily: "'Chalkduster', sans-serif",
                    }}>
                        <div style={{ textAlign: "center" }}>
                            {currentQuestion && (
                                <>

                                    {<h2>{currentQuestion.summary}</h2>}
                                    <div>{renderAnswers(answers)}</div>
                                </>
                            )}
                        </div>
                        <Box>
                            <h2>Score: {score}</h2>
                            <h2>Time left: {timer} seconds left</h2>
                        </Box>
                    </Box>

                </Box>

            </Box>

        </Box>

        <Dialog
            open={gameOver}
            onClose={() => setGameOver(false)} // Optionally close the dialog
            aria-labelledby="highscore-dialog-title"
            aria-describedby="highscore-dialog-description"
            sx={{
                '& .MuiPaper-root': { // Styles for the dialog's paper component
                    backgroundColor: 'rgba(0, 0, 0, 0.85)', // Semi-transparent black
                    color: 'white',
                    fontFamily: "'Chalkduster', sans-serif",
                }
            }}
        >
            <DialogTitle id="highscore-dialog-title" sx={{ textAlign: 'center' }}>Game Over</DialogTitle>
            <DialogContent>
                <DialogContentText id="highscore-dialog-description" sx={{ color: 'white' }}>
                    Your High Score: {score}
                </DialogContentText>
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'center' }}>
                <Button
                    onClick={() => { navigate('/rankings') }}
                    color="primary"
                    sx={{
                        backgroundColor: '#1095e0',
                        color: 'white',
                        '&:hover': {
                            backgroundColor: '#0d7ecb'
                        }
                    }}
                >
                    Go to Leaderboard
                </Button>
            </DialogActions>
        </Dialog>
    </>

    )
};


export default OnlyText;