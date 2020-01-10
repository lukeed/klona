const assert = require('assert');
const { Suite } = require('benchmark');

const naiive = x => JSON.parse(JSON.stringify(x));

const contenders = {
	'JSON.stringify': naiive,
	'fast-clone': require('fast-clone'),
	'lodash': require('lodash/clonedeep'),
	'clone-deep': require('clone-deep'),
	'deep-copy': require('deep-copy'),
	'klona': require('../dist/klona')
};

console.log('Validation: ');
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
