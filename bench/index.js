const assert = require('assert');
const { Suite } = require('benchmark');

console.log('Load times: ');

console.time('fast-clone');
const fastclone = require('fast-clone');
console.timeEnd('fast-clone');

console.time('lodash/clonedeep');
const lodash = require('lodash/clonedeep');
console.timeEnd('lodash/clonedeep');

console.time('rfdc');
const rfdc = require('rfdc');
console.timeEnd('rfdc');

console.time('clone-deep');
const clonedeep = require('clone-deep');
console.timeEnd('clone-deep');

console.time('deep-copy');
const deepcopy = require('deep-copy');
console.timeEnd('deep-copy');

console.time('klona');
const klona = require('klona');
console.timeEnd('klona');

const contenders = {
	'JSON.stringify': x => JSON.parse(JSON.stringify(x)),
	'fast-clone': fastclone,
	'lodash': lodash,
	'rfdc': rfdc(),
	'clone-deep': clonedeep,
	'deep-copy': deepcopy,
	'klona': klona,
};

console.log('\nValidation: ');
Object.keys(contenders).forEach(name => {
	const INPUT = require('./input');

	try {
		const output = contenders[name](INPUT);
		assert.deepStrictEqual(output, INPUT, 'initial copy');

		output[0].age++;
		assert.notEqual(INPUT[0].age, 34, 'increment');

		output[1].details.address.coords.longitude = 100;
		assert.notEqual(INPUT[1].details.address.coords.longitude, 100, 'nested assignment');

		output[0].friends[1].friends_common.friends_of_friends.push('BOB');
		assert.equal(INPUT[0].friends[1].friends_common.friends_of_friends.includes('BOB'), false, 'nested push');

		console.log('  ✔', name);
	} catch (err) {
		console.log('  ✘', name, `(FAILED @ "${err.message}")`);
	}
});


console.log('\nBenchmark:');
const INPUT = require('./input');

const bench = new Suite().on('cycle', e => {
	console.log('  ' + e.target);
});

Object.keys(contenders).forEach(name => {
	bench.add(name + ' '.repeat(22 - name.length), () => contenders[name](INPUT))
});

bench.run();
