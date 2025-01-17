import path from 'path';
import express, { Application, Request, Response } from 'express';
import errorMiddleware from './middleware/err.middleware';
import config from './config';
import db from './database';
import { auth } from './controller/user.controller';

const app: Application = express();

//middlewares
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/view'));

//test database connection
db.connect()
    .then((client) => {
        return client
            .query('SELECT NOW()')
            .then((res) => {
                client.release();
                console.log(res.rows);
            })
            .catch((err) => {
                client.release();
                console.log(err.stack);
            });
    })
    .catch((err) => {
        console.log(err);
    });

//==================== Routes =====================

app.get('/login', (req: Request, res: Response) => {
    //throw new Error('');
    res.render('login');
});

app.get('/panal', (req: Request, res: Response) => {
    //throw new Error('');
    res.render('dashboard');
});

app.post('/panal', (req: Request, res: Response) => {
    //throw new Error('');
    res.render('dashboard');
});
app.post('/auth', auth);

//================================================

//Internal errors in the server
app.use(errorMiddleware);

//NOT FOUND ROUTES
app.use((_req: Request, res: Response) => {
    res.status(404).json({
        message: 'THAT IS WRONG ROUTE!!',
    });
});

const PORT = config.port || 3000;
app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
});

export default app;
