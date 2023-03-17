# Realtime Chat Application
![Conversation example](https://i.imgur.com/9wlRFc4.png)
## Project Description
This is the Realtime Chat Application project that I have built from the
ground up. It is used for realtime communication between people where
you can create conversations with many of different users. I have also integrated ChatGPT into this project, which allows you to create a conversation with artificial intelligence. This will help, for example, translate sentences into different languages, allowing you to communicate with people all over the world!
<br>
### Technologies used in the project:
Frontend:
  * Next.js
  * Chakra UI 
  * GraphQL Apollo Client.

Backend:
  + Nest.js
  + MySQL
  + Prisma
  + GraphQL
  + Websockets

## Installation & Setup
Before you try to run this project locally, you must have both the NextJS & NestJS project, as well as a SQL database. I use MySQL, but you can switch to another database like PostgreSQL very easily.
### Frontend Setup
1. Clone the repository.
2. Run npm install to install dependencies.
3. Create a .env.development file in the frontend-next directory and paste the following:

 ```
   DATABASE_URL= 
   NEXTAUTH_SECRET=
   GOOGLE_CLIENT_ID=
   GOOGLE_CLIENT_SECRET=
   ```
  - **`DATABASE_URL`** - The database url that consists of USERNAME, PASSWORD, HOST, PORT, NAME of your database, for example: mysql://root:mypassword@localhost:3306/wise_chat
  - **`NEXTAUTH_SECRET`** - Can be any string that can be used to encrypt & decrypt your tokens.
  - **`GOOGLE_CLIENT_ID`** - Google Client ID, which you can get from your google developer console, in order to use Google OAuth 2.0.
  - **`GOOGLE_CLIENT_SECRET`** - Google Client Secter, which you can get from your google developer console, in order to use Google OAuth 2.0.
Run npm run dev to start the project in development mode.
### Backend Setup
1. Run npm install to install dependencies.
2. Create a .env.development file in the backend-nest directory and paste the following:

 ```
   DATABASE_URL= 
   OPENAI_ORG_ID=
   OPENAI_API_KEY=
   ```
  - **`DATABASE_URL`** - The database url that consists of USERNAME, PASSWORD, HOST, PORT, NAME of your database, for example: mysql://root:mypassword@localhost:3306/wise_chat
  - **`OPENAI_ORG_ID`** - OpenAI API Organization ID, which you can get from your openAI api account settings.
  - **`OPENAI_API_KEY`** - OpenAI API API key which you can generate from your openAI api account settings.
Run npm run start:dev to start the project in development mode.
<br>
Then go to the http://localhost:3000 pass the google oauth and use the application.

## Improvements and additions
I want to emphisize that this is only a MVP version of the project, meaning, there may be some bugs and flaws. 
However, I will work on improving the project, adding new features and fixing bugs.
<br>
### Basic Plan for Project Improvement:
  * Add the ability to edit the conversation.
  * Add the ability to send files in messages.
  * Add different providers for authorization, such as Facebook, Linkedin, Github and so on, also add local authorization.
  * Implement audio and video calls.
