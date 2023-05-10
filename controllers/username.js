const bcrypt = require("bcryptjs");
const Username = require('../models/UpdatePasUser');

const compareAndUpdate = async (req, res) => {
    const { username, password, newPassword } = req.body;

    try {
        const user = await Username.findOne({ username });

        if (!user) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        // Compare Password
        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        // Update Password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ message: 'Contraseña actualizada correctamente' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error al actualizar la contraseña' });
    }
};

module.exports = { compareAndUpdate };