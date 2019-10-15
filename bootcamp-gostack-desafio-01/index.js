const express = require('express')

const app = express()

app.use(express.json())

const projects = []
let totalRequests = 0

//middleware global contabilizando a quantidade de requests
app.use((req, res, next) => {
    totalRequests++

    console.log('Total de requests: ', totalRequests)

    return next()
})

//middleware verificar se o existe o projeto com o id informado
function checkIdExists(req, res, next) {
    const { id } = req.params

    const project = projects.find(item => item.id === id)

    if (!project) {
        return res.status(400).json({ error: 'Project not found' })
    }

    req.project = project

    return next()
}

//criar projeto
app.post('/projects', (req, res) => {
    const { id, title } = req.body

    const project = {
        id,
        title,
        tasks: []
    }

    projects.push(project)

    return res.json(project)
})

//listar todos os projetos
app.get('/projects', (req, res) => {
    return res.json(projects)
})

//alterar o projeto
app.put('/projects/:id', checkIdExists, (req, res) => {
    const { title } = req.body

    req.project.title = title

    return res.json(req.project)
})

//deletar o projeto
app.delete('/projects/:id', checkIdExists, (req, res) => {
    const { id } = req.params

    const index = projects.findIndex(item => item.id === id)

    projects.splice(index, 1)

    return res.send()
})

//adicionar tarefa
app.post('/projects/:id/tasks', checkIdExists, (req, res) => {
    const { title } = req.body

    req.project.tasks.push(title)

    return res.json(req.project)
})

app.listen(3000)