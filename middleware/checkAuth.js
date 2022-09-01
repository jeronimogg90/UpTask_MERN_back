import jwt from "jsonwebtoken";
import Usuario from "../models/Usuario.js";

const checkAuth = async (req, res, next) => {
    let token;
    //Bearer es una convecion de tokens
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try{
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET)

            //Al asignarlo a request podemos acceder a el en otros sitios y con select - quitamos campos
            req.usuario = await Usuario.findById(decoded.id).select("-password -confirmado -token -createdAt -updatedAt -__v")
        } catch (error){
            return res.status(404).json({msg: 'Hubo un error'})
        }
    }

    if(!token){
        const error = new Error('Token no valido')
        return res.status(401).json({msg: error.message})
    }

    return next();
} 

export default checkAuth