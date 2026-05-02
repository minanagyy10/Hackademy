# Testing Guide

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Test Database
Make sure MongoDB is running and optionally set `TEST_DB_URL` in your `.env` file:
```
TEST_DB_URL=mongodb://localhost:27017/hackademy_test
```

### 3. Run Tests
```bash
# Run all tests
npm test

# Run tests in watch mode (for development)
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

## Test Structure

```
__tests__/
├── setup/
│   └── testSetup.js          # Database connection utilities
├── helpers/
│   └── testHelpers.js        # Mock data generators
├── integration/
│   ├── student.test.js       # Student module tests
│   ├── instructor.test.js    # Instructor module tests
│   ├── report.test.js        # Report module tests
│   └── score.test.js         # Score module tests
└── README.md                 # Test documentation
```

## What's Tested

### Student Module Tests
- ✅ Submit report with validation
- ✅ Get my reports
- ✅ Get total score
- ✅ Get assigned instructor
- ✅ Error scenarios

### Instructor Module Tests
- ✅ Assign student
- ✅ Get assigned students
- ✅ Add/update feedback
- ✅ Assign/edit scores
- ✅ Get reviewed reports
- ✅ Error scenarios

### Report Module Tests
- ✅ Create report
- ✅ Get report by ID
- ✅ Get reports by student/instructor
- ✅ Assign/edit feedback
- ✅ Error scenarios

### Score Module Tests
- ✅ Assign score
- ✅ Edit score
- ✅ Get score of report
- ✅ Get scores of student
- ✅ Leaderboard
- ✅ Error scenarios

## Test Output

When tests run successfully, you'll see:
```
PASS  __tests__/integration/student.test.js
PASS  __tests__/integration/instructor.test.js
PASS  __tests__/integration/report.test.js
PASS  __tests__/integration/score.test.js

Test Suites: 4 passed, 4 total
Tests:       XX passed, XX total
```

## Troubleshooting

### Tests fail with database connection error
- Ensure MongoDB is running
- Check `TEST_DB_URL` in `.env` or use default connection
- Verify database permissions

### Tests fail with import errors
- Ensure all dependencies are installed: `npm install`
- Check Node.js version (should be 18+ for ES modules)

### Tests fail with "jest is not defined"
- Ensure Jest is installed: `npm install --save-dev jest @jest/globals`
- Check that test files import from `@jest/globals`

## Coverage Report

After running `npm run test:coverage`, check the `coverage/` directory for:
- `index.html` - HTML coverage report
- `lcov.info` - LCOV format coverage data

## Notes

- Tests clean the database before each test suite
- Mock data uses timestamps to ensure uniqueness
- All tests are integration tests that use real database operations
- Authentication module is excluded from testing as requested

