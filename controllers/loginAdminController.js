import { validationResult } from "express-validator";
import loginService from "../models/loginAdminModel";

const getPageLoginAdmin = (req, res) => {
    return res.render("sign-in", {
        errors: req.flash("errors")
    });
};

const handleLogin = async (req, res) => {
    const errorsArr = [];
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
        const errors = Object.values(validationErrors.mapped());
        errors.forEach((item) => {
            errorsArr.push(item.msg);
        });
        req.flash("errors", errorsArr);
        return res.redirect("/sign-in");
    }

    try {
        await loginService.handleLogin(req.body.username, req.body.password);
        return res.redirect("/");
    } catch (err) {
        req.flash("errors", err);
        return res.redirect("/sign-in");
    }
};

const checkLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        return res.redirect("/sign-in");
    }
    next();
};

const checkLoggedOut = (req, res, next) => {
    if (req.isAuthenticated()) {
        return res.redirect("/sign-in");
    }
    next();
};

const postLogOut = (req, res) => {
    req.session.destroy(function(err) {
        return res.redirect("/sign-in");
    });
};

export default {
    getPageLoginAdmin,
    handleLogin,
    checkLoggedIn,
    checkLoggedOut,
    postLogOut
};