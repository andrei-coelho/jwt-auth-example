import crypto from 'crypto'

interface header {
    alg:string,
    typ?:string
}

export default {

    gen: function(header:header, body:{}, salt:string){

        const h = Buffer.from(JSON.stringify(header)).toString('base64')
        const b = Buffer.from(JSON.stringify(body)).toString('base64')

        return `${h}.${b}.${crypto.createHmac(header.alg, salt).update(h+'.'+b).digest('base64')}`
    },

    verify: function(hash:string, salt:string){

        try {

            const parts  = hash.split('.')
            const header = JSON.parse(Buffer.from(parts[0], 'base64').toString('utf8'))
            
            const cripth = Buffer.from(
                crypto.createHmac(header.alg, salt)
                .update(parts[0]+'.'+parts[1])
                .digest('base64'), 'base64'
            ).toString('ascii')
    
            return (
                cripth
                == Buffer.from(parts[2], 'base64').toString('ascii')
                ?  JSON.parse(Buffer.from(parts[1], 'base64').toString('utf8'))
                :  false 
            )
    
        } catch(e){
            return false
        }
        
    }

}