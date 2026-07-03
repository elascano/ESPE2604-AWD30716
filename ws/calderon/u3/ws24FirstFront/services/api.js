import axios from "axios";

export const getDishes = async (url) => {
  const response = await axios.get(url);
  return response.data;
};