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
exports.getAllUsers = void 0;
exports.signup = signup;
exports.signin = signin;
exports.userProfile = userProfile;
const edge_1 = require("@prisma/client/edge");
const extension_accelerate_1 = require("@prisma/extension-accelerate");
const user_1 = require("../zod/user");
const jwt_1 = require("hono/utils/jwt");
var StatusCode;
(function (StatusCode) {
    StatusCode[StatusCode["BADREQ"] = 400] = "BADREQ";
    StatusCode[StatusCode["NOTFOUND"] = 404] = "NOTFOUND";
    StatusCode[StatusCode["NOTPERMISSIOON"] = 403] = "NOTPERMISSIOON";
})(StatusCode || (StatusCode = {}));
function signup(c) {
    return __awaiter(this, void 0, void 0, function* () {
        const prisma = new edge_1.PrismaClient({
            datasourceUrl: c.env.DATABASE_URL,
        }).$extends((0, extension_accelerate_1.withAccelerate)());
        try {
            const body = yield c.req.json();
            const parsedUser = user_1.signupSchema.safeParse(body);
            if (!parsedUser.success) {
                return c.body('Invalid user input', StatusCode.BADREQ);
            }
            const isUserExist = yield prisma.user.findFirst({
                where: { email: body.email },
            });
            if (isUserExist) {
                return c.body('email already exist', StatusCode.BADREQ);
            }
            const res = yield prisma.user.create({
                data: {
                    username: body.username,
                    email: body.email,
                    password: body.password,
                },
            });
            const userId = res.id;
            const token = yield jwt_1.Jwt.sign(userId, c.env.JWT_TOKEN);
            return c.json({
                msg: 'User created successfully',
                token: token,
                user: {
                    userId: res.id,
                    username: res.username,
                    email: res.email,
                },
            });
        }
        catch (error) {
            return c.body(`Internal server error: ${error}`, 500);
        }
    });
}
function signin(c) {
    return __awaiter(this, void 0, void 0, function* () {
        const prisma = new edge_1.PrismaClient({
            datasourceUrl: c.env.DATABASE_URL,
        }).$extends((0, extension_accelerate_1.withAccelerate)());
        try {
            const body = yield c.req.json();
            const parsedUser = user_1.signinSchema.safeParse(body);
            if (!parsedUser.success) {
                return c.body('Invalid user input', StatusCode.BADREQ);
            }
            const isUserExist = yield prisma.user.findFirst({
                where: {
                    email: body.email,
                    password: body.password,
                },
            });
            if (isUserExist == null) {
                return c.body('User does not exists', StatusCode.BADREQ);
            }
            const userId = isUserExist.id;
            const token = yield jwt_1.Jwt.sign(userId, c.env.JWT_TOKEN);
            return c.json({
                message: 'login successfully',
                token: token,
                user: {
                    userId: userId,
                    username: isUserExist.username,
                    email: isUserExist.email,
                },
            });
        }
        catch (error) {
            return c.body(`Internal server error: ${error}`, 500);
        }
    });
}
function userProfile(c) {
    return __awaiter(this, void 0, void 0, function* () {
        const prisma = new edge_1.PrismaClient({
            datasourceUrl: c.env.DATABASE_URL,
        }).$extends((0, extension_accelerate_1.withAccelerate)());
        try {
            const res = yield prisma.user.findFirst({
                where: {
                    id: Number(c.req.param('id')),
                },
                include: {
                    posts: true,
                },
            });
            if (res == null) {
                return c.body('User not found', 404);
            }
            else {
                return c.json({
                    user: {
                        id: res.id,
                        username: res.username,
                        email: res.email,
                        posts: res.posts,
                    },
                });
            }
        }
        catch (error) {
            return c.body(`Internal server error: ${error}`, 500);
        }
    });
}
const getAllUsers = (c) => __awaiter(void 0, void 0, void 0, function* () {
    const prisma = new edge_1.PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends((0, extension_accelerate_1.withAccelerate)());
    try {
        const res = yield prisma.user.findMany();
        return c.json({
            users: res.map((user) => ({
                id: user.id,
                username: user.username,
                email: user.email,
            })),
        });
    }
    catch (error) {
        return c.body(`Internal server error: ${error}`, 500);
    }
});
exports.getAllUsers = getAllUsers;
