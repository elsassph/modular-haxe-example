(function (console, $hx_exports) { "use strict";
$hx_exports.module1 = $hx_exports.module1 || {};
$hx_exports.module1.sub = $hx_exports.module1.sub || {};
var Main = function() {
	var doc = window.document;
	this.root = doc.createElement("div");
	this.root.className = "main";
	doc.body.appendChild(this.root);
	var link = doc.createElement("a");
	link.href = "#";
	link.onclick = $bind(this,this.loadContent);
	link.innerText = "Load module";
	this.root.appendChild(link);
};
Main.__name__ = true;
Main.main = function() {
	var app = new Main();
};
Main.prototype = {
	loadContent: function(_) {
		util_Require.module("module1").then($bind(this,this.moduleLoaded),$bind(this,this.moduleFailed));
		return false;
	}
	,moduleLoaded: function(name) {
		console.log("Module " + name + " loaded");
		var module = new module1.Module1();
		this.currentSub = module.sub;
		this.root.appendChild(module.view);
	}
	,moduleFailed: function(name) {
		console.log("Module " + name + " failed");
	}
};
Math.__name__ = true;
var Reflect = function() { };
Reflect.__name__ = true;
Reflect.field = function(o,field) {
	try {
		return o[field];
	} catch( e ) {
		return null;
	}
};
Reflect.fields = function(o) {
	var a = [];
	if(o != null) {
		var hasOwnProperty = Object.prototype.hasOwnProperty;
		for( var f in o ) {
		if(f != "__id__" && f != "hx__closures__" && hasOwnProperty.call(o,f)) a.push(f);
		}
	}
	return a;
};
Reflect.isFunction = function(f) {
	return typeof(f) == "function" && !(f.__name__ || f.__ename__);
};
var haxe_IMap = function() { };
haxe_IMap.__name__ = true;
var haxe_ds_StringMap = function() {
	this.h = { };
};
haxe_ds_StringMap.__name__ = true;
haxe_ds_StringMap.__interfaces__ = [haxe_IMap];
haxe_ds_StringMap.prototype = {
	set: function(key,value) {
		if(__map_reserved[key] != null) this.setReserved(key,value); else this.h[key] = value;
	}
	,get: function(key) {
		if(__map_reserved[key] != null) return this.getReserved(key);
		return this.h[key];
	}
	,exists: function(key) {
		if(__map_reserved[key] != null) return this.existsReserved(key);
		return this.h.hasOwnProperty(key);
	}
	,setReserved: function(key,value) {
		if(this.rh == null) this.rh = { };
		this.rh["$" + key] = value;
	}
	,getReserved: function(key) {
		if(this.rh == null) return null; else return this.rh["$" + key];
	}
	,existsReserved: function(key) {
		if(this.rh == null) return false;
		return this.rh.hasOwnProperty("$" + key);
	}
	,remove: function(key) {
		if(__map_reserved[key] != null) {
			key = "$" + key;
			if(this.rh == null || !this.rh.hasOwnProperty(key)) return false;
			delete(this.rh[key]);
			return true;
		} else {
			if(!this.h.hasOwnProperty(key)) return false;
			delete(this.h[key]);
			return true;
		}
	}
};
var util_Require = function() { };
util_Require.__name__ = true;
util_Require.module = function(name,loadCss) {
	if(loadCss == null) loadCss = true;
	if(util_Require.loaded.exists(name)) return util_Require.loaded.get(name);
	var p = new Promise(function(resolve,reject) {
		var doc = window.document;
		var pending;
		if(loadCss) pending = 2; else pending = 1;
		var css = null;
		var script = null;
		var hasFailed = false;
		var resourceLoaded = function() {
			if(--pending == 0) {
				util_Require.joinModules(name);
				resolve(name);
			}
		};
		var resourceFailed = function() {
			if(!hasFailed) {
				hasFailed = true;
				util_Require.loaded.remove(name);
				if(css != null) doc.body.removeChild(css);
				doc.body.removeChild(script);
				reject(name);
			}
		};
		if(loadCss) {
			css = doc.createElement("link");
			css.rel = "stylesheet";
			css.onload = resourceLoaded;
			css.onerror = resourceFailed;
			css.href = "" + name + ".css";
			doc.body.appendChild(css);
		}
		script = doc.createElement("script");
		script.onload = resourceLoaded;
		script.onerror = resourceFailed;
		script.src = "" + name + ".js";
		doc.body.appendChild(script);
	});
	util_Require.loaded.set(name,p);
	return p;
};
util_Require.joinModules = function(loadedModule) {
	var join = $hx_join;
	var refs = join._refs;
	var _g = 0;
	var _g1 = Reflect.fields(refs);
	while(_g < _g1.length) {
		var module = _g1[_g];
		++_g;
		util_Require.joinModule(module,Reflect.field(refs,module));
	}
};
util_Require.joinModule = function(updateModule,refs) {
	console.log("Join " + updateModule);
	var join = $hx_join;
	var _g = 0;
	var _g1 = Reflect.fields(refs);
	while(_g < _g1.length) {
		var prop = _g1[_g];
		++_g;
		util_Require.merge(Reflect.field(join,prop),Reflect.field(refs,prop));
	}
};
util_Require.merge = function(from,to) {
	var _g = 0;
	var _g1 = Reflect.fields(from);
	while(_g < _g1.length) {
		var prop = _g1[_g];
		++_g;
		var value = Reflect.field(from,prop);
		if(Reflect.isFunction(value)) to[prop] = value; else {
			if(!Object.prototype.hasOwnProperty.call(to,prop)) to[prop] = { };
			util_Require.merge(value,Reflect.field(to,prop));
		}
	}
};
var $_, $fid = 0;
function $bind(o,m) { if( m == null ) return null; if( m.__id__ == null ) m.__id__ = $fid++; var f; if( o.hx__closures__ == null ) o.hx__closures__ = {}; else f = o.hx__closures__[m.__id__]; if( f == null ) { f = function(){ return f.method.apply(f.scope, arguments); }; f.scope = o; f.method = m; o.hx__closures__[m.__id__] = f; } return f; }
String.__name__ = true;
Array.__name__ = true;
var __map_reserved = {}
util_Require.loaded = new haxe_ds_StringMap();
Main.main();
if (typeof module1 == "undefined") var module1 = {}
$hx_join._refs = ($hx_join._refs || {}); $hx_join._refs.index = {module1:module1};
})(typeof console != "undefined" ? console : {log:function(){}}, typeof $hx_join != "undefined" ? $hx_join : $hx_join = {});

//# sourceMappingURL=index.js.map