const express = require('express');

const postDb = require("./../posts/postDb.js")
const db = require("./userDb.js")
const router = express.Router();

router.post('/', validateUser, async (req, res) => {
  try{
    const newUser = await db.insert(req.body)
    res.status(201).json(newUser)
  }
  catch{
    res.status(500).json({ error: "ERROR"})
  }
});

router.post('/:id/posts', validateUserId, validatePost, async (req, res) => {
  const newPost = { ...req.body, user_id: req.user}
  try{
    const success = await postDb.insert(newPost)
    res.status(201).json(success)
  }
  catch{
    res.status(500).json({ error: "ERROR"})
  }
});

router.get('/', async (req, res) => {
  try {
    const users = await db.get()
    res.status(200).json(users)
  }
  catch{
    res.status(500).json({ error: "error"})
  }

});

router.get('/:id', validateUserId, async (req, res) => {
  try{
    console.log(req.user)
    const user = await db.getById(req.user)
    res.status(200).json(user)
  }
  catch{
    res.status(500).json({ error: "500 Error"})
  }
});

router.get('/:id/posts', validateUserId, async (req, res) => {
  try{
    const posts = await db.getUserPosts(req.user)
    res.status(200).json(posts)
  }
  catch{
    res.status(500).json({ error: "500 Error"})
  }
});

router.delete('/:id', validateUserId, async (req, res) => {
  // do your magic!
  try {
    const result = await db.remove(req.user)
    res.status(200).json({ status: `User Id: ${result} has been successfully deleted`})
  }
  catch {
    res.status(500).json({ error: "500 Error"})
  }
});

router.put('/:id', validateUserId, validateUser, async (req, res) => {
  // do your magic!
  try {
    await db.update(req.user, { ...req.body, id: req.user })
    const newResult = await db.getById(req.params.id)
    res.status(200).json(newResult)
  }
  catch {
    res.status(500).json({ error: "500 Error"})
  }
});

//custom middleware

async function validatePostId(req, res, next) {
  const post = await db.getById(req.params.id)
  if (post){
    next()
  } else {
    res.status(400).json({ message: "not found"})
  }
  }

async function validateUserId(req, res, next) {
  const user = await db.getById(req.params.id)
  if (user){
    req.user = user.id
    next()
  } else {
    res.status(400).json({ message: "invalid user id" })
  }
}

function validatePost(req, res, next) {

  if (!req.body){
    res.status(400).json({ message: "missing post data" })
  } else if (!req.body.text) {
    res.status(400).json({ message: "missing required TEXT field" })
  } else {
    next()
  }
}

function validateUser(req, res, next) {
  if (!req.body){
    res.status(400).json({ message: "missing user data" })
  } else if (!req.body.name) {
    res.status(400).json({ message: "missing required NAME field" })
  } else {
    next()
  }
}

module.exports = router;
