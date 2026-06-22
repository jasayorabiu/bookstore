import 'dotenv/config';
import express from "express";
import bookRouter from "./routers/book.router";
import userRoutes from "./routers/user.router";
import orderRouter from "./routers/order.router";
import rateLimiter from "express-rate-limit";
import authenticateToken from "./middleware/authentication";
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './swagger';



const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const limiter = rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
});

app.use(limiter);
app.get('/', (req, res) => {
  res.send('Welcome to the Bookstore API');
});
app.use("/books", authenticateToken, bookRouter);
app.use("/users", userRoutes);
app.use("/orders", authenticateToken, orderRouter);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}: http://localhost:${PORT}`);
});