
import { Request, Response } from "express"

const getCookie = (req:Request, name:string) => {
    
    let val = req.cookies[name];
    if(val == undefined) return false;

    try {
        let test = JSON.parse(val);
        return test
    } catch (error) {
        return val;
    }

}

const setCookie = (res:Response, name:string, value:string, hours:number = 1) => {
    res.setHeader('Set-Cookie', [`${name}=${value};expires=${new Date(new Date().getTime()+(60 * 60 * hours)).toUTCString()}; sameSite=Strict; path=/`])
}

const removeCookie = (res:Response, name:string) => {
    res.setHeader('Set-Cookie', [`${name}=;expires=${new Date(0)}; sameSite=Strict; path=/`])
}

export {
    getCookie,
    setCookie,
    removeCookie
}