"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postRouter = void 0;
const hono_1 = require("hono");
const postController_1 = require("../controller/postController");
const user_1 = require("../middleware/user");
exports.postRouter = new hono_1.Hono();
exports.postRouter.get('/all-posts', postController_1.getPosts);
exports.postRouter.get('/posts', user_1.authmiddleware, postController_1.getUserPosts);
exports.postRouter.post('/create-post', user_1.authmiddleware, postController_1.createPost);
exports.postRouter.get('/post/:id', user_1.authmiddleware, postController_1.getPost);
exports.postRouter.put('/post/:id', user_1.authmiddleware, postController_1.updatePost);
exports.postRouter.delete('/post/:id', user_1.authmiddleware, postController_1.deletePost);
