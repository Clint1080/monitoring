const express = require('express')
const path = require('path')
const Rollbar = require('rollbar')

const rollbar = new Rollbar({
    accessToken: '90ae000da3f448c8ab5aadbee0618d1d',
    captureUncaught: true,
    captureUnhandledRejections: true
})

const app = express()

const students = []


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'))
    rollbar.info('html file served successfully')
})

app.post('/api/student', (req, res) => {
    const {name} = req.body
    name = name.trim()
    
    students.push(name)
    
    rollbar.log('Student entered successfully', {author: 'Clint', type: 'manual entry'})
    res.status(200).send(students)
})


const port = process.env.PORT || 4545

app.use(rollbar.errorHandler())

app.listen(port, () => (console.log(`Running on ${port} Captain`)))