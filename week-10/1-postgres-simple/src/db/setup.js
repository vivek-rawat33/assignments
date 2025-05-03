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
exports.createTables = createTables;
exports.dropTables = dropTables;
// src/db/__tests__/setup.js
const index_1 = require("../index");
function createTables() {
    return __awaiter(this, void 0, void 0, function* () {
        yield index_1.client.query(`
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            username VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            name VARCHAR(255) NOT NULL
        );
    `);
        yield index_1.client.query(`
        CREATE TABLE IF NOT EXISTS todos (
            id SERIAL PRIMARY KEY,
            user_id INTEGER NOT NULL REFERENCES users(id),
            title VARCHAR(255) NOT NULL,
            description TEXT,
            done BOOLEAN DEFAULT false
        );
    `);
    });
}
function dropTables() {
    return __awaiter(this, void 0, void 0, function* () {
        yield index_1.client.query(`DROP TABLE IF EXISTS todos;`);
        yield index_1.client.query(`DROP TABLE IF EXISTS users;`);
    });
}
module.exports = { createTables, dropTables };
