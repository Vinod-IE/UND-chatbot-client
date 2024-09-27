const RestProxy = require('sp-rest-proxy');
const settings = {
  configPath: './private.json',
  port: 8081 // Change this to an unused port
  // staticRoot: 'node_modules/sp-rest-proxy/static',
  // Root folder for static content
};

const restProxy = new RestProxy(settings);
restProxy.serve();
