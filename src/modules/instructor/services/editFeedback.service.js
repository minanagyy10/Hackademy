import { editReportFeedback } from "../../report/services/report.service.js";


export const updateFeedback = async (req, res) => {
  try {
    // Call updateReportFeedback which handles updating existing feedback
    await editReportFeedback(req, res);

  } catch (error) {
    console.log("Catch error from updateFeedback service", error);
    res.status(500).json({ message: 'Internal server error', error });
  }
};
