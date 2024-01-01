import express from 'express'
import * as db from '../db/db'

const router = express.Router()

export default router

// GET '/api/v1/posts'
router.get('/', async (req, res) => {
  try {
    const posts = await db.getAllPostsDb()
    res.json(posts)
  } catch (error: any) {
    console.error(`Error getting all posts from server: ${error.message}`)
    return error
  }
})

//POST '/api/v1/posts'
router.post('/', async (req, res) => {
  const post = req.body
  try {
    const addedPost = await db.addPostDb(post)
    res.json(addedPost)
  } catch (error: any) {
    console.error(`Error adding a post from server: ${error.message}`)
    return error
  }
})

//PATCH '/api/v1/posts/:id'
router.patch('/:id', async (req, res) => {
  const postId = Number(req.params.id)
  const updatedPostData = req.body

  try {
    const updatedPost = await db.updatePostDb(postId, updatedPostData)

    if (updatedPost) {
      res.json(updatedPost)
    } else {
      res.json({ error: 'Post not found' })
    }
  } catch (error: any) {
    console.error(`Error updating post from server: ${error.message}`)
    res.json({ error: 'Internal Server Error' })
  }
})

//DELETE 'api/v1/posts/:id'
router.delete('/:id', async (req, res) => {
  const postId = Number(req.params.id)

  try {
    const deletedPostCount = await db.deletePostDb(postId)

    if (deletedPostCount > 0) {
      res.status(200).send() // Send a 200 response if the post was deleted
    } else {
      res.json({ error: 'Post not found' })
    }
  } catch (error: any) {
    console.error(`Error deleting post from server: ${error.message}`)
    res.json({ error: 'Internal Server Error' })
  }
})

// -- COMMENTS -- //

//GET comments '/api/v1/posts/:postId/comments'

router.get('/:postId/comments', async (req, res) => {
  const postId = Number(req.params.postId)
  try {
    const comments = await db.getAllCommentsDb(postId)
    res.json(comments)
  } catch (error: any) {
    console.error(`Error in getting all comments in server`)
    res.json({ error: 'Internal Server Error' })
  }
})
