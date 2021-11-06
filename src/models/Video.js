//mongoose가 우리와 mongo를 연결하게끔 도와줌
//우리는 mongoose를 도와주기 위해 app의 생김새를 설명해줌
import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
    fileUrl: {type:String, required:true},
    title: {type : String, required:true, trim:true, maxlength:20},
    description: {type : String, required:true, trim:true, maxlength:80},
    createdAt: {type : Date, required:true, default:Date.now},
    hashtags:[{type: String, trim : true, }],
    meta:{
        views: {type:Number, default:0,required:true},
        rating: {type:Number, default:0,required:true},
    },
    owner: {type:mongoose.Schema.Types.ObjectId, required:true, ref:"User"}
    //mongooser에게 ↑위의 objectId가 model User에서 온다고 알려줌
});

videoSchema.static("formatHashtags", function(hashtags){
    return hashtags
        .split(",")
        .map((word)=>(word.startsWith("#")? word:`#${word}`));
});

const Video = mongoose.model("Video", videoSchema);
export default Video;