const timeline  = document.getElementById('timeline'), //DOM element where will inserted the JSON contents using timeline design
      STORE     = "comprou", //defines a store event
      proxyurl  = "https://cors-anywhere.herokuapp.com/", //CORS proxy
      url       = "https://storage.googleapis.com/dito-questions/events.json"; //url to get JSON data

fetch(proxyurl + url) 
.then(response => response.text())
.then(contents => {
  let data     = JSON.parse(contents).events, //transform text from response to JSON
      stores   = [],
      products = [];

  //sort all events by descending timestamp 
  data.sort((a, b) => {
    return new Date(a.timestamp).getTime() < new Date(b.timestamp).getTime() ? 1 : -1;  
  });

  data.forEach(event => {
    //convert custom_data array to object for better data manipulation
    event.custom_data = event.custom_data.reduce((obj, product) => {
      obj[product.key] = product.value
      return obj
    }, {});

    //organize each event by it's type into an proper array
    if (event.event == STORE) 
      stores.push(event); 
    else 
      products.push(event);
  });

  //create a container for each store with it's products and more information

  let container, content, img, span, header, date, table, tr, th, td;

  stores.forEach(store => {

    //container 
    container = document.createElement('div');
    container.className = 'container';

    //content
    content = document.createElement('div');
    content.className = 'content';

    //store information
    header = document.createElement('div');
    header.className = 'header';

    //moment object for date formatting
    date = moment(new Date(store.timestamp));

    //date 
    img = document.createElement('img');
    img.src = 'assets/calendar.svg';
    header.appendChild(img);
    span = document.createElement('span');
    span.textContent = date.format('DD/MM/YYYY');
    header.appendChild(span);

    //time
    img = document.createElement('img');
    img.src = 'assets/clock.svg';
    header.appendChild(img);
    span = document.createElement('span');
    span.textContent = date.format('HH:mm');
    header.appendChild(span);

    //localization
    img = document.createElement('img');
    img.src = 'assets/place.svg';
    header.appendChild(img);
    span = document.createElement('span');
    span.textContent = store.custom_data.store_name;
    header.appendChild(span);

    //transaction value
    img = document.createElement('img');
    img.src = 'assets/money.svg';  
    header.appendChild(img);
    span = document.createElement('span');
    span.textContent = 'R$ ' + store.revenue.toFixed(2).replace('.', ',');
    header.appendChild(span);

    //products table
    table = document.createElement('table');
    table.className = "products";

    //table header
    tr = document.createElement('tr');
    th = document.createElement('th');
    th.appendChild(document.createTextNode('Produto'));
    tr.appendChild(th);
    th = document.createElement('th');
    th.appendChild(document.createTextNode('Preço'));
    tr.appendChild(th);
    table.appendChild(tr);

    //table rows with products
    products.forEach(product => {
      //identify products using transaction_id from the store
      if (product.custom_data.transaction_id == store.custom_data.transaction_id) {
        //insert row with product data
        tr = document.createElement('tr');
        td = document.createElement('td');
        td.appendChild(document.createTextNode(product.custom_data.product_name));
        tr.appendChild(td);
        td = document.createElement('td');
        td.appendChild(document.createTextNode('R$ ' + product.custom_data.product_price.toFixed(2).replace('.', ',')));
        tr.appendChild(td);
        table.appendChild(tr);
      }
    }); 

    //append all elements to the timeline div respecting hierarchy 
    content.appendChild(header);
    content.appendChild(table);
    container.appendChild(content);
    timeline.appendChild(container);
  });

}).catch((e) => console.log("An error has occurred: " + e));