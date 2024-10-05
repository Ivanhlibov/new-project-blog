import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../axios.js';

export const fetchAuth = createAsyncThunk('/auth/fetchAuth', async (params) => {
    try {
        const { data } = await axios.post('/auth/login', params);
        return data;
    } catch (error) {
        throw new Error(error.response.data.message || 'Ошибка авторизации');
    }
});

export const fetchAuthMe = createAsyncThunk('/auth/fetchAuthMe', async () => {
    try {
        const { data } = await axios.get('http://localhost:4444/auth/me');

        return data;
    } catch (error) {
        if (error.response) {
            // Сервер ответил с ошибкой
            console.error("Ответ сервера:", error.response.data);
            console.error("Статус:", error.response.status);
            console.error("Заголовки:", error.response.headers);
        } else if (error.request) {
            // Запрос был отправлен, но ответа не было
            console.error("Запрос был отправлен, но ответа не поступило:", error.request);
        } else {
            // Ошибка при настройке запроса
            console.error("Ошибка настройки запроса:", error.message);
        }
        console.error("Полные детали ошибки:", error.config);
        throw error; // Бросаем ошибку, чтобы она отработала в Redux
    }
});




export const fetchRegister = createAsyncThunk('/auth/fetchRegister', async (params) => {
    const { data } = await axios.post('/auth/register', params);
    return data;
});

const initialState = {
    data: null,
    status: 'idle', // Начальное состояние
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.data = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAuth.pending, (state) => {
                state.status = 'loading';
                state.data = null;
            })
            .addCase(fetchAuth.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data = action.payload;
            })
            .addCase(fetchAuth.rejected, (state) => {
                state.status = 'failed';
                state.data = null;
            })

            .addCase(fetchAuthMe.pending, (state) => {
                state.status = 'loading';
                state.data = null;
            })
            .addCase(fetchAuthMe.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data = action.payload;
            })
            .addCase(fetchAuthMe.rejected, (state) => {
                state.status = 'failed';
                state.data = null;
            })

            .addCase(fetchRegister.pending, (state) => {
                state.status = 'loading';
                state.data = null;
            })
            .addCase(fetchRegister.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data = action.payload;
            })
            .addCase(fetchRegister.rejected, (state) => {
                state.status = 'failed';
                state.data = null;
            });
    },
});

export const selectAuth = (state) => Boolean(state.auth.data);
export const AuthReducer = authSlice.reducer;
export const { logout } = authSlice.actions;
