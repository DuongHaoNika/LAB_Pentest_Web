import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import axios from 'axios';
import jwkToPem from "jwk-to-pem"
import fs from "fs"
import path from "path"

const Authentication = async (req, res, next) => {
    let mysecretkey = process.env.JWT_SECRET
    const prisma = new PrismaClient()
    try{
        if(req.path == '/page-login' || req.path == '/page-register' || req.path == '/settings' || req.path == '/page-register/createUser' || req.path == '/admin'){
            next()
        }
        else{
            const ck = req.headers.cookie
            const indexOfJWT = ck.indexOf("jwt")
            if(indexOfJWT === -1) return res.redirect("/page-login")
            let jwtToken = ck.substr(indexOfJWT + 3)
            const idx = jwtToken.indexOf(";")
            if(idx === -1){
                jwtToken = jwtToken.split("=")[1]
            }
            else{
                jwtToken = jwtToken.substr(1, idx - 1)
            }
            const jwtStatus = await prisma.vulnSetting.findUnique({
                where: {
                    name: "JWT"
                }
            })
            const encodedHeader = jwtToken.split(".")[0]
            const decodedHeader = Buffer.from(encodedHeader, 'base64').toString('utf-8')
            const header = JSON.parse(decodedHeader)
            let user
            if(jwtStatus.status == "None-Alg" && header.alg == 'none') 
            {
                mysecretkey = null
                jwt.verify(jwtToken, mysecretkey, (err, decoded) => {
                    if (err) {
                    return res.status(401).json({ message: 'Invalid token' });
                    }
                });
            }
            else if (jwtStatus.status === "Weak-Key") {
                try {
                    const secretsFilePath = path.join(__dirname, '../helper/key/used_jwt.txt');
                    const secrets = await fs.readFileSync(secretsFilePath, 'utf8')

                    if (secrets.length === 0) {
                        throw new Error('No secrets found in the file.');
                    }
                    user = await jwt.verify(jwtToken, secrets);

                } catch (error) {
                    console.error("Error while verifying JWT token:", error);
                    return res.status(401).json({ error: 'Invalid token' });
                }
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
                const publicKey = jwkToPem(rsaKey)
                jwt.verify(jwtToken, publicKey)
            }
            else if (jwtStatus.status === "Weak-Key") {
                try {
                    const secretsFilePath = path.join(__dirname, '../helper/key/used_jwt.txt');
                    const secrets = fs.readFileSync(secretsFilePath, 'utf8').split('\n').filter(secret => secret.trim() !== '');
                    console.log(secrets)
            
                    if (secrets.length === 0) {
                        throw new Error('No secrets found in the file.');
                    }
            
                    const jwtsecret = secrets[0];
            
                    user = await jwt.verify(jwtToken, jwtsecret);
            
                } catch (error) {
                    console.error("Error while verifying JWT token:", error);
                    return res.status(401).json({ error: 'Invalid token' });
                }
            }
            else if(jwtStatus.status == "No"){
                const key = fs.readFileSync(path.join(__dirname, "../helper/key/publicKey.pem"), 'utf-8')
                user = await jwt.verify(jwtToken, key)
            }
            req.user = {username: `${user.username}`, role: `${user.isAdmin}`}
            res.locals.user = {username: 'hao', role: 'admin'}
            next()
        }
    }
    catch(err){
        console.log(err)
        return res.redirect('/page-login')
    }
}

export default Authentication