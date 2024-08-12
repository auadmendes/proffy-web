# Proffy

Proffy is a web platform designed to connect students with professors and teachers, 
allowing them to find the perfect class subjects they want to study. The project was developed during the Next Level Week #2 
(NLW#2) and has been enhanced with new features, including user login and dynamic class availability.

## Features

- **Student Portal**: 
  - Search and filter for classes by subject, weekday, or starting time.
  - Combine filters for a more precise search.
  
- **Teacher Portal**: 
  - Sign up as a professor/teacher by providing an email, social media links, and a bio.
  - Create new class subjects or choose existing ones.
  - Set availability for classes by day and time, with the flexibility to update it whenever needed.

- **API Integration**: 
  - The project connects to a custom-built API for data management and user authentication.

## Technologies Used

- **Frontend**:
  - [React](https://reactjs.org/) - A JavaScript library for building user interfaces.
  - [React Hook Form](https://react-hook-form.com/) - For handling form validation.
  - [React Router DOM](https://reactrouter.com/web/guides/quick-start) - For client-side routing.
  - [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework.
  - [Zod](https://zod.dev/) - For schema validation and error handling.

- **Backend**:
  - Custom API built to manage users, classes, and availability data.

- **Build Tools**:
  - [Vite](https://vitejs.dev/) - A fast build tool and development server.
  - [TypeScript](https://www.typescriptlang.org/) - A superset of JavaScript that adds static types.

- **Linting and Code Quality**:
  - [ESLint](https://eslint.org/) - For identifying and fixing problems in the JavaScript code.
  - [@typescript-eslint](https://typescript-eslint.io/) - ESLint plugins for TypeScript.
  - [Autoprefixer](https://github.com/postcss/autoprefixer) and [PostCSS](https://postcss.org/) - For processing CSS.

## Installation

To run this project locally, follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/proffy.git
2. Access the folder:
   ```bash
   cd proffy
3. Install dependencies:
   ```bash
   npm install
3. Get the API:
   ```bash
   [api](https://github.com/auadmendes/proffy-api/tree/main)
3. Run your project:
   ```bash
   npm run dev

