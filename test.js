require('cosmos');
var foo = new Cosmos.Foo(3,2,1);
delete Cosmos.Foo.toString
console.log(Cosmos.Foo);
console.log(foo instanceof Cosmos.Foo);
foo.bar();
