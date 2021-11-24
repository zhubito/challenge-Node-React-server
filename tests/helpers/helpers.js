const {app} = require('../../server.js')
const supertest = require('supertest')

const api = supertest(app)

const initialPosts = [
    {
        "name": "test 1",
        "description": "descripción test 1"
    },
    {
        "name": "test 2",
        "description": "descripción test 2"
    }
]

const getAllPosts = async () => {
    const response = await api.get('/api/posts')
    return {
        names: response.body.map(post => post.name),
        response
    }
}

module.exports = {
    initialPosts,
    api,
    getAllPosts
}