import type { ComponentInterface} from '@stencil/core';
import { Component, h, Host } from '@stencil/core';

@Component({
	tag: 'discord-attachments',
	styleUrl: 'discord-attachments.css'
})
export class DiscordAttachments implements ComponentInterface {
	public render() {
		return (
			<Host class="discord-attachments">
				<slot></slot>
			</Host>
		);
	}
}
