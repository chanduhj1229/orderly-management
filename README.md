
# Order Management System

A full-stack application for managing products with logging functionality.

## Features

- Add, edit, and delete products
- View product listing with search and filter capabilities
- Activity logging for all product operations
- User authentication
- Responsive design for all screen sizes

## Tech Stack

### Frontend
- React.js
- Tailwind CSS
- Shadcn UI
- React Router
- React Query
- Framer Motion

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose

## Getting Started

### Prerequisites

- Node.js (v14 or newer)
- MongoDB (local instance or MongoDB Atlas)

### Installation

1. Clone the repository
```
git clone <repository-url>
```

2. Install frontend dependencies
```
npm install
```

3. Install backend dependencies
```
cd server
npm install
```

4. Create a `.env` file in the server directory with the following variables:
```
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/ordermanagement
```

### Running the Application

1. Start the backend server
```
cd server
npm run dev
```

2. Start the frontend development server
```
npm run dev
```

3. Open your browser and navigate to `http://localhost:3000`

## API Documentation

### Product Endpoints

- `GET /api/products` - Get all products
- `POST /api/products` - Create a new product
- `PUT /api/products/:id` - Update product by ID
- `DELETE /api/products/:id` - Delete product by ID

### Log Endpoints

- `GET /api/logs` - Get all activity logs

## License

This project is licensed under the MIT License - see the LICENSE file for details.
