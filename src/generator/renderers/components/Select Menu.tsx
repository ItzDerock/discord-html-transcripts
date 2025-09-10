import React from 'react';
import { type MessageActionRowComponent, ComponentType } from 'discord.js';
import { parseDiscordEmoji } from '../../../utils/utils';
import { getSelectTypeLabel } from './utils';

function DiscordSelectMenu({
  component,
}: {
  component: Exclude<MessageActionRowComponent, { type: ComponentType.Button }>;
}) {
  const isStringSelect = component.type === ComponentType.StringSelect;
  const placeholder = component.placeholder || getSelectTypeLabel(component.type);

  return (
    <div className="discord-select-menu">
      <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{placeholder}</div>
      <div style={{ display: 'flex', alignItems: 'center', marginLeft: '8px' }}>
        <svg width="24" height="24" viewBox="0 0 24 24">
          <path fill="currentColor" d="M7 10L12 15L17 10H7Z" />
        </svg>
      </div>
      {isStringSelect && component.options && component.options.length > 0 && (
        <div
          style={{
            display: 'none',
            position: 'absolute',
            top: '44px',
            left: '0',
            width: '100%',
            backgroundColor: '#2b2d31',
            borderRadius: '4px',
            zIndex: 10,
            border: '1px solid #1e1f22',
            maxHeight: '320px',
            overflowY: 'auto',
          }}
        >
          {component.options.map((option, idx) => (
            <div
              key={idx}
              style={{
                padding: '8px 12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                borderBottom: idx < component.options.length - 1 ? '1px solid #1e1f22' : 'none',
              }}
            >
              {option.emoji && <span style={{ marginRight: '8px' }}>{parseDiscordEmoji(option.emoji)}</span>}
              <span>{option.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DiscordSelectMenu;
