"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const express_1 = __importDefault(require("express"));
const serverless_http_1 = __importDefault(require("serverless-http"));
const routes_1 = __importDefault(require("./routes"));
const APIResponse_1 = __importDefault(require("./utils/APIResponse"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use("/", routes_1.default);
// Error handling
// 404
app.use((req, res, next) => {
    return APIResponse_1.default.NotFound(res);
});
// 500
app.use((err, req, res, next) => {
    return APIResponse_1.default.ServerError(res, err);
});
exports.handler = (0, serverless_http_1.default)(app);
