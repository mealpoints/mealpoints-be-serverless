"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const env_1 = require("./env");
const connect = () => mongoose_1.default.connect(env_1.config.mongoose.url, env_1.config.mongoose.options);
exports.db = {
    connect,
};
