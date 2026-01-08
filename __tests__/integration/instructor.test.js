import { describe, it, expect, beforeAll, afterAll, beforeEach } from '@jest/globals';
import { connectTestDB, disconnectTestDB, clearDatabase } from '../setup/testSetup.js';
import { createMockStudent, createMockInstructor, createMockReport, createMockScore, createMockRequest, createMockResponse } from '../helpers/testHelpers.js';
import { assignStudent } from '../../src/modules/instructor/services/assignStudent.service.js';
import { getAssignedStudents } from '../../src/modules/instructor/services/getAssignedStudents.service.js';
import { feedbackReport } from '../../src/modules/instructor/services/feedbackReport.service.js';
import { updateFeedback } from '../../src/modules/instructor/services/editFeedback.service.js';
import { scoreReport } from '../../src/modules/instructor/services/scoreReport.service.js';
import { editScore } from '../../src/modules/instructor/services/editScore.service.js';
import { getReviewedReports } from '../../src/modules/instructor/services/getReviewedReports.service.js';
import { Report } from '../../src/db/models/report.model.js';
import { Score } from '../../src/db/models/score.model.js';
import mongoose from 'mongoose';

describe('Instructor Module Integration Tests', () => {
  let instructor, student1, student2;

  beforeAll(async () => {
    await connectTestDB();
  });

  afterAll(async () => {
    await disconnectTestDB();
  });

  beforeEach(async () => {
    await clearDatabase();
    instructor = await createMockInstructor();
    student1 = await createMockStudent();
    student2 = await createMockStudent();
  });

  describe('assignStudent', () => {
    it('should successfully assign a student to instructor', async () => {
      const req = createMockRequest(instructor, {
        studentId: student1._id.toString()
      });
      const res = createMockResponse();

      await assignStudent(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      const responseData = res.json.mock.calls[0][0];
      expect(responseData.message).toContain('successfully');
      expect(responseData.instructor.assignedStudents).toHaveLength(1);
    });

    it('should fail when studentId is missing', async () => {
      const req = createMockRequest(instructor, {});
      const res = createMockResponse();

      await assignStudent(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringContaining('Missing required field')
        })
      );
    });

    it('should fail when studentId is invalid format', async () => {
      const req = createMockRequest(instructor, {
        studentId: 'invalid-id'
      });
      const res = createMockResponse();

      await assignStudent(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringContaining('Invalid studentId format')
        })
      );
    });

    it('should fail when student does not exist', async () => {
      const req = createMockRequest(instructor, {
        studentId: new mongoose.Types.ObjectId().toString()
      });
      const res = createMockResponse();

      await assignStudent(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringContaining('Student not found')
        })
      );
    });

    it('should fail when student is already assigned', async () => {
      instructor.assignedStudents.push(student1._id);
      await instructor.save();

      const req = createMockRequest(instructor, {
        studentId: student1._id.toString()
      });
      const res = createMockResponse();

      await assignStudent(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringContaining('already assigned')
        })
      );
    });
  });

  describe('getAssignedStudents', () => {
    it('should retrieve all assigned students', async () => {
      instructor.assignedStudents.push(student1._id, student2._id);
      await instructor.save();

      const req = createMockRequest(instructor);
      const res = createMockResponse();

      await getAssignedStudents(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      const responseData = res.json.mock.calls[0][0];
      expect(responseData.students).toHaveLength(2);
    });

    it('should return empty array when no students assigned', async () => {
      const req = createMockRequest(instructor);
      const res = createMockResponse();

      await getAssignedStudents(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      const responseData = res.json.mock.calls[0][0];
      expect(responseData.students).toHaveLength(0);
    });
  });

  describe('feedbackReport', () => {
    beforeEach(async () => {
      instructor.assignedStudents.push(student1._id);
      await instructor.save();
    });

    it('should successfully add feedback to a report', async () => {
      const report = await createMockReport(student1._id, instructor._id);

      const req = createMockRequest(instructor, {
        reportId: report._id.toString(),
        feedback: 'Great work! Keep it up.'
      });
      const res = createMockResponse();

      await feedbackReport(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      const responseData = res.json.mock.calls[0][0];
      expect(responseData.report.feedback).toBe('Great work! Keep it up.');
    });

    it('should fail when feedback already exists', async () => {
      const report = await createMockReport(student1._id, instructor._id, {
        feedback: 'Existing feedback'
      });

      const req = createMockRequest(instructor, {
        reportId: report._id.toString(),
        feedback: 'New feedback'
      });
      const res = createMockResponse();

      await feedbackReport(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringContaining('Feedback already exists')
        })
      );
    });

    it('should fail when report does not belong to instructor', async () => {
      const otherInstructor = await createMockInstructor();
      const report = await createMockReport(student1._id, otherInstructor._id);

      const req = createMockRequest(instructor, {
        reportId: report._id.toString(),
        feedback: 'Test feedback'
      });
      const res = createMockResponse();

      await feedbackReport(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
    });
  });

  describe('updateFeedback', () => {
    beforeEach(async () => {
      instructor.assignedStudents.push(student1._id);
      await instructor.save();
    });

    it('should successfully update existing feedback', async () => {
      const report = await createMockReport(student1._id, instructor._id, {
        feedback: 'Old feedback'
      });

      const req = createMockRequest(instructor, {
        reportId: report._id.toString(),
        feedback: 'Updated feedback'
      });
      const res = createMockResponse();

      await updateFeedback(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      const responseData = res.json.mock.calls[0][0];
      expect(responseData.report.feedback).toBe('Updated feedback');
    });
  });

  describe('scoreReport', () => {
    beforeEach(async () => {
      instructor.assignedStudents.push(student1._id);
      await instructor.save();
    });

    it('should successfully assign score to a report', async () => {
      const report = await createMockReport(student1._id, instructor._id);

      const req = createMockRequest(instructor, {
        reportId: report._id.toString(),
        scoreValue: 85
      });
      const res = createMockResponse();

      await scoreReport(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      const responseData = res.json.mock.calls[0][0];
      expect(responseData.score).toBeDefined();
      expect(responseData.score.score).toBe(85);
    });

    it('should update student totalScore when score is assigned', async () => {
      const report = await createMockReport(student1._id, instructor._id);
      student1.totalScore = 50;
      await student1.save();

      const req = createMockRequest(instructor, {
        reportId: report._id.toString(),
        scoreValue: 85
      });
      const res = createMockResponse();

      await scoreReport(req, res);

      const updatedStudent = await student1.constructor.findById(student1._id);
      expect(updatedStudent.totalScore).toBe(135); // 50 + 85
    });

    it('should fail when score is out of range', async () => {
      const report = await createMockReport(student1._id, instructor._id);

      const req = createMockRequest(instructor, {
        reportId: report._id.toString(),
        scoreValue: 150
      });
      const res = createMockResponse();

      await scoreReport(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringContaining('between 0 and 100')
        })
      );
    });

    it('should fail when score already exists', async () => {
      const report = await createMockReport(student1._id, instructor._id);
      await createMockScore(report._id, instructor._id, student1._id, 80);

      const req = createMockRequest(instructor, {
        reportId: report._id.toString(),
        scoreValue: 85
      });
      const res = createMockResponse();

      await scoreReport(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringContaining('Score already exists')
        })
      );
    });
  });

  describe('editScore', () => {
    beforeEach(async () => {
      instructor.assignedStudents.push(student1._id);
      await instructor.save();
    });

    it('should successfully update an existing score', async () => {
      const report = await createMockReport(student1._id, instructor._id);
      const score = await createMockScore(report._id, instructor._id, student1._id, 80);
      student1.totalScore = 80;
      await student1.save();

      const req = createMockRequest(instructor, {
        reportId: report._id.toString(),
        scoreValue: 90
      });
      const res = createMockResponse();

      await editScore(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      const responseData = res.json.mock.calls[0][0];
      expect(responseData.score.score).toBe(90);

      // Verify totalScore was updated
      const updatedStudent = await student1.constructor.findById(student1._id);
      expect(updatedStudent.totalScore).toBe(90); // 80 - 80 + 90 = 90
    });

    it('should fail when score does not exist', async () => {
      const report = await createMockReport(student1._id, instructor._id);

      const req = createMockRequest(instructor, {
        reportId: report._id.toString(),
        scoreValue: 90
      });
      const res = createMockResponse();

      await editScore(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringContaining('Score not found')
        })
      );
    });
  });

  describe('getReviewedReports', () => {
    beforeEach(async () => {
      instructor.assignedStudents.push(student1._id);
      await instructor.save();
    });

    it('should retrieve all reports reviewed by instructor', async () => {
      const report1 = await createMockReport(student1._id, instructor._id);
      const report2 = await createMockReport(student1._id, instructor._id);
      instructor.reviewedReports.push(report1._id, report2._id);
      await instructor.save();

      const req = createMockRequest(instructor);
      const res = createMockResponse();

      await getReviewedReports(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      const responseData = res.json.mock.calls[0][0];
      expect(responseData.reports).toBeDefined();
      expect(Array.isArray(responseData.reports)).toBe(true);
    });
  });
});

