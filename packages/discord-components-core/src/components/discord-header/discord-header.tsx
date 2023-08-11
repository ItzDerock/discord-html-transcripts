import { Component, Host, h, Prop, ComponentInterface } from '@stencil/core';

@Component({
	tag: 'discord-header',
	styleUrl: 'discord-header.css'
})
export class DiscordHeader implements ComponentInterface {
	/**
	 * The guild name
	 */
	@Prop()
	public guild: string;

	/**
	 * The name of the channel
	 */
	@Prop()
	public channel: string;

	/**
	 * The icon to display.
	 */
	@Prop()
	public icon?: string;

	public render() {
		return (
			<Host class="discord-header">
				<div class="discord-header-icon">
					{
						// if no guild icon, create one using the first letter of the guild name
						this.icon ? (
							<img src={this.icon} alt="guild icon" />
						) : (
							<div>
								<span>
									{(() => {
										const split = this.guild.split(' ');
										return split.length > 1 ? split[0][0] + split[1][0] : split[0][0];
									})()}
								</span>
							</div>
						)
					}
				</div>
				<div class="discord-header-text">
					<div class="discord-header-text-guild">{this.guild}</div>
					<div class="discord-header-text-channel">#{this.channel}</div>
					<slot></slot>
				</div>
			</Host>
		);
	}
}
