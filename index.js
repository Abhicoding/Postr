const express = require('express')
const app = express()

const path = require('path')
const session = require('express-session')

const randomKey = require('./utilities')

const bodyParser = require('body-parser')

const redis = require('redis')
const client = redis.createClient()

const bcrypt = require('bcrypt')
const saltRounds = 10

app.use(express.static('resources/static/'))
app.use(session({secret: 'testing', resave: false, saveUninitialized: false}))

app.use(bodyParser.text())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded())

app.get('/home', (req, res) => {
  if (!req.session.email) {
    res.sendFile(path.join(__dirname + '/resources/public/home.html'))
  } else {
    res.redirect('/')
  }
})

app.get('/login', (req, res) => {
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
        bcrypt.compare(req.body.password, result, (err, result) => {
          if (err) {
            throw err
          }
          if (result) {
            req.session.email = req.body.email
            res.redirect('/')
          } else {
            res.redirect('/login')
          }
        })
      })
    }
  })
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
      bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
        if (err) {
          throw err
        }
        client.hmset('users', req.body.email, hash, redis.print)
        res.redirect('/login')
      })
    }
  })
})

app.get('/', (req, res) => {
  if (req.session.email) {
    res.sendFile(path.join(__dirname + '/resources/public/index.html'))
  } else {
    res.redirect('/home')
  }
})

app.get('/api/me', (req, res) => {
  if (req.session.email) {
    res.json({'status': 'success', 'email': req.session.email})
  } else {
    res.json({'status': 'failure'})
  }
})

app.post('/posted', (req, res) => {
  if (req.session.email) {
    let key = randomKey.keygen(), json = {}
    json.user = req.session.email
    json.post = req.body.post
    client.hmset('posts', key, JSON.stringify(json), redis.print)
    res.redirect('/')
  } else {
    res.redirect('/home')
  }
})

app.get('/postdata', (req, res) => {
  client.hgetall('posts', function (error, result) {
    if (error) {
      throw error
    }
    res.json(result)
  })
})

app.get('/logout', (req, res) => {
  req.session.destroy()
  res.redirect('/home')
})

app.listen(8080, function () {
  console.log('Example app listening on port 8080!')
})

client.on('error', function (err) {
  console.log('Something went wrong ', err)
})
