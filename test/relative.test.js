let pp = require('../index');

test('Relative path', () => {
	console.log(pp.get('src'));
	expect(pp.get('src') == `./../src`).toBe(true);
});

test('Relative path with using masks', () => {
	expect(pp.get('react', 'components') == `./../src/react/components`).toBe(true);
});