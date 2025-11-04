import { fetchData } from "../utils.js";
import { setLoggedInUser, logInUrl, userUrl, avatarUrl } from "../variables.js";

export const logIn = async (userName, password) => {
  const option = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: userName,
      password: password,
    }),
  };
  try {
    const response = await fetchData(logInUrl, option);
    if (
      typeof response.token === "string" &&
      response.token.trim().length > 0 &&
      response.message === "Login successful"
    ) {
      await userInfoByToken(response.token);
      return true;
    }
  } catch (e) {
    console.log(e);
  }
};

export async function userInfoByToken(token) {
  const url = userUrl + "/token";
  const option = {
    method: "GET",
    headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
  };
  try {
    const data = await fetchData(url, option);
    let userAvatarUrl;
    if (data.avatar) {
      userAvatarUrl = avatarUrl + data.avatar;
    }
    setLoggedInUser({
      token: token,
      username: data.username,
      email: data.email,
      favouriteRestaurant: data.favouriteRestaurant ?? "",
      avatar: userAvatarUrl ?? ""
    });
  } catch (error) {}
}
