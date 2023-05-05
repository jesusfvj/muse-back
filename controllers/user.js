const bcrypt = require("bcryptjs");
const Playlist = require("../models/Playlist");
const User = require("../models/User");
// const generateJWT = require("generateJWT");

const register = async (req, res) => {
  const { fullName, email, password, repPassword, isArtist } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user) {
      return res.status(409).json({
        ok: false,
        message: "User already exists",
      });
    }

    if (password !== repPassword) {
      return res.status(400).json({
        ok: false,
        message: "Passwords do not match",
      });
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const newUser = new User({
      email,
      password: hashedPassword,
      fullName,
      role: isArtist ? "artist" : "user",
    });

    await newUser.save();
    newUser.password = undefined;

    return res.status(201).json({
      ok: true,
      user: newUser,
    });
  } catch (error) {
    console.log(error);
    return res.status(503).json({
      ok: false,
      msg: "Oops, we could not save your data",
    });
  }
};

const logInUser = async (req, res) => {
  const { email, password } = req.body
  try {
    const userFromDb = await User.findOne({ email });
    const comparedPassword = bcrypt.compareSync(password, userFromDb.password);
    if (!userFromDb || !comparedPassword) {
      return res.status(400).json({
        ok: false,
        msg: "Email and password don't match."
      })
    }
    // const token = await generateJWT(userFromDb._id)
    return res.status(200).json({
      ok: true,
      user: { ...userFromDb } // add token
    });
  } catch (error) {
    console.log(error);
    return res.status(503).json({
      ok: false,
      msg: "Oops, we could not verify your data",
    });
  }
}

const followUser = async (req, res) => {
  const { loggedUserId, followedUserId, isFollowing } = req.body
  try {
    const loggedUser = await User.findOne({ _id: loggedUserId });
    const followedUser = await User.findOne({ _id: followedUserId });
    if (isFollowing) {
      await loggedUser.updateOne({ $push: { following: followedUserId } });
      await followedUser.updateOne({ $push: { followedBy: loggedUserId } });
      return res.status(200).json({
        ok: true,
        loggedUserId,
        followedUserId,
        isFollowing
      });
    } else {
      await loggedUser.updateOne({ $pull: { following: followedUserId } });
      await followedUser.updateOne({ $pull: { followedBy: loggedUserId } });
      return res.status(200).json({
        ok: true,
        loggedUserId,
        followedUserId,
        isFollowing
      });
    }


  } catch (error) {
    return res.status(503).json({
      ok: false,
      msg: "Oops, something happened",
    });
  }
}
const getArtists = async (req,res) => {
  const { loggedUserId } = req.body
  try {
    const artists = await User.findOne({ role: "artist", _id: { $ne: loggedUserId } }).select("_id fullName following followedBy profilePhoto ");;
    return res.status(200).json({
      ok: true,
      artists
    });
  } catch (error) {
    return res.status(503).json({
      ok: false,
      msg: "Oops, something happened",
    });
  }

}



module.exports = { register, logInUser, followUser, getArtists };
