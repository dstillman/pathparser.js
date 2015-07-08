## About

pathparser.js is a tiny, simple-to-use JavaScript URL parser/router with no dependencies. It supports optional named parameters, query string parameter parsing, and automatic parameter assignment:

```javascript
var params = { format: 'html' };
var router = new PathParser(params);
router.add('users/:userID', function () {
    params.controller = 'users';
});
router.add('groups/:groupID', function () {
    params.controller = 'groups';
});

router.run('users/12345?format=json');
// params.controller == 'users'
// params.userID == 12345
// params.format == 'json'
```


## Usage

### Fixed paths

```javascript
var router = new PathParser;
router.add('users', function () {
    document.title = 'Users';
});
router.add('users/new', function () {
    document.title = 'New Users';
});
router.add('groups', function () {
    document.title = 'Groups';
});

router.run('users');
// document.title is now 'Users'
```

### Optional named parameters

Named parameters in the matching route are accessible from within the ```this``` object in the handler function:

```javascript
var router = new PathParser;
router.add('users/:userID', function () {
    showUser(this.userID);
});

router.run('users/2714');
// showUser(2714)
```

Routes still match even if there are unmatched named parameters at the end:

```javascript
var router = new PathParser;
router.add('collections/:collectionID/items/:subset', function () {
    showItemsInCollection(this.collectionID, this.subset);
});

router.run('collections/3424/items');
// showItemsInCollection(3424, undefined);
```

Routes are matched in the order they're added, so to use a more general route when a named parameter is omitted, simply add it first:

```javascript
var router = new PathParser;
router.add('users', function () {
    showUsers();
});
router.add('users/:userID', function () {
    showUser(this.userID);
});

router.run('users');
// showUsers();
```
(This behavior differs from some other routers that use more complex rules to determine which route to choose when there are multiple options.)

### Query string parameter parsing

Query string parameters are parsed automatically:

```javascript
var router = new PathParser;
router.add('users', function () {
    showUsers(this.limit);
});

router.run('users?limit=10');
// showUsers(10)
```

If a named parameter already exists with the same name as a query parameter, the query parameter will be ignored:

```javascript
var router = new PathParser;
router.add('users/:userID', function () {
    showUser(this.userID);
});

router.run('users/1?userID=4');
// showUser(1)
```

This holds true even if a trailing named parameter is omitted, in which case the named parameter will be ```undefined```.

### Automatic parameter assignment

You can pass an object to the constructor to have parameters from the matching route automatically assigned to that object, which can be used, among other things, to override a set of default parameters:

```javascript
var params = {
    format: 'html',
    limit: 25
};
var router = new PathParser(params);
router.add('users/:userID', function () {
    params.controller = 'users';
});
router.add('groups/:groupID', function () {
    params.controller = 'groups';
});

router.run('users/12345?format=json');
// params:
// {
//     format: 'json',
//     limit: 25,
//     controller: 'users',
//     userID: 12345
// }
```

Handler functions are run after automatic parameter assignment, so properties set in a handler will always override parameters from the request:

```javascript
var params = {};
var router = new PathParser(params);
router.add('users/:userID', function () {
    params.controller = 'users';
});
router.add('groups/:groupID', function () {
    params.controller = 'groups';
});

router.run('users/12345?controller=groups');
// params:
// {
//     controller: 'users',
//     userID: 12345
// }
```

In some cases, handler functions may not even be required when automatic parameter assignment is used:

```javascript
var params = {};
var router = new PathParser(params);
router.add('items/:itemID');
router.add('collections/:collectionID/items/:itemID');

router.run('collections/1/items/2?limit=10');
// params:
// {
//     collectionID: 1
//     itemID: 2,
//     limit: 10
// }
```

## Installation

### Node

```
npm install pathparser
```

```javascript
var PathParser = require('pathparser');
var router = new PathParser;
```

### Browser

```html
<script src="pathparser.min.js"></script>
<script>
var router = new PathParser;
</script>
```

### Mozilla JSM

```javascript
Components.utils.import("resource://myext/pathparser.js", MyExtension);
var router = new MyExtension.PathParser;
```
