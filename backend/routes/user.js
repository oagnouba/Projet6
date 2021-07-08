const express = require('express');
const router = express.Router();
const userCtrl = require ('../controllers/user');

router.post('/signup', userCtrl.signup);//post car le frontend va envoyer des informations (mail et mdp)
router.post('/login', userCtrl.login);

module.exports = router;
