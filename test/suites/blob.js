import { suite } from 'uvu';
import * as assert from 'assert';

export default function (klona) {
  const Blobs = suite('Blobs');

  Blobs('blob', async () => {
    // node is not support blob. maybe use 'fetch-blob'?
    const input = new Blob(['foo']);
    const output = klona(input);

    assert.equal(input.size, output.size);
    assert.equal(input.type, output.type);
    assert.equal(await input.text(), await output.text());
  });

  Blobs.run();
}
