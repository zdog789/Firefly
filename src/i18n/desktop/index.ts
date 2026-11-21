import type { DesktopDictionary, Language } from "../../types/desktop";
import { en } from "./en";
import { zhCN } from "./zh-CN";

const dictionaries: Record<Language, DesktopDictionary> = { en, "zh-CN": zhCN };

export function getDictionary(language: Language): DesktopDictionary {
	return dictionaries[language];
}
