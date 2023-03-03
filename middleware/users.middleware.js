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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = exports.generateAccessToken = exports.checkPassword = exports.getHashedPassword_async = exports.getHashedPassword = void 0;
// Users middleware methods
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const getHashedPassword = (unhashed_password) => {
    const hashed_password = bcrypt_1.default.genSalt(10, (err, salt) => {
        if (err) {
            console.error(err);
            return "";
        }
        bcrypt_1.default.hash(unhashed_password, salt, (err, encrypted) => {
            if (err) {
                console.error(err);
                return "";
            }
            console.log(encrypted);
            return encrypted;
        });
    });
    return hashed_password;
};
exports.getHashedPassword = getHashedPassword;
const getHashedPassword_async = function (unhashed_password) {
    return __awaiter(this, void 0, void 0, function* () {
        // Generate salt
        const salt = yield bcrypt_1.default.genSalt(10);
        const hashed_password = yield bcrypt_1.default.hash(unhashed_password, salt);
        return hashed_password;
    });
};
exports.getHashedPassword_async = getHashedPassword_async;
const checkPassword = (unhashed_password, hashed_password) => __awaiter(void 0, void 0, void 0, function* () {
    return yield bcrypt_1.default.compare(unhashed_password, hashed_password);
});
exports.checkPassword = checkPassword;
const generateAccessToken = (user) => {
    return jsonwebtoken_1.default.sign(user, process.env.TOKEN_SECRET, { expiresIn: '1800s' });
};
exports.generateAccessToken = generateAccessToken;
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['Authorization'];
    console.log(authHeader);
    const token = authHeader && authHeader.split(' ')[1];
    console.log(token);
    if (token == null)
        return res.sendStatus(401);
    jsonwebtoken_1.default.verify(token, process.env.TOKEN_SECRET, (err, user) => {
        console.log(err);
        if (err)
            return res.sendStatus(403);
        req.user = user;
        next();
    });
};
exports.authenticateToken = authenticateToken;
