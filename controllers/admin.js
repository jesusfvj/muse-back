const mongoose = require("mongoose");

const getCollection = async (req, res) => {
    console.log('here')
    const {
        collection,
        role
    } = req.body
    try {

        const Model = mongoose.model(collection);

        const collectionObject = await Model.find({
            $or: [{
                role: role
            }],
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

        return res.status(200).json({
            ok: true,
            object: collectionObject,
            title: collection.toLowerCase()
        });
    } catch (error) {
        console.log(error);
        return res.status(503).json({
            ok: false,
            msg: "Oops, something happened",
        });
    }
};

const toggleBanAsset = async (req, res) => {
    const {
        collection,
        assetId,
        banTheAsset
    } = req.body

    try {

        const Model = mongoose.model(collection);

        await Model.findOneAndUpdate({
            _id: assetId,
        }, {
            $set: {
                isBanned: banTheAsset,
            },
        }, {
            new: true,
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
        return res.status(200).json({
            ok: true,
            assetId: assetId
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

            const addedDocument = documents.map(({
                _doc
            }) => {
                return ({
                    collection: collection,
                    ..._doc
                });
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
    toggleBanAsset,
    getSearchElement,
    getCollection,
};