let pp = require('../index'),
	root = require('app-root-path');

test('Absolute path', () => {
	expect(pp.getA('src') == `${root.toString()}/src`).toBe(true);
});

test('Absolute path with using masks', () => {
	expect(pp.getA('react', 'components') == `${root.toString()}/src/react/components`).toBe(true);
});