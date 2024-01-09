# Expense Manager

This project is a simple yet effective expense manager. Follow the steps below to set it up and run it on your local machine.

## Stacks

Before you begin, make sure you have the following installed:

- Node.js
- Git
- Prisma
- SQLite

## Setup
1. Clone the repository
Use the following command to clone the repository:
`git clone https://github.com/tannazma/expense-manager.git`

3. Set up the environment variable
You need to set the DATABASE_URL environment variable. Use the following command:
`export DATABASE_URL="file:./dev.db"`
This tells Prisma to use SQLite and the `dev.db` file in the current directory as the database.

3. Reset Prisma
Navigate to the `backend/prisma` directory and reset Prisma:
`cd backend/prisma`
`npx prisma db push --force-reset`

4. Run the seed script
Still in the `backend/prisma` directory, run the `seed.ts` file:
 `npx tsx seed.ts`

5. Run Prisma Studio
Start Prisma Studio to view and edit your database:
`npx prisma studio`
 
6. Install npm Packages
npm should be installed in the root, backend, and frontend directories. Navigate to each directory and run the following command:
 `npm i` 
 
8. Run the application
Navigate back to the root directory and start both the backend and frontend concurrently:
`cd ../..`
`npm run dev`
This will start the application. You can now open your browser and navigate to http://localhost:3000 to see the application in action.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
