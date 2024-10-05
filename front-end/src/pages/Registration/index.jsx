import React from 'react';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { selectAuth, fetchRegister } from '../../redux/slices/auth';
import styles from './Login.module.scss';
import { Navigate } from 'react-router-dom';

export const Registration = () => {
    const isAuth = useSelector(selectAuth);
    const dispatch = useDispatch();
    const { register, handleSubmit, formState: { errors, isValid } } = useForm({
        defaultValues: {
            fullName: 'Cars',  // Приведено в соответствие с ожиданиями сервера
            email: 'Avto-car@gmail.com',
            password: '1234567',
        },
        mode: 'all'
    });

    const onSubmit = async (values) => {
        const data = await dispatch(fetchRegister(values));

        if (!data.payload) {
            return alert('Не удалось зарегистрироваться');
        }

        if (data.payload.token) {
            window.localStorage.setItem('token', data.payload.token);
        }
    };

    if (isAuth) {
        return <Navigate to='/' />;
    }

    return (
        <Paper classes={{ root: styles.root }}>
            <Typography classes={{ root: styles.title }} variant="h5">
            Create an account        
                </Typography>
            <div className={styles.avatar}>
                <Avatar sx={{ width: 100, height: 100 }} />
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
                {/* FullName */}
                <TextField 
                    error={Boolean(errors.fullName?.message)}
                    helperText={errors.fullName?.message}
                    type="text"
                    {...register('fullName', { required: 'Please provide your full name' })}
                    className={styles.field} label="Fullname" fullWidth
                />
                {/* Email */}
                <TextField 
                    error={Boolean(errors.email?.message)}
                    helperText={errors.email?.message}
                    type="email"
                    {...register('email', { required: 'Please enter your email' })}
                    className={styles.field} label="E-mail" fullWidth
                />
                {/* Password */}
                <TextField 
                    error={Boolean(errors.password?.message)}
                    helperText={errors.password?.message}
                    type="password"
                    {...register('password', { required: 'Please enter your password' })}
                    className={styles.field} label="Password" fullWidth
                />
                <Button disabled={!isValid} type="submit" variant="contained" fullWidth>
                Register
                </Button>
            </form>
        </Paper>
    );
};
