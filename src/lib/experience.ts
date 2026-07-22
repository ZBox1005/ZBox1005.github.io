import { getPageConfig } from '@/lib/content';
import type { CardPageConfig, ExperiencePageConfig } from '@/types/page';

export function resolveExperiencePage(
  config: ExperiencePageConfig,
  locale?: string
): ExperiencePageConfig {
  return {
    ...config,
    groups: config.groups.map((group) => {
      const sourceConfig = getPageConfig<CardPageConfig>(group.source, locale);

      return {
        ...group,
        items: sourceConfig?.type === 'card' ? sourceConfig.items : [],
      };
    }),
  };
}
