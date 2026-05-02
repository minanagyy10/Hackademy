// import jwt from "jsonwebtoken";
// 
// 
// 
// export const refreshTokenService = async(req, res) => {
  // try {
    // const { refreshtoken } = req.headers;
    // const decodedData = jwt.verify(refreshtoken, 'process.env.JWT_SECRET_REFRESH');
    // const accessToken = jwt.sign({_id: decodedData._id, email: decodedData.email}, "process.env.JWT_SECRET_LOGIN", {expiresIn: '1h'});
// 
    // return res.status(200).json({message: 'Refresh token verified successfully', accessToken}); 
// 
  // } catch (error) {
    // console.log("Catch error from refresh token service", error);
        // res.status(500).json({message: 'Internal server error', error});
// 
  // }
// }