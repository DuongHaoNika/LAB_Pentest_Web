import jwt from 'jsonwebtoken';
import prisma from "../models/prisma";
import bcrypt from 'bcrypt';
import fs from 'fs';
import path from 'path';

const getPageLogin = (req, res) => {
  res.clearCookie("jwt");
  if (typeof req.session === "undefined") {
    return res.render("page-login");
  } else {
    const info = req.session.info;
    delete req.session.info;
    return res.render("page-login", { info: info });
  }
};

const handleLogin = async (req, res) => {
  const { username, password } = req.body;
  try {
    let result;

    // Check SQLI status
    const SQLIstatus = await prisma.vulnSetting.findUnique({
      where: {
        name: "SQLI"
      }
    });
    if (SQLIstatus.status === 'Login') {
      const blacklist = ['--', '#', '/**/', 'or', 'Or', 'oR', 'OR'];
      const isBlacklisted = blacklist.some(char => username.includes(char) || password.includes(char));
    
      if (isBlacklisted) {
        const error = {
          message: "Do not hack!!!"
        };
        return res.render('page-login', { layout: false, error: error });
      }
    
      result = await prisma.$queryRawUnsafe(`SELECT * FROM "Credential" WHERE username='${username}'`);
    }    
    else { 
      result = await prisma.$queryRaw`SELECT * FROM "Credential" where username=${username}`;
    }

    if (result.length == 0 || !await bcrypt.compare(password, result[0].password)) {
      const error = {
        message: "Username or Password is incorrect !"
      };
      return res.render('page-login', { layout: false, error: error });
    }
    let header;
    const jwtStatus = await prisma.vulnSetting.findUnique({
      where: {
        name: "JWT"
      }
    });
    let key;
    if (jwtStatus.status === "Algo-Confusion" || jwtStatus.status === "No") {
      header = {
        alg: 'RS256',
        typ: 'JWT',
        kid: "fbdafd16-cc6a-4e21-8924-6531343f7a49"
      };
      key = fs.readFileSync(path.join(__dirname, "../helper/key/privateKey.pem"), 'utf-8');
    } else if (jwtStatus.status === "None-Alg") {
      header = {
        alg: 'HS256',
        typ: 'JWT',
      };
    }
    let token;
    if (jwtStatus.status === "Algo-Confusion" || jwtStatus.status === "No") {
      token = jwt.sign(
        { id: result[0].id, username: username, isAdmin: false },
        key,
        { algorithm: 'RS256', header }
      );
    } else if (jwtStatus.status === "Weak-Key") {
      header = {
        alg: 'HS256',
        typ: 'JWT',
      };

      const secretsFilePath = path.join(__dirname, '../helper/key/jwt.txt');
      const secrets = fs.readFileSync(secretsFilePath, 'utf8').split('\n').filter(secret => secret.trim() !== '');

      const randomIndex = Math.floor(Math.random() * secrets.length);
      const jwtsecret = secrets[randomIndex];
      const usedSecretsFilePath = path.join(__dirname, '../helper/key/used_jwt.txt');
      fs.writeFileSync(usedSecretsFilePath, jwtsecret);

      token = jwt.sign(
        { id: result[0].id, username: username, isAdmin: false },
        jwtsecret,
        { expiresIn: '1h', header }
      );
    } else {
      token = jwt.sign(
        { id: result[0].id, username: username, isAdmin: false },
        process.env.JWT_SECRET,
        { expiresIn: '5d', header }
      );
    }

    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: 10000 * 1000
    });
    return res.redirect("/");
  } catch (error) {
    res.render("page-login", { error: { message: error.message } });
  }
};

export default {
  getPageLogin,
  handleLogin
};
