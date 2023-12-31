import connection from './connection.ts'
import { Post, PostData, PostUpdate } from '../../models/post.ts'

// -- POSTS -- //

//GET all posts
export async function getAllPostsDb(): Promise<Post> {
  try {
    const posts = await connection('posts').select(
      'id',
      'title',
      'date_created as dateCreated',
      'text'
    )
    return posts
  } catch (error: any) {
    console.error(`Error in getAllPostsDb: ${error.message}`)
    throw error
  }
}

//ADD a post
export async function addPostDb(post: PostData) {
  try {
    const [addedPost] = await connection('posts')
      .insert({
        title: post.title,
        text: post.text,
        date_created: new Date(),
      })
      .returning(['id', 'title', 'date_created as dateCreated', 'text'])

    return addedPost
  } catch (error: any) {
    console.error(`Error in addPostDb: , ${error.message}`)
    throw error
  }
}

//UPDATE a post
export async function updatePostDb(postId: number, updatedPostData: any) {
  try {
    const [updatedPost] = await connection('posts')
      .update({
        title: updatedPostData.title,
        text: updatedPostData.text,
        date_created: new Date(),
      })
      .where({ id: postId })
      .returning(['id', 'title', 'date_created as dateCreated', 'text'])

    return updatedPost
  } catch (error: any) {
    console.error(`Error in updatePostDb: ${error.message}`)
    throw error
  }
}

//DELETE a post
export async function deletePostDb(postId: number) {
  try {
    // Delete the post and return the number of affected rows
    const deletedPostCount = await connection('posts')
      .where({ id: postId })
      .del()

    if (deletedPostCount > 0) {
      // If the post was deleted, delete associated comments
      await connection('comments').where({ post_id: postId }).del()
    }

    return deletedPostCount
  } catch (error: any) {
    console.error(`Error in deletePostDb: ${error.message}`)
    throw error
  }
}

// -- COMMENTS -- //

//GET all comments for a specific post

export async function getAllCommentsDb(postId: number) {
  try {
    const comments = await connection('comments')
      .select('id', 'post_id as postId', 'date_posted as datePosted', 'comment')
      .where({ post_id: postId })
    return comments
  } catch (error: any) {
    console.error(`Error in getAllCommentsDb: ${error.message}`)
    throw error
  }
}

//ADD a comment to a specific post

export async function addCommentDb(postId: number, comment: string) {
  try {
    const [addedComment] = await connection('comments')
      .insert({
        post_id: postId,
        comment: comment,
        date_posted: new Date(),
      })
      .returning([
        'id',
        'post_id as postId',
        'date_posted as datePosted',
        'comment',
      ])
    return addedComment
  } catch (error: any) {
    console.error(`Error in addCommentToPostDb: ${error.message}`)
    throw error
  }
}

//UPDATE an existing comment
export async function updateCommentDb(
  commentId: number,
  updatedComment: string
) {
  try {
    const [updatedCommentData] = await connection('comments')
      .where({ id: commentId })
      .update({
        comment: updatedComment,
        date_posted: new Date(),
      })
      .returning(
        'id',
        'post_id as postId',
        'date_posted as datePosted',
        'comment'
      )
    return updatedCommentData
  } catch (error: any) {
    console.error(`Error in updateCommentDb: ${error.message}`)
    throw error
  }
}

//DELETE an existing comment
export async function deleteCommentDb(commentId: number) {
  try {
    const deletedComment = await connection('comments')
      .where({ id: commentId })
      .del()
    return deletedComment
  } catch (error: any) {
    console.error(`Error in deleteCommentDb: ${error.message}`)
    throw error
  }
}
