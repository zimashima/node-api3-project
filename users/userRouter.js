const express = require('express');

const postDb = require("./../posts/postDb.js")
const db = require("./userDb.js")
const router = express.Router();

router.post('/', (req, res) => {
  // do your magic!
});

router.post('/:id/posts', validateUserId, validatePost, async (req, res) => {
  try{
    const success = postDb.insert({user_id: req.params.id, text: req.body.tex})
    res.status(200).json(success)
  }
  catch{
    res.status(500).json({ error: "ERROR"})
  }
});

router.get('/', (req, res) => {
  // do your magic!
});

router.get('/:id', validateUserId, async (req, res) => {
  try{
    const user = await db.getById(req.params.id)
    res.status(200).json(user)
  }
  catch{
    res.status(500).json({ error: "ERROR"})
  }
});

router.get('/:id/posts', validateUserId, validatePost, async (req, res) => {
  // do your magic!
});

router.delete('/:id', (req, res) => {
  // do your magic!
});

router.put('/:id', (req, res) => {
  // do your magic!
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
  console.log(user)
  if (user){
    next()
  } else {
    res.status(400).json({ message: "not found"})
  }
}

function validatePost(req, res, next) {
  if (!req.body){
    res.status(400).json({ message: "not found"})
  } else if(!req.body.text) {
    res.status(400).json({ message: "NO TEXT, IDOT"})
  } else {
    next()
  }
}


module.exports = router;
