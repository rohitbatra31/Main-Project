const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./reviews.js");

const listingSchema = new Schema({
    title : {
        type: String,
    },
    description : {
        type: String,
    
    },
    price : {
        type: Number,
      
    },
    location : {
        type: String,
      
    },
   
    image: {
       filename: String,
      url: String,
    },

    country :{
        type: String,
   
    },
    reviews:[{
          type : Schema.Types.ObjectId,
          ref : "Review"
    }],

    owner :{
     type : Schema.Types.ObjectId,
          ref : "User"
    }
});

listingSchema.post("findOneAndDelete",async(listing)=>{       // this middleware was made if once listing gets deleted the reviews which stored in db with that listings gets also deleted
if(listing){
    await Review.deleteMany({_id:{$in : listing.reviews}}) ; 
    console.log("i am working");
}
})

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;