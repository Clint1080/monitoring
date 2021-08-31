const express = require('express')
const path = require('path')
const Rollbar = require('rollbar')


const app = express()
app.use(express.json())
app.use('/main', express.static('./public/main.css'))

const rollbar = new Rollbar({
    accessToken: '90ae000da3f448c8ab5aadbee0618d1d',
    captureUncaught: true,
    captureUnhandledRejections: true
})

const students = []

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'))
    rollbar.info('html file served successfully')
})

app.post("/api/student", (req, res) => {
  let { name } = req.body;
  name = name.trim();

  const index = students.findIndex((studentName) => studentName === name);

  if (index === -1 && name !== "") {
    students.push(name);
    rollbar.log('Student added succussfully', {author: 'Clint'})
    res.status(200).send(students);
  } else if (name === "") {
      rollbar.error('No name given')
    res.status(400).send("must provide a name.");
  } else {
      rollbar.error('Student already exists')
    res.status(400).send("that student already exists");
  }
});


const port = process.env.PORT || 4545

app.use(rollbar.errorHandler())

app.listen(port, () => (console.log(`Running on ${port} Captain`)))