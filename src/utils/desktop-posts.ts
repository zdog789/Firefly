import type { CollectionEntry } from "astro:content";
import type { ArticleSummary } from "@/types/desktop";
import { processCoverImageSync } from "@/utils/image-utils";
import { loadLocalImage } from "@/utils/schema-image";
import { getFileDirFromPath, getPostUrlBySlug, url } from "@/utils/url-utils";

export function getDesktopPostLanguage(post: CollectionEntry<"posts">): string {
	return post.data.lang.replaceAll("_", "-") || "zh-CN";
}

export async function getDesktopPostCover(
	post: CollectionEntry<"posts">,
): Promise<string | undefined> {
	const cover = processCoverImageSync(post.data.image, post.id);
	if (!cover) return undefined;
	if (/^(https?:)?\/\/|^data:/.test(cover)) return cover;
	if (cover.startsWith("/")) return url(cover);
	const image = await loadLocalImage(
		cover,
		getFileDirFromPath(post.filePath || ""),
	);
	return image?.src;
}

export async function toDesktopArticleSummary(
	post: CollectionEntry<"posts">,
): Promise<ArticleSummary> {
	return {
		slug: post.id,
		title: post.data.title,
		description: post.data.description,
		pubDate: post.data.published.toISOString(),
		image: await getDesktopPostCover(post),
		url: getPostUrlBySlug(post.id),
		lang: getDesktopPostLanguage(post),
	};
}
