const app = document.getElementById('scope');

const container = document.createElement('div');

container.setAttribute('class', 'container');

app.appendChild(container);

var request = new XMLHttpRequest();
request.open('GET', 'https://storage.googleapis.com/dito-questions/events.json', true);
request.onload = function () {

  
  var data = JSON.parse(this.response);
  if (request.status >= 200 && request.status < 400) {
    
    console.log(data);
  } else {
  }
}

request.send();