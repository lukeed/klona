const assert = require('assert');

module.exports = function (_, copy) {
	assert.ok(["[object Circular]", "[Circular]"].includes(copy.full));
}
