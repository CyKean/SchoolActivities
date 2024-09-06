const express = require('express');
const router = express.Router();

const {
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
 
} = require('../controller/view');


router.get('/', landingPage); 
router.get('/signin', signInPage);
router.get('/signup', signUpPage);
router.get('/home', homePage);
router.get('/logout',logOut);

router.get('/about',aboutPage);
router.get('/about/add',renderAddAbout);
router.get('/about/edit',renderEditAbout);

router.get('/profile',viewProfile);
router.get('/profile/edit',editProfile);



module.exports = router;