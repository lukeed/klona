import test from 'tape';
import klona from '../src';

test('exports', t => {
	t.is(typeof klona, 'function', 'exports a function');
	t.end();
});


test('array :: flat', t => {
	const input = ['foo', 'bar', 'baz'];
	const output = klona(input);

	t.deepEqual(input, output);

	output[1] = 'hello';
	t.not(input[1], 'hello');

	t.end();
});


test('array :: nested', t => {
	const input = ['foo', [1, 2, ['hello', 'world'], 3], 'bar', 'baz'];
	const output = klona(input);

	t.deepEqual(input, output);

	output[1][2][0] = 'howdy';
	t.is(input[1][2][0], 'hello');

	output[1] = 'hello';
	t.not(input[1], 'hello');

	t.end();
});


test('boolean', t => {
	const input = true;
	let output = klona(input);

	t.deepEqual(input, output);

	output = false;
	t.is(input, true);

	t.end();
});


test('class', t => {
	class Foobar {}
	const input = new Foobar();
	const output = klona(input);

	t.deepEqual(input, output);

	output.foobar = 123;
	t.not(input.foobar, 123);

	t.end();
});


test('constructor :: hijack', t => {
	let count = 0;

	class Foo {}
	function CustomArray() {
		count++;
	}

	const input = new Foo();
	t.is(input.constructor.name, 'Foo');

	input.constructor = CustomArray;
	t.is(input.constructor.name, 'CustomArray');

	const output = klona(input);
	t.deepEqual(input, output);

	t.is(count, 0, '~> did not call constructor');

	t.end();
});


// @see https://snyk.io/vuln/SNYK-JS-LODASH-450202
test('constructor :: pollution', t => {
	const payload = '{"constructor":{"prototype":{"a0":true}}}';

	const input = JSON.parse(payload);
	const output = klona(input);

	t.deepEqual(
		JSON.stringify(output),
		payload
	);

	t.not(({})['a0'], true, 'Safe POJO');
	t.not(input['a0'], true, 'Safe input');
	t.not(output['a0'], true, 'Safe output');

	t.end();
});


test('prototype :: pollution', t => {
	const payload = '{"__proto__":{"a0":true}}';

	const input = JSON.parse(payload);
	const output = klona(input);

	t.deepEqual(
		JSON.stringify(output),
		payload
	);

	t.not(({})['a0'], true, 'Safe POJO');
	t.not(input['a0'], true, 'Safe input');
	t.not(output['a0'], true, 'Safe output');

	t.end();
});


test('date', t => {
	const input = new Date;
	const output = klona(input);
	const original = input.toString();

	t.deepEqual(input, output);

	output.setDate('foobar123');
	t.is(output.toString(), 'Invalid Date');
	t.is(input.toString(), original);

	t.end();
});


test('function', t => {
	let input = () => {};
	let output = klona(input);
	let original = input.toString();

	t.deepEqual(input, output);

	input = () => 123;
	t.is(output.toString(), original);

	output = () => 456;
	t.is(input.toString(), '() => 123');

	t.end();
});


test('map :: flat', t => {
	const input = new Map();
	const output = klona(input);

	t.deepEqual(input, output);

	output.set('hello', 'world');
	t.is(input.get('hello'), undefined);

	input.set('foo', 'bar');
	t.is(output.get('foo'), undefined);

	t.end();
});


test('map :: nested', t => {
	const input = new Map([
		['foo', { a: 1 }],
		['bar', [1, 2, 3]],
	]);
	const output = klona(input);

	const foo = output.get('foo');
	foo.b = 2;
	foo.a++;

	t.deepEqual(input.get('foo'), { a: 1 });
	t.deepEqual(output.get('foo'), { a: 2, b: 2 });

	output.get('bar').push(4, 5, 6);
	t.deepEqual(input.get('bar'), [1, 2, 3]);
	t.deepEqual(output.get('bar'), [1, 2, 3, 4, 5, 6]);

	t.end();
});


test('map :: nested :: keys', t => {
	const input = new Map([
		[{ foo:1 }, { a: 1 }]
	]);

	const output = klona(input);
	t.deepEqual(input, output);

	[...output.keys()][0].bar = 2;

	t.deepEqual([...input.keys()][0], { foo:1 });
	t.deepEqual([...output.keys()][0], { foo:1, bar:2 });

	t.end();
});


test('null', t => {
	let input = null;
	let output = klona(input);

	t.deepEqual(input, output);

	output = 1;
	t.is(input, null);

	input = 123;
	t.is(output, 1);

	t.end();
});


test('number', t => {
	let input = 123;
	let output = klona(input);

	t.deepEqual(input, output);

	output++;
	t.is(input, 123);

	input += 100;
	t.is(output, 124);

	t.end();
});


test('object :: flat', t => {
	const input = { foo:1, bar:2, baz:3 };
	const output = klona(input);

	t.deepEqual(input, output);

	output.foo++;
	t.is(input.foo, 1);

	output.bar = 'hello';
	t.is(input.bar, 2);

	t.end();
});


test('object :: nested', t => {
	const input = {
		foo: 1,
		bar: {
			a: 2,
			b: ['hello', 'world'],
			c: [{ hello: 1, world: 2 }]
		},
		baz: 3
	};

	const output = klona(input);

	t.deepEqual(
		JSON.stringify(input),
		JSON.stringify(output)
	);

	output.bar.a = 11;
	t.is(input.bar.a, 2);

	output.bar.b[1] = 'mundo';
	t.is(input.bar.b[1], 'world');

	output.bar.c[0].hello = 99;
	t.is(input.bar.c[0].hello, 1);

	t.end();
});


test('regexp :: basic', t => {
	const input = /foo/gi;
	const output = klona(input);

	t.deepEqual(input, output);

	output.exec('foofoofoo');
	t.is(output.lastIndex, 3);
	t.is(input.lastIndex, 0);

	t.end();
});


test('regexp :: state', t => {
	const input = /foo/gi;
	input.exec('foofoofoo');
	const index = input.lastIndex;

	const output = klona(input);

	t.deepEqual(input, output);

	t.is(index, 3);
	t.is(input.lastIndex, index);
	t.is(output.lastIndex, index);

	t.end();
});


test('set :: flat', t => {
	const input = new Set('hello');
	const output = klona(input);

	t.deepEqual(input, output);

	output.add('world');
	t.false(input.has('world'));

	input.add('foobar');
	t.false(output.has('foobar'));

	t.end();
});

test('set :: nested', t => {
	const input = new Set([{ foo: 123 }]);
	const output = klona(input);

	t.deepEqual(input, output);

	const [obj] = [...output.keys()];
	obj.bar = 456;
	obj.foo++;

	const [item] = [...input.keys()];
	t.deepEqual(item, { foo: 123 });

	t.end();
});


test('string', t => {
	let input = 'hello';
	let output = klona(input);

	t.deepEqual(input, output);

	output += ' world';
	t.is(input, 'hello');

	input += '123';
	t.is(output, 'hello world');

	t.end();
});


test('typedarray :: buffer', t => {
	const input = Buffer.from('asd');
	const output = klona(input);

	t.deepEqual(input, output);

	output.write('foobar');
	t.is(input.toString(), 'asd');

	output[1] = 11;
	t.not(input[1], output[1]);

	const current = output.toString();
	input.write('hello');
	t.is(output.toString(), current);

	t.end();
});


test('typedarray :: uint16array', t => {
	const input = new Int16Array([42]);
	const output = klona(input);

	t.deepEqual(input, output);

	output[1] = 42;
	t.is(input[1], undefined);

	input[0] = 0;
	t.is(output[0], 42);

	t.end();
});


test('typedarray :: int32array', t => {
	const buf = new ArrayBuffer(8);
	const input = new Int32Array(buf);
	const output = klona(input);

	t.deepEqual(input, output);

	output[1] = 42;
	t.is(input[1], 0);

	input[0] = 22;
	t.is(output[0], 0);

	t.end();
});
