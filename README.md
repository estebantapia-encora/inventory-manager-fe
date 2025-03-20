# Inventory Manager - Frontend

An Inventory Management System built with React, MaterialUI and Zustand.
## Table of Contents
- Features
- Tech Stack
- Installation
- Connecting to the Backend
- API Endpoints
- Running Tests
- Deployment
- License


## Features
- **Product Management:** Add, edit, delete, and search for products.
- **Stock Control:**
  - Mark products as "Out of Stock".
  - Unchecking the "Out of Stock" box restores stock to **10** by default.
- **Filtering & Sorting:**
  - Filter products by **name, category, and availability**.
  - **Two-column sorting** (Sort by multiple attributes).
- **Pagination Support:** 10 products per page.
- **User Interface:** Styled with **Material UI**.

## Tech Stack
- **Frontend:** React, TypeScript, Zustand (State Management), Material UI, Vite.
- **Backend:** Java, Spring Boot ([Backend Repository](https://github.com/estebantapia-encora/inventory-manager-be)).

## Installation
### **1. Clone the Repository**
- git clone https://github.com/estebantapia-encora/inventory-manager-fe.git
- cd inventory-manager-fe

### **2. Install Dependencies**
- npm install
- npm run dev
The application will be available at http://localhost:8080/.

## Connecting to the Backend
- Clone and start the Backend Repository (https://github.com/estebantapia-encora/inventory-manager-be)
- The Frontend will consume the backend API at http://localhost:9090/inventory/products/.

## API Endpoints used by the Frontend
METHOD |          ENDPOINT         |            DESCRIPTION            |
- GET     |  /products                :Fetches all products.             |
- POST    |  /products                : Adds a new product.               |
- PUT     |  /products{id}            : Edits a product.                  |
- DELETE  |  /products{id}            : Deletes a product.                |
- PUT     |  /products{id}/instock    : Restores product stock            |
- POST    |  /products{id}/outofstock : Marks a product as "out of stock" |

## Running Tests - To run unit tests for the frontend
 - npm run test

## Install Dependencies
 #Deployment - To build and deploy the frontend
 - npm run build

 ## License
 This project is licensed under the MIT License. https://opensource.org/license/mit
