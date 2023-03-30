const router =require('express').Router();
const{categoriesController}=require('../controllers')
const { auth, isAdmin } =require('../middlewares')


router.use(auth);
router.use(isAdmin);

router.post('/',async (req,res,next)=>{
 const{body:{Name}}=req;
 const category=await categoriesController.create({Name});
 return res.json(category);
 next()
 
})

router.patch('/:id',async(req,res,next)=>{
    const{Name}=req.body;
    const{id}=req.params;
    const category = await categoriesController.update({_id:id},{Name});
    return res.json(category);
    next()
})
router.delete('/:id',async(req,res,next)=>{
    const{id}=req.params;
    const category = await categoriesController.del({_id:id});
    return res.json({message:'succesffully deleted'});
    next()
})
router.get('/' ,async(req,res,next) =>{
    const category = await categoriesController.get();
    return res.json(category);
    next()
})
module.exports=router;