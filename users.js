const users = [];

const addUsers = ({ id, name, room }) => {
  name = name.trim().toLowerCase();
  room = room.trim().toLowerCase();

  const existingUser = users.find(
    (user) => user.room === room && user.name === name
  );
  if (existingUser) {
    return { error: "username taken" };
  }
  const newUser = { id: id, name: name, room: room };
  users.push(newUser);
  return { newUser };
};

const removeUsers = (id) => {
  const index = users.findIndex((user) => user.id === id);
  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};

const getUsers = (id) => users.find((user) => user.id === id);

const getUsersInRoom = (room) => users.filter((user) => user.room === room);

module.exports = { addUsers, removeUsers, getUsers, getUsersInRoom };
