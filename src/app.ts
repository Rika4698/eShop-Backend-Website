import express, { Application,  Request, Response } from 'express';
import cors from 'cors';
import config from './app/config';
import router from './app/routes';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import notFound from './app/middlewares/notFound';
import cookieParser from 'cookie-parser';


const app: Application = express();
app.use(cors({
    origin: 'https://eshop-frontend-website.vercel.app',
    credentials: true
}));
app.use(cookieParser());


//parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/api/v1', router);


app.get('/', (req: Request, res: Response) => {
    res.send({
        message: "Server is running..",
        environment: config.NODE_ENV,
        uptime: process.uptime().toFixed(2) + " sec",
        timeStamp: new Date().toISOString()
    })
});

app.use(globalErrorHandler);


app.use(notFound);


export default app;