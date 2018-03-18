const input = document.querySelector('textarea')
const btn = document.querySelector('#post-submit')
const page = document.querySelector('.page')

const welcomeDiv = document.querySelector('.welcome')

fetch('/postdata').then((response) => response.json()).then((data) => {
  if (data) {
    for (let x of Object.values(data)) {
      createPosts(JSON.parse(x))
    }
  }
})

const userEmail = fetch('/api/me', {credentials: 'same-origin'}).then((response) => response.json()).then((data) => {
  welcome(data.email)
  logout()
  return data.email
})

function createPosts (data) {
  let div, postText
  console.log(data)
  div = document.createElement('div')
  div1 = document.createElement('div')
  user = document.createElement('span')
  div2 = document.createElement('div')
  postText = document.createElement('span')
  div.setAttribute('class', 'postblock')
  div1.setAttribute('class', 'postuser')
  div2.setAttribute('class', 'posted')
  user.textContent = data.user + ' : '
  postText.textContent = data.post
  div1.appendChild(user)
  div2.appendChild(postText)
  div.appendChild(div1)
  div.appendChild(div2)
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
