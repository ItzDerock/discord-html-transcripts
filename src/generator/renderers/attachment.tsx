import { DiscordAttachment, DiscordAttachments } from '@derockdev/discord-components-react';
import React from 'react';
import type { APIAttachment, APIMessage, Attachment as AttachmentType, Message } from 'discord.js';
import type { RenderMessageContext } from '..';
import type { AttachmentTypes } from '../../types';
import { formatBytes } from '../../utils/utils';

/**
 * Renders all attachments for a message
 * @param message
 * @param context
 * @returns
 */
export async function Attachments(props: { message: Message; context: RenderMessageContext }) {
  if (props.message.attachments.size === 0) return <></>;

  return (
    <DiscordAttachments slot="attachments">
      {props.message.attachments.map((attachment, id) => (
        <Attachment attachment={attachment} message={props.message} context={props.context} key={id} />
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
  message,
}: {
  attachment: AttachmentType;
  context: RenderMessageContext;
  message: Message;
}) {
  let url = attachment.url;
  const name = attachment.name;
  const width = attachment.width;
  const height = attachment.height;

  const type = getAttachmentType(attachment);

  // if the attachment is an image, download it to a data url
  if (type === 'image') {
    const downloaded = await context.callbacks.resolveImageSrc(
      attachment.toJSON() as APIAttachment,
      message.toJSON() as APIMessage
    );

    if (downloaded !== null) {
      url = downloaded ?? url;
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
