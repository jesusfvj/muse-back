const User = require("../models/User");

const getUsers = async (req, res) => {
    try {
        const users = await User.find({})

        return res.status(200).json({
            ok: true,
            users
        });
    } catch (error) {
        console.log(error);
        return res.status(503).json({
            ok: false,
            msg: "Oops, something happened",
        });
    }
};

module.exports = {
    getUsers
};