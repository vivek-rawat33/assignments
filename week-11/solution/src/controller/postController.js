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
exports.getPosts = getPosts;
exports.getUserPosts = getUserPosts;
exports.createPost = createPost;
exports.getPost = getPost;
exports.updatePost = updatePost;
exports.deletePost = deletePost;
const edge_1 = require("@prisma/client/edge");
const extension_accelerate_1 = require("@prisma/extension-accelerate");
var StatusCode;
(function (StatusCode) {
    StatusCode[StatusCode["BADREQ"] = 400] = "BADREQ";
    StatusCode[StatusCode["NOTFOUND"] = 404] = "NOTFOUND";
    StatusCode[StatusCode["NOTPERMISSIOON"] = 403] = "NOTPERMISSIOON";
})(StatusCode || (StatusCode = {}));
function getPosts(c) {
    return __awaiter(this, void 0, void 0, function* () {
        const prisma = new edge_1.PrismaClient({
            datasourceUrl: c.env.DATABASE_URL,
        }).$extends((0, extension_accelerate_1.withAccelerate)());
        try {
            const response = yield prisma.posts.findMany({
                include: {
                    tags: true,
                    User: true,
                },
            });
            return c.json({
                post: response.map((res) => ({
                    id: res.id,
                    username: res.User.username,
                    userId: res.User.id,
                    title: res.title,
                    body: res.body,
                    tags: res.tags,
                    createdAt: res.createdAt,
                })),
            });
        }
        catch (error) {
            return c.body(`Internal server error: ${error}`, 500);
        }
    });
}
function getUserPosts(c) {
    return __awaiter(this, void 0, void 0, function* () {
        const prisma = new edge_1.PrismaClient({
            datasourceUrl: c.env.DATABASE_URL,
        }).$extends((0, extension_accelerate_1.withAccelerate)());
        try {
            const resp = yield prisma.posts.findMany({
                where: {
                    userId: c.get('userId'),
                },
            });
            return c.json({
                post: resp,
            });
        }
        catch (error) {
            return c.body(`Internal server error: ${error}`, 500);
        }
    });
}
function createPost(c) {
    return __awaiter(this, void 0, void 0, function* () {
        const prisma = new edge_1.PrismaClient({
            datasourceUrl: c.env.DATABASE_URL,
        }).$extends((0, extension_accelerate_1.withAccelerate)());
        try {
            const body = yield c.req.json();
            const tagNames = body.tags.split(',').map((tag) => tag.trim());
            if ((body.body && body.title) == null) {
                return c.body('Invalid user input', StatusCode.BADREQ);
            }
            const res = yield prisma.posts.create({
                data: {
                    title: body.title,
                    body: body.body,
                    userId: c.get('userId'),
                    tags: {
                        connectOrCreate: tagNames.map((tag) => ({
                            where: { tag },
                            create: { tag },
                        })),
                    },
                },
                include: {
                    tags: true,
                },
            });
            return c.json({
                message: 'Post successfully',
                post: {
                    id: res.id,
                    title: res.title,
                    body: res.body,
                    tags: res.tags.map((tag) => tag.tag),
                    createdAt: res.createdAt,
                },
            });
        }
        catch (error) {
            return c.body(`Internal server error: ${error}`, 500);
        }
    });
}
function getPost(c) {
    return __awaiter(this, void 0, void 0, function* () {
        const prisma = new edge_1.PrismaClient({
            datasourceUrl: c.env.DATABASE_URL,
        }).$extends((0, extension_accelerate_1.withAccelerate)());
        try {
            const id = Number(c.req.param('id'));
            const isPostExist = yield prisma.posts.findFirst({
                where: {
                    id: id,
                    userId: c.get('userId'),
                },
                include: {
                    tags: true,
                },
            });
            if (isPostExist == null) {
                return c.body('Post does not exists', StatusCode.NOTFOUND);
            }
            return c.json({
                data: {
                    id: isPostExist.id,
                    title: isPostExist.title,
                    body: isPostExist.body,
                    tags: isPostExist.tags,
                    createdAt: isPostExist.createdAt,
                },
            });
        }
        catch (error) {
            return c.body(`Internal server error: ${error}`, 500);
        }
    });
}
// this controller update the specific post
function updatePost(c) {
    return __awaiter(this, void 0, void 0, function* () {
        const prisma = new edge_1.PrismaClient({
            datasourceUrl: c.env.DATABASE_URL,
        }).$extends((0, extension_accelerate_1.withAccelerate)());
        try {
            const id = Number(c.req.param('id'));
            const body = yield c.req.json();
            const tagNames = body.tags.split(',').map((tag) => tag.trim());
            const isPostExist = yield prisma.posts.findFirst({
                where: {
                    id: id,
                    userId: c.get('userId'),
                },
            });
            if (isPostExist == null) {
                return c.body('Post does not exists', StatusCode.NOTFOUND);
            }
            const res = yield prisma.posts.update({
                where: {
                    id: id,
                    userId: c.get('userId'),
                },
                data: {
                    title: body.title,
                    body: body.body,
                    tags: {
                        connectOrCreate: tagNames.map((tag) => ({
                            where: { tag },
                            create: { tag },
                        })),
                    },
                },
                include: {
                    tags: true,
                },
            });
            return c.json({
                data: {
                    id: res.id,
                    title: res.title,
                    body: res.body,
                    tags: res.tags,
                    createdAt: res.createdAt,
                },
            });
        }
        catch (error) {
            return c.body(`Internal server error: ${error}`, 500);
        }
    });
}
function deletePost(c) {
    return __awaiter(this, void 0, void 0, function* () {
        const prisma = new edge_1.PrismaClient({
            datasourceUrl: c.env.DATABASE_URL,
        }).$extends((0, extension_accelerate_1.withAccelerate)());
        try {
            const id = Number(c.req.param('id'));
            const isPostExist = yield prisma.posts.findFirst({
                where: {
                    id: id,
                    userId: c.get('userId'),
                },
            });
            if (isPostExist == null) {
                return c.body('Post does not exists', StatusCode.NOTFOUND);
            }
            const res = yield prisma.posts.delete({
                where: {
                    id: id,
                    userId: c.get('userId'),
                },
            });
            return c.json({
                message: 'post deleted',
            });
        }
        catch (error) {
            return c.json({ msg: `Internal server error: ${error}` }, 500);
        }
    });
}
