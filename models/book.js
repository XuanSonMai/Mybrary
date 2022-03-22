const mongoose = require ('mongoose')
const coverImageBasePath = 'uploads/bookCovers'
const path = require('path')

const bookSchema = new mongoose.Schema ({
    title:{
        type:String,
        require:true
    },
    description:
    {
        type:String
    },
    publishDate:
    {
        type:Date,
        required:true
    },
    pageCount:
    {
        type:Number,
        required:true
    },
    createdAt:
    {
       type:Date,
       require:true,
    },
    coverImagename:
    {
        type:String,
        required:true
    },
    author:{
        type:String,
        required:true,
        ref:'Author'
    }
})

bookSchema.virtual('coverImagePath').get(function(){
    if(this.coverImagename!=null)
    {
     return path.join('/',coverImageBasePath,this.coverImagename)
    }
})

module.exports = mongoose.model('Book',bookSchema)
module.exports.BasePath = coverImageBasePath