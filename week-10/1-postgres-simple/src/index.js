"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.client = void 0;
const pg_1 = require("pg");
const config_1 = require("./config");
exports.client = new pg_1.Client({
    connectionString: config_1.DB_URL
});
