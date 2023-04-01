const category=require('../models/Categories')
const { BaseError } = require('../libs');


const create=(data)=>category.create(data)
const update=(id,data)=>category.findByIdAndUpdate(id,data,{new:true})
const deleteCategory= async (id)=>{
const deletedcat= await category.findByIdAndDelete(id)
if(!deletedcat) throw new BaseError("Category not found",400)
return deletedcat
}
const get =()=>category.find()

module.exports={
    create,
    update,
    deleteCategory,
    get,
    
}