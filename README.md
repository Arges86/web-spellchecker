# web-spellchecker

web-spellchecker is a VueJs/ExpressJS full stack application for checking the spelling of any webpage.
  - Enter web address
  -- Must be publicaly accessable
  - See list of words and if they are in the dictionary

### Tech

web-spellchecker uses a number of open source projects to work properly:

* [vuejs] - HTML enhanced for web apps!
* [buefy] - awesome web-based text editor
* [node.js] - evented I/O for the backend
* [Express] - fast node.js network app framework

### Installation

web-spellchecker requires [Node.js](https://nodejs.org/) v10+ to run.

The front end is in the './client' folder and the backend is in the './server' folder
Install the dependencies and devDependencies and start the server.

```sh
$ cd web-spellchecker/client
$ npm install
$ npm run serve

$ cd web-spellchecker/server
$ npm install
$ npm nodemon
```

For production environments...

```sh
$ cd web-spellchecker/client
$ npm run build
```

For the server I recoomend [pm2](http://pm2.keymetrics.io/docs/usage/quick-start/)

### Todos

 - Write MORE Tests
 - Add Themes
 - Add domain crawler
 -- The goal is to go to each unique link in the domain (if chosen) and check that page as well
 - Allow as js script to be specified to run before collecting page data

License
----

MIT


**Free Software, Hell Yeah!**

[//]: # (These are reference links used in the body of this note and get stripped out when the markdown processor does its job. There is no need to format nicely because it shouldn't be seen. Thanks SO - http://stackoverflow.com/questions/4823468/store-comments-in-markdown-syntax)

   [buefy]: <https://buefy.org/>
   [git-repo-url]: <https://github.com/Arges86/web-spellchecker>
   [vuejs]: <https://vuejs.org/>
   [expressjs]: <https://expressjs.com/>
   [node.js]: <http://nodejs.org>
   [express]: <http://expressjs.com>
