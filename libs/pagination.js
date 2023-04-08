const paginationOption = (pageSize,pageNumber,totaldocs) =>  {
    return  {
        "totalDocs" : totaldocs,
        "limit" : pageSize,
        "totalPages":Math.ceil(totaldocs/pageSize),
        "page": pageNumber,
        "pagingCounter": ((pageNumber-1)*pageSize)+1,
        "hasPrevPage": pageNumber > 1 && totaldocs ? true : false ,
        "hasNextPage": pageSize*pageNumber<totaldocs && totaldocs ? true : false,
        "prevPage": pageNumber > 1 ? pageNumber-1:null,
        "nextPage":pageSize*pageNumber<totaldocs ? pageNumber+1 :null
    }
}

module.exports = {
    paginationOption
} 