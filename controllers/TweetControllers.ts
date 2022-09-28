import express from "express";
import mongoose from "mongoose";
import { validationResult } from "express-validator";
import { isValidObjectId } from "../utils/isValidObjectId";
import { TweetModel, TweetModelInterface } from "../models/TweetModel";
import { UserModelDocumentInterface, UserModelInterface } from "../models/UserModel";


class TweetsController{
    async index(_: any, res: express.Response): Promise<any>{
        try {
            const tweets = await TweetModel.find({}).populate('user').sort({'createdAt' : -1}).exec()

            res.json({
                status: 'Success',
                data: tweets
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
            const tweetId = req.params.id

            if (!isValidObjectId(tweetId)){
                res.status(400).send()
                return
            }

            // const user = await UserModel.findById({userId}).exec()
            const tweet = await TweetModel.findOne({_id: tweetId}).populate('user').exec()
            
            if(!tweet){
                res.status(404).send()
                return
            }

            res.json({
                status: 'Success',
                data: tweet
            })
        } catch (error) {
            res.status(500).json({
                status: 'Error',
                message: error
            })
        }
    }

    async create (req: express.Request, res: express.Response): Promise<void>{
        try {
            const user = req.user as UserModelInterface

            if(user?._id){

                const errors = validationResult(req)

                if(!errors.isEmpty()){
                    res.status(400).json({status: 'error', errors: errors})
                    return
                }

                const data: any = {
                    text: req.body.text,
                    user: user._id
                }
                const tweet = await TweetModel.create(data)

                
                res.json({
                    status: 'Success',
                    data: await tweet.populate('user')
                })
            }

        } catch (error) {
            res.status(500).json({
                status: 'Error',
                message: error
            })
        }
    }

    async delete (req: express.Request, res: express.Response): Promise<void>{
        const user = req.user as UserModelInterface
        try {

            const tweetId = req.params.id

            if (!isValidObjectId(tweetId)){
                res.status(400).send()
                return
            }

            const tweet = await TweetModel.findById(tweetId)
            
            if(tweet){
                if(String(tweet.user._id) === String(user._id)){
                    tweet.delete()
                    res.send()
                } else {
                    res.status(403).send()
                }
                
            } else {
                res.status(404).send()
            }

            res.send()
        } catch (error) {
            res.status(500).json({
                status: 'Error',
                message: error
            })
        }
    }

    async update (req: express.Request, res: express.Response): Promise<void>{
        const user = req.user as UserModelInterface
        try {

            const tweetId = req.params.id

            if (!isValidObjectId(tweetId)){
                res.status(400).send()
                return
            }

            const tweet = await TweetModel.findById(tweetId)
            
            if(tweet){
                if(String(tweet.user._id) === String(user._id)){
                    const text = req.body.text
                    tweet.text = text
                    tweet.save()
                    res.send()
                } else {
                    res.status(403).send()
                }
                
            } else {
                res.status(404).send()
            }

            res.send()
        } catch (error) {
            res.status(500).json({
                status: 'Error',
                message: error
            })
        }
    }

}

export const TweetsCtr = new TweetsController()
