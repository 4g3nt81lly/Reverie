import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import HomePage from '../app/pages/home/HomePage';
import Workspace from '../app/pages/workspace/Workspace';
import type { ServerRenderResult } from './types';

export function renderHomePage(): ServerRenderResult {
	return {
		body: renderToString(
			<StrictMode>
				<HomePage />
			</StrictMode>
		),
	};
}

export function renderWorkspacePage(url: string): ServerRenderResult {
	return {
		body: renderToString(
			<StrictMode>
				<Workspace />
			</StrictMode>
		),
	};
}
