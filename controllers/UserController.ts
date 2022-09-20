import express from "express";
import mongoose from "mongoose";
import jwt from 'jsonwebtoken';
import { UserModel, UserModelDocumentInterface } from "../models/UserModel";
import { validationResult } from "express-validator";
import { generateMD5 } from "../utils/generateHash";
import { sendEmail } from "../utils/sendEmail";


const isValidObjectId = mongoose.Types.ObjectId.isValid 

 class UserController {
    async index(_: any, res: express.Response): Promise<any>{
        try {
            const users = await UserModel.find({}).exec()
            res.json({
                status: 'Success',
                data: users
            })
        } catch (error) {
            res.status(500).json({
                status: 'Error',
                message: error
            })
        }
    }

    async show(req: express.Request, res: express.Response): Promise<any>{
        try {
            const userId = req.params.id
            // console.log(req.params)

            if (!isValidObjectId(userId)){
                console.log('hello')
                res.status(400).send()
                return
            }

            // const user = await UserModel.findById({userId}).exec()
            const user = await UserModel.findOne({_id: userId}).exec()
            
            if(user){
                console.log( user)
            }

            res.json({
                status: 'Success',
                data: user
            })
        } catch (error) {
            res.status(500).json({
                status: 'Errorrrrr',
                message: error
            })
        }
    }

    async create (req: express.Request, res: express.Response): Promise<void>{
        try {
            const errors = validationResult(req)
            if(!errors.isEmpty()){
                res.status(400).json({status: 'error', errors: errors})
                return
            }

            const data = {
                email: req.body.email,
                fullname: req.body.fullname,
                username: req.body.username,
                password: generateMD5(req.body.password + process.env.SECRET_KEY),
                confirmHash: generateMD5(process.env.SECRET_KEY || Math.random().toString())
            }

            const user = await UserModel.create(data)

            
            sendEmail({
                emailFrom: 'admin@twitter.com',
                emailTo: data.email,
                subject: 'Подтверждение почты Twitter',
                html: `Для того, чтобы подтвердить почту, перейлите <a href='http://localhost:${process.env.PORT || 8888}/auth/verify?hash=${data.confirmHash}'> по этой ссылке </a>`,
            }, (err: Error | null) => {
                if(err) {
                    res.json({
                        status: 'Error',
                        message: err
                    })
                } else {
                    res.status(201).json({
                        status: 'succes',
                        data: user
                    })        
                }
            })

            
        } catch (error) {
            res.json({
                status: 'Error',
                message: error
            })
        }
    }

    async verify(req: express.Request, res: express.Response): Promise<any>{
        try {

            const hash = req.query.hash

            if(!hash){
                res.status(400).send({
                    status: 'error',
                    message: 'Hash not found!'
                })
                return
            }

            const user = await UserModel.findOne({confirmHash: hash}).exec()

            if(user) {
                user.confirmed = true
                user.save()

                res.json({
                    status: 'Success'
                })
            } else {
                res.status(404).send({
                    status: 'error',
                    messasge: 'Пользователь не найден'
                })
            }
            
        } catch (error) {
            res.status(400).json({
                status: 'Error',
                message: error
            })
        }
    }

    async afterLogin(req: express.Request, res: express.Response): Promise<any>{
        try {
            const user = req.user ? (req.user as UserModelDocumentInterface).toJSON() : undefined
            res.json({
                status: 'succes',
                data: {
                    ...user,
                    token: jwt.sign({data: req.user} , process.env.SECRET_KEY as string, {expiresIn: '30d'})
                }
            })
        } catch (error) {
            res.status(400).json({
                status: 'Error',
                message: error
            })
        }
    }

    async getUserInfo(req: express.Request, res: express.Response): Promise<any>{
        try {
            const user = req.user ? (req.user as UserModelDocumentInterface).toJSON() : undefined
            res.json({
                status: 'succes',
                data: user
            })
        } catch (error) {
            res.status(400).json({
                status: 'Error',
                message: error
            })
        }
    }
}

export const UserCtlr = new UserController()