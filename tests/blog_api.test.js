const assert = require('node:assert')
const { test, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const jest = require('jest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})

test('notes are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all notes are returned', async () => {
  const response = await api.get('/api/blogs')
  assert.strictEqual(response.body.length, helper.initialBlogs.length)
})

test('blog has property: id', async () => {
  const blogsAtStart = helper.initialBlogs
  const blogToView = blogsAtStart[0]

  const resultBlog = await api
    .get(`/api/blogs/${blogToView._id}`)
    .expect(res => {
      if (res.body.id ) {
        console.log(res.body.id)
      }else {
        return console.error('does not have id')
      }
    })
  
})

test('a new blog is added', async () => {
  const blogsAtStart = helper.initialBlogs
  const newBlog = {title: 'hilihihg', author: 'Your mom', url: 'http:/your/mom', likes: 34}
  await api
    .post('/api/blogs/')
    .send(newBlog)
    .expect(201)
  
  const blogsAtEnd = await helper.blogsInDb()
  const blogsMapped = blogsAtEnd.map(m => m.title)
  assert.strictEqual(blogsAtEnd.length, blogsAtStart.length + 1)
  assert(blogsMapped.includes('hilihihg'))
})

test('a blog with no likes will have value of 0', async () => {
  const newBlog = {title: 'hilihihg', author: 'Your mom', url: 'http:/your/mom'}
  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)

  const blogsAtEnd = await helper.blogsInDb()
  const blogsMapped = blogsAtEnd.map(m => m.likes)
  assert(blogsMapped.includes(0))
})

after(async () => {
  await mongoose.connection.close()
})