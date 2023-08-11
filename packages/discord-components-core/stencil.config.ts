import { Config } from '@stencil/core';
import { reactOutputTarget } from '@stencil/react-output-target';

export const config: Config = {
	namespace: 'derockdev-discord-components-core',
	extras: {
		experimentalImportInjection: true
	},
	outputTargets: [
		reactOutputTarget({
			componentCorePackage: '@derockdev/discord-components-core',
			proxiesFile: '../react/src/index.ts',
			includeDefineCustomElements: true,
			includePolyfills: false
		}),
		{
			type: 'dist',
			empty: true,
			esmLoaderPath: '../loader'
		},
		{
			type: 'docs-readme',
			strict: true
		},
		{
			type: 'www',
			serviceWorker: null,
			copy: [{ src: '../static', dest: 'static/' }]
		}
	]
};
