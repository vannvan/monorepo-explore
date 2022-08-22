import { gzip } from 'pako'
import { ImageSender } from './saEvent';

import { version } from '../../package.json'

export interface Props {
  [key: string]: any;
}

const ArrayProto = Array.prototype
const nativeForEach = ArrayProto.forEach
const slice = ArrayProto.slice
const nativeIsArray = Array.isArray
const ObjProto = Object.prototype
const toString = ObjProto.toString
const hasOwnProperty = ObjProto.hasOwnProperty
const breaker = {}

/**
 * script 动态加载 js
 * @param para
 */
export const loadScript = (para: any) => {
	para = Object.assign(
		{
			success: () => {},
			error: () => {},
			appendCall: (g: any) => {
				document.getElementsByTagName('head')[0].appendChild(g)
			},
		},
		para
	)

	let g: any = null
	if (para.type === 'css') {
		g = document.createElement('link')
		g.rel = 'stylesheet'
		g.href = para.url
	}
	if (para.type === 'js') {
		g = document.createElement('script')
		g.async = 'async'
		g.setAttribute('charset', 'UTF-8')
		g.src = para.url
		g.type = 'text/javascript'
	}
	g.onload = g.onreadystatechange = function () {
		if (
			!this.readyState ||
			this.readyState === 'loaded' ||
			this.readyState === 'complete'
		) {
			para.success()
			g.onload = g.onreadystatechange = null
		}
	}
	g.onerror = function () {
		para.error()
		g.onerror = null
	}
	para.appendCall(g)
}

/**
 * 判断是否字符串
 * @param obj
 * @returns
 */
export function isString(obj: any) {
	return toString.call(obj) == '[object String]'
}

/**
 * 判断是否对象
 * @param obj
 * @returns
 */
export const isObject = (obj: any) => {
	if (obj == null) return false

	return toString.call(obj) == '[object Object]'
}

/**
 * 判断是否函数方法
 * @param f
 * @returns
 */
export function isFunction(f: any) {
	if (!f) return false

	const type = toString.call(f)
	return type == '[object Function]' || type == '[object AsyncFunction]'
}

/**
 * 判断是否数字类型
 * @param obj
 * @returns
 */
export function isNumber(obj: any) {
	return toString.call(obj) == '[object Number]' && /[\d\.]+/.test(String(obj))
}

/**
 * 判断是否 dom 类型
 * @param obj
 * @returns
 */
export function isElement(obj: any) {
	return !!(obj && obj.nodeType === 1)
}

export function isEmptyObject(obj: any) {
	if (isObject(obj)) {
		for (var key in obj) {
			if (hasOwnProperty.call(obj, key)) {
				return false
			}
		}
		return true
	}
	return false
}

export function isUndefined(obj: any) {
	return obj === void 0
}

function map(obj: any, iterator: any) {
	let results: any[] = []
	if (obj == null) {
		return results
	}
	if (Array.prototype.map && obj.map === Array.prototype.map) {
		return obj.map(iterator)
	}
	each(obj, function (value: any, index: any, list: any) {
		results.push(iterator(value, index, list))
	})
	return results
}

function base64Decode(data: any) {
	var arr = []
	try {
		arr = map(atob(data).split(''), function (c: any) {
			return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
		})
	} catch (e) {
		arr = []
	}

	try {
		return decodeURIComponent(arr.join(''))
	} catch (e) {
		return arr.join('')
	}
}

export function base64Encode(data: any) {
	const unit: any = new Uint16Array(data);
	let result = ''
	try {
		result = btoa(String.fromCharCode.apply(null, unit))
	} catch (error) {
		result = data
	}
	return result
}

function hashCode(str: string) {
	if (typeof str !== 'string') {
		return 0
	}
	let hash = 0
	let char: any = null
	if (str.length == 0) {
		return hash
	}
	for (let i = 0; i < str.length; i++) {
		char = str.charCodeAt(i)
		hash = (hash << 5) - hash + char
		hash = hash & hash
	}
	return hash
}

function isDate(obj: any) {
	return toString.call(obj) == '[object Date]'
}

function isSupportCors() {
	if (typeof window.XMLHttpRequest === 'undefined') {
		return false
	}
	if ('withCredentials' in new XMLHttpRequest()) {
		return true
	} else {
		return false
	}
}

/**
 * get userNative
 * @returns
 */
export function getUA() {
	const Sys: any = {}
	const ua = navigator.userAgent.toLowerCase()
	let s
	if ((s = ua.match(/opera.([\d.]+)/))) {
		Sys.opera = Number(s[1].split('.')[0])
	} else if ((s = ua.match(/msie ([\d.]+)/))) {
		Sys.ie = Number(s[1].split('.')[0])
	} else if ((s = ua.match(/edge.([\d.]+)/))) {
		Sys.edge = Number(s[1].split('.')[0])
	} else if ((s = ua.match(/firefox\/([\d.]+)/))) {
		Sys.firefox = Number(s[1].split('.')[0])
	} else if ((s = ua.match(/chrome\/([\d.]+)/))) {
		Sys.chrome = Number(s[1].split('.')[0])
	} else if ((s = ua.match(/version\/([\d.]+).*safari/))) {
		Sys.safari = Number(s[1].match(/^\d*.\d*/))
	} else if ((s = ua.match(/trident\/([\d.]+)/))) {
		Sys.ie = 11
	}
	return Sys
}

/**
 * 判断是否数组
 */
export const isArray =
	nativeIsArray ||
	function (obj) {
		return toString.call(obj) === '[object Array]'
	}

/**
 * 获取请求 url
 * @param para
 * @returns
 */
export function getURL(para?: any) {
	if (isString(para)) {
		para = trim(para)
		return _decodeURI(para)
	} else {
		return _decodeURI(location.href)
	}
}

/**
 * 寻找数组对应下标
 * @param arr
 * @param target
 * @returns
 */
export function indexOf(arr: any[], target: any) {
	const indexof = arr.indexOf
	if (indexof) {
		return indexof.call(arr, target)
	} else {
		for (let i = 0; i < arr.length; i++) {
			if (target === arr[i]) return i
		}
		return -1
	}
}

export function each(obj: any, iterator: any, context?: any) {
	if (obj == null) return false

	if (nativeForEach && obj.forEach === nativeForEach) {
		obj.forEach(iterator, context)
	} else if (isArray(obj) && obj.length === +obj.length) {
		for (var i = 0, l = obj.length; i < l; i++) {
			if (i in obj && iterator.call(context, obj[i], i, obj) === breaker) {
				return false
			}
		}
	} else {
		for (var key in obj) {
			if (hasOwnProperty.call(obj, key)) {
				if (iterator.call(context, obj[key], key, obj) === breaker) {
					return false
				}
			}
		}
	}
}

export function filter(arr: any[], fn: any, self?: any) {
	const hasOwn = Object.prototype.hasOwnProperty
	if (arr.filter) {
		return arr.filter(fn)
	}
	const ret: any[] = []
	for (let i = 0; i < arr.length; i++) {
		if (!hasOwn.call(arr, i)) {
			continue
		}
		const val = arr[i]
		if (fn.call(self, val, i, arr)) {
			ret.push(val)
		}
	}
	return ret
}

export function trim(str: string) {
	if (!str) return ''
	return str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '')
}

export function _decodeURIComponent(val: any) {
	let result = val
	try {
		result = decodeURIComponent(val)
	} catch (e) {
		result = val
	}
	return result
}

export function _decodeURI(val: any) {
	let result = val
	try {
		result = decodeURI(val)
	} catch (e) {
		result = val
	}
	return result
}

export function urlParse(para: any) {
	const URLParser = function (this: any, a: any) {
		this._fields = {
			Username: 4,
			Password: 5,
			Port: 7,
			Protocol: 2,
			Host: 6,
			Path: 8,
			URL: 0,
			QueryString: 9,
			Fragment: 10,
		}
		this._values = {}
		this._regex = null
		this._regex =
			/^((\w+):\/\/)?((\w+):?(\w+)?@)?([^\/\?:]+):?(\d+)?(\/?[^\?#]+)?\??([^#]+)?#?(\w*)/

		if (typeof a != 'undefined') {
			this._parse(a)
		}
	} as any
	URLParser.prototype.setUrl = function (a: any) {
		this._parse(a)
	}
	URLParser.prototype._initValues = function () {
		for (var a in this._fields) {
			this._values[a] = ''
		}
	}
	URLParser.prototype.addQueryString = function (queryObj: any) {
		if (typeof queryObj !== 'object') {
			return false
		}
		var query = this._values.QueryString || ''
		for (var i in queryObj) {
			if (new RegExp(i + '[^&]+').test(query)) {
				query = query.replace(new RegExp(i + '[^&]+'), i + '=' + queryObj[i])
			} else {
				if (query.slice(-1) === '&') {
					query = query + i + '=' + queryObj[i]
				} else {
					if (query === '') {
						query = i + '=' + queryObj[i]
					} else {
						query = query + '&' + i + '=' + queryObj[i]
					}
				}
			}
		}
		this._values.QueryString = query
	}
	URLParser.prototype.getUrl = function () {
		var url = ''
		url += this._values.Origin
		url += this._values.Port ? ':' + this._values.Port : ''
		url += this._values.Path
		url += this._values.QueryString ? '?' + this._values.QueryString : ''
		url += this._values.Fragment ? '#' + this._values.Fragment : ''
		return url
	}

	URLParser.prototype.getUrl = function () {
		var url = ''
		url += this._values.Origin
		url += this._values.Port ? ':' + this._values.Port : ''
		url += this._values.Path
		url += this._values.QueryString ? '?' + this._values.QueryString : ''
		return url
	}
	URLParser.prototype._parse = function (a: any) {
		this._initValues()
		var b = this._regex.exec(a)
		if (!b) {
			console.log('DPURLParser::_parse -> Invalid URL')
		}
		for (var c in this._fields) {
			if (typeof b[this._fields[c]] != 'undefined') {
				this._values[c] = b[this._fields[c]]
			}
		}
		this._values['Hostname'] = this._values['Host'].replace(/:\d+$/, '')
		this._values['Origin'] =
			this._values['Protocol'] + '://' + this._values['Hostname']
	}
	return new URLParser(para)
}

export function _URL(url: string) {
	let result: any = {}
	const isURLAPIWorking = function () {
		let url
		try {
			url = new URL('http://modernizr.com/')
			return url.href === 'http://modernizr.com/'
		} catch (e) {
			return false
		}
	}
	if (typeof window.URL === 'function' && isURLAPIWorking()) {
		result = new URL(url)
		if (!result.searchParams) {
			result.searchParams = (function () {
				const params: any = getURLSearchParams(result.search)
				return {
					get: function (searchParam: any) {
						return params[searchParam]
					},
				}
			})()
		}
	} else {
		if (!isString(url)) {
			url = String(url)
		}
		url = trim(url)
		const _regex = /^https?:\/\/.+/
		if (_regex.test(url) === false) {
			console.log('Invalid URL')
			return
		}
		const instance = urlParse(url)
		result.hash = ''
		result.host = instance._values.Host
			? instance._values.Host +
			  (instance._values.Port ? ':' + instance._values.Port : '')
			: ''
		result.href = instance._values.URL
		result.password = instance._values.Password
		result.pathname = instance._values.Path
		result.port = instance._values.Port
		result.search = instance._values.QueryString
			? '?' + instance._values.QueryString
			: ''
		result.username = instance._values.Username
		result.hostname = instance._values.Hostname
		result.protocol = instance._values.Protocol
			? instance._values.Protocol + ':'
			: ''
		result.origin = instance._values.Origin
			? instance._values.Origin +
			  (instance._values.Port ? ':' + instance._values.Port : '')
			: ''
		result.searchParams = (function () {
			const params: any = getURLSearchParams('?' + instance._values.QueryString)
			return {
				get: function (searchParam: any) {
					return params[searchParam]
				},
			}
		})()
	}
	return result
}

export function getURLSearchParams(queryString: string) {
	queryString = queryString || ''
	const decodeParam = function (str: string) {
		return _decodeURIComponent(str)
	}
	const args: any = {}
	const query = queryString.substring(1)
	const pairs = query.split('&')
	for (let i = 0; i < pairs.length; i++) {
		const pos = pairs[i].indexOf('=')
		if (pos === -1) continue
		let name = pairs[i].substring(0, pos)
		let value = pairs[i].substring(pos + 1)
		name = decodeParam(name)
		value = decodeParam(value)
		args[name] = value
	}
	return args
}

export const getReferrer = (referrer?: any, full?: any) => {
	referrer = referrer || document.referrer
	if (typeof referrer !== 'string') {
		return '取值异常_referrer异常_' + String(referrer)
	}
	referrer = trim(referrer)
	referrer = _decodeURI(referrer)
	if (referrer.indexOf('https://www.baidu.com/') === 0 && !full) {
		referrer = referrer.split('?')[0]
	}
	referrer = referrer.slice(0, 200)
	return typeof referrer === 'string' ? referrer : ''
}

export function getHostname(url: string, defaultValue?: any) {
	if(!url) return;
	
	if (!defaultValue || typeof defaultValue !== 'string') {
		defaultValue = 'hostname 解析异常'
	}
	var hostname = null
	
	try {
		hostname = _URL(url).hostname
	} catch (e) {
		console.log('getHostname 传入的 url 参数不合法！', e)
	}
	return hostname || defaultValue
}

/**
 * 格式化 json 为字符串
 * @param obj
 * @returns
 */
export function formatJsonString(obj: any) {
	try {
		return JSON.stringify(obj, null, '  ')
	} catch (e) {
		return JSON.stringify(obj)
	}
}

function unique(ar: any[]) {
	let temp,
		n: any[] = [],
		o: any = {}
	for (var i = 0; i < ar.length; i++) {
		temp = ar[i]
		if (!(temp in o)) {
			o[temp] = true
			n.push(temp)
		}
	}
	return n
}

/**
 * 获取随机数
 * @returns
 */
export function getRandom() {
	if (typeof Uint32Array === 'function') {
		let cry: any = ''
		if (typeof crypto !== 'undefined') {
			cry = crypto
		}
		if (isObject(cry) && cry.getRandomValues) {
			var typedArray = new Uint32Array(1)
			var randomNumber = cry.getRandomValues(typedArray)[0]
			var integerLimit = Math.pow(2, 32)
			return randomNumber / integerLimit
		}
	}
	return getRandomBasic(10000000000000000000) / 10000000000000000000
}

/**
 * 获取随机数
 */
export const getRandomBasic = (function () {
	var today = new Date()
	var seed = today.getTime()

	function rnd() {
		seed = (seed * 9301 + 49297) % 233280
		return seed / 233280.0
	}
	return function rand(number: number) {
		return Math.ceil(rnd() * number)
	}
})()

/**
 * 增加 hashEvent
 * @param callback
 */
export const addHashEvent = (callback: any) => {
	const hashEvent = 'pushState' in window.history ? 'popstate' : 'hashchange'
	addEvent(window, hashEvent, callback)
}

export const addEvent = (element: Window | any, type: any, handler: any) => {
	const makeHandler = (
		element: any,
		new_handler: any,
		old_handlers: any,
		type: any
	) => {
		return (event: any) => {
			if (!event) return undefined

			event.target = event.srcElement
			let ret = true
			let old_result, new_result
			if (typeof old_handlers === 'function') {
				old_result = old_handlers(event)
			}
			new_result = new_handler.call(element, event)
			if (type !== 'beforeunload') {
				if (false === old_result || false === new_result) {
					ret = false
				}
				return ret
			}
		}
	}

	if (element && element.addEventListener) {
		element.addEventListener(
			type,
			(event: any) => {
				handler(event)
			},
			false
		)
	} else {
		const ontype: any = 'on' + type
		const old_handler = element[ontype]
		element[ontype] = makeHandler(element, handler, old_handler, type)
	}
}

export function getElementContent(target: any, tagName: string) {
	var textContent = ''
	var element_content = ''
	if (target.textContent) {
		textContent = trim(target.textContent)
	} else if (target.innerText) {
		textContent = trim(target.innerText)
	}
	if (textContent) {
		textContent = textContent
			.replace(/[\r\n]/g, ' ')
			.replace(/[ ]+/g, ' ')
			.substring(0, 255)
	}
	element_content = textContent || ''

	if (tagName === 'input' || tagName === 'INPUT') {
		if (target.type === 'button' || target.type === 'submit') {
			element_content = target.value || ''
		}
	}
	return element_content
}

export function getEleInfo(obj: any): any {
	if (!obj.target) return false

	const target = obj.target
	const tagName = target.tagName.toLowerCase()

	let props: Props = {}
	props.$element_type = tagName
	props.$element_id = target.getAttribute('id')
	props.$element_name = target.getAttribute('name')
	props.$element_content = getElementContent(target, tagName)
	props.$element_class_name = typeof target.className === 'string' ? target.className : null
	props.$element_target_url = target.getAttribute('href')
	props = strip_empty_properties(props)
	props.$url = getURL()
	props.$url_path = location.pathname
	props.$title = document.title

	return props
}

export function strip_empty_properties(p: any) {
	const ret: any = {}
	each(p, function (v: any, k: any) {
		if (v != null) {
			ret[k] = v
		}
	})
	return ret
}

export function ry(dom: any) {
	return new ry.init(dom)
}

ry.init = function (this: any, dom: any) {
	this.ele = dom
} as any
ry.init.prototype = {
	previousElementSibling: function () {
		var el = this.ele
		if ('previousElementSibling' in document.documentElement) {
			return ry(el.previousElementSibling)
		} else {
			while ((el = el.previousSibling)) {
				if (el.nodeType === 1) {
					return ry(el)
				}
			}
			return ry(null)
		}
	},
	getSameTypeSiblings: function () {
		const element = this.ele
		const parentNode = element.parentNode
		const tagName = element.tagName.toLowerCase()
		const arr: any[] = []
		for (let i = 0; i < parentNode.children.length; i++) {
			const child = parentNode.children[i]
			if (child.nodeType === 1 && child.tagName.toLowerCase() === tagName) {
				arr.push(parentNode.children[i])
			}
		}
		return arr
	},
	getParents: function () {
		try {
			let element = this.ele
			if (!isElement(element)) {
				return []
			}
			const pathArr = [element]
			if (element === null || element.parentElement === null) {
				return []
			}
			while (element.parentElement !== null) {
				element = element.parentElement
				pathArr.push(element)
			}
			return pathArr
		} catch (err) {
			return []
		}
	},
}

export const heatmap = {
	getElementPath: function (element: any, ignoreID: any, rootElement?: any) {
		const names: any[] = []
		while (element.parentNode) {
			if (
				element.id &&
				!ignoreID &&
				/^[A-Za-z][-A-Za-z0-9_:.]*$/.test(element.id)
			) {
				names.unshift(element.tagName.toLowerCase() + '#' + element.id)
				break
			} else {
				if (rootElement && element === rootElement) {
					names.unshift(element.tagName.toLowerCase())
					break
				} else if (element === document.body) {
					names.unshift('body')
					break
				} else {
					names.unshift(element.tagName.toLowerCase())
				}
				element = element.parentNode
			}
		}
		return names.join(' > ')
	},
	getClosestLi: function (element: any) {
		const getClosest = function (elem: any, selector: any) {
			for (
				;
				elem && elem !== document && elem.nodeType === 1;
				elem = elem.parentNode
			) {
				if (elem.tagName.toLowerCase() === selector) {
					return elem
				}
			}
			return null
		}
		return getClosest(element, 'li')
	},
	getElementPosition: function (element: any, elementPath: any, ignoreID: any) {
		const closestLi = heatmap.getClosestLi(element)
		if (!closestLi) return null

		const tag = element.tagName.toLowerCase()
		const sameTypeTags: any = closestLi.getElementsByTagName(tag)
		const sameTypeTagsLen = sameTypeTags.length
		const arr: any[] = []
		if (sameTypeTagsLen > 1) {
			for (let i = 0; i < sameTypeTagsLen; i++) {
				const elepath = heatmap.getElementPath(sameTypeTags[i], ignoreID)
				if (elepath === elementPath) {
					arr.push(sameTypeTags[i])
				}
			}
			if (arr.length > 1) {
				return indexOf(arr, element)
			}
		}

		function _getPosition(element: any) {
			var parentNode = element.parentNode
			if (!parentNode) {
				return ''
			}
			var sameTypeSiblings = ry(element).getSameTypeSiblings()
			var typeLen = sameTypeSiblings.length
			if (typeLen === 1) {
				return 0
			}
			for (
				var i = 0, e = element;
				ry(e).previousElementSibling().ele;
				e = ry(e).previousElementSibling().ele, i++
			);
			return i
		}
		return _getPosition(closestLi)
	},
	getDomIndex: function (el: any) {
		if (!el.parentNode) return -1
		var i = 0
		var nodeName = el.tagName
		var list = el.parentNode.children
		for (var n = 0; n < list.length; n++) {
			if (list[n].tagName === nodeName) {
				if (el === list[n]) {
					return i
				} else {
					i++
				}
			}
		}
		return -1
	},
	selector: function (el: any, notuseid: any) {
		var i =
			el.parentNode && 9 == el.parentNode.nodeType ? -1 : this.getDomIndex(el)
		if (
			el.getAttribute &&
			el.getAttribute('id') &&
			/^[A-Za-z][-A-Za-z0-9_:.]*$/.test(el.getAttribute('id')) &&
			!notuseid
		) {
			return '#' + el.getAttribute('id')
		} else {
			return (
				el.tagName.toLowerCase() + (~i ? ':nth-of-type(' + (i + 1) + ')' : '')
			)
		}
	},
	getDomSelector: function (
		this: any,
		el: any,
		arr?: any[],
		notuseid?: string
	) {
		if (!el || !el.parentNode || !el.parentNode.children) {
			return false
		}
		arr = arr && arr.join() ? arr : []
		var name = el.nodeName.toLowerCase()
		if (!el || name === 'body' || 1 != el.nodeType) {
			arr.unshift('body')
			return arr.join(' > ')
		}
		arr.unshift(this.selector(el, notuseid))
		if (
			el.getAttribute &&
			el.getAttribute('id') &&
			/^[A-Za-z][-A-Za-z0-9_:.]*$/.test(el.getAttribute('id')) &&
			!notuseid
		)
			return arr.join(' > ')
		return this.getDomSelector(el.parentNode, arr, notuseid)
	},
	getEleDetail: function (target: any) {
		const selector = this.getDomSelector(target)
		const prop = getEleInfo({ target: target })
		prop.$element_selector = selector ? selector : ''
		prop.$element_path = this.getElementPath(target, 'not_use_id')
		var element_position = this.getElementPosition(
			target,
			prop.$element_path,
			'not_use_id'
		)
		if (isNumber(element_position)) {
			prop.$element_position = element_position
		}
		return prop
	},
	getPointerEventProp: function (ev: any, target: any) {
		if (!ev) return {}

		function getScroll() {
			const scrollLeft =
				document.body.scrollLeft || document.documentElement.scrollLeft || 0
			const scrollTop =
				document.body.scrollTop || document.documentElement.scrollTop || 0
			return {
				scrollLeft: scrollLeft,
				scrollTop: scrollTop,
			}
		}

		function getElementPosition(target: any) {
			// document.documentElement.getBoundingClientRect
			const targetEle = target.getBoundingClientRect()
			return {
				targetEleX: targetEle.left + getScroll().scrollLeft || 0,
				targetEleY: targetEle.top + getScroll().scrollTop || 0,
			}
		}

		function toFixedThree(val: any) {
			return Number(Number(val).toFixed(3))
		}

		function getPage(ev: any) {
			const pageX =
				ev.pageX ||
				ev.clientX + getScroll().scrollLeft ||
				ev.offsetX + getElementPosition(target).targetEleX ||
				0
			const pageY =
				ev.pageY ||
				ev.clientY + getScroll().scrollTop ||
				ev.offsetY + getElementPosition(target).targetEleY ||
				0
			return { $page_x: toFixedThree(pageX), $page_y: toFixedThree(pageY) }
		}
		return getPage(ev)
	},
}

const checkLog: Props = {
	string: function (str: string) {
		console.log(str + ' must be string')
	},
	emptyString: function (str: string) {
		console.log(str + "'s is empty")
	},
	regexTest: function (str: string) {
		console.log(str + ' is invalid')
	},
	idLength: function (str: string) {
		console.log(str + ' length is longer than ' + 255)
	},
	keyLength: function (str: string) {
		console.log(str + ' length is longer than ' + 100)
	},
	stringLength: function (str: string) {
		console.log(str + ' length is longer than ' + 500)
	},
	voidZero: function (str: string) {
		console.log(str + "'s is undefined")
	},
	reservedLoginId: function (str: string) {
		console.log(str + ' is invalid')
	},
	reservedBind: function (str: string) {
		console.log(str + ' is invalid')
	},
}

const ruleOption: Props = {
	regName:
		/^((?!^distinct_id$|^original_id$|^time$|^properties$|^id$|^first_id$|^second_id$|^users$|^events$|^event$|^user_id$|^date$|^datetime$|^user_tag.*|^user_group.*)[a-zA-Z_$][a-zA-Z\d_$]*)$/i,
	loginIDReservedNames: ['$identity_anonymous_id', '$identity_cookie_id'],
	bindReservedNames: [
		'$identity_login_id',
		'$identity_anonymous_id',
		'$identity_cookie_id',
	],
	string: function (str: string) {
		if (!isString(str)) {
			return false
		}
		return true
	},
	emptyString: function (str: string) {
		if (!isString(str) || trim(str).length === 0) {
			return false
		}
		return true
	},
	regexTest: function (str: string) {
		if (!isString(str) || !this.regName.test(str)) {
			return false
		}
		return true
	},
	idLength: function (str: string) {
		if (!isString(str) || str.length > 255) {
			return false
		}
		return true
	},
	keyLength: function (str: string) {
		if (!isString(str) || str.length > 100) {
			return false
		}
		return true
	},
	stringLength: function (str: string) {
		if (!isString(str) || str.length > 500) {
			return false
		}
		return true
	},
	voidZero: function (str: string) {
		if (str === void 0) {
			return false
		}
		return true
	},
	reservedLoginId: function (str: string) {
		if (indexOf(this.loginIDReservedNames, str) > -1) {
			return false
		}
		return true
	},
}

export const checkOption = {
	distinct_id: {
		rules: ['string', 'emptyString', 'idLength'],
		onComplete: function (status: any, val: any, rule_type: any) {
			if (!status) {
				if (rule_type === 'emptyString') {
					val = 'Id'
				}
				isFunction(checkLog[rule_type]) && checkLog[rule_type](val)
				if (rule_type === 'idLength') {
					return true
				}
			}
			return status
		},
	},
	event: {
		rules: ['string', 'emptyString', 'keyLength', 'regexTest'],
		onComplete: function (status: any, val: any, rule_type: any) {
			if (!status) {
				if (rule_type === 'emptyString') {
					val = 'eventName'
				}
				isFunction(checkLog[rule_type]) && checkLog[rule_type](val)
			}
			return true
		},
	},
	propertyKey: {
		rules: ['string', 'emptyString', 'keyLength', 'regexTest'],
		onComplete: function (status: any, val: any, rule_type: any) {
			if (!status) {
				if (rule_type === 'emptyString') {
					val = 'Property key'
				}
				isFunction(checkLog[rule_type]) && checkLog[rule_type](val)
			}
			return true
		},
	},
	propertyValue: {
		rules: ['voidZero'],
		onComplete: function (status: any, val: any, rule_type: any) {
			if (!status) {
				val = 'Property Value'
				isFunction(checkLog[rule_type]) && checkLog[rule_type](val)
			}
			return true
		},
	},
	properties: function (p: any) {
		const _this = this
		if (isObject(p)) {
			each(p, function (s: any, k: any) {
				_this.check({
					propertyKey: k,
				})

				var onComplete = function (status: any, val: any, rule_type: any) {
					if (!status) {
						val = k + "'s Value"
						isFunction(checkLog[rule_type]) && checkLog[rule_type](val)
					}
					return true
				}
				_this.check(
					{
						propertyValue: s,
					},
					onComplete
				)
			})
		} else if (ruleOption.voidZero(p)) {
			console.log('properties可以没有，但有的话必须是对象')
		}
		return true
	},
	propertiesMust: function (p: any) {
		if (!(p === undefined || !isObject(p) || isEmptyObject(p))) {
			this.properties.call(this, p)
		} else {
			console.log('properties 必须是对象')
		}
		return true
	},
	item_type: {
		rules: ['string', 'emptyString', 'keyLength', 'regexTest'],
		onComplete: function (status: any, val: any, rule_type: any) {
			if (!status) {
				if (rule_type === 'emptyString') {
					val = 'item_type'
				}
				isFunction(checkLog[rule_type]) && checkLog[rule_type](val)
			}
			return true
		},
	},
	item_id: {
		rules: ['string', 'emptyString', 'stringLength'],
		onComplete: function (status: any, val: any, rule_type: any) {
			if (!status) {
				if (rule_type === 'emptyString') {
					val = 'item_id'
				}
				isFunction(checkLog[rule_type]) && checkLog[rule_type](val)
			}
			return true
		},
	},
	loginIdKey: {
		rules: [
			'string',
			'emptyString',
			'keyLength',
			'regexTest',
			'reservedLoginId',
		],
		onComplete: function (status: any, val: any, rule_type: any) {
			if (!status) {
				if (rule_type === 'emptyString') {
					val = 'login_id_key'
				}
				isFunction(checkLog[rule_type]) && checkLog[rule_type](val)
				if (rule_type === 'keyLength') {
					return true
				}
			}
			return status
		},
	},
	bindKey: {
		rules: ['string', 'emptyString', 'keyLength', 'regexTest', 'reservedBind'],
		onComplete: function (status: any, val: any, rule_type: any) {
			if (!status) {
				if (rule_type === 'emptyString') {
					val = 'Key'
				}
				isFunction(checkLog[rule_type]) && checkLog[rule_type](val)
				if (rule_type === 'keyLength') {
					return true
				}
			}
			return status
		},
	},
	bindValue: {
		rules: ['string', 'emptyString', 'idLength'],
		onComplete: function (status: any, val: any, rule_type: any) {
			if (!status) {
				if (rule_type === 'emptyString') {
					val = 'Value'
				}
				isFunction(checkLog[rule_type]) && checkLog[rule_type](val)
				if (rule_type === 'idLength') {
					return true
				}
			}
			return status
		},
	},
	check: function (this: any, a?: any, b?: any, onComplete?: any) {
		const checkRules = this[a]
		if (isFunction(checkRules)) {
			return checkRules.call(this, b)
		} else if (!checkRules) {
			return false
		}
		for (let i = 0; i < checkRules.rules.length; i++) {
			const rule = checkRules.rules[i]
			const status = ruleOption[rule](b)
			const result = isFunction(onComplete)
				? onComplete(status, b, rule)
				: checkRules.onComplete(status, b, rule)
			if (!status) {
				return result
			}
		}
		return true
	},
}

function searchConfigData(data: any) {
	if (typeof data === 'object' && data.$option) {
		const data_config = data.$option
		delete data.$option
		return data_config
	} else {
		return {}
	}
}

export const kit: Props = {}
kit.encodeTrackData = function (data: any, props: any) {
	const _data = deleteAttr(data)

	const _dataStr = JSON.stringify(_data)
	const binaryStr = gzip(_dataStr)

	// 进行两次两次 base64
	const dataStr = btoa(base64Encode(binaryStr))

	return `data=${encodeURIComponent(dataStr)}&gzip=1&org=${props.org}&project=${
		props.project
	}&token=${props.token}`
}
kit.buildData = function (p: any) {
	const distinct_id = localStorage.getItem('distinct_id')
	const data: any = {
		distinct_id,
		identities: {},
		event: p.event,
		lib: {
			$lib: 'js',
			$lib_method: 'code',
			$lib_version: String(version),
		},
		type: p.type,
		properties: p.properties,
	}

	if (data.properties.$time && isDate(data.properties.$time)) {
		data.time = data.properties.$time * 1
		delete data.properties.$time
	} else {
		data.time = new Date().getTime() * 1
	}
	return data
}
kit.sendData = function (sa: any, data: any, callback: any) {
	const data_config = searchConfigData(data.properties)
	const senderData = { ...data, ...data_config, callback }
	const sender = new ImageSender(sa, senderData)
	

	const start = sender.start
	sender.start = function () {
		var me = this
		start.apply(this, arguments)
		setTimeout(function () {
			me.isEnd(true)
		}, sa.callback_timeout)
	}
	sender.end = function () {
		this.callback && this.callback()
		var self = this
		setTimeout(function () {
			self.lastClear && self.lastClear()
		}, sa.datasend_timeout - sa.callback_timeout)
	}
	sender.isEnd = function () {
		if (!this.received) {
			this.received = true
			this.end()
		}
	}

	sender.start()
}

export function extend(obj: any) {
	each(slice.call(arguments, 1), function (source: any) {
		for (var prop in source) {
			if (hasOwnProperty.call(source, prop) && source[prop] !== void 0) {
				obj[prop] = source[prop]
			}
		}
	})
	return obj
}

export function getSendData(data: any) {
	return kit.encodeTrackData(data)
}

export function getSendUrl(url: string, data: any, props: any) {
	var dataStr = kit.encodeTrackData(data, props)
	if (url.indexOf('?') !== -1) {
		return url + '&' + dataStr
	}
	return url + '?' + dataStr
}

export function isValidListener(listener: any): boolean {
	if (typeof listener === 'function') {
		return true
	} else if (listener && typeof listener === 'object') {
		return isValidListener(listener.listener)
	} else {
		return false
	}
}

function getCookieTopLevelDomain(hostname?: string) {
	hostname = hostname || location.hostname

	function validHostname(value: any) {
		if (value) {
			return value
		} else {
			return false
		}
	}
	const new_hostname = validHostname(hostname)
	if (!new_hostname) return ''

	const splitResult = new_hostname.split('.')
	if (
		isArray(splitResult) &&
		splitResult.length >= 2 &&
		!/^(\d+\.)+\d+$/.test(new_hostname)
	) {
		let domainStr = '.' + splitResult.splice(splitResult.length - 1, 1)
		while (splitResult.length > 0) {
			domainStr =
				'.' + splitResult.splice(splitResult.length - 1, 1) + domainStr
			document.cookie =
				'sensorsdata_domain_test=true; path=/; SameSite=Lax; domain=' +
				domainStr

			if (document.cookie.indexOf('sensorsdata_domain_test=true') !== -1) {
				const now: any = new Date()
				now.setTime(now.getTime() - 1000)

				document.cookie =
					'sensorsdata_domain_test=true; expires=' +
					now.toGMTString() +
					'; path=/; SameSite=Lax; domain=' +
					domainStr

				return domainStr
			}
		}
	}
	return ''
}

export const pageInfo: any = {
	initPage: function () {
		const referrer = getReferrer()
		const url = getURL()
		this.pageProp = {
			referrer: referrer,
			referrer_host: referrer ? getHostname(referrer) : '',
			url: url,
			url_host: getHostname(url, 'url_host取值异常'),
		}
	},
	pageProp: {},
	properties: function () {
		const viewportHeightValue =
			window.innerHeight ||
			document.documentElement.clientHeight ||
			document.body.clientHeight ||
			0
		const viewportWidthValue =
			window.innerWidth ||
			document.documentElement.clientWidth ||
			document.body.clientWidth ||
			0
		const propertiesObj = {
			$timezone_offset: new Date().getTimezoneOffset(),
			$screen_height: Number(screen.height) || 0,
			$screen_width: Number(screen.width) || 0,
			$viewport_height: viewportHeightValue,
			$viewport_width: viewportWidthValue,
			$lib: 'js',
			$lib_version: version,
		}
		return propertiesObj
	},
}

export function addSinglePageEvent(callback: any) {
	let current_url = location.href
	const historyPushState = window.history.pushState
	const historyReplaceState = window.history.replaceState

	if (isFunction(window.history.pushState)) {
		window.history.pushState = function () {
			const args: any = arguments;
			historyPushState.apply(window.history, args)
			callback(current_url)
			current_url = location.href
		}
	}

	if (isFunction(window.history.replaceState)) {
		window.history.replaceState = function () {
			const args: any = arguments;
			historyReplaceState.apply(window.history, args)
			callback(current_url)
			current_url = location.href
		}
	}

	let singlePageEvent
	if (window.document?.DOCUMENT_NODE) {
		singlePageEvent = 'hashchange'
	} else {
		singlePageEvent = 'popstate'
	}

	addEvent(window, singlePageEvent, function () {
		callback(current_url)
		current_url = location.href
	})
}

/**
 * 清除多余上报参数
 * @param data
 * @returns
 */
const deleteAttr = (data: any) => {
	delete data.properties.heatmap
	delete data.callback

	delete data.properties.server_url
	delete data.properties.send_type
	delete data.properties.org
	delete data.properties.project
	delete data.properties.token

	delete data.properties.callback_timeout
	delete data.properties.preset_properties
	delete data.properties.batch_send
	delete data.properties.datasend_timeout

	delete data.properties.cross_subdomain
	delete data.properties.is_debug
	delete data.properties.isLogin
	delete data.properties.show_log

	delete data.properties.max_id_length
	delete data.properties.max_key_length
	delete data.properties.max_string_length
	delete data.properties.max_referrer_string_length

	return data
}
