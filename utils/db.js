// Todo: Setup database connection here
import { MongoClient } from "mongodb";

// กำหนด URL ของ MongoDB
const connectionString = "mongodb://localhost:27017";

// สร้าง instance ของ MongoClient
export const client = new MongoClient(connectionString, {});

// สร้าง instance ของฐานข้อมูลจาก MongoClient
export const db = client.db("backend");
