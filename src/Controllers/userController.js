import User from "../models/User";
import fetch from "node-fetch";
import bcrypt from "bcrypt";

export const getJoin = (req, res) => {
  return res.render("users/join", { pageTitle: "Join" });
};

export const postJoin = async (req, res) => {
  const { name, email, username, password, password2, location } = req.body;
  const exists = await User.exists({ $or: [{ username }, { email }] });
  if (password !== password2) {
    return res.status(400).render("users/join", {
      pageTitle: "Join",
      errorMessage: "Password confirmation does not match.",
    });
  }
  if (exists) {
    return res.status(400).render("users/join", {
      pageTitle: "Join",
      errorMessage: "This username or email is already taken.",
    });
  }
  try {
    await User.create({
      name,
      email,
      username,
      password,
      location,
    });
    return res.redirect("/login");
  } catch (error) {
    return res.status(400).render("users/join", {
      pageTitle: "Join",
      errorMessage: error._message,
    });
  }
};

export const getLogin = async (req, res) => {
  return res.render("users/login", { pageTitle: "Login" });
};

export const postLogin = async (req, res) => {
  const { username, password } = req.body;
  const pageTitle = "Login";
  //check if account exists
  const user = await User.findOne({ username, socialOnly: false });
  if (!user) {
    return res.status(400).render("users/login", {
      pageTitle,
      errorMessage: "An account with this username does not exists.",
    });
  }
  //check if password correct
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    return res.status(400).render("/users/login", {
      pageTitle,
      errorMessage: "Wrong Password.",
    });
  }
  req.session.loggedIn = true; //session을 초기화하는 두 줄,
  req.session.user = user; // 이 과정 없으면 uninitialized임
  return res.redirect("/");
  //localsMiddleware를 썼기에 함께 session object를 return 하지 않아도 pug 파일에서 session object 사용 가능
};

export const startGithubLogin = (req, res) => {
  const baseUrl = "https://github.com/login/oauth/authorize";
  const config = {
    client_id: process.env.GH_CLIENT,
    allow_signup: false,
    scope: "read:user user:email",
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  return res.redirect(finalUrl);
};

export const finishGithubLogin = async (req, res) => {
  const baseUrl = "https://github.com/login/oauth/access_token";
  const config = {
    client_id: process.env.GH_CLIENT,
    client_secret: process.env.GH_SECRET,
    code: req.query.code,
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  //↑↑↑↑ Github에서 준 code를 access token으로 바꾸는 과정

  const tokenRequest = await (
    await fetch(finalUrl, {
      method: "POST", //finalUrl에 POST 요청하기 위해 fetch로 '○데이터' 받아옴
      headers: {
        //json return 받기위해서는 이게 필요
        Accept: "application/json",
      },
    })
  ).json(); //그 '○데이터'에서 json 추출

  //↓↓↓ access_token으로 github api 사용해 user 정보 가져오는 과정 ↓↓↓
  if ("access_token" in tokenRequest) {
    //access api
    const { access_token } = tokenRequest; //assess_token을 json에서 꺼내서
    const apiUrl = "https://api.github.com";
    const userData = await (
      await fetch(`${apiUrl}/user`, {
        headers: {
          //access token을 주면 user 정보를 줌
          Authorization: `token ${access_token}`, //access_token을 fetch 안의 header로 보냄
        },
      })
    ).json(); //userData : github user 정보

    const emailData = await (
      await fetch(`${apiUrl}/user/emails`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    const emailObj = emailData.find(
      (email) => email.primary === true && email.verified === true
    );
    if (!emailObj) {
      return res.redirect("/login");
    }
    let user = await User.findOne({ email: emailObj.email });
    if (!user) {
      user = await User.create({
        avatarUrl: userData.avatar_url,
        name: userData.name ? userData.name : userData.login,
        username: userData.login,
        email: emailObj.email,
        password: "",
        socialOnly: true,
        location: userData.location,
      });
    }
    req.session.loggedIn = true;
    req.session.user = user;
    return res.redirect("/");
  } else {
    return res.redirect("/login");
  }
};

export const getEdit = async (req, res) => {
  return res.render("users/edit-profile", { pageTitle: "Edit User" });
};

export const postEdit = async (req, res) => {
  const {
    session: {
      user: { _id, username: usernameS, email: emailS }, //id는 mongo가 만들어줌, mongostore가 mongo를 세션과 연결해줌. => 세션을 몽고에 저장 가능
    },
    body: { name, email, username, location },
  } = req;

  //변경한 username, email이 중복된다면
  const pageTitle = "Edit User";
  let exist = [];
  if (username !== usernameS) {
    const usernameExists = await User.exists({ username });
    if (usernameExists) {
      exist.push("usernameExists");
    }
  }
  if (email !== emailS) {
    const emailExists = await User.exists({ email });
    if (emailExists) {
      exist.push("emailExists");
    }
  }
  if (exist.length > 0) {
    if (exist.length === 2) {
      return res.render("users/edit-profile", {
        pageTitle,
        errorMessage: "These email address & username already exist.",
      });
    } else if (exist.length == 1) {
      if (exist[0] == "usernameExists") {
        return res.render("users/edit-profile", {
          pageTitle,
          errorMessage: "This username already exist.",
        });
      } else if (exist[0] == "emailExists")
        return res.render("users/edit-profile", {
          pageTitle,
          errorMessage: "This email address already exist.",
        });
    }
  }

  const updatedUser = await User.findByIdAndUpdate(
    _id,
    {
      name,
      email,
      username,
      location,
    },
    { new: true }
  );

  req.session.user = updatedUser;
  // { ...req.session.user, name, email, username, location}
  // 이렇게 직접 넣을 수도 있지만 비효율적 (...req~ :기존이랑 동일하단 뜻)
  return res.redirect("edit");
};

export const logout = (req, res) => {
  req.session.destroy();
  return res.redirect("/");
};

export const getChangePW = (req, res) => {
  return res.render("users/change-pw", { pageTitle: "Change Password" });
};

export const postChangePW = async (req, res) => {
  const pageTitle = "Change Password";
  const {
    session: {
      user: { _id},
    },
    body: { current_pw, new_pw1, new_pw2 },
  } = req;

  const user = await User.findById(_id);//save 함수 실행 위해 user 찾기
  const ok = await bcrypt.compare(current_pw, user.password);
  if (!ok) {
    return res.status(400).render("users/change-pw", {
      pageTitle,
      errorMessage: "Wrong current password",
    });
  }
  if (new_pw1 !== new_pw2) {
    return res.status(400).render("users/change-pw", {
      pageTitle,
      errorMessage: "Password Confirmation Failed :(",
    });
  }
  
  user.password = new_pw1;
  user.save(); //save()로 pre save middleware 실행해서 hash한 후 저장해야함
  return res.redirect("/users/logout");
};

export const see = (req, res) => res.send("See User");
