export type Language = "en" | "zh-CN";
export type WindowId = "about" | "links" | "work" | "faq" | "contact";

export interface ArticleSummary {
	slug: string;
	title: string;
	description: string;
	pubDate: string;
	image?: string;
	url: string;
	lang: string;
}

export interface WindowState {
	id: WindowId;
	x: number;
	y: number;
	width: number;
	height: number;
	z: number;
}

export interface DesktopDictionary {
	languageLabel: string;
	lightsOn: string;
	lightsOff: string;
	soundOn: string;
	soundOff: string;
	musicPlay: string;
	musicPause: string;
	musicPlaying: string;
	musicPaused: string;
	musicError: string;
	closeWindow: string;
	close: string;
	home: string;
	footer: string;
	nav: Record<WindowId, string>;
	windows: Record<WindowId, string>;
	hero: {
		subtitle: string;
	};
	about: {
		badge: string;
		avatarAlt: string;
		body: string;
		summary: string;
		detailsTitle: string;
		interests: string[];
		note: string;
	};
	links: {
		github: string;
		bilibili: string;
	};
	work: {
		tools: string;
		development: string;
		articles: string;
		toolsEmpty: string;
		developmentEmpty: string;
		articlesEmpty: string;
		coverAlt: string;
		openArticle: string;
		previewNote: string;
	};
	faq: {
		items: Array<{ question: string; answer: string }>;
	};
	contact: {
		intro: string;
		copy: string;
		copied: string;
		copyFailed: string;
		email: string;
	};
	article: {
		backHome: string;
		closeTab: string;
		closeFailed: string;
		published: string;
	};
	dateLocale: string;
}
