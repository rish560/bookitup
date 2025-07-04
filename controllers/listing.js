const Listing = require("../models/listing.js");

module.exports.index = async(req,res)=>{
    let allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings});
}

module.exports.renderNewForm = (req,res)=>{
    res.render("listings/new.ejs");
}

module.exports.showListing = async (req,res)=>{
     let{id} = req.params;
     const listing  = await Listing.findById(id)
     .populate({path:"reviews", 
        populate:{
        path:"author",
     },
    })
     .populate("owner");
     if(!listing){
        req.flash("error","listing you requested for does not exist!");
        return res.redirect("/listings");    
     }
     res.render("listings/show.ejs",{listing});
}

module.exports.createListing = async(req,res)=>{
    let url = req.file.path;
    let filename = req.file.filename;
    
    const newListing = new Listing(req.body.listing);
     newListing.owner = req.user._id;
     newListing.image = {url,filename};
     await newListing.save();
     req.flash("success","new listing created!");
     res.redirect("/listings");    
}

module.exports.renderEditForm = async(req,res)=>{
    let{id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","listing you requested for does not exist!");
        return res.redirect("/listings");    
     }
     let originalImageUrl = listing.image.url;
     originalImageUrl = originalImageUrl.replace("/upload","/upload/w_250");
    res.render("listings/edit.ejs",{listing,originalImageUrl});
}

module.exports.updateListing = async(req,res)=>{
     let{id} = req.params;
     let listing = await Listing.findByIdAndUpdate(id,{ ...req.body.listing},{ runValidators: true });
     if( typeof req.file !== "undefined"){
     let url = req.file.path;
     let filename = req.file.filename;
     listing.image = {url,filename};
     await listing.save();
     }
     req.flash("success","listing updated!");
     res.redirect(`/listings/${id}`);
}

module.exports.destroyListing = async (req,res)=>{
    let{id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    req.flash("success","listing deleted!");
    res.redirect("/listings");
}
module.exports.filterByCategory = async (req, res) => {
  const { category } = req.params;
  const allListings = await Listing.find({ category });
  res.render("listings/index.ejs", { allListings });
};
module.exports.searchListings = async (req, res) => {
  const { q } = req.query;
  if (!q) {
    req.flash("error","no listing found!");
    return res.redirect("/listings");
  }

  const allListings = await Listing.find({
    country: { $regex: q, $options: "i" }, // case-insensitive match
  });
  
  if (allListings.length === 0) {
    req.flash("error", `No listings found for "${q}"`);
    return res.redirect("/listings");
  }
  res.render("listings/index.ejs", { allListings });

};
