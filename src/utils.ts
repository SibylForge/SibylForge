
export function throwIf(condition: boolean, exception: Error) {
	if (condition) {
		throw exception;
	}
}

export function throwUnless(conditions: boolean, exception: Error) {
	throwIf(!conditions, exception);
}
