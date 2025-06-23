export interface Env {
	// PORTS
	PORT: number;

	// VARIABLES to say if we want to save coordinates into db,json
	TO_STORE_COORDINATES: 0 | 1;

	// WITHAI params
	MODE: 'dev' | 'prod';

	// Turn off error if not yet defined
	[key: string]: string | undefined;
}
