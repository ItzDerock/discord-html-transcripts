import type { ComponentInterface } from '@stencil/core';
import { Component, h, Host } from '@stencil/core';

@Component({
  tag: 'discord-action-row',
  styleUrl: 'discord-action-row.css',
})
export class DiscordActionRow implements ComponentInterface {
  public render() {
    return (
      <Host class="discord-action-row">
        <slot></slot>
      </Host>
    );
  }
}
