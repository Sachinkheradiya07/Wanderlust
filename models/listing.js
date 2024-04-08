const mongoose = require("mongoose");
const Review = require("./review");
const Schema = mongoose.Schema;

// const defaultImageUrl =
//   "https://www.justahotels.com/wp-content/uploads/2023/11/Weekend-Getaways-From-Goa.jpg";

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    url: String,
    filename: String,
  },

  price: Number,
  location: String,
  country: String,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  geometry: {
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ["Point"], // 'location.type' must be 'Point'
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
});

// listingSchema.pre("save", function (next) {
//   if (!this.image || !this.image.url) {
//     this.image = { url: defaultImageUrl };
//   }
//   next();
// });

listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
