

const authdmin = (req,res,next)=>{
    const token='xy';
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