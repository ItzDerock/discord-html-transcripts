import type { CSSProperties } from 'react';
import { ButtonStyle } from 'discord.js';

// Container styles
export const containerStyle = {
  display: 'grid',
  gap: '4px',
  width: '100%',
  maxWidth: '500px',
  borderRadius: '8px',
  overflow: 'hidden',
} satisfies CSSProperties;

// Base image style
export const baseImageStyle = {
  overflow: 'hidden',
  position: 'relative',
  background: '#2b2d31',
} satisfies CSSProperties;

// Button style mapping
export const ButtonStyleMapping = {
  [ButtonStyle.Primary]: 'primary',
  [ButtonStyle.Secondary]: 'secondary',
  [ButtonStyle.Success]: 'success',
  [ButtonStyle.Danger]: 'destructive',
  [ButtonStyle.Link]: 'secondary',
} as const;

// TODO: minify
export const globalStyles = `
  .discord-container {
    display: grid;
    gap: 4px;
    width: 100%;
    max-width: 500px;
    border-radius: 8px;
    overflow: hidden;
  }

  .discord-base-image {
    overflow: hidden;
    position: relative;
    background: #2b2d31;
  }

  .discord-button {
    color: #ffffff !important;
    padding: 2px 16px;
    border-radius: 8px;
    text-decoration: none !important;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    font-weight: 500;
    height: 32px;
    min-height: 32px;
    min-width: 60px;
    cursor: pointer;
    font-family: Whitney, "Helvetica Neue", Helvetica, Arial, sans-serif;
    text-align: center;
    box-sizing: border-box;
    border: none;
    outline: none;
    transition: background-color 0.2s ease;
  }

  .discord-button-primary {
    background-color: hsl(234.935 calc(1*85.556%) 64.706% /1);
  }

  .discord-button-secondary {
    background-color: hsl(240 calc(1*4%) 60.784% /0.12156862745098039);
  }

  .discord-button-success {
    background-color: hsl(145.97 calc(1*100%) 26.275% /1);
  }

  .discord-button-destructive {
    background-color: hsl(355.636 calc(1*64.706%) 50% /1);
  }

  .discord-select-menu {
    margin-top: 2px;
    margin-bottom: 2px;
    position: relative;
    width: 100%;
    max-width: 500px;
    height: 40px;
    background-color: #2b2d31;
    border-radius: 4px;
    color: #b5bac1;
    cursor: pointer;
    font-family: Whitney, "Helvetica Neue", Helvetica, Arial, sans-serif;
    font-size: 14px;
    display: flex;
    align-items: center;
    padding: 0 8px;
    justify-content: space-between;
    box-sizing: border-box;
    border: 1px solid #1e1f22;
  }

  .discord-header {
  	display: flex;
  	flex-direction: row;
  	max-height: 5rem;
  	padding: 0.5rem;
  	gap: 0.5rem;
  	border-bottom: 1px solid rgba(79, 84, 92, 0.48);
  }

  .discord-header-icon {
  	float: left;
  	width: 5rem;
  }

  .discord-header-icon > div {
  	background-color: rgb(79, 84, 92);
  	border-radius: 50%;
  	width: 5rem;
  	height: 5rem;
  	text-align: center;
  	align-items: center;
  	justify-content: center;
  	display: flex;
  	font-size: xx-large;
  }

  .discord-header-icon > img {
  	border-radius: 50%;
  	width: auto;
  	height: 100%;
  }

  .discord-header-text {
    flex-grow: 1;
  }

  .discord-header-text-guild {
  	font-size: 1.5rem;
  	font-weight: bold;
  }

  .reply-inline {
    white-space: collapse;
  }
`;
