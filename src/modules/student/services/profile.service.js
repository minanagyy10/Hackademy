//Note: We have to check these 2 functions logic again

import { compareSync, hashSync } from "bcrypt";
import { Student } from "../../../db/models/student.model.js";
import { Decryption, Encryption } from "../../../utils/encryption.utils.js";


export const updatePasswordService = async(req, res) => {
  try {
    //const { _id } = req.params;
    const { oldPassword, newPassword, confirmPassword } = req.body;

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const student = await Student.findOne(_id);
    if (!student) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordMatched = compareSync(oldPassword, student.password);
    if (!isPasswordMatched) {
      return res.status(400).json({ message: "Wrong password" });
    }

    //Hash new password and save to the database
    const hashedPassword = hashSync(newPassword, +process.env.SALT);
    student.password = hashedPassword;
    await student.save();

    
    //Revoke token (To make him log out and login again the new password)
    await BlacklistedToken.create(req.loggedInUser.token);

    return res.status(200).json({ message: "Password updated successfully" });

  } catch (error) {
    console.log("Catch error ", error);
  
    }    
  
}


export const updateProfileService = async(req, res) => {
  try {

    const { _id } = req.loggedInUser ;
    const { email, username, phone } = req.body;
    
    const student = await Student.findById(_id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if(username) {student.username = username;} //Just update
    if(phone) {student.phone = Encryption({ value: phone, secretkey:process.env.SECRET_KEY});} //Encrypt it first then update
    //
    if(email){
      const isEmailExist = await Student.findOne({ email });
      if (isEmailExist) {
        return res.status(400).json({ message: "Email already exists" }); //Because email is unique so he can't use it as a new email
      }

    }


  } catch (error) {
    console.log("Eror from update profile service: ", error);
    res.status(500).json({ message: " Something went wrong", error: error.message });
  }
}
     