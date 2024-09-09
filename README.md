## Description

Full stack JavaScript application. Presents a game in which player tries to locate objects on a given image.

## Requirements

The following is .env requirement for the backend to work:

MONGODB - your MongoDB connection string <br>

.env file needs to be created in backend folder

## Installation
Clone the repository using the link on the repository page

cd into the repository folder and type:
```
cd frontend
npm install
npm run dev
```
in another terminal window type:
```
cd backend
npm install
```
create .env file with `touch .env` and add the following environment variable:
```
MONGODB="<your MongoDB connection string>"
```
and finally run the server with:
```
npm run dev
```
