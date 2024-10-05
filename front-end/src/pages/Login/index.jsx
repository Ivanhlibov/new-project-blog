import React, { isValidElement } from "react";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import { useForm } from "react-hook-form";
import { Navigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { fetchAuth, selectAuth } from "../../redux/slices/auth";

import styles from "./Login.module.scss";

export const Login = () => {
    const isAuth = useSelector(selectAuth);
    const dispatch = useDispatch();
    const { register, handleSubmit, setError, formState: { errors } } = useForm({
        defaultValues: {
            email: 'Friend@gmail.com',
            password: 'Friend-K',
        },
        mode: 'onChange'
    });

    const onSubmit = async (values) => {
        const data = await dispatch(fetchAuth(values)); // Обработка dispatch с await

        if (!data.payload) {
            return alert('Failed to log in');
        }

        if (data.payload.token) {
            window.localStorage.setItem('token', data.payload.token);
        }
    };

    if (isAuth) {
        return <Navigate to='/' />;
    }

    return (
        <Paper className={styles.root} elevation={1}> {/* Установите допустимое значение elevation */}
            <Typography className={styles.title} variant="h5">
            Login to your account           
             </Typography>
            <form onSubmit={handleSubmit(onSubmit)}>
                <TextField
                    className={styles.field}
                    label="E-Mail"
                    error={Boolean(errors.email?.message)}
                    helperText={errors.email?.message}
                    type="email"
                    {...register('email', { required: 'Email' })}
                    fullWidth
                />
                <TextField
                    className={styles.field}
                    label="Пароль"
                    error={Boolean(errors.password?.message)}
                    helperText={errors.password?.message}
                    {...register('password', { required: 'Password' })}
                    fullWidth
                />
                <Button disabled={!isValidElement}  type="submit" size="large" variant="contained" fullWidth>
                  Login
                </Button>
            </form>
        </Paper>
    );
};
