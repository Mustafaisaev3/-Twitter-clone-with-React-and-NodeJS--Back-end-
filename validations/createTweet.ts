import { body } from 'express-validator'

export const createTeweetValidations = [
    body('text', 'Введите текст твита')
        .isString()
        .isLength({
            max: 280
        })
        .withMessage('Максимальная длинна твита 280 символов'),
]