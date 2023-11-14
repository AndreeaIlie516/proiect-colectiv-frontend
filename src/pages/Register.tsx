import { Box, Button, TextField, Typography } from '@mui/material';
import background from '../resources/background.png';
import Header from '../components/Header';
import '../styles/Header.css';
import '../styles/GameModes.css';
import React, { useState } from 'react';
import { IUser } from '../interfaces/User';
import { validateUsername, validatePasswd, PasswordError } from '../utils/validators';
import { Errors } from '../components/ErrorMessages';
import { NavigateFunction, useNavigate } from 'react-router-dom';

const handleSubmit = async (event: React.FormEvent<HTMLFormElement>, setErrors: React.Dispatch<React.SetStateAction<string[]>>, navigate: NavigateFunction): Promise<void> => {
    event.preventDefault();
    const errors: string[] = []
    const data = new FormData(event.currentTarget);
    const userName = data.get('username') as string;
    const password = data.get('password') as string;
    const confirmPassword = data.get('confirmPassword') as string;
    if (!validateUsername(userName)) {
        errors.push("Username cannot be empty");
    }
    if (validatePasswd(password) !== true) {
        const errMsg: PasswordError = validatePasswd(password) as PasswordError;
        errors.push(errMsg);
    }
    if (password !== confirmPassword) {
        errors.push("Passwords dont match");
    }

    //will move it lower after the fetch to push also the backend errors
    if (errors.length > 0) {
        console.log(errors);
        setErrors(errors);
        return;
    }
    type SendToBERegister = Omit<IUser, "highScoreMixed" | "highScorePhotos" | "highScoreText" | "id">;
    const objToSend: SendToBERegister = {
        userName: userName,
        password: password,
    }
    navigate('/gamemode');
    console.log(objToSend);
}

export function Register() {
    const [errors, setErrors] = useState<string[]>([]);
    const navigate = useNavigate();
    const handleFormSUbmit = (event: React.FormEvent<HTMLFormElement>) => {
        handleSubmit(event, setErrors, navigate);
    }
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
                    flexDirection: 'column',
                    alignItems: 'center',
                    height: '100vh',
                    backgroundColor: 'transparent',
                    fontFamily: "'Chalkduster', sans-serif",
                }}>
                    <Typography variant="h2" style={{ 
                        marginBottom: '10px' , 
                        marginTop: '70px', 
                        fontFamily: "'Chalkduster', sans-serif",
                        }}>
                        Register
                    </Typography>
                    <Box
                        component="form"
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'space-evenly',
                            height: '50vh', 
                            maxWidth: '400px', 
                            
                            marginTop: '65px',
                            padding: '10px',
                            borderRadius: '12px',
                            backgroundColor: 'transparent', 
                            backdropFilter: 'blur(8px)', 
                            '& .MuiTextField-root': {
                                m: 1, 
                                width: '100%', 
                            },
                            '& .MuiInputBase-input': {
                                fontFamily: 'Chalkduster, sans-serif',
                                color: '#a3a3a3'
                            },
                            '& .MuiInputLabel-root': {
                                fontFamily: 'Chalkduster, sans-serif',
                                color: '#a3a3a3'
                            },
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: 'rgba(0, 0, 0, 0.23)', 
                                },
                                '&:hover fieldset': {
                                    borderColor: 'rgba(0, 0, 0, 0.5)', 
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: '#1976d2', 
                                },
                            },
                            '& .MuiButton-root': {
                                mt: 3, 
                                width: '100%', 
                                backgroundColor: '#1976d2', 
                                color: 'white',
                                padding: '10px 0',
                                '&:hover': {
                                    backgroundColor: '#115293',
                                },
                            },
                        }}
                        autoComplete="off"
                        onSubmit={handleFormSUbmit}
                    >
                        <Typography variant="h5" style={{ 
                                marginBottom: '10px' , 
                                fontFamily: "'Chalkduster', sans-serif",
                                width: '550px'
                            }}>
                                Please insert your username:
                            </Typography>
                        <TextField
                            
                            required
                            name='username'
                            label="Your username:"
                            variant="outlined"
                            style={{ 
                                marginBottom: '20px', 
                                fontFamily: "'Chalkduster', sans-serif",
                                backgroundColor: '#e6e6e6',
                                width: '550px',
                                borderRadius: '10px',
                            }}
                        />
                        <Typography variant="h5" style={{ 
                                marginBottom: '10px' , 
                                marginTop: '10px', 
                                fontFamily: "'Chalkduster', sans-serif",
                                width: '550px'
                            }}>
                                Please insert your password:
                            </Typography>
                        <TextField
                            required
                            name='password'
                            label="Your password:"
                            type="password"
                            variant="outlined"
                            style={{ 
                                marginBottom: '20px', 
                                fontFamily: "'Chalkduster', sans-serif",
                                backgroundColor: '#e6e6e6',
                                width: '550px',
                                borderRadius: '10px',}}
                        />
                        <Typography variant="h5" style={{ 
                                marginBottom: '10px' , 
                                marginTop: '10px', 
                                maxWidth: '600px',
                                fontFamily: "'Chalkduster', sans-serif",
                                width: '550px'
                            }}>
                                Please confirm your password:
                            </Typography>
                        <TextField
                            required
                            name='confirmPassword'
                            label="Your password:"
                            type="password"
                            variant="outlined"
                            style={{ 
                                marginBottom: '20px', 
                                fontFamily: "'Chalkduster', sans-serif",
                                backgroundColor: '#e6e6e6',
                                width: '550px',
                                borderRadius: '10px',}}            
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            style={{
                                textTransform: 'none',
                                width: '300px',
                                fontFamily: "'Chalkduster', sans-serif",
                                fontSize: '30px',
                                backgroundColor: '#1095e0',
                                borderRadius: '10px',
                                marginTop: '30px'
                            }}
                        >
                            Register
                        </Button>
                    </Box>     
            <Errors errors={errors}></Errors>
                </Box>
            </Box>
        </Box>
    </>
    );
}
