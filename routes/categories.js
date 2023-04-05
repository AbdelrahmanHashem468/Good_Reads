const router =require('express').Router();
const{categoriesController}=require('../controllers')
const {asycnWrapper}=require('../libs')
const { auth, isAdmin } =require('../middlewares')
const { BaseError } = require('../libs'); 
const { validation, CategoryValidator} = require('../middlewares/validation');
const {isUser} = require('../middlewares/auth');


router.get('/popular', async (req, res, next) => {
    const [err, data] = await asycnWrapper(categoriesController.getPopular())
    if (err) return next(err);
    res.status(200).json({ message: 'success', categories: data });
});

router.use(auth);
router.get('/' ,async(req,res,next) =>{
    const limit = parseInt(req.query.limit);
    const page  = parseInt(req.query.page);
    const category =  categoriesController.get(limit,page);
    const [err, data] = await asycnWrapper(category);
    if (err) return next(err);
    res.status(200).json({ message: 'success', category: data });
})
router.get('/:id',isUser, validation(CategoryValidator.idParam), async (req, res, next) => {
    const { id } = req.params;
    const [err, data] = await asycnWrapper(categoriesController.getCategoryById(id));
    if (err) return next(err);
    res.status(200).json({ message: 'success', book: data });
})

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
router.delete('/:id',validation(CategoryValidator.idParam),async(req,res,next)=>{
    const{id}=req.params;
    const category =  categoriesController.deleteCategory({_id:id});
    const [err, data] = await asycnWrapper(category);
    if (err) return next(err);
    res.status(200).json({ message: 'deleted' });
})

module.exports=router;