# Project Name

#SeeMe

## Table of Contents

- [Introduction](#introduction)
- [Getting Started](#getting-started)
- [API Endpoints](#API-endpoints)

## Introduction

SeeMe is a lightweight social app designed to facilitate face-to-face communication among friends through audio and video means, enabling quick connections. Addressing the challenges of real-time communication spontaneity, disruptions in text and call workflows, and the scheduling constraints of traditional video calls that existed in other social media platforms. This app aims to provide users with seamless connections with their chosen close friends while prioritizing user privacy. SeeMe utilizes the mongoose library to interact with a MongoDB database.

## Getting Started

1. Installation
   . Clone the repository: `git clone https://github.com/obaikoko/seeme/your-repo.git`
   . Install dependencies: `npm install`

2. Configuration
   . Set up MongoDB connection details in a `.env` file.
   . Configure server settings and environment variables in the `./config/db.js` file.

3. Running the Application
   . Start the server: `npm start`
   . Access the API endpoints locally: `http://localhost:5000`

### Folder Structure

. config: Contains configuration files for database connection and server settings.
. controllers: Houses logic for handling user actions, chat functionalities, and notifications.
. middleware: Includes authentication, error handling, and logging middleware.
. models: Defines schemas for user data, chat sessions, and notifications.
. routes: Defines API endpoints for user management and chat functionalities.
. utils: Contains utility functions for validation, responses, and authentication.

## API Endpoints

### POST
 /api/users/: Register a new user.

### POST 
/api/users/auth: Authenticate a user and generate a JWT token.

### POST
 /api/users/logout: logout user.
### POST
 /api/users/resetPassword: generates otp for password reset.
### PUT
 /api/users/verifyOTP: veryfies the otp .
### GET 
api/users/profile: Fetch user profile information.
### PUT
 api/users/profile: Update user profile information.

## Technologies Used

. Node.js: Backend JavaScript runtime environment.
. Express.js: Web application framework for Node.js.
. MongoDB: NoSQL database for storing user and chat data.
. Mongoose: ODM library for MongoDB interactions.
. JWT: JSON Web Tokens for user authentication and authorization.

## Development Guidelines

. Follow RESTful API design principles for clear and consistent endpoints.
. Implement error handling to provide informative responses to clients.
. Secure API endpoints with authentication and authorization mechanisms.
. Test API endpoints using tools like Postman or automated testing frameworks.

Let's take you from Getting Started to communicating with friends - SeeMe.
