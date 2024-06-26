import mongoose, { Schema } from "mongoose";

const listingSchema = new mongoose.Schema({

    name: {
        type: String , 
        required: true
    },
    description: {
        type: String,
        required: true
    },
    address: {
        type: String , 
        required: true
    },
    regularPrice: {
        type: Number,
        required: true
    },
    discountedPrice: {
        type: Number , 
        required: true
    },
    bathrooms: {
        type: Number ,
        required: true
    },
    bedrooms: {
        type: Number ,
        required: true
    },
    furnished: {
        type: Boolean , 
        required: true
    },
    parking: {
        type: Boolean , 
        required: true
    },
    type: {
        type: String , 
        required: true
    },
    offer: {
        type: Boolean , 
        required: true
    },
    imageURLs: {
        type: Array , 
        required: true,
    },
    userRef: {
        type: Schema.Types.ObjectId ,
        ref: 'User'
    }


}, {timestamps: true})

const Listing = mongoose.model('Listing' , listingSchema);

export default Listing ;