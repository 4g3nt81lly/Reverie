import { StrictMode } from 'react';
import { hydrateRoot } from 'react-dom/client';
import Workspace from './Workspace';

hydrateRoot(
	document.getElementById('root')!,
	<StrictMode>
		<Workspace />
	</StrictMode>
);
