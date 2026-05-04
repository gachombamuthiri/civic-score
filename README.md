# 🇰🇪 CivicScore: Citizen Engagement & Reward Platform

![CivicScore Logo](/assets/civicscore_logo.png)


## Empowering Kenyan Citizens, Rewarding Civic Action

CivicScore is a pioneering web-based platform designed to revolutionize citizen engagement and compliance in Kenya. By introducing a transparent, incentive-based system, CivicScore aims to motivate active participation in community development and adherence to civic duties. The platform provides a centralized digital solution to track, verify, and reward positive civic behavior, fostering a more accountable and engaged citizenry.

## ✨ Key Features

*   **Role-Based Access Control (RBAC)**: Secure authentication and authorization for Citizens, Organizations, and Administrators using Clerk.
*   **Citizen Dashboard**: Personalized view for citizens to track their Civic Score, participation history, and tier progression.
*   **Organization Portal**: Dedicated interface for authorized organizations to create events, manage attendance, and monitor citizen engagement.
*   **Event Management**: Organizations can easily create, edit, and delete civic events, including details like category, location, date, and points reward.
*   **Attendance Tracking**: Robust system for organizations to mark attendance for events, ensuring accurate point allocation.
*   **Dynamic Points System**: Citizens earn points for verified civic actions, which contribute to their overall Civic Score and tier status.
*   **
**The Big Five Tier System**.
*   **Gamified Rewards**: A points-based reward mechanism that allows citizens to redeem incentives (e.g., discounts, vouchers) from participating businesses.
*   **Real-time Updates**: Instantaneous updates to Civic Scores and tier progression upon verification of activities.
*   **Data-driven Insights**: Analytics for organizations to understand participation trends and impact.

## 🦁 The Big Five Tier System

CivicScore employs a unique 
gamified tier system, inspired by Kenya's iconic 'Big Five' wildlife, to motivate continuous civic engagement. Citizens progress through these tiers by accumulating Civic Points, unlocking greater rewards and recognition.

| Tier             | Points Required | Description                                                                                             |
| :--------------- | :-------------- | :------------------------------------------------------------------------------------------------------ |
| **Buffalo**      | 0 - 499         | The starting point for every citizen, representing foundational engagement.                             |
| **Rhino**        | 500 - 999       | Demonstrating consistent participation and growing commitment to civic duties.                          |
| **Leopard Bronze** | 1000 - 2499     | A significant milestone, indicating active and impactful contributions to the community.                |
| **Lion Silver**  | 2500 - 4999     | Reserved for highly engaged citizens who are making a substantial difference in their communities.      |
| **Elephant Gold**| 5000+           | The pinnacle of civic engagement, recognizing exemplary and sustained contributions to national development. |

## 🚀 Technology Stack

CivicScore is built on a modern, robust, and scalable technology stack:

*   **Frontend**: [Next.js 15](https://nextjs.org/) (App Router) with [React](https://react.dev/) and [TypeScript](https://www.typescriptlang.org/)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/) for rapid and responsive UI development
*   **Authentication**: [Clerk](https://clerk.com/) for secure and flexible user authentication and role management
*   **Backend/Database**: [Firebase](https://firebase.google.com/) (Firestore for NoSQL database, Firebase Authentication for user management)
*   **Deployment**: [Vercel](https://vercel.com/) for seamless continuous deployment

## 🛠️ Getting Started

Follow these steps to set up and run CivicScore locally:

### Prerequisites

*   Node.js (v18 or higher)
*   npm or yarn
*   A Firebase Project with Firestore and Authentication enabled
*   A Clerk Account

### Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/gachombamuthiri/civic-score.git
    cd civic-score
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Environment Variables**:
    Create a `.env.local` file in the root of your project and add your Firebase and Clerk credentials:
    ```env
    NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
    NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
    NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_firebase_measurement_id

    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
    CLERK_SECRET_KEY=your_clerk_secret_key
    ```

4.  **Run the development server**:
    ```bash
    npm run dev
    # or
    yarn dev
    ```

    Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 🤝 Contributing

Contributions are welcome! Please feel free to fork the repository, create a new branch, and submit a pull request. For major changes, please open an issue first to discuss what you would like to change.

## 📞 Contact

For any inquiries, please contact [Agnes Muthiri Gachomba](amgachomba6@gmail.com).
