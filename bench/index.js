const assert = require('assert');
const { Suite } = require('benchmark');
const fast_clone = require('fast-clone');
const lodash = require('lodash.clonedeep');
const clone_deep = require('clone-deep');
const deep_copy = require('deep-copy');
const depcopy = require('deepcopy');

const klona = require('../dist/klona');
const INPUT = require('./input');

const naiive = x => JSON.parse(JSON.stringify(x));

const contenders = { 'JSON.stringify':naiive, fast_clone, lodash, clone_deep, deep_copy, depcopy, klona };

console.log('Validation: ');
Object.keys(contenders).forEach(lib => {
	const name = lib.replace('_', '-');

	try {
		const output = contenders[lib](INPUT);
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

const onCycle = e => console.log('  ' + e.target);
const bench = new Suite({ onCycle });

Object.keys(contenders).forEach(lib => {
	bench.add(lib.replace('_', '-') + ' '.repeat(16 - lib.length), () => contenders[lib](INPUT))
});

bench.run();
