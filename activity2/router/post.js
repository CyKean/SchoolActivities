const express = require('express');
const router = express.Router();

const {
    signIn,
    signUp,
    addAbout,
    editAbout,
    deleteAbout,
    editProfile,
    deleteProfile,
} = require('../controller/auth');

router.post('/signup', signUp);  // Add this line for sign in route
router.post('/signin', signIn); // Add this line for sign

router.post('/about/add', addAbout); // Add this line for login
router.post('/about/edit', editAbout); // Add this line for
router.post('/about/delete', deleteAbout); // Delete

router.post('/profile/edit', editProfile);
router.post('/profile/delete', deleteProfile);

module.exports = router;