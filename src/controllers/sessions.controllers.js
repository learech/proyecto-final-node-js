
import { userDTO } from '../models/DTO/user.dto.js'


const getLoginSessionsController = async (req, res) => {
    try {
        return res.render('login', {});
    }
    catch (error) {
        res.status(500).json({ success: false, result: error.message });
    }
};

const getRegisterSessionsController = async (req, res) => {
    try {
        return res.render('register', {});
    }
    catch (error) {
        res.status(500).json({ success: false, result: error.message });
    }
};

const getProfileSessionsController = (req, res) => {
    const user = { email: req.session.user.email, isAdmin: req.session.user.role }
    return res.render('profile', { user })
};

const getLogoutSessionsController =(req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).render('error', { error: "Unspected error. Session can't be destroyed" });
        }
        return res.redirect('/api/sessions/login');
    });
};

const getAdministrationSessionsController = (req, res) => {
    return res.send('Data only seen by admins')
};

const getFailRegisterSessionsController = (req, res) => {
    return res.json({ error: 'fail to register' });
};

const getFailLoginSessionsController = (req, res) => {
    return res.json({ error: 'fail to login' });
};

const getCurrentSessionsController = (req, res) => {
    const infoUser = new userDTO(req.session.user);
    return res.send(infoUser);
};

const getGithubCallbackSessionsController = (req, res) => {
    req.session.user = req.user;
    res.redirect('/views/products');
};

const passportLoginSessionsController = async (req, res) => {
    try {
        if (!req.user) {
            return res.json({ error: 'invalid credentials' });
        }
        req.session.user = { 
            _id: req.user._id, 
            email: req.user.email, 
            firstName: req.user.firstName, 
            lastName: req.user.lastName, 
            age: req.user.age,
            cartId: req.user.cartId,
            role: req.user.role, 
        };

        return res.redirect('/views/products');
    }
    catch (error) {
        res.status(500).json({ success: false, result: error.message });
    }
};

const passportRegisterSessionsController = async (req, res) => {
    try {
        if (!req.user) {
            return res.json({ error: 'something went wrong' });
        }
        req.session.user = { 
            _id: req.user._id, 
            email: req.user.email, 
            firstName: req.user.firstName, 
            lastName: req.user.lastName, 
            age: req.user.age,
            cartId: req.user.cartId,
            role: req.user.role, 
        };

        return res.json({ msg: 'ok', payload: req.user });
    }
    catch (error) {
        res.status(500).json({ success: false, result: error.message });
    }
};




export {
    getLoginSessionsController,
    getRegisterSessionsController,
    getProfileSessionsController,
    getLogoutSessionsController,
    getAdministrationSessionsController,
    getFailRegisterSessionsController,
    getFailLoginSessionsController,
    getCurrentSessionsController,
    getGithubCallbackSessionsController,
    passportLoginSessionsController,
    passportRegisterSessionsController,
}