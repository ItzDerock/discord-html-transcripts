import { h } from '@stencil/core';

export default function Boost<T>(props: T) {
	return (
		<svg {...props} aria-hidden="false" width="24" height="24" viewBox="0 0 8 12">
			<path d="M4 0L0 4V8L4 12L8 8V4L4 0ZM7 7.59L4 10.59L1 7.59V4.41L4 1.41L7 4.41V7.59Z" fill="currentColor" />
			<path d="M2 4.83V7.17L4 9.17L6 7.17V4.83L4 2.83L2 4.83Z" fill="currentColor" />
		</svg>
	);
}
