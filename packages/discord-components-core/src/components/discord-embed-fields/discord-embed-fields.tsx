import type { ComponentInterface} from '@stencil/core';
import { Component, h, Host } from '@stencil/core';

@Component({
	tag: 'discord-embed-fields',
	styleUrl: 'discord-embed-fields.css'
})
export class DiscordEmbedFields implements ComponentInterface {
	public render() {
		return (
			<Host class="discord-embed-fields">
				<slot></slot>
			</Host>
		);
	}
}
