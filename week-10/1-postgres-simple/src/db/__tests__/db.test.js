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
const __1 = require("../..");
const user_1 = require("../user");
const setup_1 = require("../setup");
const todo_1 = require("../todo");
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield __1.client.connect();
    yield (0, setup_1.dropTables)();
    yield (0, setup_1.createTables)();
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield __1.client.end();
}));
describe('User Database Operations', () => {
    test('createUser inserts a new user into the database', () => __awaiter(void 0, void 0, void 0, function* () {
        const username = 'testuser';
        const password = 'testpass';
        const name = 'Test User';
        yield (0, user_1.createUser)(username, password, name);
        const user = yield __1.client.query('SELECT * FROM users WHERE username = $1', [username]);
        expect(user.rows[0]).toHaveProperty('username', username);
        expect(user.rows[0]).toHaveProperty('name', name);
        expect(user.rows[0].password).toBe(password);
    }));
    test('getUser retrieves a user by ID', () => __awaiter(void 0, void 0, void 0, function* () {
        // Assuming an existing user with ID 1 for this test
        const userId = 1;
        const user = yield (0, user_1.getUser)(userId);
        expect(user).toHaveProperty('id', userId);
        expect(user).toHaveProperty('username');
        expect(user).toHaveProperty('name');
    }));
});
describe('Todo Operations', () => {
    let userId;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        // Assuming you have a function to get a user by username for test setup
        const res = yield __1.client.query('SELECT id FROM users WHERE username = $1', ['testuser']);
        userId = res.rows[0].id;
    }));
    test('createTodo inserts a new todo for a user', () => __awaiter(void 0, void 0, void 0, function* () {
        const title = 'Test Todo';
        const description = 'Test Description';
        const todo = yield (0, todo_1.createTodo)(userId, title, description);
        expect(todo).toHaveProperty('id');
        expect(todo.title).toEqual(title);
        expect(todo.description).toEqual(description);
        expect(todo.done).toEqual(false);
    }));
    test('updateTodo marks a todo as done', () => __awaiter(void 0, void 0, void 0, function* () {
        // First, create a todo to update
        const { id: todoId } = yield (0, todo_1.createTodo)(userId, 'Update Test', 'To be updated');
        const updatedTodo = yield (0, todo_1.updateTodo)(todoId);
        expect(updatedTodo.done).toEqual(true);
    }));
    test('getTodos retrieves all todos for a user', () => __awaiter(void 0, void 0, void 0, function* () {
        // Assuming there are already todos created in previous tests
        const todos = yield (0, todo_1.getTodos)(userId);
        expect(todos.length).toBeGreaterThan(0);
        todos.forEach(todo => {
            expect(todo).toHaveProperty('id');
            expect(todo.user_id).toEqual(userId);
        });
    }));
});
