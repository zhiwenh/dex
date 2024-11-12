const path = require('path');
const express = require("express");
const router = express.Router();
const cors = require("cors");
const nodemailer = require("nodemailer");

const config = require('./config.json');

const app = express();

const contactEmail = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: "zhiwen555@gmail.com",
    pass: config.gmailPassword
  },
});

contactEmail.verify((error) => {
  if (error) {
    console.log(error);
  } else {
    console.log("Ready to Send");
  }
});

app.use(cors());
app.use(express.json());
app.use("/", router);

router.post("/contact", (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const message = req.body.message;
  const mail = {
    from: name,
    to: "***************@gmail.com",
    subject: "Contact Form Submission",
    html: `<p>Name: ${name}</p>
           <p>Email: ${email}</p>
           <p>Message: ${message}</p>`,
  };
  contactEmail.sendMail(mail, (error) => {
    if (error) {
      res.json({ status: "ERROR" });
    } else {
      res.json({ status: "Message Sent" });
    }
  });
});

app.listen(5000, () => console.log("Server Running"));


// const PORT = 3000;
//
// // Have Node serve the files for our built React app
// app.use(express.static(path.resolve(__dirname, '../client/build/index.html')));
//
// // All other GET requests not handled before will return our React app
// app.get('*', (req, res) => {
//   res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
// });
//
// app.listen(PORT, () => {
//   console.log(`Server listening on ${PORT}`);
// });
