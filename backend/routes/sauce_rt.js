const express = require('express');
const router = express.Router();//création du router

const sauceCtrl = require('../controllers/sauce_ctrl');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

/****** Création de la requête POST (Nouvelle recette donnée par le user) ******/
router.post('/', auth, multer, sauceCtrl.createSauce);
/****** Fin création de la requête POST ******/

/****** Création de route get pour modifier une sauce ******/
router.put("/:id", auth, multer, sauceCtrl.modifySauce);
/****** Fin création de route get pour modifier une sauce ******/

/****** Création de route get pour supprimer une sauce ******/
router.delete("/:id", auth, sauceCtrl.deleteSauce);
/****** Fin création de route get pour supprimer une sauce ******/

/****** Création de route get pour trouver une sauce précise******/
router.get('/:id', auth, sauceCtrl.getOneSauce);
/****** Fin création de route get pour trouver une sauce précise******/

/****** Création de route get pour trouver toutes les sauces ******/
router.get('/', auth, sauceCtrl.getAllSauces);
/****** Fin de la création de route get pour trouver toutes les sauces ******/

/****** Création de route like pour les sauces ******/
router.post("/:id/like", auth, sauceCtrl.likeStatus);
/****** Fin création de routr like pour les sauces ******/
module.exports = router;
