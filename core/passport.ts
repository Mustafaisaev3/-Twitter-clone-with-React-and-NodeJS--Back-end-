import passport from 'passport'
import {Strategy as LocalStrategy} from 'passport-local'
import {Strategy as JwtStrategy, ExtractJwt} from 'passport-jwt'
import { UserModel, UserModelInterface } from '../models/UserModel';
import { generateMD5 } from '../utils/generateHash';



passport.use(new LocalStrategy(async (username, password, done): Promise<any> => {
        try {
            const user = await UserModel.findOne({$or: [{email: username},{username}]}).exec()

            if(!user){
                return done(null, false)
            }

            if(user.password === generateMD5(password + process.env.SECRET_KEY)){
                done(null, user)
            } else {
                done(null, false)
            }
        } catch (error) {
            return done(error, false)
        }
    }
))

passport.use(new JwtStrategy(
    {
    secretOrKey: process.env.SECRET_KEY || '123',
    jwtFromRequest: ExtractJwt.fromHeader('token')
    },
    async (payload: {data: UserModelInterface}, done) => {
        try {
          const user = await UserModel.findById(payload.data._id).exec()
          return done(null, user)  
        } catch (error) {
          return done(error)
        }
    }
));

// @ts-ignore

passport.serializeUser<string>((user: UserModelInterface, done) => {
    done(null, user?._id)
})

passport.deserializeUser((id, done) => {
    UserModel.findById(id, (err: Error, user: UserModelInterface) => {
        done(err, user)
    })
})


export {passport}

