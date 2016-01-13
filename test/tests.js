test("run() boolean for match found", function () {
    expect(1);
    var router = new PathParser;
    router.add('items', function () {
    });
    router.add('itemsnomatch', function () {
        throw "Incorrect match";
    });
    ok(router.run('items') === true);
});

test("run() boolean for no match found", function () {
    var router = new PathParser;
    router.add('items', function () {});
    ok(router.run('users') === false);
});

test("Single-part fixed path", function () {
    expect(1);
    var router = new PathParser;
    router.add('items', function () {
        ok(true);
    });
    router.add('itemsnomatch', function () {
        throw "Incorrect match";
    });
    router.run('items');
});

test("Multi-part fixed path", function () {
    expect(1);
    var router = new PathParser;
    router.add('items/top', function () {
        throw "Incorrect match";
    });
    router.add('items', function () {
        ok(true);
    });
    router.add('itemsnomatch', function () {
        throw "Incorrect match";
    });
    router.add('item', function () {
        throw "Incorrect match";
    });
    router.run('items');
});

test("Don't match fixed path with additional parts", function () {
    var router = new PathParser;
    router.add('items', function () {
        throw new Error("Incorrect match");
    });
    notOk(router.run('items/top'));
});

test("Ignore leading slash in URL", function () {
    expect(1);
    var router = new PathParser;
    router.add('items', function () {
        ok(true);
    });
    router.add('itemsnomatch', function () {
        throw "Incorrect match";
    });
    router.run('/items');
});

test("Ignore leading slash in rules", function () {
    expect(1);
    var router = new PathParser;
    router.add('/items', function () {
        ok(true);
    });
    router.add('/itemsnomatch', function () {
        throw "Incorrect match";
    });
    router.run('items');
});

test("Ignore trailing slash in URL", function () {
    expect(1);
    var router = new PathParser;
    router.add('items', function () {
        ok(this.itemID == undefined);
    });
    router.run('items/');
});

test("Root path ('/' URL, empty rule)", function () {
    expect(1);
    var router = new PathParser;
    router.add('items/top', function () {
        throw "Incorrect match";
    });
    router.add('items/', function () {
        throw "Incorrect match";
    });
    router.add('', function () {
        ok(true);
    });
    router.run('/');
});

test("Root path (empty URL, empty rule)", function () {
    expect(1);
    var router = new PathParser;
    router.add('items/top', function () {
        throw "Incorrect match";
    });
    router.add('items/', function () {
        throw "Incorrect match";
    });
    router.add('', function () {
        ok(true);
    });
    router.run('/');
});

test("Root path (empty URL, '/' rule)", function () {
    expect(1);
    var router = new PathParser;
    router.add('items/top', function () {
        throw "Incorrect match";
    });
    router.add('items/', function () {
        throw "Incorrect match";
    });
    router.add('/', function () {
        ok(true);
    });
    router.run('');
});

test("Root path (empty URL with query string, empty rule)", function () {
    expect(1);
    var router = new PathParser;
    router.add('items/top', function () {
        throw "Incorrect match";
    });
    router.add('items/', function () {
        throw "Incorrect match";
    });
    router.add('/', function () {
        ok(this.q == 'foo');
    });
    router.run('?q=foo');
});

test("Root path ('/' URL with query string, empty rule)", function () {
    expect(1);
    var router = new PathParser;
    router.add('items/top', function () {
        throw "Incorrect match";
    });
    router.add('items/', function () {
        throw "Incorrect match";
    });
    router.add('/', function () {
        ok(this.q == 'foo');
    });
    router.run('/?q=foo');
});

test("Named parameter", function () {
    expect(1);
    var router = new PathParser;
    router.add('items/:itemID', function () {
        ok(this.itemID == 2);
    });
    router.run('items/2');
});

test("Named parameters are optional", function () {
    expect(1);
    var router = new PathParser;
    router.add('items/:itemID', function () {
        ok(this.itemID == undefined);
    });
    router.run('items');
});

test("First match wins (named parameter)", function () {
    expect(1);
    var router = new PathParser;
    router.add('items/:itemID', function () {
        ok(this.itemID == undefined);
    });
    router.add('items', function () {
        throw "Incorrect match";
    });
    router.run('items');
});

test("First match wins (named parameter before exact match)", function () {
    expect(1);
    var router = new PathParser;
    router.add('items/:itemID', function () {
        ok(this.itemID == 1);
    });
    router.add('items/1', function () {
        throw "Incorrect match";
    });
    router.run('items/1');
});

test("First match wins (duplicate rule)", function () {
    expect(1);
    var router = new PathParser;
    router.add('items', function () {
        ok(this.itemID == undefined);
    });
    router.add('items', function () {
        throw "Incorrect match";
    });
    router.run('items');
});

test("Query string parameters", function () {
    expect(2);
    var router = new PathParser;
    router.add('items', function () {
        ok(this.id == 1);
        ok(this.q == 'foo');
    });
    router.run('items?id=1&q=foo');
});

test("Query string parameters don't override named parameters", function () {
    expect(1);
    var router = new PathParser;
    router.add('items/:id', function () {
        ok(this.id == 1);
    });
    router.run('items/1?id=2');
});

test("Query string parameters don't override missing named parameters", function () {
    expect(1);
    var router = new PathParser;
    router.add('items/:id', function () {
        ok(this.id === undefined);
    });
    router.run('items?id=2');
});

test("Ignore fragment identifier", function () {
    expect(1);
    var router = new PathParser;
    router.add('items', function () {
        ok(true);
    });
    router.add('item', function () {
        throw "Incorrect match";
    });
    router.run('items#item2');
});

test("Ignore fragment identifier after query string", function () {
    expect(1);
    var router = new PathParser;
    router.add('items', function () {
        ok(this.q == 'foo');
    });
    router.add('item', function () {
        throw "Incorrect match";
    });
    router.run('items?q=foo#item2');
});

test("Automatic parameter assignment", function () {
    var params = {};
    var router = new PathParser(params);
    router.add('items/:itemID/:subset');
    router.run('items/1?q=foo');
    ok(params.itemID == 1);
    ok(params.subset == undefined);
    ok(params.q == 'foo');
});

test("Parameters set in handlers always win", function () {
    var params = {};
    var router = new PathParser(params);
    router.add('items/:itemID', function () {
        params.controller = 'items';
    });
    router.run('items/1?controller=groups');
    ok(params.controller == 'items');
    ok(params.itemID == 1);
});