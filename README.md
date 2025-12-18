# Introduction

## What is iRoomie

iRoomie is a roommate matching app aimed towards UIUC students. Inspired by gamified dating apps like Tindr, we wanted to make an interactive and engaging app that makes it easy for students to find and contact potential roommates.

iRoomie allows users to:
1. Create a profile with their email
2. Match with users with similar preferences
3. Get into contact with said person

For more details, view the full project proposal [here](https://docs.google.com/document/d/15c7sLHsO_B3nfjQLCp6QkTyK0kEl_TNWyFCs8jph8wI/edit?usp=sharing)

# Technical Architecture
<img width="913" height="510" alt="Screen Shot 2568-12-17 at 21 34 07" src="https://github.com/user-attachments/assets/9f75dbb7-a6d1-4e38-b4c5-828c7f9d0892" />

# React Frontend

When a user performs an action (changing profile or submitting a match request), the frontend sends HTTP requests in JSON format to the backend API. Once a response is received, the frontend updates the UI accordingly.

Interactions 
Sends requests to the Django REST API
Receives JSON responses and renders them
Relies on authentication state provided by the backend

# Django backend

Each endpoint corresponds to a specific feature (e.g., fetching profiles, creating matches, updating user data). The backend validates requests, performs necessary logic, interacts with the database, and returns structured responses.

Interactions 
Receives HTTP requests from the React frontend
Communicates with the authentication module to verify users
Reads from and writes to the database using Django’s ORM

# Developers
- **Jihwi Min**: Worked on backend, frontend
- **Veda Fernandes**: Worked on backend, frontend
- **Arin Rahman**: Worked on design, frontend, and styling
- **Gus Nophaket**: Worked on design, frontend, and styling

# Backend Setup

Create a virtual environment. Navigate to the backend directory, and run the following command.

```
python3 -m venv ./venv
```

Activating the venv. Run one of the following:

```
venv/Scripts/activate/ # macOS / Linux
source venv/bin/activate # Windows
```
Download requirements.txt

Run Migrations
```
python manage.py migrate
```

Start Backend Server
```
python manage.py runserver
```

# Frontend Setup
Navigate to Frontend Directory
```
cd frontend
```

Install Dependencies
```
npm install
```

Start Frontend Server
```
npm start
```


Frontend runs at:
```
http://localhost:3000/
```
You are now ready to use iRoomie!
