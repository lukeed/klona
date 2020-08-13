import { suite } from 'uvu';
import * as assert from 'assert';

export default function (klona) {
	const Pollution = suite('pollution');

	// @see https://snyk.io/vuln/SNYK-JS-LODASH-450202
	Pollution('constructor', () => {
		const payload = '{"constructor":{"prototype":{"a0":true}}}';

		const input = JSON.parse(payload);
		const output = klona(input);

		assert.equal(
			JSON.stringify(output),
			payload
		);

		assert.notEqual(({})['a0'], true, 'Safe POJO');
		assert.notEqual(new Object()['a0'], true, 'Safe Object');

		assert.notEqual(input['a0'], true, 'Safe input');
		assert.notEqual(output['a0'], true, 'Safe output');
	});

	// @see https://snyk.io/vuln/SNYK-JS-LODASH-450202
	Pollution('__proto__', () => {
		const payload = '{"__proto__":{"a0":true}}';
		const input = JSON.parse(payload);
		const output = klona(input);

		assert.equal(
			JSON.stringify(output),
			payload
		);

		assert.notEqual(({})['a0'], true, 'Safe POJO');
		assert.notEqual(new Object()['a0'], true, 'Safe Object');

		assert.notEqual(input['a0'], true, 'Safe input');
		assert.notEqual(output['a0'], true, 'Safe output');
	});

	Pollution('prototype', () => {
		const payload = '{"prototype":{"hello":"world"}}';
		const input = JSON.parse(payload);
		const output = klona(input);

		assert.equal(
			JSON.stringify(output),
			payload
		);

		assert.notEqual(({})['hello'], 'world', 'Safe POJO');
		assert.notEqual(new Object()['hello'], 'world', 'Safe Object');

		assert.notEqual(input['hello'], 'world', 'Safe input');
		assert.notEqual(output['hello'], 'world', 'Safe output');
	});

	Pollution.run();
}
