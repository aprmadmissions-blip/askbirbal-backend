# Ask Birbal - SaaS Chatbot Backend

This is the backend server for the "Ask Birbal" SaaS chatbot. It's built with Node.js and Express, and it uses the OpenAI API to provide chat functionality.

## Features

-   **Chat Endpoint**: A `/chat` endpoint that processes user queries.
-   **Subscription Plans**: Supports free and premium plans with different usage limits.
-   **Rate Limiting**: Enforces a daily limit of 3 questions for free users.
-   **Health Check**: A `/health` endpoint to monitor the server's status.
-   **CORS Enabled**: Configured to accept requests from a specific WordPress domain.

## Tech Stack

-   **Node.js**: JavaScript runtime environment.
-   **Express**: Web framework for Node.js.
-   **OpenAI API**: Used for the chat functionality (GPT-4o-mini).
-   **dotenv**: For managing environment variables.
-   **cors**: For enabling Cross-Origin Resource Sharing.

## Getting Started

### Prerequisites

-   Node.js (v14 or higher)
-   npm (or yarn)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <your-repo-url>
    cd ask-birbal-backend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root of the project by copying the example file:
    ```bash
    cp .env.example .env
    ```
    Then, open the `.env` file and add your OpenAI API key and allowed origins:
    ```
    PORT=3000
    OPENAI_API_KEY="your_openai_api_key_here"
    ALLOWED_ORIGINS="http://your-wordpress-site.com"
    ```

### Running the Server

-   **For development (with auto-reloading):**
    ```bash
    npm run dev
    ```

-   **For production:**
    ```bash
    npm start
    ```

The server will be running on `http://localhost:3000`.

## API Endpoints

-   `GET /health`: Checks the health of the server.
-   `POST /chat`: The main endpoint for the chatbot.

### `/chat` Endpoint

**Request Body:**
```json
{
  "userId": "some_wordpress_user_id",
  "plan": "free" | "premium_monthly" | "premium_yearly",
  "message": "Your question for the chatbot."
}
```

**Response:**
```json
{
  "reply": "The chatbot's response."
}
```

## Deployment on Render

This application is ready to be deployed on [Render](https://render.com/).

### Steps

1.  **Create a new "Web Service"** on Render and connect it to your Git repository.
2.  **Configure the service:**
    -   **Environment**: `Node`
    -   **Build Command**: `npm install`
    -   **Start Command**: `npm start`
3.  **Add Environment Variables:**
    In the "Environment" tab for your service, add the following variables:
    -   `OPENAI_API_KEY`: Your OpenAI API key.
    -   `ALLOWED_ORIGINS`: A comma-separated list of the domains you want to allow (e.g., `https://your-wordpress-site.com`).
    -   `PORT`: `3000` (or any port you prefer, Render will map it to 80/443).

Render will automatically deploy your application whenever you push changes to your repository.# askbirbal-backend
