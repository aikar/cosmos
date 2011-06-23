
// load all our modules.
var autoloadModules = [
  'traceur',
  'autoloader',
];

autoloadModules.forEach(function (mod) {
  require(mod);
})

registerAutoloader(__dirname + '/classes');

var origTraceurCreateClass = traceur.runtime.createClass;
traceur.runtime.createClass = function (className) {
  return global[className] = origTraceurCreateClass.apply(this, arguments);
}
