export interface IBrowserInteraction {
    setBadge(count: number);
    setUnreadStatus(unread: boolean);
    getActiveUrl(): string;
    goto(url: string): void;
    onToggle(onToggle: Function): void;
    onRandomArticle(onRandomArticle: Function): void;
    startOAuthRoutine();
    onChangeActivePage(onChangeActivePage: (url: string)=>void): void;
    onSaveAccessToken(onSaveAccessToken: (accessToken: string)=>void): void;
}