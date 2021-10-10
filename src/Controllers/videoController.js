// const fakeData ={
//   name : "Dan",
//   loggedIn : true, 
// }

let videos = [
  {
    title: "First Video",
    rating: 5,
    comments: 2,
    createdAt: "2 minutes ago",
    views: 59,
    id: 1,
  },
  {
    title: "Second Video",
    rating: 5,
    comments: 2,
    createdAt: "2 minutes ago",
    views: 59,
    id: 2,
  },
  {
    title: "Third Video",
    rating: 5,
    comments: 2,
    createdAt: "2 minutes ago",
    views: 1,
    id: 3,
  },
];


export const trending = (req, res) => res.render("home",{pageTitle : "Home", videos});

export const watch = (req, res) =>{
  const {id} = req.params;
  const  video = videos[id-1];
  return res.render("watch" , {pageTitle: `Watching ${video.title}`, video });
};

export const getEdit = (req, res) => {
  const {id} = req.params;
  const  video = videos[id-1];
  return res.render("edit" , {pageTitle: `Editing ${video.title}`, video });
};

export const postEdit = (req,res) => {
  const {id} = req.params; //params - routed에서 :id //in ES6 grammer, 변수명과 param 이름 같게 하고 싶을 때 {} 사용
  const {title} = req.body; //req의 body부분에서 name이 title인 요소를 찾아 그 요소 정보 입력
  videos[id-1].title = title;
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