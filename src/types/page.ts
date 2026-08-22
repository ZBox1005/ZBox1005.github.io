export interface BasePageConfig {
    type: 'about' | 'publication' | 'card' | 'text' | 'experience' | 'travel';
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
    updated?: string;
}

export interface CardItem {
    title: string;
    subtitle?: string;
    date?: string;
    content?: string;
    tags?: string[];
    link?: string;
    image?: string;
    image_scale?: number;
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

/** [longitude, latitude] in degrees — d3 order, not lat/lon. */
export type Coord = [number, number];

export interface TravelPhoto {
    src: string;
    /** "3:2" — mandatory, so the layout reserves space under `images.unoptimized`. */
    ratio: string;
    alt?: string;
    caption?: string;
}

export type TravelBlock =
    | { kind: 'prose'; text: string; lede?: boolean }
    | {
      kind: 'gallery';
      images: string[];
      alts?: string[];
      /** Intrinsic image ratios, kept parallel to `images` for stable lazy layout. */
      ratios?: string[];
  }
    | {
          kind: 'figure';
          layout?: 'full' | 'wide' | 'pair';
          ratio: string;
          images: string[];
          alt?: string;
          caption?: string;
      }
    | { kind: 'quote'; text: string };

export interface TravelEntry {
    id: string;
    place: string;
    region?: string;
    coord: Coord;
    /** ISO date, YYYY-MM-DD. */
    date: string;
    /** Local wall-clock time, "21:10". */
    local_time?: string;
    /** Authored with DST already applied — a static site has no tz database. */
    utc_offset?: string;
    headline?: string;
    /** Register-note density: a short paragraph instead of `blocks`. */
    note?: string;
    photo?: TravelPhoto;
    /** Dispatch density: full editorial treatment. */
    blocks?: TravelBlock[];
}

export interface TravelPageConfig extends BasePageConfig {
    type: 'travel';
    eyebrow?: string;
    headline?: string;
    standfirst?: string;
    /** The fixed point every measurement on the page is taken from. */
    home?: { label: string; region?: string; coord: Coord };
    globe?: {
        initial?: [number, number];
        drift_deg_per_sec?: number;
        graticule_step?: number;
    };
    entries: TravelEntry[];
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
