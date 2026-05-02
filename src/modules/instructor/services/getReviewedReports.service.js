import { getReportsByInstructor } from "../../report/services/report.service.js";


export const getReviewedReports = async (req, res) => {
  try {
    // This function delegates to getReportsByInstructor in report service
    // getReportsByInstructor already gets instructorId from req.user.id
    await getReportsByInstructor(req, res);

  } catch (error) {
    console.log("Catch error from getReviewedReports service", error);
    res.status(500).json({ message: 'Internal server error', error });
  }
};