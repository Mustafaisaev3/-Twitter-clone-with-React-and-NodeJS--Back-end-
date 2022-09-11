import express from 'express'

const app = express()

app.get('/hello', (_, res: express.Response) => {
    res.send('Hello!')
})

app.listen(3000, () => {
    console.log('SERVER RUNNING!')
})