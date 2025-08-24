import { StatusCodes } from 'http-status-codes';
import type { Request } from 'express';
import type { IRouter } from '../types/api';
import { time } from 'console';

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
				response.status(StatusCodes.UNPROCESSABLE_ENTITY);
				throw new Error('Failed per request.');
			},
		},
		{
			path: '/think',
			method: 'get',
			async handler(request, response) {
				const { time } = request.query;
				const timeout = Number(time);
				if (Number.isInteger(timeout) && timeout >= 0) {
					await new Promise((resolve) => {
						setTimeout(resolve, timeout);
					});
				}
				response.status(StatusCodes.OK);
				return 'Done!';
			},
		},
	],
} as IRouter;
