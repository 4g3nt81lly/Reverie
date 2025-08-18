import { StatusCodes } from 'http-status-codes';
import type { IRouter } from '../types/api';

export default {
	path: '/api/v1',
	endpoints: [
		{
			path: '/echo',
			method: 'get',
			middlware: [
				(request, response, next) => {
					console.log('🔊 An echo request was received!');
					next();
				},
			],
			handler(request, response) {
				response.status(StatusCodes.OK);
				return 'OK';
			},
		},
		{
			path: '/fail',
			method: 'get',
			handler(request, response) {
				throw new Error('Failed per request.');
			},
		},
	],
} as IRouter;
