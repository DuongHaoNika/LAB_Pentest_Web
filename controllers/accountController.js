import jwt from 'jsonwebtoken';
import bcrypt from "bcrypt";
import ejs from "ejs";
import { readTemplateFile } from "../configs/template.conf";
import fs from "fs"
import path from "path"
import axios from 'axios';
import jwkToPem from "jwk-to-pem"

import prisma from "../models/prisma";

// [GET] /page-account
const getAccount = async (req, res) => {
  const jwtStatus = await prisma.vulnSetting.findUnique({
    where:{
      name: "JWT"
    }
  })

  const token = req.cookies.jwt;
  let mysecretkey = process.env.JWT_SECRET
  const encodedHeader = token.split(".")[0]
  const decodedHeader = Buffer.from(encodedHeader, 'base64').toString('utf-8')
  const header = JSON.parse(decodedHeader)
  if(jwtStatus.status == "None-Alg" && header.alg == 'none') mysecretkey = null
  else if(jwtStatus.status == "No") {
    mysecretkey = fs.readFileSync(path.join(__dirname, "../helper/key/publicKey.pem"), 'utf-8')
  }
  else if(jwtStatus.status == "Algo-Confusion"){
    let rsaKey
    let url = "http://localhost:3000/.well-known/jwks.json"
    await axios.get(url)
        .then(response => {
            const data = response.data
            rsaKey = {
                kty: data.keys[0].kty,
                e: data.keys[0].e,
                kid: data.keys[0].kid,
                n: data.keys[0].n
            }
        })
        mysecretkey = jwkToPem(rsaKey)
  }
  else if(jwtStatus.status == "Weak-Key") mysecretkey = await fs.readFileSync(path.join(__dirname, '../helper/key/used_jwt.txt'), 'utf8')
  jwt.verify(token, mysecretkey, async (err, result) => {
    if (err) {
      return res.send(err);
    } else {
      try {
        const userId = result.id;
        const userInfo = await prisma.$queryRaw`
            SELECT "UserInfo"."firstName", "UserInfo"."lastName", "UserInfo"."email", "UserInfo"."bio"
            FROM public."Credential"
            JOIN public."UserInfo" ON "Credential"."userId" = ${userId} AND "UserInfo"."userId" = ${userId}`;

        if (!userInfo) {
          return res.send("No user");
        }
        const update = req.session.update
        delete req.session.update
        const errPw = req.session.err
        delete req.session.err
        return res.render('page-account', { userInfo: userInfo[0], update: update, err: errPw});
      } catch (error) {
        return res.status(500).send(error);
      }
    }
  });
};

// [POST] page-account
const setInfoAccount = async (req, res) => {
  const jwtStatus = await prisma.vulnSetting.findUnique({
    where:{
      name: "JWT"
    }
  })
  const token = req.cookies.jwt;
  let mysecretkey = process.env.JWT_SECRET
  const encodedHeader = token.split(".")[0]
  const decodedHeader = Buffer.from(encodedHeader, 'base64').toString('utf-8')
  const header = JSON.parse(decodedHeader)
  if(jwtStatus.status == "None-Alg" && header.alg == 'none') mysecretkey = null
  else if(jwtStatus.status == "No") {
    mysecretkey = fs.readFileSync(path.join(__dirname, "../helper/key/publicKey.pem"), 'utf-8')
  }
  else if(jwtStatus.status == "Algo-Confusion"){
    let rsaKey
    let url = "http://localhost:3000/.well-known/jwks.json"
    await axios.get(url)
        .then(response => {
            const data = response.data
            rsaKey = {
                kty: data.keys[0].kty,
                e: data.keys[0].e,
                kid: data.keys[0].kid,
                n: data.keys[0].n
            }
        })
        mysecretkey = jwkToPem(rsaKey)
  }
  else if(jwtStatus.status == "Weak-Key") mysecretkey = await fs.readFileSync(path.join(__dirname, '../helper/key/used_jwt.txt'), 'utf8')
  if (token) {
    jwt.verify(token, mysecretkey, async (err, result) => {
      if (err) {
        console.log(err)
        return res.status(500).send(err);
      } else {
        try {
          const userId = result.id;
          const { firstname, lastname, email, bio} = req.body;
          const blacklist = ['=', 'exec', 'execSync', 'localLoad', 'constructor'];
          const isBlacklisted = blacklist.some(char => firstname.includes(char) || lastname.includes(char));
            
          if (isBlacklisted) {
            req.session.err = {message: "Firstname or Lastname have character in blacklists!"}
            return res.redirect('/page-account')
          } else {
            await prisma.userInfo.update({
              where: { userId: userId },
              data: { firstName: firstname, lastName: lastname, email: email, bio: bio }
            });

            const sstiStatus = await prisma.vulnSetting.findUnique({
              where: { name: "SSTI" }
            });

            if (sstiStatus && sstiStatus.status === "Yes") {
              const userInfo = await prisma.$queryRaw`
                SELECT "UserInfo"."firstName", "UserInfo"."lastName", "UserInfo"."email", "UserInfo"."bio"
                FROM public."Credential"
                JOIN public."UserInfo" ON "Credential"."userId" = ${userId} AND "UserInfo"."userId" = ${userId}`;

              try {
                const templateData = readTemplateFile(); // Sử dụng hàm đọc template từ templateConfig.js
                let accountProfile = templateData.replace("<%= userInfo.firstName %>",firstname).replace("<%= userInfo.lastName %>", lastname)
                const renderProfile = ejs.render(accountProfile, { userInfo: userInfo[0], update: { message: "Updated Successfully!" } });
                return res.send(renderProfile);
              } catch (error) {
                console.log(error)
                return res.status(500).send(error);
              }
            } else {
              req.session.update = {message: "Updated Successfully!"};
              return res.redirect('/page-account');
            }
          }
        } catch (error) {
          return res.status(500).send(error);
        }
      }
    });
  } else {
    res.redirect('/page-login');
  }
};

// [POST] page-account/password
const setPassword = async (req, res) => {
  const token = req.cookies.jwt;
  jwt.verify(token, process.env.JWT_SECRET, async (err, result) =>{
    if(err) return res.status(500).send(err)
    else{
      const userId = result.id;
      const {password, newpassword, cpassword} = req.body;
      const user = await prisma.credential.findUnique({
        where:{
          id: userId
        }
      });

      const isMatch = await bcrypt.compare(password, user.password);
      if(!isMatch) {
        req.session.err = {message: "Wrong Password!"}
        return res.redirect('/page-account');
      }
      else if(newpassword !== cpassword) {
        req.session.err = {message: "New password doesn't match confirm password!"}
        return res.redirect('/page-account');
      }
      else{
        const hashedPassword = await bcrypt.hash(newpassword, 10);
        await prisma.credential.update({
          where: {userId: userId},
          data: {password: hashedPassword}
        });
        req.session.update = {message: "Updated Successfully!"}
        return res.redirect('/page-account');
      }
    }
  });
}

export default { getAccount, setInfoAccount, setPassword };