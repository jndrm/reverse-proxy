# reverse-proxy
A TCP based reverse-proxy written with Typescript supporting both HTTP and HTTPS.

The purpos of this project is to map your IPv6 address to an IPv4 based server. 
It can help you passing Apple Store's IPv6 only network rule.

## Usage

1. Install node on your VPS.

2. Clone this project
```sh
$ git clone https://github.com/jndrm/reverse-proxy.git
```

3. Resolve dependencies
```sh
$ npm install
```
or if you are using yarn
```sh
$ yarn
```

4. add your proxy mapping to index.js file
```js
const ReproxyServer = require('reverse-proxy').ReproxyServer

const server = new ReproxyServer()

server.add("your IPv6 address", "your IPv4 address or domain")

// start http 
server.startHttp()

// or start https
server.startHttps()

// or start both
server.startAll()
```