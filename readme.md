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

### On-demand loading

These combined allows us to:

- build modules as separate JS files
- build main application with modules excluded, 
- load modules at runtime.

## Example

### Building:

The hxml script defines common build properties, then builds the module and then the main application.
Obviously you can create several build scripts instead.

Note how `-main` is absent of the module build options: we only want to include the code and without
an entry point.

	-cp src

	--each
	
	-js bin/module1.js
	module1.Module1
	
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

Note: this is all livereload-friendly!

## Gotchas

In a module, you MUST `@:expose` every type that you will explicitly use in your main
application's code (`new`, `Std.is`, `Type` reflection...).

Also if you are going to use reflection in the main application (eg. `Std.is`), you MUST use some
reflection in the module code, otherwise the compiler will not generate the reflection metadata.
Alternatively you can set `-dce no` in the compiler arguments for the module.

## Further improvements

The provided utility class is probably not super robust and it works in modern browsers with native 
ES6 Promise support. It requires a shim for Promise and there will probably be subtle issues to fix.

Node support should be easy to add, but it's not done yet.

One arguably not-so-great aspect of the (super simple) current system is that the global context is 
used to "bridge" the main application and the modules: we lose the complete isolation of the 
application code, which is unfortunate in the browser. There is a clever solution to find here. 