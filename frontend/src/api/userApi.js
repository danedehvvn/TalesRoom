import api from "./axiosInstance";

export async function fetchMyInfo() {
  const response = await api.get("/users/me");
  return response.data.data;
}

export async function updateMyInfo(body) {
  const response = await api.patch("/users/me", body);
  return response.data.data;
}

export async function fetchMyPosts(params) {
  const response = await api.get("/users/me/posts", { params });
  return response.data.data;
}

export async function fetchMyComments(params) {
  const response = await api.get("/users/me/comments", { params });
  return response.data.data;
}

export async function fetchHallOfFame() {
  const res = await api.get("/users/hall-of-fame");
  return res.data.data;
}