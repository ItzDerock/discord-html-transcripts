import { Component, Host, h, Prop, ComponentInterface } from '@stencil/core';
import hljs from 'highlight.js';

@Component({
	tag: 'discord-code-block',
	styleUrl: 'discord-code-block.css'
})
export class DiscordCodeBlock implements ComponentInterface {
	/**
	 * The language of the code block.
	 */
	@Prop()
	public language?: string;

	/**
	 * The code to display.
	 */
	@Prop()
	public code: string;

	public render() {
		// check if hljs has the language
		const language = this.language ? (hljs.getLanguage(this.language) ? this.language : 'plaintext') : 'plaintext';

		return (
			<Host class="discord-code-block-pre discord-code-block-pre--multiline language">
				<code class={`hljs language-${language}`} innerHTML={hljs.highlight(this.code, { language }).value} />
			</Host>
		);
	}
}
