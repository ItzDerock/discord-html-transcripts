import type { ComponentInterface} from '@stencil/core';
import { Component, h, Host } from '@stencil/core';

@Component({
	tag: 'discord-reactions',
	styleUrl: 'discord-reactions.css'
})
export class DiscordReactions implements ComponentInterface {
	public render() {
		return (
			<Host class="discord-reactions">
				<slot></slot>
			</Host>
		);
	}
}
