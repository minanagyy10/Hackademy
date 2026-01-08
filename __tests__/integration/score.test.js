import { describe, it, expect, beforeAll, afterAll, beforeEach } from '@jest/globals';
import { connectTestDB, disconnectTestDB, clearDatabase } from '../setup/testSetup.js';
import { createMockStudent, createMockInstructor, createMockReport, createMockScore, createMockRequest, createMockResponse } from '../helpers/testHelpers.js';
import { assignScoreToReport } from '../../src/modules/score/services/assignScoreToReport.service.js';
import { editReportScore } from '../../src/modules/score/services/editReportScore.service.js';
import { getScoreOfReport } from '../../src/modules/score/services/getScoreOfReport.service.js';
import { getScoresOfStudent } from '../../src/modules/score/services/getScoresOfStudent.service.js';
import { leaderboard } from '../../src/modules/score/services/leaderBoard.service.js';
import { Student } from '../../src/db/models/student.model.js';
import mongoose from 'mongoose';

describe('Score Module Integration Tests', () => {
  let student, instructor;

  beforeAll(async () => {
    await connectTestDB();
  });

  afterAll(async () => {
    await disconnectTestDB();
  });

  beforeEach(async () => {
    await clearDatabase();
    student = await createMockStudent();
    instructor = await createMockInstructor();
    instructor.assignedStudents.push(student._id);
    await instructor.save();
  });

  describe('assignScoreToReport', () => {
    it('should successfully assign score to a report', async () => {
      const report = await createMockReport(student._id, instructor._id);

      const req = createMockRequest(instructor, {
        reportId: report._id.toString(),
        scoreValue: 85
      });
      const res = createMockResponse();

      await assignScoreToReport(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      const responseData = res.json.mock.calls[0][0];
      expect(responseData.score).toBeDefined();
      expect(responseData.score.score).toBe(85);
    });

    it('should update student totalScore', async () => {
      const report = await createMockReport(student._id, instructor._id);
      student.totalScore = 50;
      await student.save();

      const req = createMockRequest(instructor, {
        reportId: report._id.toString(),
        scoreValue: 85
      });
      const res = createMockResponse();

      await assignScoreToReport(req, res);

      const updatedStudent = await Student.findById(student._id);
      expect(updatedStudent.totalScore).toBe(135);
    });

    it('should link score to report', async () => {
      const report = await createMockReport(student._id, instructor._id);

      const req = createMockRequest(instructor, {
        reportId: report._id.toString(),
        scoreValue: 85
      });
      const res = createMockResponse();

      await assignScoreToReport(req, res);

      const updatedReport = await report.constructor.findById(report._id);
      expect(updatedReport.score).toBeDefined();
    });

    it('should fail when score is out of range', async () => {
      const report = await createMockReport(student._id, instructor._id);

      const req = createMockRequest(instructor, {
        reportId: report._id.toString(),
        scoreValue: 150
      });
      const res = createMockResponse();

      await assignScoreToReport(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringContaining('between 0 and 100')
        })
      );
    });

    it('should fail when score already exists', async () => {
      const report = await createMockReport(student._id, instructor._id);
      await createMockScore(report._id, instructor._id, student._id, 80);

      const req = createMockRequest(instructor, {
        reportId: report._id.toString(),
        scoreValue: 85
      });
      const res = createMockResponse();

      await assignScoreToReport(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringContaining('Score already exists')
        })
      );
    });
  });

  describe('editReportScore', () => {
    it('should successfully update an existing score', async () => {
      const report = await createMockReport(student._id, instructor._id);
      const score = await createMockScore(report._id, instructor._id, student._id, 80);
      student.totalScore = 80;
      await student.save();

      const req = createMockRequest(instructor, {
        reportId: report._id.toString(),
        scoreValue: 90
      });
      const res = createMockResponse();

      await editReportScore(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      const responseData = res.json.mock.calls[0][0];
      expect(responseData.score.score).toBe(90);

      // Verify totalScore was updated correctly
      const updatedStudent = await Student.findById(student._id);
      expect(updatedStudent.totalScore).toBe(90);
    });

    it('should correctly calculate totalScore difference', async () => {
      const report = await createMockReport(student._id, instructor._id);
      const score = await createMockScore(report._id, instructor._id, student._id, 70);
      student.totalScore = 100;
      await student.save();

      const req = createMockRequest(instructor, {
        reportId: report._id.toString(),
        scoreValue: 85
      });
      const res = createMockResponse();

      await editReportScore(req, res);

      const updatedStudent = await Student.findById(student._id);
      expect(updatedStudent.totalScore).toBe(115); // 100 - 70 + 85
    });

    it('should fail when score does not exist', async () => {
      const report = await createMockReport(student._id, instructor._id);

      const req = createMockRequest(instructor, {
        reportId: report._id.toString(),
        scoreValue: 90
      });
      const res = createMockResponse();

      await editReportScore(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringContaining('Score not found')
        })
      );
    });
  });

  describe('getScoreOfReport', () => {
    it('should retrieve score for a report', async () => {
      const report = await createMockReport(student._id, instructor._id);
      const score = await createMockScore(report._id, instructor._id, student._id, 85);

      const req = createMockRequest(student, {}, {
        reportId: report._id.toString()
      });
      const res = createMockResponse();

      await getScoreOfReport(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      const responseData = res.json.mock.calls[0][0];
      expect(responseData.score.score).toBe(85);
    });

    it('should fail when score does not exist', async () => {
      const report = await createMockReport(student._id, instructor._id);

      const req = createMockRequest(student, {}, {
        reportId: report._id.toString()
      });
      const res = createMockResponse();

      await getScoreOfReport(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringContaining('Score not found')
        })
      );
    });
  });

  describe('getScoresOfStudent', () => {
    it('should retrieve all scores for a student', async () => {
      const report1 = await createMockReport(student._id, instructor._id);
      const report2 = await createMockReport(student._id, instructor._id);
      await createMockScore(report1._id, instructor._id, student._id, 85);
      await createMockScore(report2._id, instructor._id, student._id, 90);

      const req = createMockRequest(student);
      const res = createMockResponse();

      await getScoresOfStudent(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      const responseData = res.json.mock.calls[0][0];
      expect(responseData.scores).toHaveLength(2);
    });

    it('should return empty array when student has no scores', async () => {
      const req = createMockRequest(student);
      const res = createMockResponse();

      await getScoresOfStudent(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      const responseData = res.json.mock.calls[0][0];
      expect(responseData.scores).toHaveLength(0);
    });
  });

  describe('leaderboard', () => {
    it('should retrieve top students by totalScore', async () => {
      const student1 = await createMockStudent({ totalScore: 200 });
      const student2 = await createMockStudent({ totalScore: 150 });
      const student3 = await createMockStudent({ totalScore: 100 });

      const req = createMockRequest(student, {}, {}, { limit: '3' });
      const res = createMockResponse();

      await leaderboard(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      const responseData = res.json.mock.calls[0][0];
      expect(responseData.topStudents).toHaveLength(3);
      expect(responseData.topStudents[0].totalScore).toBeGreaterThanOrEqual(
        responseData.topStudents[1].totalScore
      );
    });

    it('should use default limit of 10 when not specified', async () => {
      // Create 15 students
      for (let i = 0; i < 15; i++) {
        await createMockStudent({ totalScore: i * 10 });
      }

      const req = createMockRequest(student);
      const res = createMockResponse();

      await leaderboard(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      const responseData = res.json.mock.calls[0][0];
      expect(responseData.topStudents.length).toBeLessThanOrEqual(10);
    });

    it('should return students sorted by totalScore descending', async () => {
      await createMockStudent({ totalScore: 50 });
      await createMockStudent({ totalScore: 100 });
      await createMockStudent({ totalScore: 75 });

      const req = createMockRequest(student, {}, {}, { limit: '10' });
      const res = createMockResponse();

      await leaderboard(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      const responseData = res.json.mock.calls[0][0];
      const scores = responseData.topStudents.map(s => s.totalScore);
      const sortedScores = [...scores].sort((a, b) => b - a);
      expect(scores).toEqual(sortedScores);
    });
  });
});

