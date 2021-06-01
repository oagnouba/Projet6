const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

const User = require ('../models/user');

/****** Fonction création de compte *****/
exports.signup = (req, res, next) => {
  bcrypt
    .hash(req.body.password, 10)//appel de la fonction pour crypter le mdp; () => on lui passe le mdp du corps de la requête; on hashe 10 tours
    .then((hash) => {//on récupère le mdp hashé qu'on met ds la bdd
      const user = new User({
        email: req.body.email,//on fournit l'adresse enrégistrée dans le corps de la requête
        password: hash,//on enrégistre le mdp crypté à la ligne 8
      });
      user
        .save()//sauvegarde dans la base de donnée
        .then(() => res.status(201).json({ message: "Votre compte a été créé !" }))
        .catch((error) => res.status(400).json({ error }));
    })
      .catch((error) => {
        console.log(error.message);
        res.status(500).json({ error: error })
      ;});
};//enrégistrement de nouveau user

/****** Fin fonction création de compte *****/

/****** Fonction connexion user *****/
exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email })//retrouvé l'utilisateur dont le mail a été enrégistré dans la bdd
    .then((user) => {
      if (!user) {
        return res.status(401).json({ error: "Utilisateur non trouvé !" });//si user non existant -> erreur
      }
      bcrypt
        .compare(req.body.password, user.password) //comparaison du mdp user avec le hash qui était sauvegardé
        .then((valid) => {
          if (!valid) {
            return res.status(401).json({ error: "Mot de passe incorrect !" });
          }
          res.status(200).json({
            userId: user._id,//si mdp correct, on lui renvoie son id et un token (système d'authentification par des jetons)
            token: jwt.sign(
              {userId: user._id},//pour éviter qu'un user modifie la recette d'un autre
              'STAY_HOW_YOU_ARE',//clé secrète pour l'encodage
              { expiresIn: '24h' }//configuration d'une expiration du token
              )
        });
      })
        .catch(error => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};// connecter le user existant

/****** Fin fonction connexion user *****/
