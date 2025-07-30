import React from "react";

const images = [
  "https://maraviyainfotech.com/projects/grabit-tailwind/grabit-tailwind/assets/img/blog/1.jpg",
  "https://maraviyainfotech.com/projects/grabit-tailwind/grabit-tailwind/assets/img/blog/2.jpg",
  "https://maraviyainfotech.com/projects/grabit-tailwind/grabit-tailwind/assets/img/blog/3.jpg",
  "https://maraviyainfotech.com/projects/grabit-tailwind/grabit-tailwind/assets/img/blog/4.jpg",
];

const BlogCard = () => {
  return (
    <div className="flex flex-wrap">
      {images.map((img, idx) => (
        <div
          key={idx}
          className="min-[992px]:w-1/3 min-[768px]:w-1/2 w-full px-3 mb-6"
        >
          <div className="bg-white rounded-[5px] mb-6 transition-all duration-300 ease-in-out shadow hover:shadow-md">
            <figure className="w-full relative overflow-hidden rounded-[5px] group">
              <a href="#">
                <img
                  src={img}
                  alt={`Blog ${idx + 1}`}
                  className="w-full h-auto object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
                />
              </a>
            </figure>

            <div className="p-4">
              <label className="block text-[13px] text-[#999] mt-5">
                January 25, 2022 -{" "}
                <a
                  href="#"
                  className="text-[#999] hover:text-[#5caf90] transition"
                >
                  Fastfood
                </a>
              </label>
              <h3 className="mt-2 mb-3 leading-[26px]">
                <a
                  href="#"
                  className="text-[17px] font-medium text-[#4b5966] leading-[22px] font-Poppins hover:text-[#5caf90] transition"
                >
                  Business ideas to grow your business.
                </a>
              </h3>
              <p className="text-[14px] text-[#777] mb-4">
                "Lorem Ipsum is simply dummy text of the printing and
                typesetting industry."
              </p>
              <div className="text-[13px]">
                <a
                  href="/blog-details"
                  className="text-[#4b5966] hover:text-blue-600 flex items-center transition"
                >
                  Read More
                  <i className="gicon gi-angle-double-right ml-1 text-[#4b5966]"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BlogCard;
