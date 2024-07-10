import prisma from "../models/prisma";
import bcrypt from "bcrypt";
const { faker } = require("@faker-js/faker");

async function createNewUser(username, email, password) {
    try {
        // Check if email exists
        const isEmailExist = await prisma.credential.findFirst({
            where: {
                email: email
            },
        });

        if (isEmailExist) {
            throw new Error(`This username "${email}" has already exist. Please choose another username`);
        } else {
            const rowCount = await prisma.credential.count();
            const createUser = await prisma.user.create({
                data: {
                    id: rowCount + 1,
                    isAdmin: false
                }
            })

            const createUserInfo = await prisma.userInfo.create({
                data: {
                    id: rowCount + 1,
                    userId: rowCount + 1,
                    email: email,
                    phone: faker.phone.number(),
                    avatarLink: faker.image.avatar(),
                    emailValidated: faker.datatype.boolean(
                        faker.number.int({ min: 0, max: 1 })
                    ),
                    phoneValidated: faker.datatype.boolean(
                        faker.number.int({ min: 0, max: 1 })
                    ),
                    bio: faker.lorem.paragraph(),
                }
            })

            console.log(createUser)

            // Create a new user
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            const newUser = await prisma.credential.create({
                data: {
                    id: rowCount + 1,
                    userId: createUser.id,
                    username: username,
                    email: email,
                    password: hashedPassword
                },
            })
            console.log(newUser)
        }
        
    } catch (err) {
        console.log(err);
        res.send("Register Error")
    }
}

async function checkExistEmail(email) {
    try {
        const user = await prisma.credential.findFirst({
            where: {
                email: email,
            },
        });
        console.log(user)
        return user !== null;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

export default { createNewUser, checkExistEmail };
