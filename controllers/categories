const category=require('../models/Categories')

const create=(data)=>category.create(data)
const update=(id,data)=>category.findByIdAndUpdate(id,data,{new:true})
const del=(id)=>category.findByIdAndDelete(id)
const get =()=>category.find()

module.exports={
    create,
    update,
    del,
    get,
    
}