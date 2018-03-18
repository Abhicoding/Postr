const input = document.querySelector('textarea')
const btn = document.querySelector('#post-submit')
const page = document.querySelector('.page')

const welcomeDiv = document.querySelector('.welcome')

fetch('/postdata').then((response) => response.json()).then((data) => {
  if (data) {
    for (let x in data) {
      console.log(x, JSON.parse(data[x]))
      createPosts(x, JSON.parse(data[x]))
    }
  }
})

const userEmail = fetch('/api/me', {credentials: 'same-origin'}).then((response) => response.json()).then((data) => {
  welcome(data.email)
  logout()
  return data.email
})

function createPosts (key, data) {
  let div, postText
  div = document.createElement('div')
  div1 = document.createElement('div')
  user = document.createElement('span')
  div2 = document.createElement('div')
  div3 = document.createElement('div')
  postText = document.createElement('span')
  dbutton = document.createElement('button')

  div.setAttribute('class', 'postblock')
  div1.setAttribute('class', 'postuser')
  div2.setAttribute('class', 'posted')
  div3.setAttribute('class', 'buttons')
  dbutton.setAttribute('onclick', 'deletereq(this.id)')
  dbutton.setAttribute('id', `${key}`)

  dbutton.textContent = 'delete'

  user.textContent = data.user + ' : '
  postText.textContent = data.post

  div1.appendChild(user)
  div2.appendChild(postText)
  div3.appendChild(dbutton)
  div.appendChild(div1)
  div.appendChild(div2)
  div.appendChild(div3)
  page.appendChild(div)
}

function welcome (data) {
  let usertext = document.createElement('p')
  usertext.textContent = 'Welcome, ' + data
  welcomeDiv.appendChild(usertext)
}

function logout () {
  let out = document.createElement('a')
  out.href = '/logout'
  out.textContent = 'Logout'
  welcomeDiv.appendChild(out)
}

btn.onsubmit = function () {
  let temp = input.value.match(/^\s+(.*)/)
  input.value = temp ? temp[1] : input.value
  if (input.value) {
    createPosts(input.value)
    fetch('/posted', {
      'method': 'post',
      'body': `{op: ${userEmail}, post: ${input.value}}`
    })
    input.value = ''
    input.focus()
  }
}

function deletereq (input) {
  window.location.reload()
  fetch('/deletepost', {
    'credentials': 'same-origin',
    'method': 'post',
    'body': `${input}`
  })
  return false
}
