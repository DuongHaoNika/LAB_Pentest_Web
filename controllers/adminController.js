import prisma from "../models/prisma";

const adminPage = async (req, res) => {
    const ssrfStatus = await prisma.vulnSetting.findUnique({
        where: {
            name: "SSRF"
        }
    })
    if(ssrfStatus.status !== "No"){
        if(req.ip == '::1') {
            return res.send("PTITCTF{this_is_a_real_flag}")
        }
    }
    else {

        if(req.user.role !== 'admin') return res.send('Not permission!')
        return res.send("PTITCTF{this_is_a_real_flag}")
    }
}

export default {adminPage}