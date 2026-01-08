import { describe, it, expect, beforeAll, afterAll, beforeEach } from '@jest/globals';
import { connectTestDB, disconnectTestDB, clearDatabase } from '../setup/testSetup.js';
import { createMockStudent, createMockInstructor, createMockReport, createMockRequest, createMockResponse } from '../helpers/testHelpers.js';
import { createReport } from '../../src/modules/report/services/createReport.service.js';
import { getReportById } from '../../src/modules/report/services/getReportByID.service.js';
import { getReportsByStudent } from '../../src/modules/report/services/getReportsByStudent.service.js';
import { getReportsByInstructor } from '../../src/modules/report/services/getReportsByInstructor.service.js';
import { assignFeedbackToReport } from '../../src/modules/report/services/assignFeedbackToReport.service.js';
import { editReportFeedback } from '../../src/modules/report/services/editReportFeedback.service.js';
import mongoose from 'mongoose';

describe('Report Module Integration Tests', () => {
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

  describe('createReport', () => {
    it('should successfully create a report', async () => {
      const req = createMockRequest(student, {
        title: 'Test Report',
        level: 1,
        content: 'Test content',
        student: student._id.toString(),
        instructor: instructor._id.toString()
      });
      const res = createMockResponse();

      await createReport(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      const responseData = res.json.mock.calls[0][0];
      expect(responseData.report).toBeDefined();
      expect(responseData.report.title).toBe('test report');
      expect(responseData.report.level).toBe('1');
    });

    it('should fail when required fields are missing', async () => {
      const req = createMockRequest(student, {
        title: 'Test Report'
        // Missing other fields
      });
      const res = createMockResponse();

      await createReport(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringContaining('Missing required fields')
        })
      );
    });

    it('should fail when student is not assigned to instructor', async () => {
      const otherInstructor = await createMockInstructor();

      const req = createMockRequest(student, {
        title: 'Test Report',
        level: 1,
        content: 'Test content',
        student: student._id.toString(),
        instructor: otherInstructor._id.toString()
      });
      const res = createMockResponse();

      await createReport(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringContaining('not assigned')
        })
      );
    });

    it('should add report to student reports array', async () => {
      const req = createMockRequest(student, {
        title: 'Test Report',
        level: 1,
        content: 'Test content',
        student: student._id.toString(),
        instructor: instructor._id.toString()
      });
      const res = createMockResponse();

      await createReport(req, res);

      const updatedStudent = await student.constructor.findById(student._id);
      expect(updatedStudent.reports).toHaveLength(1);
    });
  });

  describe('getReportById', () => {
    it('should retrieve a report by ID', async () => {
      const report = await createMockReport(student._id, instructor._id);

      const req = createMockRequest(student, {}, {
        reportId: report._id.toString()
      });
      const res = createMockResponse();

      await getReportById(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      const responseData = res.json.mock.calls[0][0];
      expect(responseData.report._id.toString()).toBe(report._id.toString());
    });

    it('should fail when reportId is invalid format', async () => {
      const req = createMockRequest(student, {}, {
        reportId: 'invalid-id'
      });
      const res = createMockResponse();

      await getReportById(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringContaining('Invalid reportId format')
        })
      );
    });

    it('should fail when report does not exist', async () => {
      const req = createMockRequest(student, {}, {
        reportId: new mongoose.Types.ObjectId().toString()
      });
      const res = createMockResponse();

      await getReportById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringContaining('Report not found')
        })
      );
    });
  });

  describe('getReportsByStudent', () => {
    it('should retrieve all reports for a student', async () => {
      await createMockReport(student._id, instructor._id, { title: 'Report 1' });
      await createMockReport(student._id, instructor._id, { title: 'Report 2' });

      const req = createMockRequest(student, {}, {
        studentId: student._id.toString()
      });
      const res = createMockResponse();

      await getReportsByStudent(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      const responseData = res.json.mock.calls[0][0];
      expect(responseData.reports).toHaveLength(2);
    });

    it('should return empty array when student has no reports', async () => {
      const req = createMockRequest(student, {}, {
        studentId: student._id.toString()
      });
      const res = createMockResponse();

      await getReportsByStudent(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      const responseData = res.json.mock.calls[0][0];
      expect(responseData.reports).toHaveLength(0);
    });

    it('should fail when student does not exist', async () => {
      const req = createMockRequest(student, {}, {
        studentId: new mongoose.Types.ObjectId().toString()
      });
      const res = createMockResponse();

      await getReportsByStudent(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('getReportsByInstructor', () => {
    it('should retrieve all reports for an instructor', async () => {
      await createMockReport(student._id, instructor._id, { title: 'Report 1' });
      await createMockReport(student._id, instructor._id, { title: 'Report 2' });

      const req = createMockRequest(instructor, {}, {
        instructorId: instructor._id.toString()
      });
      const res = createMockResponse();

      await getReportsByInstructor(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      const responseData = res.json.mock.calls[0][0];
      expect(responseData.reports).toHaveLength(2);
    });

    it('should fail when instructorId is invalid format', async () => {
      const req = createMockRequest(instructor, {}, {
        instructorId: 'invalid-id'
      });
      const res = createMockResponse();

      await getReportsByInstructor(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe('assignFeedbackToReport', () => {
    it('should successfully assign feedback to a report', async () => {
      const report = await createMockReport(student._id, instructor._id);

      const req = createMockRequest(instructor, {
        reportId: report._id.toString(),
        feedback: 'Great work!'
      });
      const res = createMockResponse();

      await assignFeedbackToReport(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      const responseData = res.json.mock.calls[0][0];
      expect(responseData.report.feedback).toBe('Great work!');
    });

    it('should fail when feedback already exists', async () => {
      const report = await createMockReport(student._id, instructor._id, {
        feedback: 'Existing feedback'
      });

      const req = createMockRequest(instructor, {
        reportId: report._id.toString(),
        feedback: 'New feedback'
      });
      const res = createMockResponse();

      await assignFeedbackToReport(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringContaining('Feedback already exists')
        })
      );
    });

    it('should add report to instructor reviewedReports', async () => {
      const report = await createMockReport(student._id, instructor._id);

      const req = createMockRequest(instructor, {
        reportId: report._id.toString(),
        feedback: 'Test feedback'
      });
      const res = createMockResponse();

      await assignFeedbackToReport(req, res);

      const updatedInstructor = await instructor.constructor.findById(instructor._id);
      expect(updatedInstructor.reviewedReports).toContainEqual(report._id);
    });
  });

  describe('editReportFeedback', () => {
    it('should successfully update feedback', async () => {
      const report = await createMockReport(student._id, instructor._id, {
        feedback: 'Old feedback'
      });

      const req = createMockRequest(instructor, {
        reportId: report._id.toString(),
        feedback: 'Updated feedback'
      });
      const res = createMockResponse();

      await editReportFeedback(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      const responseData = res.json.mock.calls[0][0];
      expect(responseData.report.feedback).toBe('Updated feedback');
    });

    it('should fail when report does not belong to instructor', async () => {
      const otherInstructor = await createMockInstructor();
      const report = await createMockReport(student._id, otherInstructor._id);

      const req = createMockRequest(instructor, {
        reportId: report._id.toString(),
        feedback: 'Test feedback'
      });
      const res = createMockResponse();

      await editReportFeedback(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
    });
  });
});

