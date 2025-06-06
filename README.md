# 📝 Note-Todo API

A simple and secure REST API for managing notes and todos. Built with Express, MongoDB, TypeDI, Celebrate for validation, and JWT-based authentication.

## ✨ Features

- 🚀 Express server with modular loader architecture
- 📦 Dependency Injection via custom loader
- 🗃 MongoDB (via Mongoose)
- 📅 Agenda job scheduler
- 📚 Swagger docs at `/api-docs`
- 🛡️ Sentry monitoring and tracing

## 🏗️ Project Structure

Follows a clean and maintainable **Bulletproof Node.js architecture**. See [Bulletproof Node.js Architecture](https://github.com/santiq/bulletproof-nodejs) for the inspiration.

## 🧰 Tech Stack

- **Node.js + Express** – Web server
- **MongoDB + Mongoose** – Database and ODM
- **TypeDI** – For dependency injection
- **Celebrate + Joi** – For route validation
- **Swagger** – For API documentation (`/api-docs`)
- **Sentry** – For error monitoring and performance tracing
- **Jest + Supertest** – For unit and integration testing

---

## Setup

### Environment Variables

Create a `.env` file with the following:

```env
PORT=3000  
JWT_SECRET=your_jwt_secret  
MONGO_URI=mongodb://localhost:27017/note-todo-api
...
```

## 📦 Local Development

```bash
git clone https://github.com/kuyrathdaro/note-todo-api.git
cd note-todo-api
npm install
npm run dev
```

## 🐳 Docker Development

```bash
docker-compose up --build
```

This runs:

- API at http://localhost:3000
- MongoDB at default port 27017

## 🧪 Running Tests

### Locally

```bash
npm run test
```

### In Docker

```bash
docker-compose exec app npm test
```

---
## 📜 License
This project is licensed under the GNU General Public License v3.0 (GPL-3.0).

You may copy, distribute, and modify the software as long as you track changes/dates in source files. Any derivative work must also be open source and licensed under the GPL-3.0.

## 🙏 Acknowledgements
- 💡 Based on the Bulletproof Node.js Architecture by Santiago Gómez

## 👤 Author
Made with ❤️ by Rathdaro Kuy