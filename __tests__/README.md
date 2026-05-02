# Backend Testing Suite

This directory contains comprehensive tests for the Hackademy backend project (excluding authentication module).

## Test Structure

- `setup/` - Test database setup and teardown utilities
- `helpers/` - Mock data generators and test utilities
- `integration/` - Integration tests for all modules
  - `student.test.js` - Student module tests
  - `instructor.test.js` - Instructor module tests
  - `report.test.js` - Report module tests
  - `score.test.js` - Score module tests

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## Test Coverage

The test suite covers:

### Student Module
- ✅ Submit report
- ✅ Get my reports
- ✅ Get my total score
- ✅ Get assigned instructor
- ✅ Error handling and validation

### Instructor Module
- ✅ Assign student to instructor
- ✅ Get assigned students
- ✅ Add feedback to report
- ✅ Update feedback
- ✅ Assign score to report
- ✅ Edit score
- ✅ Get reviewed reports
- ✅ Error handling and validation

### Report Module
- ✅ Create report
- ✅ Get report by ID
- ✅ Get reports by student
- ✅ Get reports by instructor
- ✅ Assign feedback to report
- ✅ Edit report feedback
- ✅ Error handling and validation

### Score Module
- ✅ Assign score to report
- ✅ Edit report score
- ✅ Get score of report
- ✅ Get scores of student
- ✅ Leaderboard functionality
- ✅ Error handling and validation

## Bugs Fixed During Testing

1. **getReportsByInstructor service**: Fixed to use `req.user.id` when called from `getReviewedReports` service
2. **Missing mongoose imports**: Added mongoose imports to score service files
3. **Status field**: Removed non-existent `status` field from report creation and scoring
4. **Level field type**: Fixed level field to be converted to string as model expects

## Test Database

Tests use a separate test database. Make sure to set `TEST_DB_URL` in your `.env` file, or it will default to `mongodb://localhost:27017/hackademy_test`.

## Notes

- All tests clean the database before each test
- Mock data is generated with unique values to avoid conflicts
- Tests verify both success and error scenarios
- Integration tests test the full flow including database operations

