import jwt from "jsonwebtoken";
import BlackListedTokens from "../../../db/models/blacklisted-tokens.model.js";



export const logOutService = async(req, res) => {
  try {
    const { accessToken, refreshtoken } = req.headers;
    //Verify the tokens
    const decodedAccessToken = jwt.verify(accessToken, process.env.JWT_SECRET_LOGIN);
    const decodedRefreshToken = jwt.verify(refreshtoken, process.env.JWT_SECRET_REFRESH);

    //Insert token id into the black list in the database
    const revokedToken = await BlackListedTokens.insertMany(
        [
            {
          tokenID: decodedAccessToken.jti,
          expirdAt: decodedAccessToken.exp,
            },
            {
          tokenID: decodedRefreshToken.jti,
          expirdAt: decodedRefreshToken.exp,
            }
        ]
    );

    res.status(200).json({ message: "User logged out successfully" });
    
    
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error", error }); 
  }

} 
