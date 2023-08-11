import { Component, ComponentInterface, Element, h, Host, Prop } from '@stencil/core';

enum DiscordAttachmentType {
	IMAGE = 'image',
	VIDEO = 'video',
	AUDIO = 'audio',
	FILE = 'file'
}

@Component({
	tag: 'discord-attachment',
	styleUrl: 'discord-attachment.css'
})
export class DiscordAttachment implements ComponentInterface {
	/**
	 * The DiscordEmbed element.
	 */
	@Element()
	public el: HTMLElement;

	/**
	 * The URL for the image attachment
	 * @important Should be a valid image URL, i.e. matching the regex `/\.(bmp|jpe?g|png|gif|webp|tiff)$/i`
	 */
	@Prop()
	public url: string;

	/**
	 * The type of file the attachment is.
	 * 'image' | 'video' | 'audio' | 'file'
	 */
	@Prop()
	public type: 'image' | 'video' | 'audio' | 'file';

	/**
	 * The size of the file.
	 */
	@Prop()
	public size: string;

	/**
	 * The height of the image in pixels
	 */
	@Prop()
	public height?: number;

	/**
	 * The width of the image in pixels
	 */
	@Prop()
	public width?: number;

	/**
	 * The alt text to show in case the image was unable to load
	 * @default 'discord attachment'
	 */
	@Prop()
	public alt? = 'discord attachment';

	public render() {
		switch (this.type) {
			case DiscordAttachmentType.IMAGE:
				return (
					<Host class="discord-attachment">
						<div class="discord-image-wrapper">
							<img alt={this.alt} src={this.url} height={this.height} width={this.width} />
						</div>
					</Host>
				);

			case DiscordAttachmentType.VIDEO:
				return (
					<Host class="discord-attachment">
						<div class="discord-image-wrapper">
							<video src={this.url} height={this.height} width={this.width} />
						</div>
					</Host>
				);

			case DiscordAttachmentType.AUDIO:
				return (
					<Host class="discord-attachment">
						<audio src={this.url} />
					</Host>
				);

			case DiscordAttachmentType.FILE:
			default:
				return (
					<Host class="discord-attachment-generic">
						<div class="discord-attachment-generic-icon">
							<svg xmlns="http://www.w3.org/2000/svg" fill="none" height="96" viewBox="0 0 72 96" width="72">
								<path
									d="m72 29.3v60.3c0 2.24 0 3.36-.44 4.22-.38.74-1 1.36-1.74 1.74-.86.44-1.98.44-4.22.44h-59.2c-2.24 0-3.36 0-4.22-.44-.74-.38-1.36-1-1.74-1.74-.44-.86-.44-1.98-.44-4.22v-83.2c0-2.24 0-3.36.44-4.22.38-.74 1-1.36 1.74-1.74.86-.44 1.98-.44 4.22-.44h36.3c1.96 0 2.94 0 3.86.22.5.12.98.28 1.44.5v16.88c0 2.24 0 3.36.44 4.22.38.74 1 1.36 1.74 1.74.86.44 1.98.44 4.22.44h16.88c.22.46.38.94.5 1.44.22.92.22 1.9.22 3.86z"
									fill="#d3d6fd"
								/>
								<path
									d="m68.26 20.26c1.38 1.38 2.06 2.06 2.56 2.88.18.28.32.56.46.86h-16.88c-2.24 0-3.36 0-4.22-.44-.74-.38-1.36-1-1.74-1.74-.44-.86-.44-1.98-.44-4.22v-16.880029c.3.14.58.28.86.459999.82.5 1.5 1.18 2.88 2.56z"
									fill="#939bf9"
								/>
							</svg>
						</div>

						<div class="discord-attachment-generic-inner">
							<div class="discord-attachment-generic-name">
								<a href={this.url} target="_blank" rel="noopener noreferrer">
									{this.alt}
								</a>
							</div>

							<div class="discord-attachment-generic-size">{this.size}</div>
						</div>

						<div class="discord-attachment-generic-download">
							<a href={this.url} download>
								<svg aria-hidden="true" role="img" width="24" height="24" viewBox="0 0 24 24">
									<path
										fill="currentColor"
										fill-rule="evenodd"
										clip-rule="evenodd"
										d="M16.293 9.293L17.707 10.707L12 16.414L6.29297 10.707L7.70697 9.293L11 12.586V2H13V12.586L16.293 9.293ZM18 20V18H20V20C20 21.102 19.104 22 18 22H6C4.896 22 4 21.102 4 20V18H6V20H18Z"
									></path>
								</svg>
							</a>
						</div>
					</Host>
				);
		}
	}
}
