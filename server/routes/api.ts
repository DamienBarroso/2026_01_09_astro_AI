import express from "express";
import openaiController from "../controllers/openaiController.ts";
import userController from "../controllers/userController.ts";
import sessionController from "../controllers/sessionController.ts";
import { createSecureServer } from "http2";

const apiRouter = express.Router(); // creates a mini Express app for routing

// ADD STARTER DATA REQUEST ROUTE HANDLER HERE
//GET req if req path matches '/api/'

// FIGURE OUT MIDDLEWARE FLOW WITH TEAM

// ADD GET ROUTE HANDLER HERE

// route middleware chain:
// 1. createUser (save basic info to DB) →
// 2. queryOpenAIChat (get astro data) →
// 3. possibly parse / validate astro data
// 4. updateUserWithAstroData (update with zodiac/locations)

// http://localhost:3000/api/createUser
apiRouter.post("/createUser", userController.createUser, (req, res) => {
  return res.status(200).json({
    message: "created User",
    user: {
      id: res.locals.userId,
      username: res.locals.username,
      birthdate: res.locals.birthdate,
      birthtime: res.locals.birthtime,
      birthplace: res.locals.birthplace,
    },
  });
});

// apiRouter.get(
//   "/",
//   openaiController.getAllAnime,
//   (_req, res) => {
//     return res.status(200).json({ getAnime: res.locals.getAnime });
//   }
// );

// // http://localhost:3000/api/genre
// apiRouter.get(
//   "/genre",
//   openaiController.getByGenre,
//   (req, res) => {
//     return res.status(200).json({ animeGenre: res.locals.animeGenre });
//   }
// );

// // http://localhost:3000/api/genre
// apiRouter.post(
//   "/genre", sessionController.isLoggedIn,
//   userController.addToFavorites,
//   (req, res) => {
//     return res.status(200).json( {
//       message: 'anime added to user favs',
//       favorites: res.locals.userFavs
//     });
//   }
// );

// EXPORT THE ROUTER
export default apiRouter;
