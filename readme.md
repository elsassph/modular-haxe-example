# Modular Haxe JS

This project demonstrates the creation of a Haxe-JavaScript modular project with on-demand 
loading of modules (JS + CSS).

It's really easy and absolutely transparent in the code!

## Basics

### Haxe compiler can exclude classes or entire packages

Compiler argument to exclude one class

	--macro exclude('module1.Module1')

Compiler argument to exclude an entire package:

	--macro exclude('module1')

### Haxe JS can expose a class to the global context

    package module1;
    @:expose
	class Module1 {
	}

When the JS is loaded, the reference to the class is exposed globally:

	window.module1.Module1 // browser
	exports.module1.Module1 // node

### The "hack"

Firstly, with a tiny change to Haxe JS output, it is possible to transparently "merge" the scopes 
of the different loaded JS files, so that the main JS can instantiate classes from modules, and 
so that modules can extend classes from the main JS or some other module.

The trick is really as simple as that:
	
	// replace
	$hx_exports.com = $hx_exports.com || {};
	// by
	var com = $hx_exports.com = $hx_exports.com || {};

Secondly, we don't want to expose on the global scope so we're changing Haxe default to a
"private" scope called `$hx_scope`. 

Now there's no clean way to actually expose something to `window` or `exports`; you can do it 
explicitly for now: 

    untyped window.MyPublicClass = MyPublicClass
    untyped exports.MyPublicClass = MyPublicClass

### On-demand loading

These combined allows us to:

- build modules as separate JS files
- build main application with modules excluded, 
- load modules at runtime.

## Example

### Building:

The hxml script defines common build properties, then builds the module and then the main application.
Obviously you can create several build scripts instead.

Here's the example script explained:

1. Common compiler options

	Those should include the `Stub.modules()` macro which does the JS modification previously
	described, and finishing by `--each` to start defining builds. 

		-cp src
		-debug
		--macro util.Stub.modules()
		--each

2. The builds (the order doesn't matter)

	The important part is to use the `--exclude` macro to ommit classes/packages that are 
	expected to be loaded, and `--next` between each module. Here we only have `-main` for the 
	main JS because we want the static main to be executed.  

		-js bin/module1.js
		module1.Module1
		--macro exclude('com.common')

		--next
	
		-js bin/index.js
		-main Main
		--macro exclude('module1')

### Loading

This sample project includes a utility class to load modules at run time, as well as its associated 
CSS file if desired.

The function `Require.module(name, loadCss)` returns a promise.

	Require.module('module1').then(moduleLoaded, moduleFailed);

	function moduleLoaded(name) {
		new Module1(); // that's all
    }

If loading any resource fails, the promise will be rejected and you'll be able to call the method
again to retry loading the module.

## Gotchas

**Shared classes can not be in the global package.**

**In a module, you MUST `@:expose` every type that you will explicitly use in your main
application's code (`new`, `Std.is`, `Type` reflection...).**

Also if you are going to use reflection in the main application (eg. `Std.is`), you MUST use some
reflection in the modules code, otherwise the compiler will not generate the reflection metadata.
Alternatively you can set `-dce no` in the compiler arguments for the module.

**The utility class uses the browser ES6 Promise object** - make sure to include a shim if you want to 
target a wide range of browsers.

## Further improvements

The provided utility classes seems to be working nicely in modern browsers but it wasn't tested on a
real project - we'll probably discover subtle issues...

What about some React hot-reload? It should be possible :)