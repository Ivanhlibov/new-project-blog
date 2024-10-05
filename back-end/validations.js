import { body } from "express-validator";

 export const registerValidation = [
    body('email', 'Неверный формат почты' ).isEmail(),
    body('password', 'Неверный пароль').isLength({min: 5}),
    body('fullName', 'Неверное имя пользователя').isLength({min: 3}),
    body('avatarUrl', 'Ошибка по аватару').optional().isURL(),


]


export const loginValidation = [
    body('email', 'Неверный формат почты' ).isEmail(),
    body('password', 'Неверный пароль').isLength({min: 5}),
    

]


export const postCreateValidation = [
    body('title', 'Введите заголовок статьи').isLength({min: 3}).isString(),
    body('text', 'Введите тест для статьи').isLength({min: 3}).isString(),
    body('tags', 'Неверный формат тэгов () ').isString().optional(),
    body('imageUrl', 'Неверная ссылка на изображение').optional().isString(),


]