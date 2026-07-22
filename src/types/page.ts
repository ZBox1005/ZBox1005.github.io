export interface BasePageConfig {
    type: 'about' | 'publication' | 'card' | 'text' | 'experience';
    title: string;
    description?: string;
}

export interface PublicationPageConfig extends BasePageConfig {
    type: 'publication';
    source: string;
}

export interface TextPageConfig extends BasePageConfig {
    type: 'text';
    source: string;
    pdf?: string;
}

export interface CardItem {
    title: string;
    subtitle?: string;
    date?: string;
    content?: string;
    tags?: string[];
    link?: string;
    image?: string;
}

export interface CardPageConfig extends BasePageConfig {
    type: 'card';
    items: CardItem[];
}

export interface ExperienceGroupConfig {
    id: string;
    tab_label: string;
    title: string;
    description?: string;
    source: string;
    items?: CardItem[];
}

export interface ExperiencePageConfig extends BasePageConfig {
    type: 'experience';
    default_group?: string;
    groups: ExperienceGroupConfig[];
}

export interface PageSectionLink {
    id: string;
    label: string;
}

export interface ProjectItem {
    title: string;
    subtitle: string;
    category: string;
    year: string;
    image: string;
    href: string;
}
