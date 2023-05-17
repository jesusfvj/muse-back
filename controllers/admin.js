const User = require("../models/User");
const Playlist = require("../models/Playlist");
const Album = require("../models/Album");
const Track = require("../models/Track");
const {
    dbConnection
} = require('../database/config.js');
const mongoose = require("mongoose");

const getUsers = async (req, res) => {
    try {
        const users = await User.find({
            role: "user"
        }, {
            password: 0,
            __v: 0,
            profilePhotoCloudinaryId: 0,
            resetToken: 0,
            playerQueue: 0
        })

        return res.status(200).json({
            ok: true,
            object: users,
            title: "user"
        });
    } catch (error) {
        console.log(error);
        return res.status(503).json({
            ok: false,
            msg: "Oops, something happened",
        });
    }
};

const getArtists = async (req, res) => {
    try {
        const users = await User.find({
            role: "artist"
        }, {
            password: 0,
            __v: 0,
            profilePhotoCloudinaryId: 0,
            resetToken: 0,
            playerQueue: 0
        })

        return res.status(200).json({
            ok: true,
            object: users,
            title: "artist"
        });
    } catch (error) {
        console.log(error);
        return res.status(503).json({
            ok: false,
            msg: "Oops, something happened",
        });
    }
};

const getPlaylists = async (req, res) => {
    try {
        const playlists = await Playlist.find({}, {
            __v: 0,
            thumbnailCloudinaryId: 0,
            color: 0
        })

        return res.status(200).json({
            ok: true,
            object: playlists,
            title: "playlist"
        });
    } catch (error) {
        console.log(error);
        return res.status(503).json({
            ok: false,
            msg: "Oops, something happened",
        });
    }
};

const getAlbums = async (req, res) => {
    try {
        const albums = await Album.find({}, {
            __v: 0,
            thumbnailCloudinaryId: 0,
        })

        return res.status(200).json({
            ok: true,
            object: albums,
            title: "album"
        });
    } catch (error) {
        console.log(error);
        return res.status(503).json({
            ok: false,
            msg: "Oops, something happened",
        });
    }
};

const getSongs = async (req, res) => {
    try {
        const tracks = await Track.find({}, {
            __v: 0,
            trackCloudinaryId: 0,
            thumbnailCloudinaryId: 0
        })

        return res.status(200).json({
            ok: true,
            object: tracks,
            title: "track"
        });
    } catch (error) {
        console.log(error);
        return res.status(503).json({
            ok: false,
            msg: "Oops, something happened",
        });
    }
};

const getSearchElement = async (req, res) => {
    const {
        value
    } = req.body

    try {
        const collections = ['User', 'Playlist', 'Album', 'Track'];
        const results = [];

        for (const collection of collections) {
            const Model = mongoose.model(collection);

            const documents = await Model.find({
                $or: [{
                        _id: value
                    },
                    {
                        following: value
                    },
                    {
                        followedBy: value
                    },
                    {
                        albums: value
                    },
                    {
                        followedPlaylists: value
                    },
                    {
                        playlists: value
                    },
                    {
                        tracks: value
                    },
                    {
                        uploadedTracks: value
                    },
                    {
                        uploadedAlbums: value
                    },
                    {
                        artist: value
                    },
                    {
                        album: value
                    },
                    {
                        user: value
                    },
                    {
                        copyFrom: value
                    },
                    {
                        songs: value
                    }
                ],
            }, {
                __v: 0,
                color: 0,
                password: 0,
                resetToken: 0,
                playerQueue: 0,
                trackCloudinaryId: 0,
                thumbnailCloudinaryId: 0,
                profilePhotoCloudinaryId: 0,
            });

            const addedDocument = documents.map(({_doc}) => {
                return ({collection: collection, ..._doc });
              });

            results.push(addedDocument);
        }

        const flattenedArrayResults = results.flat();
        return res.status(201).json({
            ok: true,
            result: flattenedArrayResults,
        });

    } catch (error) {
        console.log(error);
        return res.status(503).json({
            ok: false,
            msg: "Oops, something happened",
        });
    }
}

module.exports = {
    getUsers,
    getArtists,
    getPlaylists,
    getAlbums,
    getSongs,
    getSearchElement
};