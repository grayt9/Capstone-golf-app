# Capstone Golf App

Capstone Golf App is a full-stack project for tracking golfers, courses, rounds, and hole-by-hole stats. The repository is split into a React frontend and an Express/MySQL backend.

## Project Structure

- `Backend/server.js`: Express API that handles login, signup, course lookup, round lookup, and round creation.
- `Frontend/golf-app/src/App.jsx`: Main frontend router that connects the login flow to the app screens.
- `Frontend/golf-app/src/Components`: Reusable React screens and UI building blocks.
- `GolfDatabaseCore.sql` and related SQL files: Database schema and seed/setup scripts for local development.

## How The App Flows

1. A user signs up or logs in from the frontend.
2. The backend validates credentials against the MySQL database.
3. After login, the frontend stores the returned `userId` in top-level React state.
4. The user can browse courses, choose one, and open the scorecard page.
5. The scorecard page collects hole-by-hole data and sends it to the backend.
6. The backend creates a round record first, then stores the per-hole statistics tied to that round.

## Frontend Notes

- Routing is handled with `react-router-dom`.
- Shared layout pieces like the page background and navbar are separated into their own components.
- Most current pages are structured and styled, with `Stats` and `Rounds` acting as placeholders for future data-driven features.

## Backend Notes

- The backend uses `express` for routing, `mysql2` for database access, `cors` for frontend communication, and `bcrypt` for password hashing.
- Database credentials are read from environment variables such as `MYSQLHOST`, `MYSQLUSER`, `MYSQLPASSWORD`, `MYSQLDATABASE`, and `MYSQLPORT`.
- A MySQL connection pool is used so multiple requests can be handled efficiently.

## Documentation Goal

Comments were added directly into the main source files to explain:

- what each component or route is responsible for
- how major blocks of logic fit into the user flow
- what data is being passed between the frontend and backend
- why specific steps exist, such as password hashing or round creation before hole insertion
