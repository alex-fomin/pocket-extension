import Dexie from 'dexie';
import {IArticle, Status} from "./model/Article";
import _ = require("lodash");

export class ArticleStorage extends Dexie {
    private articles: Dexie.Table<IArticle, number>;

    constructor() {
        super("pocket");

        this.version(1).stores({
            articles: "&item_id,given_url,resolved_url"
        });

    }


    public count(): Promise<number> {
        return new Promise((resolve, reject)=>this.articles.count().then(resolve, reject));
    }

    public getRandomArticle(): Promise<IArticle> {
        return this.count()
            .then(n=>this.articles.offset(Math.round(Math.random() * n)).first())
    }

    public async update(articles: IArticle[], since?: number) {
        var articleMap = _.groupBy(articles, a=>a.status);

        if (_.isUndefined(since)) {
            await this.articles.clear();
        }
        await this.articles.bulkDelete(articleMap[Status.ARCHIVED].map(x=>x.item_id));
        await this.articles.bulkDelete(articleMap[Status.DELETED].map(x=>x.item_id));
        await this.articles.bulkPut(articleMap[Status.OK]);
    }
}