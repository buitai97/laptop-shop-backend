"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controllers/user.controller");
const router = express_1.default.Router();
const webRoutes = (app) => {
    router.get('/', user_controller_1.getHomePage);
    router.get("/create-user", user_controller_1.getCreateUserPage);
    router.post("/create-user", user_controller_1.postCreateUser);
    app.use("/", router);
};
exports.default = webRoutes;
//# sourceMappingURL=web.js.map