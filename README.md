# Welcome to PZero app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Description

PZero is a comprehensive mobile application designed to simplify daily life management and enhance productivity. It combines features like expense tracking, task management, goal setting, and fitness planning within a sleek and intuitive user interface. Built using modern technologies such as React Native and Clerk authentication, pZero offers users a seamless and secure experience.

## Features

- **User Authentication & Security**: Secure login using Clerk Authentication. Email verification via OTP, ensuring user identity and secure access.
- **Expense Management**: Track monthly expenses with an interactive UI. Add, modify, and delete expense records effortlessly. Filter expenses by categories such as AMI, Needs, Investments, and Personal. Generate monthly expense reports to monitor spending habits.
- **To-Do Management**: Create and organize daily tasks. Filter tasks by: Completed, Main Priority, Overdue, Due Date Closing.
- **Goal Setting**: Set and achieve goals with step-by-step progress tracking. Example: Create a goal like (Learn React in 10 Days) with actionable steps to complete it.
- **Workout Planning**: Personalized Workout Plans: Users can create custom workout routines tailored to their needs. Public Workout Plans: Access plans posted by admins, including, Single Body Part Plans:- Focused exercises for specific body parts. Weekly Workout Plans:- Structured schedules detailing daily exercises. Filter plans by workout categories to find the perfect fit.
- **Backend and API**: The backend, powered by Node.js and Express, ensures robust data handling and efficient communication between the app and server. APIs were tested rigorously with Postman, ensuring reliability.

## Technology Stack

- **React Native & Expo**: For a dynamic and responsive user interface.
- **Clerk**: For User Authentication and Managment.
- **Tanstack Query**: For featching, caching data.
- **Nativewind**: For sleek and modern design.
- **Reanimated V3**: For animations.
- **Node**, **Express**: For Backend.
- **MongoDB**: For Database management.

## Get started

Create a new empty folder in your directory.
Then go your directory.

1. Clone the Front-end repository:
   ```bash
   git clone https://github.com/prpradhan13/pz-expo.git
   ```

- [PZ Expo Server](https://github.com/prpradhan13/pz-expo-server.git): View the server or backend repository.

2. Clone the Backend repository:
   ```bash
   git clone https://github.com/prpradhan13/pz-expo-server.git
   ```

3. Go to the backend clone folder
   ```bash
   cd pz-expo-server
   ```

4. Set up environment variables: 
   - Create a `.env` file in the root directory.
   - Add the following variables:
   ```
     PORT=your_port
     MONGO_URI=your_mongodb_uri
     CLERK_API_KEY=clerk_backend_api_key
     CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
     CLERK_SECRET_KEY=your_clerk_secret_key
   ```

5. Install dependencies:
   ```bash
   npm install
   ```
6. Start the development server:
   ```bash
   npm run server
   ```

Do not stop server keep it running. Open a new terminal and follow the following commands.

7. Go to the frontend clone folder
   ```bash
   cd pz-expo
   ```

8. Set up environment variables:
   - Create a `.env` file in the root directory.
   - Add the following variables:
   ```
     EXPO_PUBLIC_API_URL=your_server_url
     EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
     EXPO_PUBLIC_CLERK_FRONTEND_API_URL=your_clerk_frontend_api_url
   ```
   Example of **your_server_url** like http://localhost:3000

9. Install dependencies:
   ```bash
   npm install
   ```

10. Start the development server:
   ```bash
   npm run start
   ```
