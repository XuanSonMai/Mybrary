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
    coverImageType:
    {
        type:String,
        required:true,

    },
    coverImage:
    {
        type:Buffer,
        required:true
    },
    author:{
        type:String,
        required:true,
        ref:'Author'
    }
})

bookSchema.virtual('coverImagePath').get(function(){
    if(this.coverImage!=null && this.coverImageType !=null)
    {
     return `data:${this.coverImageType};charset=utf-8;base64,
     ${this.coverImage.toString('base64')}`
    }
})

module.exports = mongoose.model('Book',bookSchema)
