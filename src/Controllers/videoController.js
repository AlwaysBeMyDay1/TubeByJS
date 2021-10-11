// const fakeData ={
//   name : "Dan",
//   loggedIn : true, 
// }
import Video from "../models/Video"

export const home = (req, res) => {
  console.log("Start");
  Video.find({}, (error, videos) => {
    console.log("Finished");
    return res.render("home", { pageTitle: "Home", videos });
  });
  console.log("I finish first");
};

export const watch = (req, res) =>{
  const {id} = req.params;
  return res.render("watch" , {pageTitle: `Watching`});
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

export const postUpload = (req, res) => {
  videos.push(req.body);
  return res.redirect("/");
}