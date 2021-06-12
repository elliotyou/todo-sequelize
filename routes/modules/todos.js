const express = require('express')
const router = express.Router()

const db = require('../../models')
const Todo = db.Todo

//CREATE
router.get('/new', (req, res) => {
  return res.render('new')
})

router.post('/', (req, res) => {
  const UserId = req.user.id
  const name = req.body.name

  return Todo.create({ name, UserId })
    .then(() => res.redirect('/'))
    .catch(err => console.log(err))
})

//READ
router.get('/:id', (req, res) => {
  console.log('into routes/modules/todos/get/id')
  const UserId = req.user.id
  const id = req.params.id
  return Todo.findOne({
    where: { id, UserId }
  })
    .then(todo => res.render('detail', { todo: todo.toJSON() }))
    .catch(error => console.log(error))
})

//UPDATE
router.get('/:id/edit', (req, res) => {
  const UserId = req.user.id
  const id = req.params.id

  return Todo.findOne({ where: { id, UserId } })
    .then(todo => res.render('edit', { todo: todo.get() }))
    .catch(error => console.log(error))
})

router.put('/:id', (req, res) => {
  const UserId = req.user.id
  const id = req.params.id
  const { name, isDone } = req.body

  return Todo.findOne({ where: { id, UserId } })
    .then(todo => {
      todo.name = name
      todo.isDone = isDone === 'on'
      return todo.save()
    })
    .then(() => res.redirect(`/todos/${id}`))
    .catch(err => console.log(err))
})

module.exports = router