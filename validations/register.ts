import { body } from 'express-validator'

export const regsiterValidations = [
    body('email', 'Введите E-Mail')
        .isEmail()
        .withMessage('Неверный E-Mail')
        .isLength({
            min: 10,
            max: 40
        })
        .withMessage('Допустимая кол-во символов в почте от 10 до 40.'),
    body('fullname', 'Введите Имя')
        .isString()
        .isLength({
            min: 10,
            max: 40
        })
        .withMessage('Допустимая кол-во символов в Имени от 10 до 40.'),
    body('username', 'Введите Логин')
        .isString()
        .isLength({
            min: 10,
            max: 40
        })
        .withMessage('Допустимая кол-во символов в Логине от 10 до 40.'),
    body('password', 'Введите Пароль')
        .isString()
        .isLength({
            min: 6
        })
        .withMessage('Минимальная длина пароля 6 символов.')
        .custom((value, { req }) => {
            if( value !== req.body.password2){
                throw new Error('Пароли не совпадают')
            } else {
                return value
            }
        })
]