import { describe, it, expect, beforeAll, afterAll, beforeEach } from '@jest/globals';
import { connectTestDB, disconnectTestDB, clearDatabase } from '../setup/testSetup.js';
import { createMockStudent, createMockInstructor, createMockRequest, createMockResponse } from '../helpers/testHelpers.js';
import { submitReport } from '../../src/modules/student/services/submitReport.service.js';
import { getMyReports } from '../../src/modules/student/services/myReports.service.js';
import { getMyTotalScore } from '../../src/modules/student/services/myScore.service.js';
import { getAssignedInstructor } from '../../src/modules/student/services/myInstructor.service.js';
import { Report } from '../../src/db/models/report.model.js';
import { Student } from '../../src/db/models/student.model.js';
import { Instructor } from '../../src/db/models/instructor.model.js';

describe('Student Module Integration Tests', () => {
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

  describe('submitReport', () => {
    it('should successfully submit a report', async () => {
      const req = createMockRequest(student, {
        title: 'Test Report',
        level: 1,
        content: 'This is test content'
      });
      const res = createMockResponse();

      await submitReport(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalled();
      
      const responseData = res.json.mock.calls[0][0];
      expect(responseData.message).toContain('successfully');
      expect(responseData.report).toBeDefined();
      expect(responseData.report.title).toBe('test report');
      expect(responseData.report.level).toBe(1);
    });

    it('should fail when required fields are missing', async () => {
      const req = createMockRequest(student, {
        title: 'Test Report'
        // Missing level and content
      });
      const res = createMockResponse();

      await submitReport(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringContaining('Missing required fields')
        })
      );
    });

    it('should fail when level is not a positive number', async () => {
      const req = createMockRequest(student, {
        title: 'Test Report',
        level: -1,
        content: 'Test content'
      });
      const res = createMockResponse();

      await submitReport(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringContaining('positive number')
        })
      );
    });

    it('should fail when student has no assigned instructor', async () => {
      const unassignedStudent = await createMockStudent();
      const req = createMockRequest(unassignedStudent, {
        title: 'Test Report',
        level: 1,
        content: 'Test content'
      });
      const res = createMockResponse();

      await submitReport(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringContaining('No instructor assigned')
        })
      );
    });

    it('should fail when title is empty', async () => {
      const req = createMockRequest(student, {
        title: '   ',
        level: 1,
        content: 'Test content'
      });
      const res = createMockResponse();

      await submitReport(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe('getMyReports', () => {
    it('should retrieve all reports for a student', async () => {
      // Create some reports
      await createMockReport(student._id, instructor._id, { title: 'Report 1' });
      await createMockReport(student._id, instructor._id, { title: 'Report 2' });

      const req = createMockRequest(student);
      const res = createMockResponse();

      await getMyReports(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      const responseData = res.json.mock.calls[0][0];
      expect(responseData.reports).toHaveLength(2);
    });

    it('should return empty array when student has no reports', async () => {
      const req = createMockRequest(student);
      const res = createMockResponse();

      await getMyReports(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      const responseData = res.json.mock.calls[0][0];
      expect(responseData.reports).toHaveLength(0);
    });
  });

  describe('getMyTotalScore', () => {
    it('should retrieve total score for a student', async () => {
      student.totalScore = 150;
      await student.save();

      const req = createMockRequest(student);
      const res = createMockResponse();

      await getMyTotalScore(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      const responseData = res.json.mock.calls[0][0];
      expect(responseData.totalScore).toBe(150);
    });

    it('should return 0 when student has no score', async () => {
      const req = createMockRequest(student);
      const res = createMockResponse();

      await getMyTotalScore(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      const responseData = res.json.mock.calls[0][0];
      expect(responseData.totalScore).toBe(0);
    });

    it('should fail when student does not exist', async () => {
      const req = createMockRequest({ _id: '507f1f77bcf86cd799439011', role: 'user' });
      const res = createMockResponse();

      await getMyTotalScore(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('getAssignedInstructor', () => {
    it('should retrieve assigned instructor for a student', async () => {
      const req = createMockRequest(student);
      const res = createMockResponse();

      await getAssignedInstructor(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      const responseData = res.json.mock.calls[0][0];
      expect(responseData.instructor).toBeDefined();
      expect(responseData.instructor._id.toString()).toBe(instructor._id.toString());
    });

    it('should fail when student has no assigned instructor', async () => {
      const unassignedStudent = await createMockStudent();
      const req = createMockRequest(unassignedStudent);
      const res = createMockResponse();

      await getAssignedInstructor(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringContaining('No instructor assigned')
        })
      );
    });
  });
});

