(function (console, $hx_exports) { "use strict";
$hx_exports.module1 = $hx_exports.module1 || {};
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
var haxe_IMap = function() { };
var haxe_ds_StringMap = function() {
	this.h = { };
};
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
};
var util_Require = function() { };
util_Require.module = function(name,loadCss) {
	if(loadCss == null) loadCss = true;
	if(util_Require.loaded.exists(name)) return util_Require.loaded.get(name);
	var p = new Promise(function(resolve,reject) {
		var doc = window.document;
		var pending;
		if(loadCss) pending = 2; else pending = 1;
		var resourceLoaded = function() {
			if(--pending == 0) resolve(name);
		};
		var resourceFailed = function() {
			reject(name);
		};
		if(loadCss) {
			var css = doc.createElement("link");
			css.rel = "stylesheet";
			css.onload = resourceLoaded;
			css.onerror = resourceFailed;
			css.href = "" + name + ".css";
			doc.body.appendChild(css);
		}
		var script = doc.createElement("script");
		script.onload = resourceLoaded;
		script.src = "" + name + ".js";
		script.onerror = resourceFailed;
		doc.body.appendChild(script);
	});
	util_Require.loaded.set(name,p);
	return p;
};
var $_, $fid = 0;
function $bind(o,m) { if( m == null ) return null; if( m.__id__ == null ) m.__id__ = $fid++; var f; if( o.hx__closures__ == null ) o.hx__closures__ = {}; else f = o.hx__closures__[m.__id__]; if( f == null ) { f = function(){ return f.method.apply(f.scope, arguments); }; f.scope = o; f.method = m; o.hx__closures__[m.__id__] = f; } return f; }
var __map_reserved = {}
util_Require.loaded = new haxe_ds_StringMap();
Main.main();
})(typeof console != "undefined" ? console : {log:function(){}}, typeof window != "undefined" ? window : exports);
