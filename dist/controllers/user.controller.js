"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postCreateUser = exports.getCreateUserPage = exports.getHomePage = void 0;
const user_service_1 = require("../services/user.service");
const getHomePage = (req, res) => {
    return res.render('home.ejs');
};
exports.getHomePage = getHomePage;
const getCreateUserPage = (req, res) => {
    return res.render("create-user.ejs");
};
exports.getCreateUserPage = getCreateUserPage;
const postCreateUser = (req, res) => {
    const { name, email, address } = req.body;
    (0, user_service_1.handleCreateUser)(name, email, address);
    return res.render("handle-create-user.ejs");
};
exports.postCreateUser = postCreateUser;
//# sourceMappingURL=user.controller.js.map