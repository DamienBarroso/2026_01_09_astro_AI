import { Request, Response, NextFunction } from "express";
import User from "../models/userModel.ts";
import bcrypt from "bcryptjs";
import { UserController } from "../types.ts";

const userController: UserController = {
  getAllUsers: (req: Request, res: Response, next: NextFunction) => {
    User.find({}, (err, users) => {
      if (err)
        return next(
          "Error in userController.getAllUsers: " + JSON.stringify(err)
        );
      res.locals.users = users;
      return next();
    });
  },

  /* createUser - create and save new User in db. */
  createUser: async (req: Request, res: Response, next: NextFunction) => {
    const {
      username,
      birthdate,
      birthtime,
      birthplace,
      current_location,
      match_preference,
    } = req.body;

    if (!username || !birthdate || !birthplace || !birthtime) {
      return next({
        log: "Missing required fields",
        status: 400,
        message: {
          err: "Username, birthdate, birthplace, and birthtime are required",
        },
      });
    }

  // convert any date format to Date object
  const parseBirthdate = (dateStr: string): Date => {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      throw new Error('Invalid date format');
    }
    return date;
  };

    try {
      // OPTION 1: using create() method
      // Mongoose middleware under the hood will automatically run .pre method (see userModel.ts) before saving. No need to create new instance, then save as 2 separate steps
      const newUser = await User.create({
        // returns newUser object with _id automatically created
        username: username,
        // password: password,
        birthdate: birthdate, // Mongoose will ensure Date object due to schema
        birthtime: birthtime,
        birthplace: birthplace,
        current_location: current_location,
        match_preference: match_preference,
      });

      // OPTION 2: using new keyword to create new User instance, then save(). Same as Option 1, except 2 separate steps

      // const newUser = new User({
      //   username: username,
      //   password: password,
      // });

      // await newUser.save();

      // store user ID
      res.locals.userId = newUser._id; // grab the _id and save to res.locals
      res.locals.username = newUser.username;
      res.locals.birthdate = newUser.birthdate;
      res.locals.birthtime = newUser.birthtime;
      res.locals.birthplace = newUser.birthplace;

      console.log("new user created with _id: ", newUser._id);

      return next();
    } catch (err) {
      return next(err);
    }
  },

  /* verifyUser - Obtain username and pw from req body, locate appropriate user in db, authenticate submitted pw against pw stored in db. */
  verifyUser: async (req: Request, res: Response, next: NextFunction) => {
    const { username, password } = req.body;
    try {
      // no need to check if already existing user since userSchema already requires unique
      const userExist = await User.findOne({ username });

      if (!userExist) {
        return res.redirect("/signup");
      }

      console.log("user exists");

      // Compare passwords properly
      const isMatch = await bcrypt.compare(password, userExist.password);
      if (!isMatch) {
        console.log("bad password");
        return res.redirect("/signup");
      }

      res.locals.userId = userExist._id;
      res.locals.username = userExist.username;
      console.log("verifyUser userId ", userExist._id);

      return next();
    } catch (err) {
      return next(err);
    }
  },

  // addToFavorites: async (req: Request, res: Response, next: NextFunction) => {
  //   if (!req.cookies.ssid) return next();

  //   const ssid = req.cookies.ssid;

  //   try {
  //     // check if already existing user, IF the userSchema didn't already require unique
  //     console.log("checking for userId that matches ssid: ", ssid);

  //     const userExist = await User.findById(ssid);

  //     if (!userExist) {
  //       console.log("User not found with ssid: ", ssid);
  //       // clear invalid cookie
  //       console.log("clearing invalid cookie ssid");
  //       res.clearCookie("ssid");
  //       return next();
  //     }

  //     console.log("User found:", userExist.username, userExist._id);

  //     const { title, ranking, genres, image, synopsis } = req.body;

  //     if (!title || !ranking || !synopsis) {
  //       return res.status(400).json({ err: "missing anime data" });
  //     }

  //     // checks if anime already in favs
  //     // some() array method tests whether at least 1 element in an array passes a condition
  //     const isAlreadyFav = userExist.favorites.some(
  //       (fav) => fav.title === title && fav.ranking === ranking
  //     );

  //     if (isAlreadyFav) console.log("already in favs", userExist.favorites);

  //     if (!isAlreadyFav) {
  //       console.log("currently adding to favs");

  //       const newFav = {
  //         title,
  //         ranking,
  //         genres,
  //         image: image || "",
  //         synopsis,
  //       };

  //       // add to userfavs
  //       userExist.favorites.push(newFav);

  //       await userExist.save();

  //       res.locals.userFavs = userExist.favorites;

  //       console.log("fav added ", userExist.username, userExist.favorites);
  //     }

  //     return next();
  //   } catch (err) {
  //     return next(err);
  //   }
  // },

  // getFavorites: async (req: Request, res: Response, next: NextFunction) => {
  //   if (!req.cookies.ssid) return next();

  //   const ssid = req.cookies.ssid;

  //   try {
  //     // check if already existing user, IF the userSchema didn't already require unique
  //     console.log("checking for userId that matches ssid: ", ssid);

  //     const userExist = await User.findById(ssid);

  //     if (!userExist) {
  //       console.log("User not found with ssid: ", ssid);
  //       // clear invalid cookie
  //       console.log("clearing invalid cookie ssid");
  //       res.clearCookie("ssid");
  //       return next();
  //     }

  //     console.log("User found:", userExist.username, userExist._id);

  //     res.locals.userFavs = userExist.favorites;

  //     console.log("favorites found ", userExist.favorites);

  //     return next();
  //   } catch (err) {
  //     return next(err);
  //   }
  // },
};

export default userController;
