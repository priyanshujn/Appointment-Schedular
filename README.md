# Meeting Scheduler Web Application

## Project Overview

This web application allows users to schedule meetings with any other user on the platform. Users can sign up, log in, schedule appointments, manage their appointments,
update their profiles, and specify their non-availability by setting up the off-hours.

## Key Features

### User Authentication

- **User Registration**: Users can create new accounts by providing the necessary information.

- **User Login**: Registered users can use their credentials to log in to the platform.

### Scheduling Appointments

- **Schedule Meetings**: Users can schedule appointments by specifying the following details:
  - Title
  - Agenda
  - Date
  - Start and End Time
  - Guest (another user on the platform)

- **Availability Check**: Appointments are only scheduled if the chosen guest is available during the selected time slot.

### Managing Appointments

- **Upcoming Appointments**: Users can view a list of their upcoming appointments.

- **Delete Old Appointments**: Users can delete appointments that have passed.

### Profile Management

- **Update Profile Information**: Users can update their profile information, including:
  - Profile Name
  - Password

- **Set Off-Hours**: Users can mark their off-hours, indicating the times when they are not available for appointments during the day.

## Getting Started

Follow these steps to set up and run the project on your local machine:

1. Clone the repository: `git clone git@github.com:priyanshujn/Appointment-Schedular.git`
2. Install dependencies: `npm install`
3. Set up the database: Set up a MongoDB cloud database and create a database user with the required access
4. Configure environment variables: Set environment variable `MONGO_URL` with the database user credentials
5. Start the application: `npm run start`

## Usage

1. Register with user details or log in with user credentials if you already have one.
2. Schedule meetings with other users by providing the required information.
3. Manage your appointments by viewing upcoming appointments and deleting old ones.
4. Update your profile information and set off-hours from your profile page.

## Technologies Used

- NodeJs, Express, MongoDB, Mongoose


## Contact

If you have any questions or feedback, please get in touch with us at priyanshu.sdev404@gmail.com.
