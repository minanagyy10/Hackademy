import { Student } from '../../src/db/models/student.model.js';
import { Instructor } from '../../src/db/models/instructor.model.js';
import { Report } from '../../src/db/models/report.model.js';
import { Score } from '../../src/db/models/score.model.js';
import { systemRoles } from '../../src/constants/constants.js';
import bcrypt from 'bcrypt';
import { jest } from '@jest/globals';

/**
 * Create a mock student user
 */
export const createMockStudent = async (overrides = {}) => {
  const defaultStudent = {
    username: `teststudent${Date.now()}`,
    email: `teststudent${Date.now()}@test.com`,
    password: await bcrypt.hash('Test123456', 10),
    phone: `123456789${Date.now().toString().slice(-4)}`,
    age: 20,
    role: systemRoles.USER,
    totalScore: 0,
    reports: [],
    scores: [],
    ...overrides
  };

  return await Student.create(defaultStudent);
};

/**
 * Create a mock instructor user
 */
export const createMockInstructor = async (overrides = {}) => {
  const defaultInstructor = {
    username: `testinstructor${Date.now()}`,
    email: `testinstructor${Date.now()}@test.com`,
    password: await bcrypt.hash('Test123456', 10),
    phone: `987654321${Date.now().toString().slice(-4)}`,
    age: 30,
    role: systemRoles.INSTRUCTOR,
    assignedStudents: [],
    reviewedReports: [],
    givenScores: [],
    ...overrides
  };

  return await Instructor.create(defaultInstructor);
};

/**
 * Create a mock report
 */
export const createMockReport = async (studentId, instructorId, overrides = {}) => {
  const levelValue = overrides.level !== undefined ? overrides.level : 1;
  const { level, ...restOverrides } = overrides;
  
  const defaultReport = {
    title: 'Test Report',
    level: levelValue.toString(), // Convert to string as model expects string
    content: 'This is a test report content',
    student: studentId,
    instructor: instructorId,
    ...restOverrides
  };

  return await Report.create(defaultReport);
};

/**
 * Create a mock score
 */
export const createMockScore = async (reportId, instructorId, studentId, scoreValue = 85, overrides = {}) => {
  const defaultScore = {
    report: reportId,
    instructor: instructorId,
    student: studentId,
    score: scoreValue,
    ...overrides
  };

  return await Score.create(defaultScore);
};

/**
 * Create a mock request object with user
 */
export const createMockRequest = (user, body = {}, params = {}, query = {}) => {
  return {
    user: {
      id: user._id.toString(),
      role: user.role,
      ...user
    },
    body,
    params,
    query
  };
};

/**
 * Create a mock response object
 */
export const createMockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
};

