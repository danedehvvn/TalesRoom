import api from "./axiosInstance";

// S-01 검색어 자동완성
export async function fetchSearchSuggestions(keyword, signal) {
  const response = await api.get("/search/suggestions", {
    params: {
      q: keyword,
      limit: 5,
    },
    signal,
  });

  return response.data.data;
}
