const bcrypt = require("bcryptjs");
const Playlist = require("../models/Playlist");
const User = require("../models/User");
const mongoose = require("mongoose");
// const generateJWT = require("generateJWT");
const nodemailer = require("nodemailer");
require("dotenv").config();

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
  const { email, password } = req.body;
  try {
    const userFromDb = await User.findOne({ email }).populate("playlists");

    if (!userFromDb) {
      return res.status(400).json({
        ok: false,
        msg: "Email and password don't match.",
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
    const loggedUser = await User.findOne({ _id: loggedUserId });
    const followedUser = await User.findOne({ _id: followedUserId });

    if (isFollowing) {
      await loggedUser.updateOne({ $push: { following: followedUserId } });
      await followedUser.updateOne({ $push: { followedBy: loggedUserId } });
      return res.status(200).json({
        ok: true,
        isFollowing,
      });
    } else {
      await loggedUser.updateOne({ $pull: { following: followedUserId } });
      await followedUser.updateOne({ $pull: { followedBy: loggedUserId } });
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
};

const getUserById = async (req, res) => {
  const { id } = req.params;

  if (id.length !== 24) {
    return res.status(200).json({
      ok: false,
    });
  }

  try {
    const user = await User.findOne({ _id: id })
      .populate("playlists")
      .populate("followedPlaylists")
      .populate("tracks")
      .populate("albums");
    if (!user) {
      return res.status(200).json({
        ok: false,
      });
    }

    user.password = undefined;

    return res.status(200).json({
      ok: true,
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(503).json({
      ok: false,
      msg: `Could not find the user with the id: ${id}`,
    });
  }
};

const getArtists = async (req, res) => {
  const { id } = req.params;
  const objectId = new mongoose.Types.ObjectId(id);

  try {
    const artists = await User.find({
      _id: { $ne: objectId },
      role: "artist",
    });

    return res.status(200).json({
      ok: true,
      artists,
    });
  } catch (error) {
    console.log(error);
    return res.status(503).json({
      ok: false,
    });
  }
};
const getFollowedUsers = async (req, res) => {
  const { id } = req.params;
  const objectId = new mongoose.Types.ObjectId(id);

  try {
    const user = await User.findOne({
      _id: id,
    }).populate("following");

    return res.status(200).json({
      ok: true,
      users: user.following,
    });
  } catch (error) {
    console.log(error);
    return res.status(503).json({
      ok: false,
    });
  }
};

const updateUsername = async (req, res) => {
  const { username, userId } = req.body;

  try {
    const newUser = await User.findOneAndUpdate(
      { _id: userId }, // filter
      { fullName: username }, // update
      { new: true } // options
    );
    console.log(newUser);
    return res.status(200).json({
      ok: true,
      newUser,
    });
  } catch (error) {
    console.log(error);
    return res.status(503).json({
      ok: false,
    });
  }
};

const getArtistById = async (req, res) => {
  console.log(req.params);
  const { id } = req.params;

  try {
    const artist = await User.findOne({
      _id: id,
    })
      .populate("tracks")
      .populate("albums");

    if (!artist) {
      return res.status(200).json({
        ok: false,
      });
    }

    if (artist.role !== "artist") {
      return res.status(200).json({
        ok: false,
      });
    }

    return res.status(200).json({
      ok: true,
      artist,
    });
  } catch (error) {
    console.log(error);
    return res.status(503).json({
      ok: false,
    });
  }
};

const addToPlaylist = async (req, res) => {
  const { playlistId, trackId } = req.body;
  try {
    const playlist = await Playlist.findOne({ _id: playlistId, tracks: trackId });

    if (playlist) {
      return res
        .status(503)
        .json({ ok: false, msg: "Track is already in the list" });
    }

    await Playlist.findByIdAndUpdate(
      playlistId,
      { $addToSet: { tracks: trackId } },
      { new: true }
    );

    return res.status(201).json({ ok: true });
  } catch (error) {
    console.log(error);
    return res.status(503).json({
      ok: false,
    });
  }
};

module.exports = {
  register,
  logInUser,
  followUser,
  getUserById,
  getArtists,
  getFollowedUsers,
  updateUsername,
  getArtistById,
  addToPlaylist,
};
