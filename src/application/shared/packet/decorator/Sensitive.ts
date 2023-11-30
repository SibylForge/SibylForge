export function Sensitive(): ClassDecorator {
	return (target: any) => {
		Reflect.defineMetadata('IS_SENSITIVE', true, target);
	};
}
