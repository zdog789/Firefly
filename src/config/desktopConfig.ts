import type { WindowId } from "../types/desktop";

export const siteConfig = {
	title: "zdog101的博客",
	name: "zdog101",
	subtitle: "目标是成为全能制作人",
	email: "2895957048@qq.com",
	github: "https://github.com/zdog789",
	bilibili: "https://space.bilibili.com/1988595",
} as const;

// Layout examples only. Replace with the author's actual tool and technology list.
export const workSampleLabels = {
	tools: [
		"Adobe Photoshop",
		"Adobe Premiere",
		"Adobe After Effects",
		"Blender",
		"Figma",
	],
	development: ["C++", "Python", "JavaScript", "HTML / CSS"],
} as const;

export const windowDefinitions: Array<{
	id: WindowId;
	icon: string;
	width: number;
	height: number;
}> = [
	{ id: "about", icon: "/assets/desktop/about.svg", width: 800, height: 610 },
	{ id: "links", icon: "/assets/desktop/links.svg", width: 344, height: 258 },
	{ id: "work", icon: "/assets/desktop/work.svg", width: 920, height: 670 },
	{ id: "faq", icon: "/assets/desktop/faq.svg", width: 500, height: 480 },
	{
		id: "contact",
		icon: "/assets/desktop/contact.svg",
		width: 440,
		height: 340,
	},
];

export const desktopAssets = {
	grass: "/assets/desktop/grass-meadow.webp",
	corgi: "/assets/desktop/corgi-animations-v3.webp",
	defaultCover: "/assets/desktop/default-cover.svg",
	lightOn: "/assets/desktop/light-on.svg",
	lightOff: "/assets/desktop/light-off.svg",
	soundOn: "/assets/desktop/sound-on.svg",
	soundOff: "/assets/desktop/sound-off.svg",
	home: "/assets/desktop/home.svg",
	close: "/assets/desktop/close.svg",
	language: "/assets/desktop/language.svg",
	music: "/assets/desktop/audio/caramel-macchiato-daydreaming.ogg",
	pop: "/assets/desktop/audio/window-pop.ogg",
} as const;
