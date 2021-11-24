
const db = require("../app/models");
const Post = db.posts;
const {server} = require('../server.js')
const {initialPosts, api, getAllPosts} = require('./helpers/helpers')


beforeEach(async ()=>{
    await Post.destroy({where: {}});
    
    const post1 = initialPosts[0];
    await Post.create(post1);

    const post2 = initialPosts[1];
    await Post.create(post2);

})

describe('API for posts',()=>{
    test('posts are returned as json', async () =>{
        await api
            .get('/api/posts')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })
    
    test('there are two posts', async () =>{
        const {response} = await getAllPosts()
        expect(response.body).toHaveLength(initialPosts.length)
    })
    
    test('the fist post have name test 1', async () =>{
        const {names} = await getAllPosts()
        expect(names).toContain('test 1')
    })

    test('a valid post can be added', async () => {
        const newPost = {
            name: 'test 3',
            description: "descripción test 3"
        }

        await api
            .post('/api/posts')
            .send(newPost)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const response = await api.get('/api/posts')
        const names = response.body.map(post => post.name)
        expect(response.body).toHaveLength(initialPosts.length + 1)
        expect(names).toContain(newPost.name)
    })

    test('post without name is not added', async () => {
        const newPost = {
            description: "descripción test 3"
        }

        await api
            .post('/api/posts')
            .send(newPost)
            .expect(400)

        const {response} = await getAllPosts()
        expect(response.body).toHaveLength(initialPosts.length)
    })

    test('a post can be deleted', async() => {
        const {response: fistResponse} = await getAllPosts()
        const { body: posts} = fistResponse
        const postToDelete = posts[0]

        await api
            .delete(`/api/posts/${postToDelete.id}`)
            .expect(200)
        
        const {names, response: secondResponse} = await getAllPosts()

        expect(secondResponse.body).toHaveLength(initialPosts.length - 1)
        
        expect(names).not.toContain(postToDelete.name)
    })
}) 


afterAll(()=>{
    server.close()//Evita dejar el servidor abierto
})