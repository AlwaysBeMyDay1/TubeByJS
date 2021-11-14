// const fakeData ={
//   name : "Dan",
//   loggedIn : true,
// }
import Video from "../models/Video";
import User from "../models/User";
import { videoUpload } from "../middlewares";

export const home = async (req, res) => {
  const videos = await Video.find({})
    .sort({ createdAt: "asc" })
    .populate("owner");
  return res.render("home", { pageTitle: "Home", videos });
};

export const watch = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id).populate("owner");
  if (!video) {
    return res.render("404", { pageTitle: "Video not found" });
  } else return res.render("videos/watch", { pageTitle: video.title, video });
};

export const getEdit = async (req, res) => {
  const { id } = req.params;
  const { _id } = req.session;
  const video = await Video.findById(id);
  if (String(video.owner) !== String(_id)) {
    return res.status(403).redirect("/");
  }
  if (!video) {
    return res
      .status(404)
      .render("404", { pageTitle: `Video needs edit Not Found` });
  }
  return res.render("videos/edit", {
    pageTitle: `Editing ${video.title}`,
    video,
  });
};

export const postEdit = async (req, res) => {
  const {
    user: { _id },
  } = req.session;
  const { id } = req.params; //params - routed에서 :id //in ES6 grammer, 변수명과 param 이름 같게 하고 싶을 때 {} 사용
  //const {title} = req.body; //req의 body부분에서 name이 title인 요소를 찾아 그 요소 정보 입력
  const { title, description, hashtags } = req.body;
  const video = await Video.exists({ _id: id }); //return값이 boolean인 것이 find(return값 object)와 다름
  if (String(video.owner) !== String(_id)) {
    return res.status(403).redirect("/");
  }
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video Not Found" });
  }
  await Video.findByIdAndUpdate(id, {
    title,
    description,
    hashtags: Video.formatHashtags(hashtags),
  });
  return res.redirect(`videos/${id}`); //제출 후 돌아갈 페이지
};

export const getUpload = (req, res) => {
  return res.render("videos/upload", { pageTitle: "Upload Video" });
};

export const postUpload = async (req, res) => {
  const {
    body: { title, description, hashtags },
    file: { path: fileUrl },
    session: {
      user: { _id },
    },
  } = req;
  try {
    const newVideo = await Video.create({
      owner: _id,
      fileUrl,
      title, //왼쪽은 스키마의 title, 오른쪽은 req.body의 title //but 같으므로 그냥 혼자 씀
      description,
      hashtags: Video.formatHashtags(hashtags),
    });
    const user = await User.findById(_id);
    user.videos.push(newVideo._id);
    user.save();
    return res.redirect("/");
  } catch (error) {
    return res.status(400).render("videos/upload", {
      pageTitle: "Upload Video",
      errorMessage: error._message,
    });
  }
};

export const deleteVideo = async (req, res) => {
  const { id } = req.params;
  const {
    user: { _id },
  } = req.session;
  const video = await Video.findById(id);
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video Not Found :(" });
  }
  if (String(id) !== String(video.owner)) {
    return res.status(403).redirect("/");
  }
  await Video.findByIdAndDelete(id);
  return res.redirect("/");
};

export const search = async (req, res) => {
  const { keyword } = req.query;
  let videos = [];
  if (keyword) {
    videos = await Video.find({
      title: {
        $regex: new RegExp(`${keyword}$`, "i"),
      },
    }).populate("owner");
  }
  return res.render("videos/search", { pageTitle: "Search", videos });
};

export const registerView = async(req,res) => {
  const {id} = req.params;
  const video = await Video.findById(id);
  if(!video){
    return res.sendStatus(404);
  }
  video.meta.views=video.meta.views+1;
  await video.save();
  return res.sendStatus(200);
}
