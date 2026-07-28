import usersData from "../data/users.data.js";

export const UserModel = {
  findAll: () => {
    return usersData;
  },

  findById: (id) => {
    return usersData.find((u) => u.id === id);
  },
};
