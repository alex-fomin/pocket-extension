export class Status {
    public static readonly OK = "0";
    public static readonly ARCHIVED = "1";
    public static readonly DELETED = "2";
}

export interface IArticle {
    item_id: string;
    resolved_id: string;
    given_url: string;
    given_title: string;
    favorite: string;
    status: "0"|"1"|"2"; // 0 - ok, 1 - archived, 2 - deleted
    time_added: string;
    time_updated: string;
    time_read: string;
    time_favorited: string;
    sort_id: number;
    resolved_title: string;
    resolved_url: string;
    excerpt: string;
    is_article: string;
    is_index: string;
    has_video: string;
    has_image: string;
    word_count: string;
}