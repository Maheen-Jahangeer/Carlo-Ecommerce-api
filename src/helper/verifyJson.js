import jwt from 'jsonwebtoken';

export const VerifyToken = (req,res,next) => {
    const authHeader = req.headers.token;
    if(authHeader){
        const token = authHeader.split(" ")[1]
        jwt.verify(token, process.env.JWTKEY,(err,user)=> {
            if(err) res.status(403).json('Token verification failed');
            req.user = user;
            next();
        })
    }else{
        res.status(500).json("Un authenticated")
    }
}

export const VerifyTokenAndAuthorization = (req,res,next) => {
    VerifyJson(req,res,() => {
        if(req.user._id === req.params.id || req.user.isAdmin){
            next()
        }else{
            res.status(400).json('Json verification failed')
        }
    })
}

export const VerifyTokenAndAdmin = (req,res,next) => {
    VerifyJson(req,res,() => {
        if(req.user.isAdmin){
            next()
        }else{
            res.status(400).json('Json verification failed')
        }
    })
}
