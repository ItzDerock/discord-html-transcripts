import { type ReactNode } from 'react';

export type TranscriptHeaderProps = {
  guildName: string;
  channelName: string;
  guildIcon?: string;
  children?: ReactNode;
};

export function TranscriptHeader(props: TranscriptHeaderProps) {
  // If guild has no icon, we take first letter of guild name words
  // i.e. Guild A -> GA
  // and OneWordGuildName -> O
  const split = props.guildName.split(' ');
  const placeholder = split.length > 1 ? split[0][0] + split[1][0] : split[0][0];

  return (
    <div className="discord-header">
      <div className="discord-header-icon">
        {props.guildIcon ? (
          <img src={props.guildIcon} alt="guild icon" />
        ) : (
          <div>
            <span>{placeholder}</span>
          </div>
        )}
      </div>
      <div className="discord-header-text">
        <div className="discord-header-text-guild">{props.guildName}</div>
        <div className="discord-header-text-channel">#{props.channelName}</div>
        {props.children}
      </div>
    </div>
  );
}
