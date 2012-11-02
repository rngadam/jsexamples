// It is supported by Firefox and Rhino, but not by V8 (Chrome, node.js). It is on the list of features that might make it into V8, though. Given the following definition.
var obj = {
    __noSuchMethod__: function(name, args) {
        print("Method " + name);
    }
};

obj.foo();