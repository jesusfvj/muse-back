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
};

const getUserById = async (req, res) => {
  const { id } = req.params;

  if (id.length !== 24) {
    return res.status(200).json({
      ok: false,
    });
  }

  try {
    const user = await User.findOne({
      _id: id,
    })
      .populate("playlists")
      .populate("followedPlaylists")
      .populate({
        path: "tracks",
        populate: {
          path: "artist",
        },
      })
      .populate({ path: "albums", populate: { path: "artist" }, populate: {path: "songs"} })
      .populate("following")
      .populate({
        path: "playerQueue",
        populate: {
          path: "tracks",
          populate: {
            path: "artist",
          },
        },
      });

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
      _id: {
        $ne: objectId,
      },
      role: "artist",
    })
      .sort({ followedBy: -1 })
      .limit(20);

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
      {
        _id: userId,
      }, // filter
      {
        fullName: username,
      }, // update
      {
        new: true,
      } // options
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
      .populate("uploadedTracks")
      .populate("uploadedAlbums");

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

const updateProfileImage = async (req, res) => {
  const userId = req.params.userId;
  const file = req.files[0];

  try {
    if (!file) {
      return res.status(503).json({
        ok: false,
        msg: "No files uploaded",
      });
    }
    if (file) {
      //Upload thumbnail to Cloudinary
      const resultImage = await uploadImage(file.path);
      const url = resultImage.secure_url;
      const cloudinaryId = resultImage.public_id;

      const userBeforeUpdate = await User.findOneAndUpdate(
        {
          _id: userId,
        },
        {
          $set: {
            profilePhoto: url,
            profilePhotoCloudinaryId: cloudinaryId,
          },
        },
        {
          new: false,
        }
      );

      const response = await deleteCloudinaryFile(
        userBeforeUpdate.profilePhotoCloudinaryId
      );
      if (!response.result === "ok") {
        return res.status(503).json({
          ok: false,
          msg: response?.result,
        });
      }

      await fs.unlink(file.path);

      return res.status(201).json({
        ok: true,
        profilePhoto: url,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(503).json({
      ok: false,
      msg: "Oops, something happened",
    });
  }
};

const addToPlaylist = async (req, res) => {
  const { playlistId, trackId } = req.body;
  try {
    const playlist = await Playlist.findOne({
      _id: playlistId,
      tracks: trackId,
    });

    if (playlist) {
      return res.status(503).json({
        ok: false,
        msg: "Track is already in the list",
      });
    }

    await Playlist.findByIdAndUpdate(
      playlistId,
      {
        $addToSet: {
          tracks: trackId,
        },
      },
      {
        new: true,
      }
    );

    return res.status(201).json({
      ok: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(503).json({
      ok: false,
    });
  }
};

const toggleFollowAlbum = async (req, res) => {
  const { albumId, userId, isFollowed } = req.body;

  try {
    const loggedUser = await User.findOne({
      _id: userId,
    });
    const album = await Album.findOne({
      _id: albumId,
    });

    if (isFollowed) {
      await loggedUser.updateOne({
        $push: {
          albums: albumId,
        },
      });
      await album.updateOne({
        $push: {
          followedBy: userId,
        },
      });
      return res.status(200).json({
        ok: true,
      });
    } else {
      await loggedUser.updateOne({
        $pull: {
          albums: albumId,
        },
      });
      await album.updateOne({
        $pull: {
          followedBy: userId,
        },
      });
      return res.status(200).json({
        ok: true,
      });
    }
  } catch (error) {
    return res.status(503).json({
      ok: false,
      msg: "Oops, something happened",
    });
  }
};

const resetPassword = async (req, res) => {
  const { email } = req.body;
  const token = uuid();
  const mailOptions = {
    from: "muse.team.assembler@gmail.com",
    to: email,
    subject: "Muze team",
    text: `Hi,
    
To reset your Muze account password, follow this link: 127.0.0.1:5173/resetpassword/${token}

If you did not request any password reset in Muze App, please ignore this message.

Muze Team
`,
  };
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    }
  });
  const user = await User.findOne({
    email: email,
  });

  if (!user) {
    return res.status(400).json({ ok: false, message: "Not a valid user" });
  }
  user.resetToken = token;
  user.save();
};

const resetPasswordChange = async (req, res) => {
  const { token, newPassword, repeatNewPassword } = req.body;
  const user = await User.findOne({ resetToken: token });

  if (!user) {
    return res.status(400).json({ ok: false, message: "Invalid token" });
  }

  if (newPassword !== repeatNewPassword) {
    return res
      .status(400)
      .json({ ok: false, message: "Password do not match" });
  }
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(newPassword, salt);
  user.password = hashedPassword;
  user.token = "empty";
  await user.save();
  return res
    .status(200)
    .json({ ok: true, message: "Your Password has been changed" });
};

const updatePasswordProfile = async (req, res) => {
  const { userId, newPassword, confirmPassword } = req.body;
  try {
    const user = await User.findById(userId);
   
  if (!user) {
    return res.status(404).json({ ok: false, message: "User not found" });
  }
  if(newPassword !== confirmPassword){
    return res
    .status(400)
    .json({ ok: false, message: "Password do not match" });
  }
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(newPassword, salt);
  user.password = hashedPassword;
  user.token = "empty";

    await user.save();
    return res.status(200).json({ ok: true, message: "Password updated successfully" });
  } catch (error) {
    console.log(error)
    return res.status(500).json({ ok: false, message: "Error updating password" });
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
  updateProfileImage,
  addToPlaylist,
  toggleFollowAlbum,
  resetPassword,
  resetPasswordChange,
  updatePasswordProfile,
};
