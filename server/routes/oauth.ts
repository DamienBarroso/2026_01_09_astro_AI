// import express from "express";
// import path from "path";

// import userController from "../controllers/userController.ts";
// import cookieController from "../controllers/cookieController.ts";
// import sessionController from "../controllers/sessionController.ts";

// const oauthRouter = express.Router();
// // PATH VARIABLES (accessing React frontend)
// // REACT path
// const clientPath = path.resolve(import.meta.dirname, "../../client/");

// // user signup without authentication
// // http://localhost:3000/oauth/signup
// oauthRouter.get("/signup", (_, res) => {
//   return res.status(200).sendFile(path.join(clientPath, "signup.html"));
// });

// oauthRouter.get("/login", (_, res) => {
//   return res.status(200).sendFile(path.join(clientPath, "login.html"));
// });

// oauthRouter.post(
//   "/signup",
//   userController.createUser,
//   cookieController.setSSIDCookie,
//   sessionController.startSession,
//   (req, res) => {
//     console.log("user on signup page ", res.locals.username, res.locals.userId);
//     console.log("cookies, if exists: ", req.cookies); // TEST ssid COOKIES HERE
//      return res.redirect("http://localhost:5173/");  // for some reason, doesn't fully load frontend unless we have this URL
//      // first had this as http://localhost:3000/ but was just displaying the HTML header without completely loading the App
//   }
// );

// /**
//  * login - do we need login.html?
//  * http://localhost:3000/oauth/login
//  */
// oauthRouter.post(
//   "/login",
//   userController.verifyUser,
//   cookieController.setSSIDCookie,
//   sessionController.startSession,
//   (req, res) => {
//     // do NOT test for req.cookies here since will still have previous logged in user's cookies, NOT yet coookies for current user
//     console.log(
//       "POST oauthRouter user on login page",
//       res.locals.username,
//       res.locals.userId
//     );
//     return res.redirect("http://localhost:5173/");
//   }
// );

// to get specific userData, we'll need oauth
// http://localhost:3000/oauth/updatedUser
// apiRouter.get(
//   "/updatedUser", sessionController.isLoggedIn, userController.updatedUser,
//   (req, res) => {
//     console.log('OauthRouter GET updatedUser ', res.locals.updatedUser)
//     return res.status(200).json({updatedUser: res.locals.updatedUser});
//   }
// );


// // http://localhost:3000/oauth/favorites
// oauthRouter.get(
//   "/favorites", sessionController.isLoggedIn, userController.getFavorites,
//   (req, res) => {
//     console.log('OauthRouter GET favorites ', res.locals.userFavs)
//     return res.status(200).json({userFavs: res.locals.userFavs});
//   }
// );

// export default oauthRouter;

