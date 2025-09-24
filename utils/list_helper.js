const lodash = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((accumulator, blog) => {
    return accumulator + blog.likes
  }, 0)
}

const favoriteBlog = (blogs) => {
  if( Array.isArray(blogs) ) {
    let higherLikes = {
      _id: "5a422a851b54a676234d17f7",
      title: "React patterns",
      author: "Michael Chan",
      url: "https://reactpatterns.com/",
      likes: 0,
      __v: 0
    }
    
    blogs.map((blog) => {
      blog.likes > higherLikes.likes
        ? higherLikes = blog
        : higherLikes = higherLikes
    })
    return higherLikes._id
  } else return blogs._id
  
}

const mostBlogs = (blogs) => {
  const mostAuthor = lodash(blogs).countBy('author').entries().maxBy(lodash.last)
  if (blogs.length === 1) {
    return blogs[0].author
  }else {
    return {author: mostAuthor[0], blogs: mostAuthor[1]}
  }
  
}

const mostLikes = (blogs) => {
  // const mostLiked = lodash.chain(blogs).groupBy('author').mapValues((likes, key) => lodash.sumBy(likes, 'likes')).value()
  const keys = ['author', 'likes']
  const mostLiked = lodash.chain(blogs)
    .groupBy('author')
    .mapValues((entries) => (lodash.sumBy(entries, 'likes')))
    .value()
  const newArray = lodash.map(mostLiked, (likes, author) => {
    return {   author: author, likes: likes }; // Create a new object to avoid mutation
  })
  const finalArray = lodash.chain(newArray)
    .maxBy('likes')
    .value()
  
  return finalArray
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}