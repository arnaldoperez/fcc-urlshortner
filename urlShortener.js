const mongoose=require('mongoose');
const dotenv=require('dotenv').config()
const dns=require('dns')

mongoose.connect(process.env.MONGODB_URI),{useMongoClient:true};
var Schema=mongoose.Schema
var urlSchema=new Schema({
  cod:{type:Number, required:true,ref:"cod"},
  address:{type:String, required:true, ref:"address"}
})

var Url=mongoose.model('Url',urlSchema)

exports.newURL=(paramurl, callback)=>{
  paramurl=paramurl.includes("http://")?paramurl.replace("http://",""):paramurl
  paramurl=paramurl.includes("https://")?paramurl.replace("https://",""):paramurl
  dns.lookup(paramurl.split('/')[0],(err,address,family)=>{
    if (err)
    {
      callback({"error":"invalid URL"})
      return
    }
    Url.countDocuments({},(err,count)=>{
      if (err)
      {
        console.log(err)
        callback({"error":"Database error"})
        return
      }
      var myURL=new Url()
      myURL.cod=count
      myURL.address=paramurl
      myURL.save((err,data)=>{
      if (err)
      {
        console.log(err)
        callback({"error":"Database error"})
        return
      }
      callback(null,{
        "original_url":data.address,
        "short_url":data.cod
        })
      })
    })
  })
}

exports.getURL=(id,callback)=>{
  Url.findOne({cod:id},(err,data)=>{
    if (err)
      {
        console.log(err)
        callback({"error":"Database error while getting the url"})
      }
    else
      {
        callback(null,data)
      }
    
  })
}