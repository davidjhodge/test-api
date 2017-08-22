const Router = require('express-promise-router')
const router = new Router()
module.exports = router

const db = require('../db')
const isAuthenticated = require('../middlewares/isAuthenticated.js')

// GET All Posts
router.get('/', isAuthenticated, async(req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM posts LIMIT 10'
    )
    const posts = result.rows
    if (posts) {
      res.send(posts)
    } else {
      res.status(500).send({ "error": "No Posts Found", "message": "No posts could be located." })
    }
  } catch(e) {
    res.status(500).send({ "error": e.name, "message": e.message })
  }
})

// GET a single post by id
router.get('/:id', isAuthenticated, async(req, res) => {
  req.checkParams('id', 'The post id provided was not valid.').notEmpty().isAlphanumeric()

  try {
    const result = await db.query(
      'SELECT * FROM posts WHERE id = $1',
      [req.params.id]
    )
    const post = result.rows[0]
    if (post) {
      res.send(post)
    } else {
      res.status(500).send({ "error": "Post Not Found", "message": "The post with id " + req.params.id + " could not be located." })
    }
  } catch(e) {
    res.status(500).send({ "error": e.name, "message": e.message })
  }
})

// Create New Post
router.post('/create', isAuthenticated, async(req, res) => {
  req.checkBody('title', 'Please provide a valid title.').notEmpty().isAlphanumeric()
  req.checkBody('description', 'Please provide a valid description.').notEmpty().isAlphanumeric()
  req.checkBody('author', 'Please provide a valid author.').notEmpty().isAlphanumeric()

  try {
    // TODO ADD OWNER FIELD
    const result = await db.query(
      'INSERT INTO posts (title, description, likes, author, created_at) VALUES ($1, $2, 0, $3, CURRENT_TIMESTAMP)',
      [req.body.title, req.body.description, req.body.author]
    )

    const { rows } = await db.query(
      'SELECT * FROM posts WHERE title = $1 AND description = $2 AND author = $3',
      [req.body.title, req.body.description, req.body.author]
    )
    const post = rows[0]
    if (post) {
      res.send(post)
    } else {
      res.status(500).send({ "error": "Create Post Error", "message": "There was an error creating this post." })
    }
  } catch(e) {
    res.status(500).send({ "error": e.name, "message": e.message })
  }
})

// Update Post
router.put('/:id', isAuthenticated, async(req, res) => {
  req.checkParams('id', 'That post id is not valid.').notEmpty().isAlphanumeric()
  req.checkBody('title', 'That title is not valid.').notEmpty().isAlphanumeric()
  req.checkBody('description', 'That description is not valid.').notEmpty().isAlphanumeric()

  try {
    const result = await db.query(
      'UPDATE posts SET title = $1, description = $2 WHERE id = $3',
      [req.body.title, req.body.description, req.params.id]
    );
    if (result.rowCount >= 1) {
      // Return new object to user
      const { rows } = await db.query(
        'SELECT * FROM posts WHERE id = $1',
        [req.params.id]
      )
      const post = rows[0]
      if (post) {
        res.send(post)
      } else {
        res.send(result.rowCount)
      }
    } else {
      res.status(500).send({ "error": "Update Post Error", "message": "An error occurred when attempting to update post" + req.params.id + "." })
    }
  } catch(e) {
    res.status(500).send({ "error": e.name, "message": e.message })
  }

})

// Like Post
router.put('/:id/like', isAuthenticated, async(req, res) => {
  req.checkParams('id', 'That post id is not valid.').notEmpty().isAlphanumeric()

  try {
    const result = await db.query(
      'UPDATE posts SET likes = likes + 1 WHERE id = $1',
      [req.params.id]
    );

    if (result.rowCount >= 1) {
      // Return new object to user
      const { rows } = await db.query(
        'SELECT * FROM posts WHERE id = $1',
        [req.params.id]
      )
      const post = rows[0]
      if (post) {
        res.send(post)
      } else {
        res.send(result.rowCount)
      }
    } else {
      res.status(500).send({ "error": "Like Error", "message": "An error occurred when attempting to like post" + req.params.id + "." })
    }
  } catch(e) {
    res.status(500).send({ "error": e.name, "message": e.message })
  }
})

// Delete Post
router.delete('/:id', async(req, res) => {
  req.checkParams('id', 'That post id is not valid.').notEmpty().isAlphanumeric()

  try {
    const result = await db.query(
      'DELETE FROM posts WHERE id = $1',
      [req.params.id]
    )
    if (result.rowCount >= 1) {
      res.send({ "Post Deleted": req.params.id })
    } else {
      const message = "There was an error deleting post " + req.params.id + "."
      res.status(500).send({
        "error": "Delete Post Error",
        "message": message
      })
    }
  } catch(e) {
    res.status(500).send({ "error": e.name, "message": e.message })
  }
})
