// const fakeData ={
//   name : "Dan",
//   loggedIn : true, 
// }
import Video from "../models/Video";

export const home = async (req, res) => {
  const videos = await Video.find({});
  return res.render("home", { pageTitle: "Home", videos });
};

export const watch = async(req, res) =>{
  const {id} = req.params;
  const video = await Video.findById(id);
  console.log(video);
  if(!video){
    return res.render("404", {pageTitle:"Video not found"});
  } else return res.render("watch" , {pageTitle: video.title, video});
};

export const getEdit = (req, res) => {
  const {id} = req.params;
  return res.render("edit" , {pageTitle: `Editing `});
};

export const postEdit = (req,res) => {
  const {id} = req.params; //params - routed에서 :id //in ES6 grammer, 변수명과 param 이름 같게 하고 싶을 때 {} 사용
  const {title} = req.body; //req의 body부분에서 name이 title인 요소를 찾아 그 요소 정보 입력
  return res.redirect(`/videos/${id}`); //제출 후 돌아갈 페이지
}

export const getUpload = (req, res) => {
  const {id} = req.params;
  return res.render("upload",{pageTitle:"Upload Video", id});
}

export const postUpload = async (req, res) => {
  const {title, description, hashtags} = req.body;
  try{
    await Video.create({
      title : title, //왼쪽은 스키마의 title, 오른쪽은 req.body의 title //but 같으므로 그냥 혼자 씀
      description,
      hashtags: hashtags.split(",").map((word) => `#${word}`),
    });
    return res.redirect("/");
  }catch(error){
    return res.render("upload", {pageTitle:"Upload Video",errorMessage : error._message,});
  }
};