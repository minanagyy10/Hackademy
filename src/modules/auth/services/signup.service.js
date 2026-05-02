// import { User } from "../../../db/models/user.model.js";
// import { compareSync, hashSync } from 'bcrypt';
// import { Encryption } from "../../../utils/encryption.utils.js";
// import * as EmailEvent  from "../../../MyServices/send_email.myservice.js";
// import jwt from "jsonwebtoken";
// 
// 
// 
// export const signUpService = async(req, res) => {
    // try {
      // const { username, email, password, confirmpassword, phone, age, gender } = req.body; //Destructing the body
// 
      // if (password !== confirmpassword) {
        // return res.status(400).json({ message: "password and confirmation password do not match" });
      // }
// 
     // =>Difference between(find, findOne, findByID) -> Video 4 week 11 session 1 => so important
      // const isEmailExist = await User.findOne({ email });
      // if (isEmailExist) {
        // return res.status(409).json({ message: "Email already exists" });
      // }
// 
    //  Validate phone number before encryption because the regex will refuse the phone cigher(after encryption it will be invalid)
      // if (!/^\d{12}$/.test(phone)) {
        // return res.status(400).json({ message: "Phone must be 12 digits" });
      // }
      //Encrypt phone number
      // const encryptedPhone = await Encryption({value: phone,secretkey: process.env.SECRET_KEY,});
// 
      //Hash password
      // const hashedPassword = hashSync(password, +process.env.SALT); //This + because .env gives out only string so we need to convert it to number
// 
      // const token = jwt.sign({ email },process.env.JWT_SECRET,{ expiresIn: '120'});
// 
      // const confirmEmailLink = `${req.protocol}://${req.headers.host}/auth/verify/${token}`;
// 
      //Send verification email 
      // EmailEvent.emitter.emit("sendEmail",
      //  {
        // to: email,
        // subject: "Verify your email",
        // text: "Hello",
        // html: `<h1>Verify your email</h1>
        // <a href="${confirmEmailLink}">Confirm Email</a>`,
        // cc:"fahmyyoussef362@gmail.com"
      // }
    // );
// 
// 
// 
  //    =>Difference between(create, save, insert many) -> Video 4 week 11 session 1 => so important
      // const user = await User.create({
        // email: email,
        // password: hashedPassword,
        // username: username,
        // phone: encryptedPhone,
        // age: age,
        // gender
      // });
      // if (!user) {
        // return res.status(500).json({ message: "User creation failed, try again later" });
      // }
// 
      // return res.status(201).json({ message: "User created successfully", user });
// 
    // } catch (error) {  //Note: printing the error is just during dev and testing, in production it have not be printed for security wise
        // console.log("Catch error from sign up service", error);
        // res.status(500).json({message: 'Internal server error', error})
    // }
// 
// }