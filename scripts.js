const container = document.getElementById('container'),
      STORE     = "comprou",
      proxyurl  = "https://cors-anywhere.herokuapp.com/",
      url       = "https://storage.googleapis.com/dito-questions/events.json"; // site that doesn’t send Access-Control-*

fetch(proxyurl + url) 
.then(response => response.text())
.then(contents => {
  var data = JSON.parse(contents).events;
  var stores = [];
  var itens = [];
  data.sort((a, b) => {
    return new Date(a.timestamp).getTime() > new Date(b.timestamp).getTime() ? 1 : -1;  
  });
  data.forEach(event => {
    event.custom_data = event.custom_data.reduce((obj, item) => {
      obj[item.key] = item.value
      return obj
    }, {})
    if (event.event == STORE) 
      stores.push(event); 
    else 
      itens.push(event);
  });
  console.log(stores);
  console.log(itens);
  
  stores.forEach(store => {
    var card = document.createElement('div');
    card.className = 'container right';

    var content = document.createElement('div');
    content.className = 'content';

    var header = document.createElement('div');
    
    var calendar = document.createElement('img');
    calendar.src = 'calendar.svg';
    
    var data = moment(new Date(store.timestamp));

    var ddmmyy = document.createTextNode(data.format('DD/MM/YYYY'));
    
    var clock = document.createElement('img');
    clock.src = 'clock.svg';

    var hhmm = document.createTextNode(data.format('HH:mm'));

    var place = document.createElement('img');
    place.src = 'place.svg';

    var name = document.createTextNode(store.custom_data.store_name);

    var money = document.createElement('img');
    money.src = 'money.svg';

    var revenue = document.createTextNode('R$ ' + store.revenue.toFixed(2).replace('.', ','));

    header.appendChild(calendar);
    header.appendChild(ddmmyy);
    header.appendChild(clock);
    header.appendChild(hhmm);
    header.appendChild(place);
    header.appendChild(name);
    header.appendChild(money);
    header.appendChild(revenue);

    content.appendChild(header);

    card.appendChild(content);

    container.appendChild(card);
    /*
    itens.forEach(item => {
      if (item.custom_data.transaction_id == store.custom_data.transaction_id) {=
      }
    }); =
    */
  })

})
.catch(() => console.log("Can’t access " + url + " response. Blocked by browser?"))