import prisma from "../models/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const handleLogin = async (username, password, res, req) => {
    try {
        const user = await prisma.credential.findFirst({
            where: {
                username: username,
            },
        });
        if (!user) {
            throw new Error(`Username or Password wrong`);

        }
        const isMatch = await bcrypt.compare(password, user.password);
        console.log(isMatch)
        if (!isMatch) {
            throw new Error(`Username or Password wrong`);
        }
        else {
            const token = jwt.sign(
                { id: user.id, username: user.username },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );
            res.cookie("jwt", token, {
                httpOnly: true,
                maxAge: 10000 * 1000
            });
        }
    } catch (error) {
        return res.send("ERROR!")
    }
};


export default {
    handleLogin
};
