import type { Language } from "../types/desktop";

export const STORAGE_KEYS = {
	lights: "firefly.lightsOn",
	language: "firefly.language",
	muted: "firefly.muted",
} as const;

export function readLightsPreference(): boolean {
	try {
		return window.localStorage.getItem(STORAGE_KEYS.lights) !== "false";
	} catch {
		return true;
	}
}

export function readLanguagePreference(): Language {
	try {
		return window.localStorage.getItem(STORAGE_KEYS.language) === "zh-CN"
			? "zh-CN"
			: "en";
	} catch {
		return "en";
	}
}

export function readMutedPreference(): boolean {
	try {
		return window.localStorage.getItem(STORAGE_KEYS.muted) !== "false";
	} catch {
		return true;
	}
}

export function savePreference(key: string, value: string): void {
	try {
		window.localStorage.setItem(key, value);
	} catch {
		// The site remains functional when storage is unavailable.
	}
}

export function applyLights(lightsOn: boolean): void {
	document.documentElement.dataset.lights = lightsOn ? "on" : "off";
}

export function applyLanguage(language: Language): void {
	document.documentElement.lang = language;
	window.dispatchEvent(
		new CustomEvent<Language>("firefly:language", { detail: language }),
	);
}
