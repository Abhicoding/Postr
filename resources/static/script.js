var input = document.querySelector('textarea')
var btn = document.querySelector('button')
var body = document.querySelector('body')

btn.onclick = function () {
  let temp = input.value.match(/^\s+(.*)/)
  input.value = temp ? temp[1] : input.value
  if (input.value) {
    var myPost = input.value
    input.value = ''
    var div = document.createElement('div')
    div.setAttribute('class', 'posted')
    var postText = document.createElement('span')

    postText.textContent = myPost
    div.appendChild(postText)
    body.appendChild(div)
    input.focus()
  }
}
