import { Component, h, Host, Listen, State } from '@stencil/core';

@Component({
	tag: 'discord-spoiler',
	styleUrl: 'discord-spoiler.css'
})
export class DiscordSpoiler {
	@State() private isRevealed = false;

	@Listen('click')
	public reveal() {
		this.isRevealed = true;
	}

	public render() {
		return (
			<Host class={`discord-spoiler${this.isRevealed ? '--revealed' : ''}`}>
				<slot></slot>
			</Host>
		);
	}
}
