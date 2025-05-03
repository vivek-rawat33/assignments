"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPostsByTag = exports.getTags = void 0;
const edge_1 = require("@prisma/client/edge");
const extension_accelerate_1 = require("@prisma/extension-accelerate");
var StatusCode;
(function (StatusCode) {
    StatusCode[StatusCode["BADREQ"] = 400] = "BADREQ";
    StatusCode[StatusCode["NOTFOUND"] = 404] = "NOTFOUND";
    StatusCode[StatusCode["NOTPERMISSIOON"] = 403] = "NOTPERMISSIOON";
})(StatusCode || (StatusCode = {}));
const getTags = (c) => __awaiter(void 0, void 0, void 0, function* () {
    const prisma = new edge_1.PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends((0, extension_accelerate_1.withAccelerate)());
    try {
        const res = yield prisma.tags.findMany();
        return c.json({
            tags: res,
        });
    }
    catch (error) {
        return c.body(`Internal server error: ${error}`, 500);
    }
});
exports.getTags = getTags;
const getPostsByTag = (c) => __awaiter(void 0, void 0, void 0, function* () {
    const prisma = new edge_1.PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends((0, extension_accelerate_1.withAccelerate)());
    try {
        const res = yield prisma.tags.findMany({
            where: {
                tag: String(c.req.param('tag')),
            },
            select: {
                post: {
                    select: {
                        User: { select: { username: true } },
                        id: true,
                        userId: true,
                        title: true,
                        body: true,
                        createdAt: true,
                    },
                },
            },
        });
        return c.json({
            posts: res[0].post.map((post) => ({
                username: post.User.username,
                id: post.id,
                title: post.title,
                userId: post.userId,
                body: post.body,
                createdAt: post.createdAt,
            })),
        });
    }
    catch (error) {
        return c.body(`Internal server error: ${error}`, 500);
    }
});
exports.getPostsByTag = getPostsByTag;
