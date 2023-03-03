"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const mapRoutes = (0, express_1.Router)();
mapRoutes.get('', (req, res) => {
    res.send("...");
});
exports.default = mapRoutes;
