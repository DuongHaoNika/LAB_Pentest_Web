import jsonwebtoken from 'jsonwebtoken'
import {PrismaClient } from '@prisma/client' 
import bcrypt from "bcrypt"
const prisma = new PrismaClient()

const getPageLogin = (req, res) => {
  res.clearCookie("jwt")  
  if(typeof(req.session) == "undefined"){
    return res.render("page-login");
  }
  else{
    const info = req.session.info
    delete req.session.info
    return res.render("page-login", {info: info})
  }
};

const handleLogin = async (req, res) => {
  const { username, password } = req.body;
  console.log(username);
  try {
    let result = await prisma.$queryRaw`SELECT * FROM public."Credential" WHERE username = ${username}`;
    if (result.length === 0) {
      throw new Error("User or Password is Incorrect!");
    }
    const isMatch = await bcrypt.compare(password, result[0].password);
    if (!isMatch) {
      throw new Error("User or Password is Incorrect!");
    }
    const token = jsonwebtoken.sign(
      { id: result[0].id, username: username, isadmin: false },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: 10000 * 1000
    });
    res.redirect("/page-account");
  } catch (error) {
    res.render("page-login", { error: { message: error.message } });
  }
};


export default {
  getPageLogin,
  handleLogin
}