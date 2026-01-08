import { getReportsByStudent } from "../../report/services/report.service.js";



export const getMyReports = async (req, res) => {
  try {
    // Get student ID from authenticated user (JWT token)
    const studentId = req.user.id;

    // Set studentId in params so getReportsByStudent can use it
    req.params.studentId = studentId;

    // Call getReportsOfStudent which handles all validation and fetching
    await getReportsByStudent(req, res);

  } catch (error) {
    console.log("Catch error from getMyReports service", error);
    res.status(500).json({ message: 'Internal server error', error });
  }
};

