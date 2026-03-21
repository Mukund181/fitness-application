# FitTrack Pro 💪

A complete, full-stack fitness tracking application built with the MERN stack (MongoDB, Express, React, Node.js). FitTrack Pro empowers users to log workouts, track nutrition, explore evidence-based supplements, bust fitness myths, and visualize their progress with customized dashboards.

## Features

*   **User Authentication**: Secure Sign-up and Login using JWT and bcrypt.
*   **Progress Dashboard**: Data visualization for daily/weekly calories, macronutrients, and completed workouts.
*   **Activity Logging**: Log workouts with sets, reps, duration, and dynamically calculate expected calorie burn.
*   **Nutrition Database**: Search through foods and log meals to fulfill daily macro targets.
*   **Workout Splits**: Auto-generated workout routines depending on the user's focus (Hypertrophy, Fat Loss, Strength).
*   **Healthy Recipes**: Browse meals filtered by fitness goals (High Protein, Low-Carb, Maintenance).
*   **Supplement Guide**: Evidence-based research detailing dosage and effectiveness of popular supplements.
*   **Myth Buster**: Debunking common fitness misconceptions with scientific backing.
*   **Modern UI**: Beautiful, aggressive carbon/neon-orange aesthetic with responsive layouts.

## Tech Stack

*   **Frontend**: React (Vite), React Router, Chart.js / React-Chartjs-2, Axios, React Hot Toast
*   **Backend**: Node.js, Express.js
*   **Database**: MongoDB (Mongoose)
*   **Authentication**: JSON Web Tokens (JWT)

## Getting Started Locally

### Prerequisites
*   [Node.js](https://nodejs.org/en/) installed
*   [MongoDB](https://www.mongodb.com/) installed and running locally on port 27017

### Installation

1. Clone the repository:
   \`\`\`bash
   git clone https://github.com/mukund181/fitness-application.git
   cd fitness-application
   \`\`\`

2. Install backend dependencies & start server:
   \`\`\`bash
   cd server
   npm install
   npm run dev
   \`\`\`
   *(The backend server will run on http://localhost:5000)*

3. Open a new terminal window, install frontend dependencies & start client:
   \`\`\`bash
   cd client
   npm install
   npm run dev
   \`\`\`
   *(The frontend development server will run on http://localhost:5173)*

### Environment Variables
Check \`server/.env\` (or create one) to ensure your backend environment matches:
\`\`\`env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/fittrack
JWT_SECRET=fittrack_super_secret_jwt_key_2024
JWT_EXPIRE=7d
NODE_ENV=development
\`\`\`

## Deployment to Cloud
To keep the application running 24/7 (so you can access it without your PC being on):
1. **Database**: Host your database on **MongoDB Atlas**. Update your \`MONGO_URI\`.
2. **Backend**: Deploy the \`server\` directory to **Render**, **Railway**, or **Heroku**.
3. **Frontend**: Update \`client/src/services/api.js\` to point to your deployed backend URL. Then deploy the \`client\` directory to **Vercel** or **Netlify**.

---
*Developed by Mukund181.*
