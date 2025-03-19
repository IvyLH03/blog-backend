import express from 'express'
import { init } from './blog.js';
import sql from './db.js';

const app = express()
const port = 7000

// CORS
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", req.headers.origin);
    if (req.headers["access-control-request-headers"]) {
        res.header("Access-Control-Allow-Headers", req.headers["access-control-request-headers"]);
    }
    if (req.headers["access-control-request-method"]) {
        res.header('Access-Control-Allow-Methods', req.headers["access-control-request-method"]);
    }
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Expose-Headers', 'Set-Cookie');
    res.header('Vary', 'Origin, Access-Control-Allow-Headers, Access-Control-Allow-Methods')
    next();
});

app.use(express.json())

await init()

app.get('/', (req, res) => {
  res.send('Hello World!')
}
)

// get a list of all blogs
app.get('/blogs', async (req, res) => {
  const blogs = await sql`select id, title, created_at from blog`
  res.json(blogs)
}
)

// get the content of a blog
app.get('/blog/:id', async (req, res) => {
  const blog = await sql`select * from blog where id = ${req.params.id}`
  res.json(blog[0])
}
)

// create a blog
app.post('/blog/create', async (req, res) => {
  if(req.body.upload_password !== process.env.UPLOAD_PASSWORD) {
    return res.status(401).json({error: 'Unauthorized'})
  }
  const blog = await sql`insert into blog (title, content) values (${req.body.title}, ${req.body.content}) returning id, title, created_at`
  res.json(blog)
}
)

// delete a blog
app.delete('/blog/:id', async (req, res) => {
  if(req.body.upload_password !== process.env.UPLOAD_PASSWORD) {
    return res.status(401).json({error: 'Unauthorized'})
  }
  const blog = await sql`delete from blog where id = ${req.params.id}`
  res.json(blog)
}
)

// update a blog
app.put('/blog/:id', async (req, res) => {
  if(req.body.upload_password !== process.env.UPLOAD_PASSWORD) {
    return res.status(401).json({error: 'Unauthorized'})
  }
  const blog = await sql`update blog set title = ${req.body.title}, content = ${req.body.content} where id = ${req.params.id} returning id, title, created_at`
  res.json(blog)
}
)

app.listen(port, () => {
  console.log(`app listening on port ${port}`)
})