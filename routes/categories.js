const router =require('express').Router();
const{categoriesController}=require('../controllers')
const {asycnWrapper}=require('../libs')
const { auth, isAdmin } =require('../middlewares')
const { BaseError } = require('../libs'); 
const { validation, CategoryValidator} = require('../middlewares/validation');

router.use(auth);
router.use(isAdmin);



router.post('/',validation(CategoryValidator.create),async (req,res,next)=>{
 const{body:{Name}}=req;
 const category= categoriesController.create({Name});
 const [err, data] = await asycnWrapper(category);
 if (err) return next(err);
 res.status(201).json({ message: 'success', category: data });
})

router.patch('/:id',validation(CategoryValidator.update),async(req,res,next)=>{
    const{Name}=req.body;
    const{id}=req.params;
    const category =  categoriesController.update({_id:id},{Name});
    const [err, data] = await asycnWrapper( category);
    if (err) return next(err);
    res.status(200).json({ message: 'success',  category: data });
})
router.delete('/:id',validation(CategoryValidator.delete),async(req,res,next)=>{
    const{id}=req.params;
    const category =  categoriesController.deleteCategory({_id:id});
    const [err, data] = await asycnWrapper(category);
    if (err) return next(err);
    res.status(200).json({ message: 'deleted' });
})
router.get('/' ,async(req,res,next) =>{
    const category =  categoriesController.get();
    const [err, data] = await asycnWrapper(category);
    if (err) return next(err);
    res.status(200).json({ message: 'success', category: data });
})
module.exports=router;