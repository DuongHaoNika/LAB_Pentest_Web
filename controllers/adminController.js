import jwt from 'jsonwebtoken';
import prisma from "../models/prisma";
import fs from 'fs'
import path from 'path'
import axios from 'axios';
import jwkToPem from "jwk-to-pem"

const adminPage = async (req, res) => {
    const jwtStatus = await prisma.vulnSetting.findUnique({
        where: {name: "JWT"}
    })
    const token = req.cookies.jwt
    let mysecretkey = process.env.JWT_SECRET
    const encodedHeader = token.split(".")[0]
    const decodedHeader = Buffer.from(encodedHeader, 'base64').toString('utf-8')
    const header = JSON.parse(decodedHeader)
    if(jwtStatus.status == "None-Alg" && header.alg == 'none') mysecretkey = null
    else if(jwtStatus.status == "Algo-Confusion") {
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
    else if(jwtStatus.status == "Weak-Key") {
        mysecretkey =  fs.readFileSync(path.join(__dirname, '../helper/key/used_jwt.txt'), 'utf8')
    }
    else {
        mysecretkey = fs.readFileSync(path.join(__dirname, "../helper/key/publicKey.pem"), 'utf-8')
    }
    
    jwt.verify(token, mysecretkey,(err, result) => {
        if(err) return res.send(err)
        else{
            const isAdmin = result.isAdmin
            console.log(result)
            if(isAdmin == true) return res.render("admin")
            else return res.send("You are not allowed!")
        }
    })
}

export default {adminPage}