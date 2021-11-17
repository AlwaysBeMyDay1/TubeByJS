import monggose from "mongoose";

const commentSchema = new monggose.Schema({
    text :  {type:String, required:true},
    owner: {type:monggose.Schema.Types.ObjectId, required:true, ref:"User"},
    video : {type:monggose.Schema.Types.ObjectId, required:true, ref:"Video"},
    createdAt: {type : Date, required:true, default:Date.now},
});

const Comment = monggose.model("Comment", commentSchema);

export default Comment;