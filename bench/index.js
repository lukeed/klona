const { join } = require('path');
const { Suite } = require('benchmark');

console.log('Load times: ');

console.time('lodash/clonedeep');
const lodash = require('lodash/clonedeep');
console.timeEnd('lodash/clonedeep');

console.time('rfdc');
const rfdc = require('rfdc');
console.timeEnd('rfdc');

console.time('clone');
const clone = require('clone');
console.timeEnd('clone');

console.time('fclone');
const fclone = require('fclone');
console.timeEnd('fclone');

console.time('clone-deep');
const clonedeep = require('clone-deep');
console.timeEnd('clone-deep');

console.time('deep-copy');
const deepcopy = require('deep-copy');
console.timeEnd('deep-copy');

console.time('klona/full');
const full = require('klona/full');
console.timeEnd('klona/full');

console.time('klona');
const klona = require('klona');
console.timeEnd('klona');

console.time('klona/lite');
const lite = require('klona/lite');
console.timeEnd('klona/lite');

console.time('klona/json');
const json = require('klona/json');
console.timeEnd('klona/json');

console.time('klona/circular');
const circular = require('klona/circular');
console.timeEnd('klona/circular');

const naiive = x => JSON.parse(JSON.stringify(x));
const clone_full = x => clone(x, { includeNonEnumerable: true });

function runner(name, contenders) {
	const fixture = join(__dirname, 'fixtures', name + '.js');
	const validator = join(__dirname, 'validate', name + '.js');

	console.log('\nValidation :: %s', name);
	Object.keys(contenders).forEach(name => {
		const isValid = require(validator);
		const INPUT = require(fixture);

		try {
			isValid(INPUT, contenders[name](INPUT));
			console.log('  ✔', name);
		} catch (err) {
			console.log('  ✘', name, `(FAILED @ "${err.message}")`);
		} finally {
			delete require.cache[fixture];
		}
	});

	const INPUT = require(fixture);
	console.log('\nBenchmark :: %s', name);
	const bench = new Suite().on('cycle', e => {
		console.log('  ' + e.target);
	});

	Object.keys(contenders).forEach(name => {
		bench.add(name + ' '.repeat(22 - name.length), () => contenders[name](INPUT))
	});

	bench.run();
}

// ---
// ONLY KEEP PASSING
// ---

runner('json', {
	'JSON.stringify': naiive,
	'lodash': lodash,
	'rfdc': rfdc(),
	'clone': clone,
	'clone/include': clone_full,
	'fclone': fclone,
	'clone-deep': clonedeep,
	'deep-copy': deepcopy,
	'klona/full': full.klona,
	'klona': klona.klona,
	'klona/lite': lite.klona,
	'klona/json': json.klona,
	'klona/circular': circular.klona,
});

runner('lite', {
	'lodash': lodash,
	'clone': clone,
	'clone/include': clone_full,
	'fclone': fclone,
	'clone-deep': clonedeep,
	'klona/full': full.klona,
	'klona': klona.klona,
	'klona/lite': lite.klona,
	'klona/circular': circular.klona,
});

runner('default', {
	'lodash': lodash, // FAIL @ Buffer, Map keys
	'clone': clone, // FAIL @ DataView
	'clone/include': clone_full, // FAIL @ DataView
	'fclone': fclone,
	// FAIL @ "Set #2" & "Map #2" :: 'clone-deep': clonedeep,
	'klona/full': full.klona,
	'klona': klona.klona,
	'klona/circular': circular.klona,
});

runner('full', {
	'lodash': lodash, // FAIL @ Buffer, Map keys, non-enumerable properties,
	'clone/include': clone_full, // FAIL @ DataView, non-enumerable descriptors
	'fclone': fclone,
	'klona/full': full.klona,
	'klona/circular': circular.klona,
});

runner('circular', {
	'lodash': lodash, 
	'clone/include': clone_full, // FAIL @ DataView, non-enumerable descriptors
	'fclone': fclone,
	'klona/full': full.klona,
	'klona/circular': circular.klona,
});
