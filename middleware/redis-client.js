const redis = require('redis');
const {promisify} = require('util');
const client = redis.createClient({
  legacyMode : true,
  // url: 'redis://127.0.0.1:6379'
  port : 6379,
  host : '127.0.0.1'
});

client.connect();
client.on('connect', function () {
  console.log('redis connected');
}).on('error', function (error) {
  console.log(error);
})

module.exports = {
  ...client,
  getAsync: promisify(client.get).bind(client),
  setAsync: promisify(client.set).bind(client), 
  keysAsync: promisify(client.keys).bind(client)
};