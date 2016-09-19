/// <reference path="./safari.d.ts"/>
/// <reference path="../../typings/index.d.ts"/>
import _ = require("lodash");
import {ExtensionButtons} from "./consts";


console.log(_);

let itemArray = safari.extension.toolbarItems;
let button = _.find(itemArray, x=>x.identifier == ExtensionButtons.ADD_TO_POCKET);

console.log(button);