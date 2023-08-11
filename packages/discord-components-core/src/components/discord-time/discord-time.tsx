import { Component, h, Host, Prop, State } from '@stencil/core';

const DATE_TYPE_FORMATS = {
	t: { timeStyle: 'short' },
	T: { timeStyle: 'medium' },
	d: { dateStyle: 'short' },
	D: { dateStyle: 'long' },
	f: { dateStyle: 'long', timeStyle: 'short' },
	F: { dateStyle: 'full', timeStyle: 'short' },
	R: { style: 'long', numeric: 'auto' }
} as const;

// max: [unit, per unit]
const RELATIVE_DATE_CONVERSION = {
	60000: ['second', 1000],
	3600000: ['minute', 60000],
	86400000: ['hour', 3600000],
	604800000: ['day', 86400000],
	2419200000: ['week', 604800000],
	29030400000: ['month', 2419200000],
	290304000000: ['year', 29030400000]
} as const;

@Component({
	tag: 'discord-time',
	styleUrl: 'discord-time.css'
})
export class DiscordTime {
	/**
	 * The time to display.
	 */
	@Prop()
	public timestamp: number;

	/**
	 * The format for the time.
	 */
	@Prop()
	public format: 't' | 'T' | 'f' | 'F' | 'd' | 'D' | 'R' = 't';

	// Private variables
	@State() private time = '';
	private updateInterval: number | undefined;

	public render() {
		return <Host class="discord-time">{this.time}</Host>;
	}

	// Lifecycle methods
	public connectedCallback() {
		this.update();
	}

	public disconnectedCallback() {
		window.clearInterval(this.updateInterval);
	}

	/**
	 * Generates a string for the time.
	 */
	private update() {
		const date = new Date(this.timestamp);

		if (this.format === 'R') {
			const [formatted, interval] = getRelativeDate(date);
			this.time = formatted;

			// Update the time according to the interval
			if (this.updateInterval) window.clearInterval(this.updateInterval);
			if (interval > -1) this.updateInterval = window.setInterval(() => this.update(), interval);
		} else {
			this.time = date.toLocaleString(undefined, DATE_TYPE_FORMATS[this.format]);
		}
	}
}

// [formatted, updateInterval]
function getRelativeDate(date: Date): [string, number] {
	const difference = Date.now() - date.getTime();
	const diffAbsolute = Math.abs(difference);

	const ending = difference < 0 ? 'from now' : 'ago';

	if (diffAbsolute < 5000) {
		return ['Just now', 1000];
	}

	for (const [time, [unit, per]] of Object.entries(RELATIVE_DATE_CONVERSION)) {
		if (diffAbsolute < Number(time)) {
			const amount = Math.round(diffAbsolute / per);

			return [`${amount} ${unit}${amount === 1 ? '' : 's'} ${ending}`, unit === 'second' ? 1000 : 60 * 1000];
		}
	}

	return [`${Math.floor(diffAbsolute / 290304000000)} years ${ending}`, -1];
}
