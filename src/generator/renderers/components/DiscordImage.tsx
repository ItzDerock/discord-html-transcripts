// Upstream skyra discord-image-attachment is not responsive, height and width must be hardcoded

export type DiscordImageAttachmentProps = {
  url: string;
  alt?: string;
};

export const DiscordAttachmentStyles = `
  .discord-attachment-container {
    display: block;
    position: relative;
    max-width: min(100%, 525px);
  }

  .discord-attachment-container > img {
    max-width: 100%;
    border-radius: 8px;
  }
`;

export function DiscordImageAttachment(props: DiscordImageAttachmentProps) {
  return (
    <div slot="attachments" className="discord-attachment-container">
      <img src={props.url} alt={props.alt} />
    </div>
  );
}
