// import { User } from "../../../db/models/user.model.js";
// import { compareSync, hashSync } from 'bcrypt';
// import * as EmailEvent  from "../../../MyServices/send_email.myservice.js";
// 
// 
// 
// export const forgetPasswordService = async(req, res) => {
  // try {
    // const { email } = req.body;
    // const user = await User.findOne({ email });
    // if (!user) {
      // return res.status(404).json({ messae: "Something went wrong", erroe: error.message });
    // }
// 
    //Generate OTP
    // const otp = Math.floor(Math.random() * 10000);
    //Send OTP to user's email
    // EmailEvent.emitter.emit("sendEmail", {
      // to: user.email,
      // subject: "OTP for password reset",
      // html: `<h1>OTP is ${otp}</h1>`,
      // email: user.email,
      //cc:"fahmyyoussef362@gmail.com"
    // });
// 
    //Hash the OTP and save it to the database
    // const hashedOTP = hashSync(otp.toString(), 10);
// 
    // user.otp = hashedOTP;
    // await user.save();
// 
    // res.status(200).json({ message: "OTP sent successfully" });
    // /*Important security layer: is to focus too much on what you send in the response, because its data is shown
    // -> so you have to ensure that there is not any sensitive data in the response.
    // ---> For example her we did not send the otp in the response, so it can be accessed easily -> we already sent in the email so it is
          // not necessary to send it again.
    // */
// 
  // } catch (error) {
    // console.log("Error from forget password service", error);
    // res.status(500).json({message: 'Internal server error', error: error.message});
  // }
// 
// 
// }
// 