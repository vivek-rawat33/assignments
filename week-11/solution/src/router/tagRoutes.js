"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tagRouter = void 0;
const hono_1 = require("hono");
const tagController_1 = require("../controller/tagController");
exports.tagRouter = new hono_1.Hono();
exports.tagRouter.get('/getPost/:tag', tagController_1.getPostsByTag);
exports.tagRouter.get('/tags', tagController_1.getTags);
