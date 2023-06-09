const category = require('../models/Categories')
const { BaseError } = require('../libs');
const books = require('../models/Books')

const create = (data) => category.create(data)
const update = (id, data) => category.findByIdAndUpdate(id, data, { new: true })
const deleteCategory = async (id) => {
  const deletedcat = await category.findByIdAndDelete(id)
  if (!deletedcat) throw new BaseError("Category not found", 400)
  return deletedcat
}
const get = async (limit, page) => {
  const categories = await category.paginate({}, {
    page: page || 1,
    limit: limit > 0 && limit < 10 ? limit : 10
  });
  return categories;
};

const getCategoryById = async(id,page,limit) => {
    const cate = await category.findById(id);
    if (!cate) throw new BaseError('category not found',400);
    const book= await books.paginate({categoryId:cate.id}, {
      page: page || 1,
      limit: limit > 0 && limit < 10 ? limit : 10,
      populate:[{ path:'authorId', select: 'firstName lastName' }]
    });
    return {book,cate};
}

const getPopular = async () => {
  const popularCategories = await books.aggregate([
    {
      $match: {
        ratingNumber: { $gt: 0 }
      }
    },
    {
      $project: {
        categoryId: 1,
        totalRating: 1,
        ratingNumber: 1,
        avgRate: { $divide: ["$totalRating", "$ratingNumber"] }
      }
    },
    {
      $sort: { avgRate: -1 }
    },
    {
      $lookup: {
        from: "categories",
        localField: "categoryId",
        foreignField: "_id",
        as: "category"
      }
    },
    {
      $group: {
        _id: null, // group by category name
        categories: { $addToSet: "$category" } // add categories to array
      }
    },
    {
      $project: {
        _id: 0,
        categories: { $slice: ["$categories", 5] }
      }
    }
  ])
  return popularCategories[0].categories;
};

module.exports = {
  create,
  update,
  deleteCategory,
  get,
  getCategoryById,
  getPopular
}