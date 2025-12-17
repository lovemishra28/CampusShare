# CampusShare - Component Lending & Project Showcase

CampusShare is a full-stack web application designed for university students to foster a collaborative and resourceful campus environment. It allows students to borrow and lend electronic components, showcase their personal projects, and build a reputation within the community.

![CampusShare Demo](./public//demo.png)
*A placeholder for a live demo screenshot.*

---

## ✨ Key Features

- **Component Marketplace**: Users can list components they are willing to lend (`GIVE`) or post requests for components they need (`TAKE`).
- **Transaction System**: A complete workflow for managing borrow/lend requests:
  - **Pending**: Initial state of a request.
  - **Active**: Request approved by the lender. Contact details are shared.
  - **Completed**: Item returned and transaction closed.
  - **Rejected**: Request declined by the lender.
- **User Authentication**: Secure user registration and login system using JWT stored in HTTP-only cookies.
- **Personalized Dashboard**: A central hub for users to manage their transactions, review requests, and track active exchanges.
- **User Profiles & Reputation**: Public user profiles showcasing their projects, inventory, and a **Reputation Score** that increases with positive community interactions.
- **Project Showcase**: A dedicated section for students to upload and document their personal projects, creating a portfolio of their work.
- **Dynamic Theming**:
  - Supports both **Light Mode** and **Dark Mode**.
  - The theme is easily customizable by changing CSS variables in a single file (`src/app/globals.css`).
- **Responsive Design**: A mobile-first design that works seamlessly across all devices.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
- **Authentication**: [JWT](https://jwt.io/) & [Bcrypt.js](https://www.npmjs.com/package/bcrypt)
- **Deployment**: [Vercel](https://vercel.com/)

---

## 🚀 Getting Started

Follow these instructions to get a local copy up and running.

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v18.x or later)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- A [MongoDB](https://www.mongodb.com/try/download/community) instance (local or cloud-based like MongoDB Atlas)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/borrow-project.git
    cd borrow-project
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Set up environment variables:**
    Create a file named `.env.local` in the root of your project and add the following variables.

    ```env
    MONGODB_URI=your_mongodb_connection_string
    JWT_SECRET=your_super_secret_jwt_key
    ```

    - `MONGODB_URI`: Your connection string for the MongoDB database.
    - `JWT_SECRET`: A long, random, and secret string used to sign the JSON Web Tokens.

### Running the Development Server

Execute the following command to start the server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## 🌐 Deployment

The easiest way to deploy this Next.js app is to use the [Vercel Platform](https://vercel.com/new).

- **Connect your Git repository** to Vercel.
- **Configure Environment Variables**: Add the `MONGODB_URI` and `JWT_SECRET` in the Vercel project settings.
- **Deploy**: Vercel will automatically build and deploy your application.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
