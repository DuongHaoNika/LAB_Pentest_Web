import prisma from "../models/prisma";
import libxmljs  from "libxmljs";
// import session from 'express-session';


// const getPageEmail = (req, res) => {
//     return res.render("index");
//   };

const subscribeMail = async (req, res) => {
    try {
      let xmlDoc;
      const xxeStatus = await prisma.vulnSetting.findUnique({
        where: {
          name: "XXE"
        }
      });
  
      if (xxeStatus.status === "No") {
        xmlDoc = libxmljs.parseXml(req.body.toString(), { replaceEntities: false, preserveWhitespace: true, dtdload: false });
        const emailNode = xmlDoc.get('//email');
        const email = emailNode ? emailNode.text() : undefined;
        const data = {
          email: email,
          redirectUrl: '/'
        };
        return res.json(data);
      } else {
        xmlDoc = libxmljs.parseXml(req.body.toString(), { replaceEntities: true, preserveWhitespace: true, dtdload: true });
        // const emailNode = xmlDoc.get('//email');
        // const email = emailNode ? emailNode.text() : undefined;
        
        if (xxeStatus.status === "Retrieve file") {
            console.log('Received XML:', req.body.toString()); // Log the raw XML data

            const xmlDoc = libxmljs.parseXml(req.body.toString(), { replaceEntities: true, preserveWhitespace: true, dtdload: true });
            const data = xmlDoc.root().text();
            console.log(data);
            return res.json(data)
        }
        // else if (xxeStatus.status === "Blind") {
        //   const data = {
        //     redirectUrl: '/'
        //   };
        //   return res.json(data);
        // }
      }
    } catch (error) {
      console.error('Error parsing XML:', error);
      return res.json({ message: 'Internal Server Error', redirectUrl: '/' });
    }
  };
  

export default { subscribeMail }



// import { PrismaClient } from '@prisma/client';
// import libxmljs from 'libxmljs';

// const prisma = new PrismaClient();

// const subscribeMail = async (req, res) => {
//     try {
//         const xmlInput = req.body.email; // Get the XML data from the request body
//         const emailDoc = libxmljs.parseXmlString(xmlInput, { noent: true, noblanks: true }); // Parse the XML

//         // Extract the email from the parsed XML
//         const emailNode = emailDoc.get('//subscribe');
//         if (!emailNode) {
//             return res.status(400).send('Invalid XML format');
//         }

//         const email = emailNode.text();
//         console.log('Extracted email:', email);

//         res.send('Email subscribed successfully');
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('An error occurred');
//     }
// };

// export default subscribeMail;
