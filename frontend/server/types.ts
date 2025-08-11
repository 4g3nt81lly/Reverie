export interface ServerRenderResult {
	head?: string;
	body: string;
}

export interface ServerEntry {
	renderHomePage(): ServerRenderResult;
	renderWorkspacePage(url: string): ServerRenderResult;
}
