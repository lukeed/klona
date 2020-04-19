function klona(x) {
	if (typeof x !== 'object') return x;

	var k, tmp, str=Object.prototype.toString.call(x);

	if (str === '[object Object]') {
		tmp = {};
		for (k in x) {
			if (k === '__proto__') {
				Object.defineProperty(tmp, k, {
					value: klona(x[k]),
					configurable: 1,
					enumerable: 1,
					writable: 1,
				});
			} else {
				tmp[k] = klona(x[k]);
			}
		}
		return tmp;
	}

	if (str === '[object Array]') {
		k = x.length;
		for (tmp=new Array(k); k--;) {
			tmp[k] = klona(x[k]);
		}
		return tmp;
	}

	if (str === '[object Set]') {
		tmp = new Set();
		x.forEach(function (val) {
			tmp.add(klona(val));
		});
		return tmp;
	}

	if (str === '[object Map]') {
		tmp = new Map();
		x.forEach(function (val, key) {
			tmp.set(klona(key), klona(val));
		});
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

	if (str.slice(-6) === 'Array]') {
		return new x.constructor(x);
	}

	return x;
}

export default klona;
export { klona };
