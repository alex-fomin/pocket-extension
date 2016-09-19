/// <reference path="model.d.ts" />
interface IStorage {
    // updatefunction (items, since) {
    update(items: Item[])
    add(item: Item);
}