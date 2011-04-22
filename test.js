require("joose")
x = Class({
  methods:{
    x:function(){}
  }
});
//console.log(x);
require('cosmos');
//Cosmos.Foo.inspect = function(){console.error('fuck')}
//console.log(Cosmos);
//console.log((new Cosmos).Foo);
/*var Proxy = require("harmonyproxy"),
undef,
   handlers = {
      get: function(rec, name) {
        try {
          a.b = 1;
        } catch (e) {
          console.error("get", name);
          console.error(e.stack)
        }
        return true;
      },
      has: function(name) {
        return true;
      },
      set: function(rec, name, value) {
        //console.log("setting", name, value)
        properties[name] = value;
      },
      "delete": function(name) {
        return true;
      },
      enumerate: function() {
        return []
      },
      fix: function() {
        return undef;
      }
    };

var fn = Proxy.createFunction(handlers, function(name) {
      console.error("calling", filePath, name)
      return properties.apply(this, arguments);
    }, function() {
      console.error("constructing", filePath, properties);
      var instance = Object.create(properties.prototype);
      properties.apply(instance, arguments);
      return instance;
    });

console.log(fn.x);*/
var foo = new Cosmos.Foo(3,2,1);
//delete Cosmos.Foo.toString

console.log(foo instanceof Cosmos.Foo);
//foo.bar();
