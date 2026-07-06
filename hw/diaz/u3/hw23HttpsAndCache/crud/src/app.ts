import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';

import supplyRouter from './routes/supplyRoutes';
import patientRouter from './routes/patientRoutes';
import paymentRouter from './routes/paymentRoutes';
import userRouter from './routes/userRoutes';
import healthRouter from './routes/health.route';

const app = express();

app.set("json replacer", (key: string, value: unknown) => {
    return typeof value === "bigint"
        ? value.toString()
        : value;
});
app.use(cors());

app.use(express.json());

app.use(healthRouter);

app.use((req: Request, res: Response, next: NextFunction): void => {

    const apiKey = req.headers["x-api-key"];

    if (!apiKey || apiKey !== process.env.CRUD_API_KEY) {
        res.status(401).json({
            error: "Authentication failure"
        });
        return;
    }

    next();
});

app.use('/fabuladental',supplyRouter);
app.use('/fabuladental',patientRouter);
app.use('/fabuladental',paymentRouter);
app.use('/fabuladental',userRouter);

export default app;