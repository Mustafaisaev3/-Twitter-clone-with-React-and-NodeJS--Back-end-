import dotenv from 'dotenv'
dotenv.config()


import express from 'express'
import { UserCtlr } from './controllers/UserController'
import { regsiterValidations } from './validations/register'
import './core/db'
import {passport} from './core/passport'

import session  from 'express-session'
import { TweetsCtr } from './controllers/TweetControllers'
import { createTeweetValidations } from './validations/createTweet'


const app = express()

app.use(express.json())
app.use(session({ secret: 'SECRET' }))
app.use(passport.initialize())
// app.use(passport.session())


app.get('/users', UserCtlr.index)
app.get('/users/me', passport.authenticate('jwt'), UserCtlr.getUserInfo)
app.get('/users/:id', regsiterValidations, UserCtlr.show)

// Tweets
app.get('/tweets', TweetsCtr.index)
app.get('/tweets/:id', TweetsCtr.show)
app.delete('/tweets/:id', passport.authenticate('jwt'), createTeweetValidations, TweetsCtr.delete)
app.patch('/tweets/:id', passport.authenticate('jwt'), createTeweetValidations, TweetsCtr.update)
app.post('/tweets', passport.authenticate('jwt'), TweetsCtr.create)

// app.post('/auth/login', passport.authenticate('local'), (req, res) => res.json(req.user));
app.post('/auth/register', regsiterValidations, UserCtlr.create)
app.post('/auth/login', passport.authenticate('local'), UserCtlr.afterLogin);
app.get('/auth/verify', regsiterValidations, UserCtlr.verify)




app.listen(process.env.PORT, () => {
    console.log('SERVER RUNNING!')
})