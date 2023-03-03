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
const express_1 = require("express");
const users_middleware_1 = require("../middleware/users.middleware");
const client_1 = require("@prisma/client");
const users_helper_1 = require("../helpers/users.helper");
// Create our PRISMA Client
const prisma = new client_1.PrismaClient();
const usersRoutes = (0, express_1.Router)();
usersRoutes.post('/create', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { firstname, lastname, email, password, dob, username } = req.body;
    // Create password hash.
    const hashedPassword = yield (0, users_middleware_1.getHashedPassword_async)(password);
    // Create 
    const newUser = yield prisma.users.create({
        data: {
            user_firstname: firstname,
            user_lastname: lastname,
            user_email: email,
            user_password: hashedPassword,
            user_username: username
        }
    });
    // Create age record
    const newAge = yield prisma.ages.create({
        data: {
            user_id: newUser.user_id,
            dob: new Date(dob),
            age: (0, users_helper_1.calculateUserAge)(dob)
        }
    });
    res.json({ status: true, user: newUser, newAge: newAge });
}));
usersRoutes.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    // Get the User
    const user = yield prisma.users.findFirst({
        where: {
            user_id: parseInt(id)
        }
    });
    // Get the Users age
    const age = yield prisma.ages.findFirst({
        where: {
            user_id: parseInt(id)
        }
    });
    // Get the Users roles
    const roles = yield prisma.roles.findMany({
        where: {
            user_id: parseInt(id)
        }
    });
    console.log({ status: true, user: user, age: age, roles: roles });
    res.json({ status: true, user: user, age: age, roles: roles });
}));
usersRoutes.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password_unhashed } = req.body;
    // Get the password hash from database
    prisma.users.findFirst({
        where: {
            user_email: email
        }
    })
        .then((user) => __awaiter(void 0, void 0, void 0, function* () {
        console.log("Got user: " + user);
        // Check passwords using salt
        const check = yield (0, users_middleware_1.checkPassword)(password_unhashed, user.user_password);
        if (!check) {
            res.sendStatus(403);
        }
        // Create access token
        const accessToken = (0, users_middleware_1.generateAccessToken)({ email: email });
        res.json({ status: check, data: { success: check, user: user, token: accessToken || "" } });
    }));
}));
usersRoutes.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    // Delete related records first
    const delted_age = yield prisma.ages.delete({
        where: {
            user_id: parseInt(id)
        }
    });
    // Delete user from database
    const deleted_record = yield prisma.users.delete({
        where: {
            user_id: parseInt(id)
        }
    });
    res.json({ status: true, data: { msg: "User sucessfully deleted!", deleted_user: deleted_record } });
}));
exports.default = usersRoutes;
