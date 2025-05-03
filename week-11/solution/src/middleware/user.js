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
exports.authmiddleware = authmiddleware;
const jwt_1 = require("hono/utils/jwt");
function authmiddleware(c, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const JWT_TOKEN = "mytoken";
        try {
            const token = c.req.header("Authorization").split(" ")[1];
            if (token !== null || token !== undefined) {
                const decode = yield jwt_1.Jwt.verify(token, JWT_TOKEN);
                if (decode) {
                    c.set("userId", decode);
                    yield next();
                }
                else {
                    return c.body("you are unauthroized user sorry", 401);
                }
            }
            else {
                return c.body("you are unauthroized user", 401);
            }
        }
        catch (error) {
            return c.body("unauthroized ", 401);
        }
    });
}
