// import { CookieController } from "../types";

// const cookieController: CookieController = {
 
//   /**
//    * setSSIDCookie - store the user id in a cookie ssid
//    */
//   setSSIDCookie: (req, res, next) => {
//     console.log('setSSIDCookie is running')
//     try {
//     const { userId } = res.locals;
//       if (!userId) {
//         return next(new Error ('no userId for SSID cookie'))
//       }
//       console.log(`setSSIDcookie's userId `, userId)
//       res.cookie("ssid", userId, {
//         httpOnly: true,
//         // secure: true, // ONLY work with HTTPS, NOT localhost so don't use here
//         maxAge: 1000 * 60 * 60 * 24,
//         path: '/' // makes cookie available for all routes
//       })
//       // DO NOT TEST LIKE THIS here --> console.log(`setSSIDCookie's req.cookies `, req.cookies) // req.cookies NOT yet available since cookies are set in response headers, so this console.log will show PREVIOUS ssid for last person who logged in
//       return next();
//     } catch (err) {
//       return next(err);
//     }
//   },

// };



// export default cookieController;