import express, { Router, Request, Response } from "express";
import Session from "./lib/session";
import cookieParser from 'cookie-parser'
const router = Router();
import { body, validationResult } from 'express-validator';
import Auth from './services/Auth';


/**
 * rotas de serviço
 */
router.use(express.urlencoded({ extended: false}))
router.post(
    '/service/criar',
    body('email').isEmail(),
    body('senha').isLength({ min: 5 }), 
    body('nome').isLength({ min: 3 }), 
    async (req:Request, res:Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) { 
            res.redirect('/signup')
            return
        }

        let user = await Auth.save(
            req.body.nome,
            req.body.email,
            req.body.senha
        )

        if(user.status) res.redirect('/login')
        else res.redirect('/signup')
        
    }
)

router.use(cookieParser())
router.post(
    '/service/logar', 
    body('email').isEmail(),
    body('senha').isLength({ min: 5 }),
    
    async (req:Request, res:Response) => {
        
        const errors = validationResult(req);
        if (!errors.isEmpty()) { 
            res.redirect('/login')
            return
        }

        const session = new Session(req, res)

        let user = await Auth.login(
            session,
            res, 
            req.body.email, 
            req.body.senha
        )

        if(user.status) res.redirect('/')
        else res.redirect('/login')
    
    }
)

router.get('/service/logout', (req:Request, res:Response) => {
    const session = new Session(req, res)
    Auth.logout(session)
    res.redirect('/login')
})


/**
 * rotas de arquivo html
 */
router.use((req:Request, res:Response, next) => {
    const session = new Session(req, res)
    res.locals.session = session.get()
    next()
})

router.get('/login', (req:Request, res:Response) => res.sendFile(__dirname+'/view/login.html'))
router.get('/signup', (req:Request, res:Response) => res.sendFile(__dirname+'/view/signup.html'))
router.get('/', (req:Request, res:Response) => {
    const file = __dirname + (!res.locals.session ? '/view/login.html' : '/view/my_area.html')
    res.sendFile(file)
})

export default router