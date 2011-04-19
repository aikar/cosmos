

// load all our modules.
var autoloadModules = [
  'joose',
    'joosex-attribute',
    'joosex-class-simpleconstructor',
    'joosex-class-singleton',
    'joosex-meta-lazy',
    'joosex-simplerequest',
    'joosex-namespace-depended',
    'joosex-observable',
  'autoloader',
];

autoloadModules.forEach(function (mod) {
  require(mod);
})
// load main Cosmos class
require('./cosmos');

registerAutoloader('Cosmos', __dirname + '/classes', Cosmos);
