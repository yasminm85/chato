import express from "express";
import cors from 'cors';
import 'dotenv/config';
import cookieParser from "cookie-parser";
import http from "http";
import { Server } from "socket.io";
import connectDB from "./config/mongodb.js";
import authRouter from "./routes/authRoutes.js";
import msgsRouter from "./routes/messageRoutes.js";
import { initSocket } from "./socket/socket.js";
import mongoSanitize from "express-mongo-sanitize";
import helmet from 'helmet';

const app = express();
const port = process.env.PORT || 4000;
connectDB();

const allowedOrigins = [
  'http://localhost:5173',
  'https://chato.sbs'
];

app.use((req, res, next) => {
    Object.defineProperty(req, 'query', {
        value: { ...req.query },
        writable: true,
        configurable: true,
        enumerable: true
    });
    next();
});
app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Blocked by CORS Security policy!'));
    }
  },
  credentials: true 
}));

app.get('/', (req, res) => res.send('API Working'));
app.use('/api/auth', authRouter);
app.use('/api/msgs', msgsRouter);

const server = http.createServer(app);
initSocket(server);

server.listen(port,() => console.log(`Server running at PORT ${port}`));




