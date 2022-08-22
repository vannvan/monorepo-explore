import { getSendUrl, getUA, isValidListener } from ".";

interface EventEmitterProps {
	[key: string]: any;
}

/**
 * 事件发射器
 * @param this 
 */
export const EventEmitter: any = function (this: EventEmitterProps) {
	this._events = {}
}
EventEmitter.prototype.on = function (eventName: string, listener: any) {
	if (!eventName || !listener) return false

	if (!isValidListener(listener)) {
		throw new Error('listener must be a function')
	}

	this._events[eventName] = this._events[eventName] || []
	const listenerIsWrapped = typeof listener === 'object'

	this._events[eventName].push(
		listenerIsWrapped
			? listener
			: {
					listener: listener,
					once: false,
			  }
	)

	return this
}
EventEmitter.prototype.prepend = function (eventName: string, listener: any) {
	if (!eventName || !listener) return false

	if (!isValidListener(listener)) {
		throw new Error('listener must be a function')
	}

	this._events[eventName] = this._events[eventName] || []
	var listenerIsWrapped = typeof listener === 'object'

	this._events[eventName].unshift(
		listenerIsWrapped
			? listener
			: {
					listener: listener,
					once: false,
			  }
	)

	return this
}
EventEmitter.prototype.once = function (eventName: string, listener: any) {
	return this.on(eventName, {
		listener: listener,
		once: true,
	})
}
EventEmitter.prototype.off = function (eventName: string, listener: any) {
	const listeners = this._events[eventName]
	if (!listeners) return false

	if (typeof listener === 'number') {
		listeners.splice(listener, 1)
	} else if (typeof listener === 'function') {
		for (var i = 0, len = listeners.length; i < len; i++) {
			if (listeners[i] && listeners[i].listener === listener) {
				listeners.splice(i, 1)
			}
		}
	}
	return this
}
EventEmitter.prototype.emit = function (eventName: string, args: any) {
	const listeners = this._events[eventName]
	if (!listeners) return false

	for (let i = 0; i < listeners.length; i++) {
		const listener = listeners[i]
		if (listener) {
			listener.listener.call(this, args || {})
			if (listener.once) {
				this.off(eventName, i)
			}
		}
	}

	return this
}
EventEmitter.prototype.removeAllListeners = function (eventName: string) {
	if (eventName && this._events[eventName]) {
		this._events[eventName] = []
	} else {
		this._events = {}
	}
}
EventEmitter.prototype.listeners = function (eventName: string) {
	if (eventName && typeof eventName === 'string') {
		return this._events[eventName]
	} else {
		return this._events
	}
}


/**
 * 图片标签设置
 * @param this 
 * @param sa 
 * @param para 
 */
export const ImageSender: any = function (this: any, sa: any, para: any) {
	this.callback = para.callback
	this.img = document.createElement('img')
	this.img.width = 1
	this.img.height = 1
	this.sa = sa
	if (sa?.img_use_crossorigin) {
		this.img.crossOrigin = 'anonymous'
	}

	const org = sa.org
	const project = sa.project
	const token = sa.token

	this.server_url = getSendUrl(sa.server_url, para, { org, project, token })
}
ImageSender.prototype.start = function () {
	const me = this
	if (me.sa.ignore_oom) {
		this.img.onload = function () {
			this.onload = null
			this.onerror = null
			this.onabort = null
			me.isEnd()
		}
		this.img.onerror = function () {
			this.onload = null
			this.onerror = null
			this.onabort = null
			me.isEnd()
		}
		this.img.onabort = function () {
			this.onload = null
			this.onerror = null
			this.onabort = null
			me.isEnd()
		}
	}
	this.img.src = this.server_url
}
ImageSender.prototype.lastClear = function () {
	var sys = getUA()
	if (sys.ie !== undefined) {
		this.img.src = 'about:blank'
	} else {
		this.img.src = ''
	}
}