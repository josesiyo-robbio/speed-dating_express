
# Speed Dating API

## Overview
A RESTful API built with Express.js for organizing speed dating events. Users can create new events, vote on potential matches, and retrieve the list of matches after the event. This system includes authentication for voting actions and emails for event participants.

## Project Structure

```
src/
├── controller/     # Route handlers and business logic  
├── middleware/     # Authentication and validation middleware  
├── model/          # Data models and business logic  
├── service/        # Email and rotation logic  
├── routes/         # API route definitions  
└── db/             # Database configuration and connection  
```

## API Endpoints

### 1. Event Management
#### POST /create-event
- Creates a new speed dating event and sends welcome emails to all participants.
- **Authentication**: No authentication required.
- Request body:
```json
{
  "name": "Event Name",
  "duration": "Duration in minutes",
  "date_time": "YYYY-MM-DD HH:MM:SS",
  "participants": ["email1", "email2", "email3"]
}
```
- Sends a list of participant rotations and a confirmation email to participants.

### 2. Voting System
#### POST /vote
- Allows participants to vote for another participant during the event.
- **Authentication**: Requires valid JWT token.
- Request body:
```json
{
  "voted_email": "email@example.com"
}
```

### 3. Matches Retrieval
#### POST /matches
- Retrieves the list of matches for a specific event.
- **Authentication**: No authentication required.
- Request body:
```json
{
  "event_id": "string"
}
```
- Returns a list of matched participants from the event.


## Insomnia API Collection and Database Restoration

### API Collection for Insomnia
- The API collection for Insomnia can be found in the file `api_collection.InsomniaV4.json`.
- This collection contains pre-configured requests for interacting with the Speed Dating API.
- You can import this file into Insomnia to easily test the API endpoints.

### Database Restoration
- To restore the database, you can use the `database_schema.sql` file.
- This file contains the necessary requests to reset or seed the database, ensuring it's set up correctly for development or testing purposes.


## Technical Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Authentication**: JWT
- **Email Service**: Custom implementation
- **Architecture**: MVC Pattern

## Security Implementation
- JWT-based authentication for vote submission.
- Protected routes for voting require valid Bearer token.
- Request validation to ensure required fields are included.

## Middleware
1. **authMiddleware**: Validates JWT tokens for protected routes.
2. **validatorApi**: Validates required fields in requests.

## Error Handling
All endpoints include standardized error responses:
```json
{
  "message": "Error message",
  "error": {
    "message": "Detailed error description"
  }
}
```

Status codes:
- 200: Successful operation
- 400: Bad request or validation error
- 401: Unauthorized
- 500: Internal server error

## Setup Requirements
1. Node.js (v14 or higher)
2. NPM or Yarn
3. Database setup (based on your db/ configuration)
4. Environment variables configuration

## Installation
```bash
# Clone the repository
git clone [repository-url]

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Start the server
npm start
```

## Environment Variables
```env
JWT_SECRET=your_jwt_secret
DATABASE_URL=your_database_url
SMTP_HOST=your_smtp_host
SMTP_PORT=your_smtp_port
SMTP_USER=your_smtp_username
SMTP_PASS=your_smtp_password
```

## Dependencies
```json
{
  "dependencies": {
    "express": "^4.17.1",
    "jsonwebtoken": "^8.5.1",
    "nodemailer": "^6.6.3"
  }
}
```

## API Response Format
Successful responses:
```json
{
  "message": "Operation success message"
}
```

Error responses:
```json
{
  "message": "Error message",
  "missingFields": ["field1", "field2"]  // For validation errors
}
```

## Development
- Follow the Express.js best practices
- Use async/await for asynchronous operations
- Implement proper error handling
- Validate all incoming requests
- Use middleware for common operations

## Contributing
1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request