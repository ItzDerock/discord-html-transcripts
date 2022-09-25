import { DiscordAttachment, DiscordAttachments } from "@derockdev/discord-components-react";
import React from "react";
import type { Attachment, Message } from "discord.js";
import type { RenderMessageContext } from "..";
import type { AttachmentTypes } from "../../types";
import { downloadImageToDataURL, formatBytes } from "../../utils/utils";

export default async function renderAttachments(message: Message, context: RenderMessageContext) {
	if (message.attachments.size === 0) return null;

	const attachments: React.ReactNode[] = [];

	for (const attachment of message.attachments.values()) {
		attachments.push(await renderAttachment(attachment, context));
	}

	return <DiscordAttachments slot="attachments">{attachments}</DiscordAttachments>;
}

// "audio" | "video" | "image" | "file"
function getAttachmentType(attachment: Attachment): AttachmentTypes {
	const type = attachment.contentType?.split("/")?.[0] ?? "unknown";
	if (["audio", "video", "image"].includes(type)) return type as AttachmentTypes;
	return "file";
}

export async function renderAttachment(attachment: Attachment, context: RenderMessageContext) {
	let url = attachment.url;
	const name = attachment.name;
	const width = attachment.width;
	const height = attachment.height;

	const type = getAttachmentType(attachment);

	if (context.saveImages) {
		const downloaded = await downloadImageToDataURL(url);
		if (downloaded) {
			url = downloaded;
		}
	}

	return (
		<DiscordAttachment
			type={type}
			size={formatBytes(attachment.size)}
			key={attachment.id}
			slot="attachment"
			url={url}
			alt={name ?? undefined}
			width={width ?? undefined}
			height={height ?? undefined}
		/>
	);
}
