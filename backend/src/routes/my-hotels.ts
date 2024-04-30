import express, { Request, Response } from "express";
import multer from "multer";
import cloudinary from "cloudinary";
import { HotelType } from "../models/hotel";
import Hotel from "../models/hotel";
import verifyToken  from "../middleware/auth";
import { body } from "express-validator";
import exp from "constants";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, //5MB
  },
});

//api/my-hotels
router.get(
  "/",
  verifyToken, [
    body("name").notEmpty().withMessage("Name is required"),
    body("city").notEmpty().withMessage("City is required"),
    body("country").notEmpty().withMessage("Country is required"),
    body("description").notEmpty().withMessage("Description is required"),
    body("type").notEmpty().withMessage("Type is required"),
    body("pricePerNight").notEmpty().isNumeric().withMessage("Price per night is required and must be a number"),
    body("facilities").notEmpty().isArray().withMessage("Facilities is required and must be an array"),
  ],
  upload.array("imageFiles", 6),
  async (req: Request, res: Response) => {
    try {
        const imageFiles = req.files as Express.Multer.File[];
        const newHotel: HotelType = req.body;
        //1. Upload images to cloudinary

        const uploadPromises = imageFiles.map(async (image) => {
            const b64 = Buffer.from(image.buffer).toString("base64");
            let dataURI = "data:" + image.mimetype + ";base64," + b64;
            const res = await cloudinary.v2.uploader.upload(dataURI);
            return res.url;
        });

        const imageUrls = await Promise.all(uploadPromises);
        //2. If the images are uploaded successfully, add the Urls to the hotel object
        newHotel.imageUrls = imageUrls;
        newHotel.lastUpdated = new Date();
        //3. save the new hotel in our database
        const hotel = new Hotel(newHotel);
        await hotel.save();
        //4. Send the hotel object as a response
        res.status(200).send(hotel);

    } catch (error) {
        console.log("Error creating hotels: ", error);
        res.status(500).json({ message: "Something went wrong"});
    }
  }
);

export default router;
