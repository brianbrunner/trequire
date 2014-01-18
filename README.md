# trequire

[thunkify](https://github.com/visionmedia/node-thunkify) an entire module at once.
Useful if you want to use normal, asynchronous modules with 
[co](https://github.com/visionmedia/co). All newly created, thunkified functions
are prefixed with "co"

## Installation

```
$ npm install trequire
```

## Example

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

# License

  MIT
