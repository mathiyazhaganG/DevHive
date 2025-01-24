

const authdmin = (req,res,next)=>{
    const token='xyz';
    const isauth=token=='xyz'
    if(!isauth){
        res.status(401).send("not authorized");
}else{
    next();
}}
;
module.exports={
    authdmin
}