import { DiscordAttachment, DiscordAttachments } from '@derockdev/discord-components-react';
import React, { ReactNode } from 'react';
import type { Attachment as AttachmentType, Message } from 'discord.js';
import type { RenderMessageContext } from '..';
import type { AttachmentTypes } from '../../types';
import { downloadImageToDataURL, formatBytes } from '../../utils/utils';

/**
 * Renders all attachments for a message
 * @param message
 * @param context
 * @returns
 */
export async function Attachments(props: { message: Message; context: RenderMessageContext }): Promise<ReactNode> {
  if (props.message.attachments.size === 0) return null;

  return (
    <DiscordAttachments slot="attachments">
      {/* {await Promise.all(message.attachments.map((attachment) => renderAttachment(attachment, context)))} */}
      {props.message.attachments.map((attachment) => (
        <Attachment attachment={attachment} context={props.context} />
      ))}
    </DiscordAttachments>
  );
}

// "audio" | "video" | "image" | "file"
function getAttachmentType(attachment: AttachmentType): AttachmentTypes {
  const type = attachment.contentType?.split('/')?.[0] ?? 'unknown';
  if (['audio', 'video', 'image'].includes(type)) return type as AttachmentTypes;
  return 'file';
}

/**
 * Renders one Discord Attachment
 * @param props - the attachment and rendering context
 */
export async function Attachment({
  attachment,
  context,
}: {
  attachment: AttachmentType;
  context: RenderMessageContext;
}) {
  let url = attachment.url;
  const name = attachment.name;
  const width = attachment.width;
  const height = attachment.height;

  const type = getAttachmentType(attachment);

  // if the attachment is an image, download it to a data url
  if (context.saveImages && type === 'image') {
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
