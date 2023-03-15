import mongoose from "mongoose";

const DaycareSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    daycareType: { type: String, required: true },
    location: { type: String, required: false },
    price: { type: Number, required: true },
    photo: { type: String, required: true },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const daycareModel = mongoose.model("Daycare", DaycareSchema);

export default daycareModel;