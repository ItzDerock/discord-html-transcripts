import { DiscordActionRow, DiscordButton } from "@derockdev/discord-components-react";
import { ActionRow, ButtonStyle, ComponentType, MessageActionRowComponent } from "discord.js";
import React from 'react';
import { parseDiscordEmoji } from "../../utils/utils";

export default function renderComponentRow(row: ActionRow<MessageActionRowComponent>, id: number) {
  return (
    <DiscordActionRow key={id}>
      {
        row.components.map((component, id) => 
          renderComponent(component, id)
        )
      }
    </DiscordActionRow>
  )
}


const ButtonStyleMapping = {
  [ButtonStyle.Primary]: 'primary',
  [ButtonStyle.Secondary]: 'secondary',
  [ButtonStyle.Success]: 'success',
  [ButtonStyle.Danger]: 'destructive',
  [ButtonStyle.Link]: 'secondary',
} as const;

export function renderComponent(component: MessageActionRowComponent, id: number) {
  if(component.type === ComponentType.Button) {
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