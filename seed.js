const mongoose = require("mongoose");
const Blog = require("./models/blog");

const blogs = [
  {
    author: "John",
    img: "https://images.unsplash.com/photo-1612423302018-97b08e4ac893?ixid=MnwxMjA3fDB8MHx0b3BpYy1mZWVkfDY5fEZ6bzN6dU9ITjZ3fHxlbnwwfHx8fA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=60",
    content:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem, nam temporibus nobis modi pariatur asperiores omnis laboriosam quia architecto praesentium consequuntur. Harum iure nihil, aperiam aut laudantium exercitationem debitis voluptatibus?",
  },
  {
    author: "Jonny",
    img: "https://images.unsplash.com/photo-1621252925354-9c677b11b890?ixid=MnwxMjA3fDB8MHx0b3BpYy1mZWVkfDkyfEZ6bzN6dU9ITjZ3fHxlbnwwfHx8fA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=60",
    content:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem, nam temporibus nobis modi pariatur asperiores omnis laboriosam quia architecto praesentium consequuntur. Harum iure nihil, aperiam aut laudantium exercitationem debitis voluptatibus?",
  },
  {
    author: "Sunny",
    img: "https://images.unsplash.com/photo-1543349689-9a4d426bee8e?ixid=MnwxMjA3fDB8MHx0b3BpYy1mZWVkfDE1NnxGem8zenVPSE42d3x8ZW58MHx8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=60",
    content:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem, nam temporibus nobis modi pariatur asperiores omnis laboriosam quia architecto praesentium consequuntur. Harum iure nihil, aperiam aut laudantium exercitationem debitis voluptatibus?",
  },
];

const seedDB = async () => {
  await Blog.insertMany(blogs);
  console.log("DB Seeded");
};

module.exports = seedDB;
