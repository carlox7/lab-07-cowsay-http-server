'use strict';

const bodyParser = require('./lib/bodyparser');
const http = require('http');
const url = require('url');
const queryString = require('querystring');
const cowsay = require('cowsay');
const PORT = process.env.PORT || 3000;

const server = module.exports = http.createServer(function(req, res) {
  console.log(req.url);
  req.url = url.parse(req.url);
  req.url.query = queryString.parse(req.url.query);

  if(req.method === 'POST') {
    if(req.url.pathname === '/cowsay') {
      bodyParser(req, function(err){
        if(err) console.error(err);
        let message = cowsay.say({text: req.body.text});
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.write(message);
        res.end(); //this will not be at the end of POST and GET
      });
    } else {
      let message = cowsay.say({text: 'bad request entry: localhost:3000/cowsay?text=howdy'});
      res.writeHead(400, {'Content-Type': 'text/plain'} );
      res.write(message);
      res.end();
    }
  }
  // NOTE: below is a cURL command that can be run from the terminal when your server is running
  // curl -H "Content-Type: application/json" -X POST -d '{"text": "moo!"}' http://localhost:3000/cowsay

  // curl (primary command)
  // -H "Content-Type: application/json" (sets the headers)
  // -X POST (sets the POST method)
  // -d {"text": "moo!"} (sets the req.body data)
  // http://localhost:3000/cowsay (url for the request)

  if(req.method === 'GET') {

    if(req.url.pathname === '/cowsay') {
      let queryText = req.url.query.text;
      if(!queryText) {
        let message = cowsay.say({text: 'bad request entry: localhost:3000/cowsay?text=howdy'});
        res.setHead(400, {'Content-Type': 'text/plain'});
        res.write(message);
        res.end();
      }

      let message = cowsay.say({text: queryText});
      res.setHead(200, {'Content-Type': 'text/plain'});
      res.write(message);
      res.end();

    }
  }
});

server.listen(PORT, () => console.log(`listening on port, ${PORT}`));
