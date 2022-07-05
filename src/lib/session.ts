import { Request, Response }  from 'express';
import jwt from "./jwt";
import { removeCookie, getCookie, setCookie } from './cookie'

const salt   = "secret_key"

class Session {

    private status = false
    private value:{} = {}
    private res:Response


    constructor(req:Request, res:Response){
        this.res = res
        const cookieVal = getCookie(req, 'sess')
        if(cookieVal){
            const val = jwt.verify(cookieVal, salt)
            if(val){
                this.status = true
                this.value = val
            }
        }
    }
    
    get(){
        return this.status ? this.value : false
    }

    open(value:{}){
        try {
            let v = jwt.gen({alg:'sha256'}, value, salt)
            setCookie(this.res, 'sess', v, 24)
            return true;
        } catch (error) {
            return false;
        }
    }

    close(){
        removeCookie(this.res, 'sess')
    }

}

export default Session