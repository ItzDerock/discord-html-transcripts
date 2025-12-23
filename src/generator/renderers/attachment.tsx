import type { APIAttachment, APIMessage, Attachment as AttachmentType, Message } from 'discord.js';
import type { RenderMessageContext } from '..';
import { AttachmentTypes } from '../../types';
import { formatBytes } from '../../utils/utils';
import { DiscordImageAttachment } from './components/DiscordImage';

/**
 * Renders all attachments for a message
 * @param message
 * @param context
 * @returns
 */
export async function Attachments(props: { message: Message; context: RenderMessageContext }) {
  if (props.message.attachments.size === 0) return <></>;

  return props.message.attachments.map((attachment, id) => (
    <Attachment attachment={attachment} message={props.message} context={props.context} key={id} />
  ));
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
  const attachmentType = getAttachmentType(attachment);
  const [bytes, bytesUnit] = formatBytes(attachment.size);

  // if the attachment is an image, download it to a data url
  switch (attachmentType) {
    case AttachmentTypes.Image: {
      const downloaded = await context.callbacks.resolveImageSrc(
        attachment.toJSON() as APIAttachment,
        message.toJSON() as APIMessage
      );

      if (downloaded !== null) {
        url = downloaded ?? url;
      }

      return <DiscordImageAttachment url={url} alt={attachment.name} key={attachment.id} />;
    }

    case AttachmentTypes.Video: {
      return <discord-video-attachment key={attachment.id} slot="attachments" href={url} />;
    }

    case AttachmentTypes.Audio: {
      return (
        <discord-audio-attachment
          slot="attachments"
          key={attachment.id}
          href={url}
          bytes={bytes}
          bytesUnit={bytesUnit}
          name={attachment.name}
        />
      );
    }

    case AttachmentTypes.File: {
      return (
        <discord-file-attachment
          slot="attachments"
          key={attachment.id}
          href={url}
          bytes={bytes}
          bytes-unit={bytesUnit}
          name={attachment.name}
        />
      );
    }
  }
}

/**
 * Parses the attachment content type.
 * @param attachment Discord.js attachment object
 * @returns
 */
function getAttachmentType(attachment: AttachmentType): AttachmentTypes {
  switch (attachment.contentType?.split('/')?.[0]) {
    case 'audio':
      return AttachmentTypes.Audio;
    case 'image':
      return AttachmentTypes.Image;
    case 'video':
      return AttachmentTypes.Video;

    case undefined:
    default:
      return AttachmentTypes.File;
  }
}
