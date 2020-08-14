export function klona(x) {
	if (typeof x !== 'object') return x;

	var k, tmp, str=Object.prototype.toString.call(x);

	if (str === '[object Object]') {
		tmp = Object.create(Object.getPrototypeOf(x));
		for (k in x) {
			if (k === '__proto__') {
				Object.defineProperty(tmp, k, {
					value: klona(x[k]),
					configurable: true,
					enumerable: true,
					writable: true,
				});
			} else if (tmp[k] !== x[k]) {
				tmp[k] = klona(x[k]);
			}
		}
		return tmp;
	}

	if (str === '[object Array]') {
		k = x.length;
		for (tmp=Array(k); k--;) {
			tmp[k] = klona(x[k]);
		}
		return tmp;
	}

	if (str === '[object Date]') {
		return new Date(+x);
	}

	if (str === '[object RegExp]') {
		tmp = new RegExp(x.source, x.flags);
		tmp.lastIndex = x.lastIndex;
		return tmp;
	}

	return x;
}
