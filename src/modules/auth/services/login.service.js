import { Student } from "../../../db/models/student.model.js";
import { Instructor } from "../../../db/models/instructor.model.js";
import { compareSync, hashSync } from 'bcrypt';
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";



export const logInService = async (req, res) => {
    try {
        const { email, password, userType } = req.body;

        // Validate userType
        if (!userType || !['student', 'instructor'].includes(userType.toLowerCase())) {
            return res.status(400).json({ message: 'Invalid user type. Must be either "student" or "instructor"' });
        }

        // Select the appropriate model based on userType
        const Model = userType.toLowerCase() === 'student' ? Student : Instructor;

        // Find user in the appropriate collection
        const user = await Model.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'Invalid email or password' });
        }

        const isPasswordMatch = compareSync(password, user.password);
        if (!isPasswordMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Include userType in the JWT payload for role-based authorization
        const accessToken = jwt.sign(
            { _id: user._id, email: user.email, userType: userType.toLowerCase() },
            process.env.JWT_SECRET_LOGIN,
            { expiresIn: '1h', jwtid: uuidv4() }
        );

        const refreshtoken = jwt.sign(
            { _id: user._id, email: user.email, userType: userType.toLowerCase() },
            process.env.JWT_SECRET_REFRESH,
            { expiresIn: '1d' }
        );


        return res.status(200).json({
            message: 'User logged in successfully',
            accessToken,
            refreshtoken,
            userType: userType.toLowerCase()
        });

    } catch (error) { //Do not forget to remove printing the error itself when production, and just put the phrase "Internal server error"
        console.log("Catch error from sign in service", error);
        res.status(500).json({ message: 'Internal server error', error });

    }
}


/*
import { User } from "../../../db/models/user.model.js";
import { compareSync, hashSync } from 'bcrypt';
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";



export const logInService = async(req, res) => {
    try {
        const {email, password} = req.body;
        const user = await User.findOne({email});
        if(!user) {
            return res.status(404).json({message: 'Invalid email or password'});
        }

        const isPasswordMatch = compareSync(password, user.password);
        if(!isPasswordMatch){
            return res.status(401).json({message: 'Invalid email or password'});
        }

        const accessToken = jwt.sign({_id:user._id, email:user.email}, "process.env.JWT_SECRET_LOGIN", {expiresIn: '1h', jwt_id: uuidv4()});
        const refreshtoken = jwt.sign({_id:user._id, email:user.email}, 'process.env.JWT_SECRET_REFRESH', {expiresIn: '1d'});

        
        return res.status(200).json({message: 'User logged in successfully', accessToken, refreshtoken});
        
    } catch (error) { //Do not forget to remove printing the error itself when production, and just put the phrase "Internal server error"
        console.log("Catch error from sign in service", error);
        res.status(500).json({message: 'Internal server error', error});
        
    }
}
*/