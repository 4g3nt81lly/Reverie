export const PRODUCTION = process.env.NODE_ENV === 'production';
export const DEV = process.env.NODE_ENV === 'dev';

export const PORT = process.env.PORT ?? 4000;

export const FRONTEND_ORIGIN =
	process.env.FRONTEND_ORIGIN ??
	(PRODUCTION ? 'http://localhost:3000' : 'http://localhost:5173');
