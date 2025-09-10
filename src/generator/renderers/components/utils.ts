import { ComponentType } from 'discord.js';
import { baseImageStyle, containerStyle } from './styles';

/**
 * Gets the appropriate label for different select menu types
 */
const SELECT_LABEL_MAP = {
  [ComponentType.UserSelect]: 'Select User',
  [ComponentType.RoleSelect]: 'Select Role',
  [ComponentType.MentionableSelect]: 'Select Mentionable',
  [ComponentType.ChannelSelect]: 'Select Channel',
  [ComponentType.StringSelect]: 'Make a Selection',
} as const;

export function getSelectTypeLabel(type: ComponentType): string {
  return SELECT_LABEL_MAP[type as keyof typeof SELECT_LABEL_MAP] ?? 'Select Option';
}

/**
 * Gets the grid layout for media galleries based on count
 */
export function getGalleryLayout(count: number) {
  switch (count) {
    case 1:
      return {
        ...containerStyle,
        gridTemplateColumns: '1fr',
        gridTemplateRows: 'auto',
      };
    case 2:
      return {
        ...containerStyle,
        gridTemplateColumns: '1fr 1fr',
        gridTemplateRows: 'auto',
      };
    case 3:
    case 4:
      return {
        ...containerStyle,
        gridTemplateColumns: '1fr 1fr',
        gridTemplateRows: '1fr 1fr',
      };
    case 5:
      return {
        ...containerStyle,
        gridTemplateColumns: '1fr 1fr 1fr',
        gridTemplateRows: 'auto auto',
      };
    default:
      if (count >= 7) {
        return {
          ...containerStyle,
          gridTemplateColumns: '1fr 1fr 1fr',
          gridTemplateRows: 'auto auto auto auto',
        };
      } else {
        return {
          ...containerStyle,
          gridTemplateColumns: '1fr 1fr 1fr',
          gridTemplateRows: 'auto',
        };
      }
  }
}

/**
 * Gets the style for an individual image based on its position and total count
 */
export function getImageStyle(idx: number, count: number) {
  switch (count) {
    case 3:
      if (idx === 0) {
        return {
          ...baseImageStyle,
          gridRow: '1 / span 2',
          gridColumn: '1',
          aspectRatio: '1/2',
        };
      }
      break;

    case 5:
      if (idx < 2) {
        return {
          ...baseImageStyle,
          gridRow: '1',
          gridColumn: idx === 0 ? '1 / span 2' : '3',
        };
      } else {
        return {
          ...baseImageStyle,
          gridRow: '2',
          gridColumn: `${idx - 2 + 1}`,
        };
      }

    case 7:
      if (idx === 0) {
        return {
          ...baseImageStyle,
          gridRow: '1',
          gridColumn: '1 / span 3',
        };
      } else if (idx <= 3) {
        return {
          ...baseImageStyle,
          gridRow: '2',
          gridColumn: `${idx - 0}`,
        };
      } else {
        return {
          ...baseImageStyle,
          gridRow: '3',
          gridColumn: `${idx - 3}`,
        };
      }

    case 8:
      if (idx < 2) {
        return {
          ...baseImageStyle,
          gridRow: '1',
          gridColumn: idx === 0 ? '1 / span 2' : '3',
        };
      } else if (idx < 5) {
        return {
          ...baseImageStyle,
          gridRow: '2',
          gridColumn: `${idx - 2 + 1}`,
        };
      } else {
        return {
          ...baseImageStyle,
          gridRow: '3',
          gridColumn: `${idx - 5 + 1}`,
        };
      }

    case 10:
      if (idx === 0) {
        return {
          ...baseImageStyle,
          gridRow: '1',
          gridColumn: '1 / span 3',
        };
      } else if (idx <= 3) {
        return {
          ...baseImageStyle,
          gridRow: '2',
          gridColumn: `${idx - 0}`,
        };
      } else if (idx <= 6) {
        return {
          ...baseImageStyle,
          gridRow: '3',
          gridColumn: `${idx - 3}`,
        };
      } else {
        return {
          ...baseImageStyle,
          gridRow: '4',
          gridColumn: `${idx - 6}`,
        };
      }
  }

  return baseImageStyle;
}
