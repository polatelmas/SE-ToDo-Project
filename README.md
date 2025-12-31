# SE-ToDo-Project
A collaborative Task Management application developed for the Software Engineering course. Managed with Scrum methodology.



Frontend  

npm install (package.json daki paketlerin hepsini indirir)

çalıştırmak için  (dosya yolu + npm run dev)

---

# 🧠 Todo Planner API

A modern productivity backend with JWT authentication, supporting **Tasks, Events, Notes, Categories**, and AI-based text parsing.
Designed for personal organization apps and microservice architectures.

---

## 🚀 Features

* User registration & login
* JWT-based authentication
* Task & Subtask management
* Event calendar system
* Notes management
* Category support
* AI-powered text parsing (convert raw text into tasks/notes)
* Full CRUD operations

---

## 📌 Base URL

```
http://127.0.0.1:8000
```

> Replace with your deployed server URL in production.

---

## 🔐 Authentication

### Register

```http
POST /auth/register
```

#### Request Body

```json
{
  "userName": "tuna",
  "password": "123456"
}
```

#### Response

```json
{
  "id": 1,
  "userName": "tuna",
  "message": "User created successfully"
}
```

---

### Login

```http
POST /auth/login
```

#### Request Body

```json
{
  "userName": "tuna",
  "password": "123456"
}
```

#### Response

```json
{
  "token": "JWT_TOKEN_HERE"
}
```

Use token in request headers:

```
Authorization: Bearer <token>
```

---

## 📝 Tasks

### Create a Task

```http
POST /tasks?user_id=1
```

```json
{
  "title": "Study Linear Algebra",
  "description": "Chapter 3 review",
  "due_date": "2025-01-10"
}
```

### Get All Tasks

```http
GET /tasks?user_id=1
```

#### Response

```json
[
  {
    "id": 10,
    "title": "Study Linear Algebra",
    "completed": false
  }
]
```

### Update a Task

```http
PUT /tasks/10?user_id=1
```

```json
{
  "title": "Study Linear Algebra - Updated",
  "completed": true
}
```

### Delete a Task

```http
DELETE /tasks/10?user_id=1
```

---

## 📎 Subtasks

Create subtask:

```http
POST /tasks/10/subtasks?user_id=1
```

```json
{
  "title": "Watch lecture video"
}
```

Update / Delete:

```http
PUT /tasks/subtasks/5?user_id=1
DELETE /tasks/subtasks/5?user_id=1
```

---

## 🗒 Notes

Same CRUD pattern as Tasks.

```http
POST /notes?user_id=1
```

```json
{
  "title": "Exam Topics",
  "content": "Pointers, Structs, OOP basics"
}
```

---

## 📅 Events

```http
POST /events?user_id=1
```

```json
{
  "title": "Physics Quiz",
  "event_date": "2025-02-01"
}
```

Other operations:

```http
GET /events?user_id=1
GET /events/3?user_id=1
PUT /events/3?user_id=1
DELETE /events/3
```

---

## 🏷 Categories

```http
POST /categories?user_id=1
```

```json
{
  "name": "School"
}
```

```http
GET /categories?user_id=1
PUT /categories/2?user_id=1
DELETE /categories/2
```

---

## 🤖 AI Parser

Generates tasks/notes from raw text.

```http
POST /ai/parse
```

```json
{
  "text": "Tomorrow study algorithms and prepare math homework"
}
```

#### Example Response

```json
{
  "tasks": ["study algorithms", "prepare math homework"]
}
```

---

## 🏃‍♂️ Run the Project

```bash
pip install -r requirements.txt
uvicorn main:app --reload
```

Swagger OpenAPI UI:

📄 [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

---
