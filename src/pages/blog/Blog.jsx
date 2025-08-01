import React from "react";
import BlogCard from "../../components/Cards/BlogCard";
import BlogDetails from "./BlogDetails";

const Blog = () => {
  return (
    <div className="w-full py-12 ">
      <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8">
        {" "}
        <BlogCard />
      </div>
    </div>
  );
};

export default Blog;
