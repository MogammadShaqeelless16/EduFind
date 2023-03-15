import Daycare from "../mongodb/models/daycare.js";
import User from "../mongodb/models/user.js";

import mongoose from "mongoose";
import * as dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const getAllDaycare = async (req, res) => {
    const {
        _end,
        _order,
        _start,
        _sort,
        title_like = "",
        daycareType = "",
    } = req.query;

    const query = {};

    if (daycareType !== "") {
        query.daycareType = daycareType;
    }

    if (title_like) {
        query.title = { $regex: title_like, $options: "i" };
    }

    try {
        const count = await Daycare.countDocuments({ query });

        const daycares = await Daycare.find(query)
            .limit(_end)
            .skip(_start)
            .sort({ [_sort]: _order });

        res.header("x-total-count", count);
        res.header("Access-Control-Expose-Headers", "x-total-count");

        res.status(200).json(daycares);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getDaycareDetail = async (req, res) => {
    const { id } = req.params;
    const daycareExists = await Daycare.findOne({ _id: id }).populate(
        "creator",
    );

    if (daycareExists) {
        res.status(200).json(daycareExists);
    } else {
        res.status(404).json({ message: "Daycare not found" });
    }
};

const createDayCare = async (req, res) => {
    try {
        const {
            title,
            description,
            daycareType,
            location,
            price,
            photo,
            email,
        } = req.body;

        const session = await mongoose.startSession();
        session.startTransaction();

        const user = await User.findOne({ email }).session(session);

        if (!user) throw new Error("User not found");

        const photoUrl = await cloudinary.uploader.upload(photo);

        const newDaycare = await Daycare.create({
            title,
            description,
            daycareType,
            location,
            price,
            photo: photoUrl.url,
            creator: user._id,
        });

        user.allDaycare.push(newDaycare._id);
        await user.save({ session });

        await session.commitTransaction();

        res.status(200).json({ message: "Daycare created successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateDaycare = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, daycareType, location, price, photo } =
            req.body;

        const photoUrl = await cloudinary.uploader.upload(photo);

        await Daycare.findByIdAndUpdate(
            { _id: id },
            {
                title,
                description,
                daycareType,
                location,
                price,
                photo: photoUrl.url || photo,
            },
        );

        res.status(200).json({ message: "Daycare updated successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteDaycare = async (req, res) => {
    try {
        const { id } = req.params;

        const daycareToDelete = await Daycare.findById({ _id: id }).populate(
            "creator",
        );

        if (!daycareToDelete) throw new Error("Daycare not found");

        const session = await mongoose.startSession();
        session.startTransaction();

        daycareToDelete.remove({ session });
        daycareToDelete.creator.allDaycare.pull(daycareToDelete);

        await daycareToDelete.creator.save({ session });
        await session.commitTransaction();

        res.status(200).json({ message: "Daycare deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export {
    getAllDaycare,
    getDaycareDetail,
    createDayCare,
    updateDaycare,
    deleteDaycare,
};