//우리 app의 생김새를 설명해줌
import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
    title: String,
    description: String,
    createdAt: Date,
    hastags:[{type: String}],
    meta:{
        views: Number,
        rating: Number,
    },
});

const Video = mongoose.model("Video", videoSchema);
export default Video;