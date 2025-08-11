import compression from 'compression';
import express, { type Request, type Response } from 'express';
import fs from 'fs';
import { StatusCodes } from 'http-status-codes';
import { resolve } from 'node:path';
import { __server_dirname, isProduction } from './shared.ts';
import type { ServerEntry } from './types.ts';

const __dist_dirname = resolve(__server_dirname, '../dist');
const __client_dirname = resolve(__dist_dirname, 'client');
const __pages_dirname = resolve(__client_dirname, 'pages');

export default class Server {
	private readonly app: express.Application;

	private entryServer?: ServerEntry;
	private templateContents: Map<string, string>;

	public constructor() {
		this.app = express();

		this.templateContents = new Map();

		this.configureMiddlewares();
		this.configureRoutes();

		this.loadEntryServerRenderMethods();
		this.preloadAssets();
	}

	private configureMiddlewares() {
		this.app.use(compression());
		this.app.use('/assets', express.static(resolve(__client_dirname, 'assets')));
	}

	private configureRoutes() {
		this.app.get('/', this.serveHomePage.bind(this));
		this.app.get('/workspace/:workspaceId', this.serveWorkspacePage.bind(this));
	}

	private preloadAssets() {
		this.templateContents.set('/', fs.readFileSync(resolve(__pages_dirname, 'home', 'index.html'), 'utf-8'));
		this.templateContents.set(
			'/workspace',
			fs.readFileSync(resolve(__pages_dirname, 'workspace', 'index.html'), 'utf-8')
		);
	}

	private async loadEntryServerRenderMethods() {
		this.entryServer = await import(resolve(__dist_dirname, 'server/entry-server.js'));
	}

	private serveHomePage(request: Request, response: Response) {
		try {
			const templateHTML = this.templateContents.get('/')!;
			const { head = '', body } = this.entryServer!.renderHomePage();

			const renderedHTML = templateHTML.replace('<!--home-head-->', head).replace('<!--home-root-->', body);
			response.status(StatusCodes.OK).type('html').end(renderedHTML);
		} catch (err) {
			const error = err as Error;
			console.error('Failed to render page:', error.stack);
			response.status(StatusCodes.INTERNAL_SERVER_ERROR).end(error.stack);
		}
	}

	private serveWorkspacePage(request: Request<{ workspaceId: string }>, response: Response) {
		try {
			const requestUrl = request.originalUrl;
			const { workspaceId } = request.params;

			const templateHTML = this.templateContents.get('/workspace')!;

			const { head = '', body } = this.entryServer!.renderWorkspacePage(requestUrl);

			const renderedHTML = templateHTML
				.replace('<!--workspace-id-->', ` ${workspaceId}`)
				.replace('<!--workspace-head-->', head)
				.replace('<!--workspace-root-->', body);
			response.status(StatusCodes.OK).type('html').end(renderedHTML);
		} catch (err) {
			const error = err as Error;
			console.error('Failed to render page:', error.stack);
			response.status(StatusCodes.INTERNAL_SERVER_ERROR).end(error.stack);
		}
	}

	public start() {
		const port = process.env.PORT ?? (isProduction ? 3000 : 5173);
		if (!this.entryServer) {
			return setTimeout(this.start.bind(this));
		}
		this.app.listen(port, (error) => {
			if (error) {
				console.log('❌ Unable to start frontend server:', error);
			} else {
				console.log(`✅ Frontend server started at http://localhost:${port}`);
			}
		});
	}
}
