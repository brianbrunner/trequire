# trequire

[thunkify](https://github.com/visionmedia/node-thunkify) an entire module at once.
Useful if you want to use normal, asynchronous modules with 
[co](https://github.com/visionmedia/co). All newly created, thunkified functions
are prefixed with "co"

## Installation

```
$ npm install trequire
```

## Examples

You can thunkify entire modules simply by using `trequire` in place of `require`:

```js

var trequire = require('trequire');
var fs = trequire('fs');

fs.readFile('package.json', 'utf8', function(err, str){
  // normal async versions of all functions are still available
});

fs.coreadFile('package.json', 'utf8')(function(err, str){
  // all functions also have a thunkified version
});

```

This works on modules like `fs` which are just a collection of functions 
as well as on modules that construct and return objects (so long as those 
underlying objects can be accessed by recursively searching through the 
module). For example, you can easily create a thunkified redis client using
trequire:

```js

var trequire = require('trequire');
var redis = trequire('redis');
var rcli = redis.createClient()

rcli.set('foo', 'bar', function(err, res){
  // res = "OK"
});

rcli.coset('foo', 'bar')(function(err, res){
  // res = "OK"
});

rcli.get('foo', function(err, res){
  // res = "bar"
});

rcli.coget('foo')(function(err, res){
  // res = "bar"
});

```

`trequire` can also be called on objects. For example, to thunkify
only the `RedisClient` instead of the entire module, you could do 
the following:

```js

var trequire = require('trequire');
var redis = require('redis');

trequire(redis.RedisClient);

var rcli = redis.createClient();

// rcli now has coget, coset, etc.

```

## Use with `co`

Thunks make it easy to write code that works well with the
`co` module. This allows you to write code that is still 
asynchronous but in some cases is easier to read. `co` 
currently requires you to run your code with the `--harmony` 
flag as it utilizes javascript generators.

```js

var trequire = require('trequire');
var redis = trequire('redis');
var co = require('co');

var rcli = redis.createClient();

co(function *(){
    
    // set the key "foo" to "bar"
    yield redis.coset("foo","bar");

    // retrieve the value of the key "foo"
    var res = yield redis.coget("foo");
    // res = "bar"

})()

```

For reference, this same code is repeated below in a
standard asynchronous style: 

```js

var redis = require('redis');

var rcli = redis.createClient();

// set the key "foo" to "bar"
rcli.set("foo", "bar", function(err){

    // retrieve the value of the key "foo"
    rcli.get("foo", function(err, res){

        // res = "bar"

    })

})

```

By thunkifying existing modules and using `co`, you can leverage
existing node modules while easily avoiding the common node pitfall
of callback hell spaghetti code.

# License

  MIT
