const input = document.querySelector('textarea')
const btn = document.querySelector('button')
const body = document.querySelector('body')

const login = document.querySelector('#login')
const username = document.querySelector('#user')
const password = document.querySelector('#password')

fetch('/postdata').then((response) => response.json()).then((data) => {
  if (data) {
    for (let x of Object.values(data)) {
      createPosts(x)
    }
  }
})

function createPosts (data) {
  let div, postText
  div = document.createElement('div')
  div.setAttribute('class', 'posted')
  postText = document.createElement('span')
  postText.textContent = data
  div.appendChild(postText)
  body.appendChild(div)
}

btn.onclick = function () {
  let temp = input.value.match(/^\s+(.*)/)
  input.value = temp ? temp[1] : input.value
  if (input.value) {
    createPosts(input.value)
    fetch('/posted', {
      'method': 'post',
      'body': `${input.value}`
    })
    input.value = ''
    input.focus()
  }
}

login.onclick = function () {
  // alert(username.value)
  fetch('login', {
    'method': 'post',
    'headers': {
      'Content-Type': 'application/json'
    },
    'body': JSON.stringify({'username': username.value, 'password': password.value})
  })
}
