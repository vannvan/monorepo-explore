(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.MSDK = {}));
})(this, (function (exports) { 'use strict';

	var init = function () { };

	exports.init = init;

	Object.defineProperty(exports, '__esModule', { value: true });

}));
