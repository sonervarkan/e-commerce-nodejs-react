# E-commerce with Nodejs - React
A full-stack e-commerce application specialized in automotive spare parts, built with the React-Node.js ecosystem and deployed on AWS infrastructure.

## Features
Frontend: Responsive UI built with React and Vite

Backend: Robust RESTful API powered by Node.js and Express.

Security: Robust password encryption via Bcrypt and secure API authentication with JSON Web Tokens (JWT).

Environment Management: Secure configuration via .env files.

Scalability: Modular folder structure designed for growth.

## Tech Stack
Client: React, Vite, CSS, Axios

Server: Node.js, Express, Sequelize (ORM)

Database: MySQL (supported via Sequelize)

DevOps: AWS EC2, Nginx, PM2

## Installation & Local Setup
````
Clone the repository:
git clone <repository-url>

Backend Setup:
cd backend
npm install
npm start

Frontend Setup:
cd frontend
npm install
npm run dev
````
## Deployment & AWS Configuration
The project is fully configured for deployment on AWS EC2 (Amazon Linux/Ubuntu). The following configurations have been implemented to ensure high availability and performance:

1. Remote Server Environment
Node.js Runtime: Optimized for Node.js v22 using NVM (Node Version Manager).

Process Management: Uses PM2 to manage the backend process, ensuring the server restarts automatically after crashes or reboots.

2. AWS EC2 & Networking
Security Groups: Configured to allow traffic on Port 80 (HTTP), 443 (HTTPS), and 22 (SSH).

Reverse Proxy: Nginx is configured as a reverse proxy to forward incoming requests to the Node.js backend running on its internal port.

3. Build & Optimization
Frontend: The React application is built using npm run build via Vite, generating optimized static assets for production.


## License
This project is licensed under the MIT License.
