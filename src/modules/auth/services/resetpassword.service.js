// import { User } from "../../../db/models/user.model.js";
// import { compareSync, hashSync } from 'bcrypt';
// 
// 
// 
// 
// export const resetPasswordService = async(req, res) => {
  // try {
    // const { email, otp, password, confirmpassword } = req.body;
// 
    // if (password !== confirmpassword) {
      // return res.status(400).json({ message: "password and confirmation password do not match" });  
      // }
// 
    // const user = await User.findOne({email});
    // if (!user) {
      // return res.status(404).json({ message: "This email is not registered "});
    // }
// 
//     Check if OTP exists for user
    //  if (!user.otp) {
      // return res.status(400).json({ message: "No OTP sent for this user" });
    // }
// 
// 
//    Decrypt the OTP
    // const isOTPMatched = compareSync(otp.toString(), user.otp);
// 
    // if (!isOTPMatched){
      // return res.status(400).json({ message: "Invalid OTP" });
    // }
// 
    // const hashedPassword = hashSync(password,  +process.env.SALT);
// 
    // await User.updateOne({email},{password:hashedPassword, $unset:{otp:""}});
    // res.status(200).json({ message: "Password reset successfully" });
// 
// 
    // 
  // } catch (error) {
    // res.status(500).json({message: 'Something went wrong', error: error.message});
  // }
// }