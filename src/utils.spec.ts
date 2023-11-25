import { throwIf, throwUnless } from './utils';

describe('Utils', () => {
	describe('#throwIf', () => {
		it('Should not throw anything', () => {
			expect(() => throwIf(false, new Error('throw false')));
		});

		it('Should throw', () => {
			expect(() => throwIf(true, new Error('throw true'))).toThrow('throw true');
		});
	});

	describe('#throwUnless', () => {
		it('Should not throw anything', () => {
			expect(() => throwUnless(true, new Error('throw true')));
		});

		it('Should throw', () => {
			expect(() => throwUnless(false, new Error('throw false'))).toThrow('throw false');
		});
	});
});
