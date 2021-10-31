// const fakeData ={
//   name : "Dan",
//   loggedIn : true, 
// }
import Video from "../models/Video";


export const home = async (req, res) => {
  const videos = await Video.find({}).sort({createdAt:"asc"});
  return res.render("home", { pageTitle: "Home", videos });
};


export const watch = async(req, res) =>{
  const {id} = req.params;
  const video = await Video.findById(id);
  if(!video){
    return res.render("404", {pageTitle:"Video not found"});
  } else return res.render("watch" , {pageTitle: video.title, video});
};


export const getEdit = async (req, res) => {
  const {id} = req.params;
  const video = await Video.findById(id);
  if(!video){
    return res.render("404", {pageTitle:`Video needs edit Not Found`});
  }
  return res.render("edit" , {pageTitle:`Editing ${video.title}`, video});
};


export const postEdit = async (req,res) => {
  const {id} = req.params; //params - routed에서 :id //in ES6 grammer, 변수명과 param 이름 같게 하고 싶을 때 {} 사용
  //const {title} = req.body; //req의 body부분에서 name이 title인 요소를 찾아 그 요소 정보 입력
  const {title, description, hashtags} = req.body;
  const video = await Video.exists({_id:id});
  if(!video){
    return res.render("404",{pageTitle:"Video Not Found"});
  }
  await Video.findByIdAndUpdate(id, {
    title,
    description,
    hashtags : Video.formatHashtags(hashtags),
  });
  return res.redirect(`/videos/${id}`); //제출 후 돌아갈 페이지
}


export const getUpload = (req, res) => {
  return res.render("upload",{pageTitle:"Upload Video"});
}


export const postUpload = async (req, res) => {
  const {title, description, hashtags} = req.body;
  try{
    await Video.create({
      title, //왼쪽은 스키마의 title, 오른쪽은 req.body의 title //but 같으므로 그냥 혼자 씀
      description,
      hashtags: Video.formatHashtags(hashtags),
    });
    return res.redirect("/");
  }catch(error){
    console.log(error);
    return res.render("upload", {pageTitle:"Upload Video",errorMessage : error._message,});
  }
};


export const deleteVideo = async (req,res)=>{
  const {id} = req.params;
  await Video.findByIdAndDelete(id);
  return res.redirect("/");
}


export const search = async (req, res) => {
  const { keyword } = req.query;
  let videos = [];
  if (keyword) {
    videos = await Video.find({
      title: {
        $regex: new RegExp(`${keyword}$`, "i"),
      },
    });
  }
  return res.render("search", { pageTitle: "Search", videos });
};