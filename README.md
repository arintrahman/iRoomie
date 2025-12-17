# Introduction

## What is iRoomie

iRoomie is a roommate matching app aimed towards UIUC students. It allows users to:
1. Create a profile with their email
2. Match with users with similar preferences
3. Get into contact with said person

For more details, view the full project proposal [here](https://docs.google.com/document/d/15c7sLHsO_B3nfjQLCp6QkTyK0kEl_TNWyFCs8jph8wI/edit?usp=sharing)

# Technical Architecture

# Developers
- **Jihwi Min**: 
- **Veda Fernandes**: 
- **Arin Rahman**:
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
