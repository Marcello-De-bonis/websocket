export interface Env {
	// PORTS
	PORT: number;

	// MODE
	MODE: 'dev' | 'prod';

	// VARIABLES to say if we want to save coordinates into db,json
	TO_STORE_COORDINATES: 0 | 1;

	// Turn off error if not yet defined
	[key: string]: string | number | undefined;
}
