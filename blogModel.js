var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var blogSchema = new Schema({
    created     : {type: Date, default:Date.now},
    lastModified: {type: Date, default:null},
    title     : {type:String, required:true},
    subTitle  : {type:String, default:''},
    textBlog    : {type:String, default:''},
    tags        : [],
    author      : {type:String, default:''},
});

mongoose.model('Blog', blogSchema);