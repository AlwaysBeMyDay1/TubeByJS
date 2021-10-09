const fakeData ={
  name : "Dan",
  loggedIn : true, 
}

const videos = [
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
    id: 1,
  },
  {
    title: "Third Video",
    rating: 5,
    comments: 2,
    createdAt: "2 minutes ago",
    views: 59,
    id: 1,
  },
];


export const trending = (req, res) => res.render("home",{pageTitle : "Home", fakeData, videos});

export const see = (req, res) => res.render("watch", {userId:`"${req.params.id}"`,fakeData});

export const edit = (req, res) => res.render("edit");

export const search = (req, res) => res.send("Search");

export const upload = (req, res) => res.send("Upload");

export const deleteVideo = (req, res) => {
  return res.send("Delete Video");
};