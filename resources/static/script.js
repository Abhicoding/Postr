const input = document.querySelector('textarea')
const btn = document.querySelector('button')
const body = document.querySelector('body')

fetch ('/postdata').then((response) => response.json()).then((data) => createPosts(data));

function createPosts(data) {
  let div, postText
  for (let x of Object.values(data)){
      div = document.createElement('div')
      div.setAttribute('class', 'posted')
      postText = document.createElement('span')
      postText.textContent = x
      div.appendChild(postText)
      body.appendChild(div)
      input.focus()
  }
}

btn.onclick = function () {
  let temp = input.value.match(/^\s+(.*)/)
  input.value = temp ? temp[1] : input.value
  if (input.value) {
    createPosts(input.value)
    input.value = ''

    fetch('/posted', {
      'method': 'post',
      'body': myPost
    })
  }
}
