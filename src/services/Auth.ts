import {  emailExists, getUserByEmail, saveUser } from './DataBase'
import Session from '../lib/session';
import { Response } from 'express';


class Auth {

    static async login(session:Session, res:Response, email:string, senha:string){

        if(!emailExists(email)){
            return {
                status:false,
                msg:"email não existe"
            }
        }

        let user = await getUserByEmail(email)
        if(user && user.senha == senha && session.open({nome: user.nome, email})){
            return {
                status:true,
                msg:user
            }
        }

        return {
            status:false,
            msg:"senha incorreta"
        }
    }

    static async save(nome:string, email:string, senha:string){

        let status = await saveUser(nome, email, senha)
        return {
            status:status,
            msg:""
        }

    }

    static logout(session:Session){
        session.close()
    }

}


export default Auth