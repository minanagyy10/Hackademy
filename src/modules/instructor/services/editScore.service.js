import { editReportScore } from "../../score/services/score.service.js";


export const editScore = async (req, res) => {
  try {
    // Call editScore which handles editing existing score
    await editReportScore(req, res);

  } catch (error) {
    console.log("Catch error from editReportScore service", error);
    res.status(500).json({ message: 'Internal server error', error });
  }
};
