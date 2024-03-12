# About Spend Smart
Spend Smart is a comprehensive and interactive expense manager that helps you not just track and manage your income and expenses, but predicts your balance based on the income and expenses you have. Users can create independent accounts (cash, bank account, common account,...) to see the balance individually based on the incomes and expenses that the user added to the specific account. It shows user how much money they have to spend and throws a warning on all pages.

In this application, you can create multiple incomes and expenses across a wide variety of categories. You can even create unique categories for income and expense. Spend Smart helps you visualize your financial habits with beautiful bar, line, and pie charts as well as detailed views of each income or expense.

<img src="expense-manager-homepage" style="width: 300px; height: 400px;">

### Tech Stack
The project uses a combination of technologies for an optimized and user-friendly experience.

- **Frontend:** React (for building user interface), Next.js (for server-side rendering)
- **Backend:** Express.js (for handling requests, routing, and APIs), Node.js (runtime environment)
- **Database:** SQLite with Prisma ORM (Object-Relational Mapping)
- **Visualizations:** <a href="https://www.npmjs.com/package/recharts" >Recharts</a> library for visualization line, pie, and bar charts

### Features
#### Incomes and Expenses
- Create numerous income and expenses entries
- Create new categories for incomes and expenses
- Add incomes and expenses according to created categories
- Create individual accounts
- Show balance for every account independently

#### Data Visualization
- Visualize incomes and expenses in Bar and Pie Charts
- A detailed view of each income and expense entry
- Apply filters to entries based on the date

- <img src="expense-manager-incomes" style="width: 300px; height: 400px;"> -


#### Details Page for expense/income
- Line chart based on the income or expense over time
- Access comprehensive information about each income or expense
  
- <img src="expense-manager-detailpage" style="width: 300px; height: 400px;"> - 

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
npm should be installed in the *root, backend, and frontend directories*. Navigate to each directory and run the following command:
 `npm i` 
 
8. Run the application
Navigate back to the root directory and start both the backend and frontend concurrently:
`cd ../..`
`npm run dev`
This will start the application. You can now open your browser and navigate to http://localhost:3000 to see the application in action.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

#### Customizability 
- Switch between different theme colors (Red, Green, Purple & Blue)
- Opt for a dark theme for enhanced usability in low-light conditions

This application can help anyone keep a close watch on where their money is going and coming from, making it an excellent tool for financial management and planning.

The project is open-source and contributions are always welcomed.
Live demo:<a href="https://spend-smart-app.vercel.app/login"> Spend Smart App </a>
