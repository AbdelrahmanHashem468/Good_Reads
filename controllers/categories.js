const category=require('../models/Categories')
const { BaseError } = require('../libs');
const books=require('../models/Books')


const create=(data)=>category.create(data)
const update=(id,data)=>category.findByIdAndUpdate(id,data,{new:true})
const deleteCategory= async (id)=>{
const deletedcat= await category.findByIdAndDelete(id)
if(!deletedcat) throw new BaseError("Category not found",400)
return deletedcat
}
const get = async (limit,page) => {
    const categories = await category.paginate({}, {
        page: page || 1,
        limit: limit > 0 && limit < 10 ? limit : 10
    });
    return categories;
};

const getCategoryById = async(id) => {
    const cate = await category.findById(id);
    if (!cate) throw new BaseError('category not found',400);
    const book=books.find({categoryId:cate.id}).populate('authorId');
    return book;
}
module.exports={
    create,
    update,
    deleteCategory,
    get,
    getCategoryById
    
}