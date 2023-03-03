"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
// Import our other routes
const map_routes_1 = __importDefault(require("./map.routes"));
const users_routes_1 = __importDefault(require("./users.routes"));
const apiRouter = (0, express_1.Router)();
// add the API routes
apiRouter.use('/map', map_routes_1.default);
apiRouter.use('/users', users_routes_1.default);
exports.default = apiRouter;
