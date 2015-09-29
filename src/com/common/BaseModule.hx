package com.common;

import js.Browser;
import js.html.DivElement;

@:expose
class BaseModule
{
	public var view:DivElement;

	public function new() 
	{
		var doc = Browser.document;
		view = doc.createDivElement();
	}
	
}