const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
 

main()
.then((res)=>{
    console.log("connected to db");
}).catch((err)=>{
    console.log(err);
})
async function main(){
   await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

const initDb= async()=>{
    await Listing.deleteMany({});
      const listingsWithOwner = initData.data.map((obj) => ({
    ...obj,
    owner: "68593532201b32eb2eca3395", 
  }));
    await Listing.insertMany(listingsWithOwner);
    console.log("data was initilized");
}
initDb();
