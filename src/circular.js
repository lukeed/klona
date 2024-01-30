function set(obj, key, val, opt) {
	if (typeof val.value === 'object') val.value = klona(val.value, opt);
	if (!val.enumerable || val.get || val.set || !val.configurable || !val.writable || key === '__proto__') {
		Object.defineProperty(obj, key, val);
	} else obj[key] = val.value;
}

const baseOptions = {
	seen: new Set()
}

/**
 * Clone any object deep without caring about circular references again.
 * 
 * If you want to manually improve memory performance add the seen Set option 
 * yourself and clear it after the clone.
 * 
 * @param {Object} x - object to clone
 * @param {{ seen: Set }} opt - options
 * 
 * @returns your object, but cloned
 */
export function klona(x, opt = baseOptions) {
	if (typeof x !== 'object') return x;

	var i=0, k, list, tmp, str=Object.prototype.toString.call(x);
	opt.seen.add(x);

	if (str === '[object Object]') {
		tmp = Object.create(x.__proto__ || null);
	} else if (str === '[object Array]') {
		tmp = Array(x.length);
	} else if (str === '[object Set]') {
		tmp = new Set;
		x.forEach(function (val) {
			tmp.add(klona(val, opt));
		});
	} else if (str === '[object Map]') {
		tmp = new Map;
		x.forEach(function (val, key) {
			tmp.set(klona(key, opt), klona(val, opt));
		});
	} else if (str === '[object Date]') {
		tmp = new Date(+x);
	} else if (str === '[object RegExp]') {
		tmp = new RegExp(x.source, x.flags);
	} else if (str === '[object DataView]') {
		tmp = new x.constructor( klona(x.buffer, opt) );
	} else if (str === '[object ArrayBuffer]') {
		tmp = x.slice(0);
	} else if (str.slice(-6) === 'Array]') {
		tmp = x.constructor.from(x);
	}

	if (tmp) {
		for (list=Object.getOwnPropertySymbols(x); i < list.length; i++) {
			set(tmp, list[i], Object.getOwnPropertyDescriptor(x, list[i]), opt);
		}

		for (i=0, list=Object.getOwnPropertyNames(x); i < list.length; i++) {
			if (Object.hasOwnProperty.call(tmp, k=list[i]) && tmp[k] === x[k]) continue;
			if (opt.seen.has(x[k])) {
				tmp[k] = "[object Circular]";
			} else {
				set(tmp, k, Object.getOwnPropertyDescriptor(x, k), opt);
			}
		}
	}

	return tmp || x;
}
