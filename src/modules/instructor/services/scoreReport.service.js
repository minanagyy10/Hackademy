import { assignScoreToReport } from "../../score/services/score.service.js";



export const scoreReport = async (req, res) => {
  try {
    // This function delegates to assignScoreToReport in score service
    await assignScoreToReport(req, res);

  } catch (error) {
    console.log("Catch error from scoreReport service", error);
    res.status(500).json({ message: 'Internal server error', error });
  }
};