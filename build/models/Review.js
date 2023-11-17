"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const ReviewSchema = new mongoose_1.default.Schema({
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
    },
    score: {
        type: Number,
        max: 5,
        min: 1,
        default: 3,
    },
    desc: {
        type: String,
        max: 200,
    },
});
const Review = mongoose_1.default.model("Review", ReviewSchema);
exports.default = Review;