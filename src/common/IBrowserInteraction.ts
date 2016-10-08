declare type BrowserInteractionConfig = {
    onRandomArticle: Function;
    onToggle: Function;
    onChangeActivePage: (url: string)=>void;
    onSaveAccessToken: (accessToken: string)=>void
};

export interface IBrowserInteraction {
    setBadge(count: number);
    setUnreadStatus(unread: boolean);
    getActiveUrl(): string;
    goto(url: string): void;
    startOAuthRoutine();
    configure(config: BrowserInteractionConfig): void;
}