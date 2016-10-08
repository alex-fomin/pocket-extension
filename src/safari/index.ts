import {SafariSettings} from "./SafariSettings";
import {start} from "../common/start";
import {SafariBrowserInteraction} from "./SafariBrowserInteraction";

const browserInteraction = new SafariBrowserInteraction();
const settings = new SafariSettings();
start(settings, browserInteraction);
