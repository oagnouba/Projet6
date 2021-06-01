const jwt = require("jsonwebtoken");


/***** Vérification du token envoyé par le frontend ******/
module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];//on récupère le token dans le header qu'on split autour de l'espace et on récupère le 2ème élément
    const decodedToken = jwt.verify(token, "STAY_HOW_YOU_ARE");//on décode le token
    const userId = decodedToken.userId;
    if (req.body.userId && req.body.userId !== userId) {//si un user id ds le corps de la req et que celui est différent du user id...
      throw "Invalid user ID";//...on renvoie l'erreur ligne 16...
    } else {
      next();//...sinon on appel next
    }
  } catch {
    res.status(401).json({ error: error | 'Requête non authentifiée'});//si on reçoit une erreur, on l'envoie sinon ''
  }
};
/***** Fin vérification du token envoyé par le frontend ******/

