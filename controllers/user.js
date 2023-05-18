const bcrypt = require("bcryptjs");
const Playlist = require("../models/Playlist");
const User = require("../models/User");
const Album = require("../models/Album");
const mongoose = require("mongoose");
// const generateJWT = require("generateJWT");
const nodemailer = require("nodemailer");
const { uploadImage, deleteCloudinaryFile } = require("../utils/cloudinary");
const fs = require("fs-extra");
require("dotenv").config();
const { uuid } = require("uuidv4");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "muse.team.assembler@gmail.com",
    pass: process.env.PASS,
  },
});

const register = async (req, res) => {
  const { fullName, email, password, repPassword, isArtist } = req.body;

  const mailOptions = {
    from: "muse.team.assembler@gmail.com",
    to: email,
    subject: "Muze team",
    text: `Hi ${fullName}, thanks for registering Muze!`,
  };

  try {
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });

    const user = await User.findOne({
      email,
    });

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
  const { email, password } = req.body;
  try {
    const userFromDb = await User.findOne({
      email,
    })
      .populate("playlists")
      .populate("playerQueue");

    if (!userFromDb) {
      return res.status(400).json({
        ok: false,
        msg: "Email and password don't match.",
      });
    }

    if (userFromDb.isBanned===true) {
      return res.status(200).json({
        ok: false,
        msg: "Your account has being banned due to the violation of our company policy. Please contact us for further information.",
      });
    }

    const comparedPassword = bcrypt.compareSync(password, userFromDb.password);

    if (!comparedPassword) {
      return res.status(400).json({
        ok: false,
        msg: "Email and password don't match.",
      });
    }
    // const token = await generateJWT(userFromDb._id)
    userFromDb.password = undefined;
    return res.status(200).json({
      ok: true,
      user: userFromDb, // add token
    });
  } catch (error) {
    console.log(error);
    return res.status(503).json({
      ok: false,
      msg: "Oops, we could not verify your data",
    });
  }
};

const followUser = async (req, res) => {
  const { loggedUserId, followedUserId, isFollowing } = req.body;

  try {
    const loggedUser = await User.findOne({
      _id: loggedUserId,
    });
    const followedUser = await User.findOne({
      _id: followedUserId,
    });

    if (isFollowing) {
      await loggedUser.updateOne({
        $push: {
          following: followedUserId,
        },
      });
      await followedUser.updateOne({
        $push: {
          followedBy: loggedUserId,
        },
      });
      return res.status(200).json({
        ok: true,
        isFollowing,
      });
    } else {
      await loggedUser.updateOne({
        $pull: {
          following: followedUserId,
        },
      });
      await followedUser.updateOne({
        $pull: {
          followedBy: loggedUserId,
        },
      });
      return res.status(200).json({
        ok: true,
        isFollowing,
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



module.exports = { register, logInUser, followUser, addTracks };
