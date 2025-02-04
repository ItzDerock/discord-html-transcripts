import { DiscordActionRow, DiscordButton } from '@derockdev/discord-components-react';
import { ButtonStyle, ComponentType, type MessageActionRowComponent, type ActionRow } from 'discord.js';
import React from 'react';
import { parseDiscordEmoji } from '../../utils/utils';

export default function ComponentRow({ row, id }: { row: ActionRow<MessageActionRowComponent>; id: number }) {
  return (
    <DiscordActionRow key={id}>
      {row.components.map((component, id) => (
        <Component component={component} id={id} key={id} />
      ))}
    </DiscordActionRow>
  );
}

const ButtonStyleMapping = {
  [ButtonStyle.Primary]: 'primary',
  [ButtonStyle.Secondary]: 'secondary',
  [ButtonStyle.Success]: 'success',
  [ButtonStyle.Danger]: 'destructive',
  [ButtonStyle.Link]: 'secondary',
  [ButtonStyle.Premium]: 'primary',
} as const;

export function Component({ component, id }: { component: MessageActionRowComponent; id: number }) {
  if (component.type === ComponentType.Button) {
    return (
      <DiscordButton
        key={id}
        type={ButtonStyleMapping[component.style]}
        url={component.url ?? undefined}
        emoji={component.emoji ? parseDiscordEmoji(component.emoji) : undefined}
      >
        {component.label}
      </DiscordButton>
    );
  }

  return undefined;
}
