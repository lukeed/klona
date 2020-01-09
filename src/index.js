export default function klona(x) {
	if (typeof x !== 'object') return x;

	var k, tmp, str=Object.prototype.toString.call(x);

	if (str === '[object Object]') {
		tmp = {};
		for (k in x) {
			tmp[k] = klona(x[k]);
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

	if (str === '[object Set]') return new Set(x);
	if (str === '[object Date]') return new Date(+x);
	if (str === '[object Map]') return new Map(x);

	if (str === '[object RegExp]') {
		tmp = new RegExp(x.source, x.flags);
		tmp.lastIndex = x.lastIndex;
		return tmp;
	}

	return x;
}
