import bcrypt from "bcryptjs";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const handleLogin = async (email, password) => {
    try {
        const user = await findUserByUsername(email);
        if (user) {
            const isMatch = await bcrypt.compare(password, user.password);
            if (isMatch) {
                return true;
            } else {
                throw new Error(`Your username or password is iscorrect`);
            }
        } else {
            throw new Error(`Your username or password is iscorrect`);
        }
    } catch (err) {
        throw err;
    }
};

const findUserByUsername = async (email) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                email: email,
            },
        });
        return user; 
    } catch (err) {
        throw err;
    }
};

const comparePassword = async (password, userObject) => {
    try {
        const isMatch = await bcrypt.compare(password, userObject.password);
        if (isMatch) {
            return true;
        } else {
            return `Your username or password is iscorrect`;
        }
    } catch (err) {
        throw err;
    }
};

export default {
    handleLogin,
    findUserByUsername,
    comparePassword
}