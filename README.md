# web-spellchecker

web-spellchecker is a VueJs/ExpressJS full stack application for checking the spelling of any webpage.
  - Enter web address
  -- Must be publicaly accessable (unless your running the whole service yourself)
  - See list of words and if they are in the dictionary

### Tech

web-spellchecker uses a number of open source projects to work properly:

* [vuejs] - Front End MVC framework
* [buefy] - Pure CSS style Library
* [node.js] - Evented I/O for the backend
* [Express] - Fast node.js network app framework
* [cheerio] - An implementation of core jQuery designed specifically for the server.
* [axios] - Promise based HTTP client for the browser and node.js.
* [ws] - WebSocket client and server implementation.

### Installation Docker
From the root project directory:
```
docker-compose build
```

### Installation Native

web-spellchecker requires [Node.js](https://nodejs.org/) v10+ to run.

The front end is in the './client' folder and the backend is in the './server' folder
Install the dependencies and devDependencies and start the server.

```sh
$ cd web-spellchecker/client
$ npm install
$ npm run serve

$ cd web-spellchecker/server
$ npm install
$ npm run start:dev
```

For production environments...

```sh
$ cd web-spellchecker/client
$ npm run build
```
For the server I recomend [pm2](http://pm2.keymetrics.io/docs/usage/quick-start/)

### Build for Heroku
run the `build.ps1` script. This will build the vuejs frontend, and copy it to the `server/public` folder for deployment.   
Then switch to the server folder and initialize that folder as new repo (first time only) and push the code changes to heroku's remote repo.   
```sh
.\build.ps1
cd server
heroku login
git init
git remote add heroku https://git.heroku.com/domain-crawler.git
git add .
git commit -am "New Release"
git push heroku master
```

### Todos

 - Write MORE Tests
 - Add Themes
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
   [cheerio]: <https://www.npmjs.com/package/cheerio>
   [axios]: <https://www.npmjs.com/package/axios>
   [ws]: <https://www.npmjs.com/package/ws>
