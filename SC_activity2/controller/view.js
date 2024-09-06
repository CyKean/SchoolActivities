const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('db.db');

const landingPage = (req, res) => {
    res.render('landing');
}

const signInPage = (req, res) => {
    res.render('auth/signin', { notification: null });
}
const signUpPage = (req, res) => {
    res.render('auth/signup', { notification: null });
}

const homePage = (req, res) => {
    if (!req.session.user) {
        return res.redirect('/signin');
    }
    // Pass the user data from the session to the home view
    res.render('client/home', { user: req.session.user });
}

const logOut = (req, res) => {
    // Destroy the session to log the user out
    req.session.destroy((err) => {
        if (err) {
            return res.redirect('/home'); // In case of error, keep them on the home page
        }

        // Clear the cookie to fully log the user out
        res.clearCookie('connect.sid');

        // Redirect to the login page
        res.redirect('/signin');
    });
};

const aboutPage = (req, res) => {
    if (!req.session.user) {
        return res.redirect('/signin');
    }

    const userId = req.session.user.id;

    const query = `SELECT * FROM about WHERE user_id = ?`;
    db.get(query, [userId], (err, about) => {
        if (err) {
            return res.render('about', { notification: err.message });
        }

        if (about) {
            res.render('client/about', { about, user: req.session.user });
        } else {
            res.render('client/about', { user: req.session.user });
        }
    });
}

const renderAddAbout = (req, res) => {
    if (!req.session.user) {
        return res.redirect('/signin');
    }
    // Pass the user data from the session to the home view
    res.render('client/about/addAbout', { user: req.session.user });
};

const renderEditAbout = (req, res) => {
    const userId = req.session.user.id;

    const query = `SELECT * FROM about WHERE user_id = ?`;
    db.get(query, [userId], (err, about) => {
        if (err) {
            return res.render('about', { notification: err.message, user: req.session.user });
        }

        if (!about) {
            return res.redirect('/about');
        }

        res.render('client/about/editAbout', { about, user: req.session.user });
    });
}; 

const viewProfile = (req, res) => {
    if (!req.session.user) {
        return res.redirect('/signin');
    }
    // Pass the user data from the session to the home view
    res.render('client/profile/viewProfile', { user: req.session.user });
}

const editProfile = (req, res) => {
    if (!req.session.user) {
        return res.redirect('/signin');
    }
    // Pass the user data from the session to the home view
    res.render('client/profile/editProfile', { user: req.session.user });
}

module.exports = {
    landingPage,
    signInPage,
    signUpPage,  
    homePage,  
    logOut,  
    aboutPage,
    renderAddAbout, 
    renderEditAbout,
    viewProfile, 
    editProfile,  
}