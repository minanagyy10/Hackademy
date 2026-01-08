import { assignFeedbackToReport } from "../../report/services/report.service.js";


export const feedbackReport = async (req, res) => {
  try {
    // Call feedbackReport which handles adding feedback for the first time
    await assignFeedbackToReport(req, res);

  } catch (error) {
    console.log("Catch error from reviewReport service", error);
    res.status(500).json({ message: 'Internal server error', error });
  }
};
