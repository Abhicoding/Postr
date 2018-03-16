const express = require('express')
const app = express()

const path = require('path')
const session = require('express-session')

const randomKey = require('./utilities')

const bodyParser = require('body-parser')

const redis = require('redis')
const client = redis.createClient()

// app.use(express.static('resources/static/'))
app.use(bodyParser.text())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded())

app.use(session({secret: 'testing', resave: false, saveUninitialized: true}))

app.get('/home', (req, res) => {
  console.log(req.session.email + '/home')
  if (!req.session.email) {
    res.sendFile(path.join(__dirname + '/resources/public/home.html'))
  } else {
    res.redirect('/')
  }
})

app.get('/', (req, res) => {
  console.log('here is it/', req.session.email)
  if (req.session.email) {
    res.sendFile(path.join(__dirname + '/resources/static/index.html'))
  } else {
    res.redirect('/home')
  }
})

app.post('/posted', (req, res) => {
  let key = randomKey.keygen()
  client.hmset('posts', key, req.body.post, redis.print)
  res.send()
})

app.get('/postdata', (req, res) => {
  client.hgetall('posts', function (error, result) {
    if (error) {
      throw error
    }
    res.send(JSON.stringify(result))
  })
})

app.get('/login', (req, res) => {
  console.log(req.session.email)
  if (req.session.email) {
    res.redirect('/')
  } else {
    res.sendFile(path.join(__dirname + '/resources/public/login.html'))
  }
})

app.post('/login', (req, res) => {
  client.hkeys('users', (error, result) => {
    if (error) {
      throw error
    }
    if (result.includes(req.body.email)) {
      client.hget('users', req.body.email, (error, result) => {
        if (error) {
          throw error
        }
        if (result == req.body.password) {
          req.session.email = req.body.email
          res.redirect('/')
        } else {
          res.redirect('/login')
        }
      })
    }
  })
  // req.session.password = req.body.password
  // res.end('done')
})

app.get('/signup', (req, res) => {
  if (req.session.email) {
    res.redirect('/')
  } else {
    res.sendFile(path.join(__dirname + '/resources/public/sign-up.html'))
  }
})

app.post('/signup', (req, res) => {
  client.hkeys('users', function (error, result) {
    if (error) {
      throw error
    }
    if (result.includes(req.body.email)) {
      res.redirect('/signup')
    } else {
      client.hmset('users', req.body.email, req.body.password, redis.print)
      res.redirect('/')
    }
  })
})

// app.get('/logout',(req, res) => {})

app.listen(8080, function () {
  console.log('Example app listening on port 8080!')
})

client.on('error', function (err) {
  console.log('Something went wrong ', err)
})
