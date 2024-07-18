# nextpalestine: The All-in-One Blogging Platform

[![GPL License](https://badgen.net/badge/license/GPL/blue)](https://www.gnu.org/licenses/gpl-3.0.html) ![npm](https://img.shields.io/badge/npm-v20%2B-blue) [![Codacy Badge](https://app.codacy.com/project/badge/Grade/eb217913062648a984f5bac092c1e5eb)](https://app.codacy.com/gh/adelpro/nextpalestine/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_grade)

Effortlessly create, manage, and publish captivating blog content with nextpalestine. Our platform empowers you to focus on writing and engaging your audience, leaving the technical complexities behind.

## Technology Stack and Tools

### Frontend

![Next.js](https://img.shields.io/badge/Next.js-black?logo=next.js&logoColor=white) ![React Query](https://img.shields.io/badge/React%20Query-FF4154?logo=reactquery&logoColor=fff) ![TailwindCSS](https://img.shields.io/badge/Tailwind%20CSS-%2338B2AC.svg?logo=tailwind-css&logoColor=white) ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=fff) [![Lexical Editor](https://badgen.net/badge/editor/Lexical%20Editor/purple)](https://example.com) ![2FA Enabled](https://badgen.net/badge/2FA%20Enabled/Yes/green) ![Client.js](https://badgen.net/badge/fingerprinting/Client.js/blue) [![Umami](https://badgen.net/badge/analytics/Umami/orange)](https://umami.is)

### Backend

![NestJS](https://img.shields.io/badge/NestJS-%23E0234E.svg?logo=nestjs&logoColor=white) ![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?logo=mongodb&logoColor=white) ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=fff) ![Swagger](https://img.shields.io/badge/Swagger-85EA2D.svg?logo=swagger&logoColor=black) ![2FA Enabled](https://badgen.net/badge/2FA%20Enabled/Yes/green) ![Client.js](https://badgen.net/badge/fingerprinting/Client.js/blue) [![Signoz](https://badgen.net/badge/monitoring/Signoz/blue)](https://signoz.io)

### DevOps and Deployment

![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=fff) ![Vercel](https://img.shields.io/badge/Vercel-%23000000.svg?logo=vercel&logoColor=white)

## Key Features

- **Seamless Content Creation**: Craft beautiful and engaging blog posts with a powerful lexical editor. Leverage rich media support for images and embeds to enhance your content.
- **Streamlined Publishing**: Effortlessly publish your content and manage your blog with a centralized and intuitive dashboard built with Next.js.
- **Robust User Management**:
  - **Secure User Accounts**: Ensure user trust and data protection with account validation via email. Users receive a confirmation email before their account is active, safeguarding your platform.
  - **Password Management**: Empower users to manage their accounts with confidence. Offer user-friendly "Forgot Password" functionality for regaining access and a secure "Reset Password" process for changing existing passwords, all facilitated through email communication.
- **NestJS-Powered Backend**: Enjoy a secure and scalable foundation for your blog, built with the powerful NestJS framework.
- **Engaging User Experience**: Captivate your audience with a customizable and user-friendly interface built with Next.js for optimal performance.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- **Node.js**: Install Node.js (including npm or Yarn) which is required to run the backend and frontend servers. Node.js serves as the runtime environment for your project. [Download Node.js](https://nodejs.org/)
- **MongoDB**: The platform uses MongoDB as its database. You'll need to have MongoDB installed on your local machine or have access to a MongoDB database. You can also opt for a cloud-based MongoDB service like MongoDB Atlas. [Install MongoDB](https://www.mongodb.com/try/download/community)
- **Git**: Git is used for version control and is necessary to clone the repository. [Download Git](https://git-scm.com/downloads)

For the backend:

- **NestJS**: A progressive Node.js framework for building efficient and scalable server-side applications. [Learn about NestJS](https://nestjs.com/)
- **JWT (JSON Web Tokens)**: Used for authentication, ensure you are familiar with JWTs and how they work in NestJS. [JWT Introduction](https://jwt.io/introduction/)
- **Cookies**: Knowledge of how cookies work in HTTP and their usage in authentication.
- **Swagger**: Used for API documentation. Familiarity with Swagger will help you understand and interact with the API endpoints. [Swagger Documentation](https://swagger.io/docs/)
- **Argon2**: A secure password hashing library. [Learn about Argon2](https://github.com/ranisalt/node-argon2)
- **Nodemailer**: A module for Node.js applications to send emails. [Nodemailer Documentation](https://nodemailer.com/about/)
- **Authentication**: Be aware of authentication mechanisms and how they are implemented in NestJS.
- **Sharp**: A module to convert large images in common formats to smaller, web-friendly JPEG, PNG, WebP, and AVIF images of varying dimensions. [Sharp Documentation](https://sharp.pixelplumbing.com/)
- **SigNoz**: A platform for monitoring and troubleshooting microservices-based applications. SigNoz provides out-of-the-box observability, including metrics, logs, and traces. [SigNoz Documentation](https://signoz.io/docs/)

For the frontend:

- **Lexical Editor**: An extensible text editor framework by Facebook. [Lexical GitHub Repository](https://github.com/facebook/lexical)
- **Client.js**: A library for browser fingerprinting. Useful if you're implementing security features based on device fingerprinting. [Client.js Documentation](https://clientjs.org/)
- **Tanstack Query (previously React Query)**: Hooks for fetching, caching, and updating asynchronous data in React. [Tanstack Query Documentation](https://tanstack.com/query/v4)
- **TailwindCSS**: A utility-first CSS framework used for designing custom user interfaces. [TailwindCSS Documentation](https://tailwindcss.com/docs)
- **Umami**: A fast and privacy-focused alternative to Google Analytics, used for website analytics. It respects your users' privacy and provides detailed insights without the need for tracking cookies. [Umami Documentation](https://umami.is/docs)

Please make sure to install and configure these prerequisites before running the nextpalestine platform.

## How to Use nextpalestine

### How to Run nextpalestine

> [!IMPORTANT]
> Important: DO NOT commit this file to your version control system (e.g., Git) for security reasons.

Here's a basic guide on getting started with nextpalestine:

1. **Clone the repository**: Use `git clone https://github.com/adelpro/nextpalestine.git` to clone the nextpalestine repository to your local machine.
2. **Install dependencies**: Navigate to the cloned directory and run `npm install` or `yarn install` to install all the required dependencies.
3. **Set up environment variables**: Create a `.env` file in the project root directory and define any necessary environment variables (e.g., database connection string, API keys, use the `env.example` file as a template). Important: DO NOT commit this file to your version control system (e.g., Git) for security reasons.
4. **Start the backend development server**: Run `npm run backend` or `yarn backend` to start the backend server. This will typically launch your backend application on `http://localhost:3500` by default.
5. **Start the frontend development server**: Run `npm run frontend` or `yarn frontend` to start the frontend server. This will typically launch your frontend application on `http://localhost:3540` by default.
6. **Start Both Servers**: Run `npm run dev` or `yarn dev` to start both the backend and frontend servers.

### Docker Deployment

> [!IMPORTANT]
> Important: DO NOT commit this file to your version control system (e.g., Git) for security reasons.

To deploy nextpalestine using Docker, follow these steps:

1. **Clone the repository**: Use `git clone https://github.com/adelpro/nextpalestine.git` to clone the nextpalestine repository to your local machine.

2. **Create a `.env` file**:
   Navigate to the ./frontend directory and create a .env file using the env.example file as a template.
   Navigate to the ./backend directory and create a .env file using the env.example file as a template.

3. **Build Docker images**:

   ```bash
   docker-compose build
   ```

4. **Run Docker containers**:

   ```bash
   docker-compose up
   ```

   This command will start both the backend and frontend services defined in your `docker-compose.yml` file.

5. **Access the application**: Open your browser and navigate to `http://localhost:3540` for the frontend and `http://localhost:3500` for the backend.

Ensure you have Docker and Docker Compose installed on your machine. [Install Docker](https://docs.docker.com/get-docker/)

## Contribute

We welcome contributions to the nextpalestine platform! If you have suggestions for improvements or new features, or if you've found a bug and want to report it, please follow these guidelines:

### Reporting Bugs

- **Use the Issue Tracker**: Go to the repository's [issue tracker](https://github.com/adelpro/nextpalestine/issues) and create a new issue.
- **Describe the Bug**: Provide a clear and concise description of what the bug is.
- **Steps to Reproduce**: List the steps to reproduce the behavior.
- **Expected Behavior**: Describe what you expected to happen.
- **Screenshots**: If applicable, add screenshots to help explain your problem.
- **Environment**: Include details about your environment, like the browser version, Node.js version, etc.

### Suggesting Enhancements

- **Submit an Issue**: Open a new issue in the repository's issue tracker.
- **Title**: Give a concise and descriptive title for the enhancement.
- **Detailed Description**: Provide a detailed description of the proposed feature or enhancement.
- **Additional Context**: Add any other context or screenshots about the feature request.

### Submitting Changes

- **Fork the Repository**: Fork the project to your own GitHub account.
- **Create a Branch**: Create a branch in your fork for your changes.
- **Make Your Changes**: Make the changes in your branch following the project's coding standards.
- **Test Your Changes**: Ensure that your changes do not break any existing functionality and that all tests pass.
- **Write a Good Commit Message**: Commit messages should be descriptive and mention the issue number if applicable.
- **Submit a Pull Request (PR)**: Open a PR to the main repository with a clear title and description.

### Pull Request Process

- Ensure that any install or build dependencies are removed before the end of the layer when doing a build.
- Update the README.md with details of changes to the interface, including new environment variables, exposed ports, useful file locations, and container parameters.
- Increase the version numbers in any examples files and the README.md to the new version that this Pull Request would represent.
- The project maintainers will review the PR and may request changes. Your PR will be merged once it receives an approval from a maintainer.

Thank you for your contributions – they make our project better!

## Thank you

[![Stargazers repo roster for @adelpro/nextpalestine](https://reporoster.com/stars/adelpro/nextpalestine)](https://github.com/adelpro/nextpalestine/stargazers)

[![Forkers repo roster for @adelpro/nextpalestine](https://reporoster.com/forks/adelpro/nextpalestine)](https://github.com/adelpro/nextpalestine/network/members)

## Sponsors

If you like this project, consider supporting me to continue developing and maintaining it!

[![BuyMeACoffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-ffdd00?&logo=buy-me-a-coffee&logoColor=black)](https://buymeacoffee.com/adelbenyahia) [![Ko-fi](https://img.shields.io/badge/Ko--fi-FF5E5B?logo=ko-fi&logoColor=white)](https://ko-fi.com/adelbenyahia) [![PayPal](https://img.shields.io/badge/PayPal-003087?logo=paypal&logoColor=fff)](https://www.paypal.com/paypalme/adelbenyahia)
