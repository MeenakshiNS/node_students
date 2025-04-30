class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString };
    // console.log(queryObj);
    const excludedFields = ["page", "sort", "limit", "fields"];
    // console.log(queryObj['class']);
    excludedFields.forEach((el) => delete queryObj[el]);
    // console.log("Object.keys(queryObj)",Object.keys(queryObj));
    // { class: '8', 'marks[$gt]': '70'

    //ADV FILTERING
    let finalQuery = {};
    for (const key of Object.keys(queryObj)) {
      const field = key.match(/^[^\[]+/)?.[0]; // e.g., 'price' from 'price[lt]'
      const operator = key.match(/(?<=\[)(gt|gte|lt|lte)(?=\])/i)?.[0]; // e.g., 'lt'
      // console.log("field",field);
      // console.log("operator",operator);
      if (field && operator) {
        if (!finalQuery[field]) finalQuery[field] = {};
        finalQuery[field][`$${operator}`] = isNaN(queryObj[key])
          ? queryObj[key]
          : Number(queryObj[key]);
      } else {
        finalQuery[key] = isNaN(queryObj[key])
          ? queryObj[key]
          : Number(queryObj[key]);
      }
    }
    // console.log("Final Query Object =>", finalQuery);

    //BUILD QUERY
    this.query = this.query.find(finalQuery);
    // console.log(".....",this.query.sort);
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }
    return this;
  }

  project() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select("-__v");
    }
    return this;
  }

  paginate() {
    if (this.queryString.page && this.queryString.limit) {
      const page = this.queryString.page*1||1;
      const limit = this.queryString.limit*1||10;
      const skip = (page - 1) * limit;
      this.query = this.query.skip(skip).limit(limit);
      // Get total count of documents
      //  const totalDocuments = await Student.countDocuments();
      //  if(skip>totalDocuments){
      //   return res.status(400).json({message:"Invalid page number"});
      //  }else{
      //   query=query.skip(skip).limit(limit);
      //  }
    } else {
      this.query = this.query.skip(0).limit(10);
    }
    return this;
  }
}

module.exports = APIFeatures;
