const BlogDetails = () => {
  const articles = [
    {
      title: "The best fashion influencers.",
      image:
        "https://maraviyainfotech.com/projects/grabit-tailwind/grabit-tailwind/assets/img/blog/6.jpg",
      date: "February 10, 2021-2022",
      tag: "Organic",
    },
    {
      title: "Vogue Shopping Weekend.",
      image:
        "https://maraviyainfotech.com/projects/grabit-tailwind/grabit-tailwind/assets/img/blog/5.jpg",
      date: "March 14, 2021-2022",
      tag: "Fruits",
    },
    {
      title: "Fashion Market Reveals Her Jacket.",
      image:
        "https://maraviyainfotech.com/projects/grabit-tailwind/grabit-tailwind/assets/img/blog/4.jpg",
      date: "June 09, 2021-2022",
      tag: "Vegetables",
    },
    {
      title: "Summer Trending Fashion Market.",
      image:
        "https://maraviyainfotech.com/projects/grabit-tailwind/grabit-tailwind/assets/img/blog/3.jpg",
      date: "July 17, 2021-2022",
      tag: "Fastfood",
    },
    {
      title: "Winter 2021 Trending Fashion Market.",
      image:
        "https://maraviyainfotech.com/projects/grabit-tailwind/grabit-tailwind/assets/img/blog/2.jpg",
      date: "August 02, 2021-2022",
      tag: "Vegetables",
    },
  ];
  return (
    <section className="gi-blog py-10 max-w-[85rem]:py-[8]">
      <div className="flex flex-wrap justify-between items-start mx-auto min-[1600px]:max-w-[1600px] min-[1400px]:max-w-[1320px] min-[1200px]:max-w-[1140px] min-[992px]:max-w-[960px] min-[768px]:max-w-[720px] min-[576px]:max-w-[540px] relative">
        <div className="flex flex-wrap w-full">
          <div className="min-[992px]:w-1/3 w-full order-1 min-[768px]:order-2 px-3 mt-10 md:mt-0">
            <div className="p-[30px] border border-[#eee] rounded-[5px]">
              <form
                className="gi-blog-search-form flex items-center bg-white mb-6"
                action="#"
              >
                <input
                  type="text"
                  placeholder="Search Our Blog"
                  className="form-control block border border-[#eee] rounded-lg  w-full min-h-[48px] h-[48px] px-[20px] text-[16px] font-normal leading-[1] text-[#777] bg-transparent  outline-none tracking-[0]"
                />
              </form>
              <div className="mb-[30px]">
                <div className="border-b-[2px] border-[#eee] pb-[15px] mb-[6px]">
                  <h3 className="text-[18px] font-medium font-Poppins flex justify-between leading-[1.2]">
                    Recent Articles
                    <div>
                      <i className="gicon gi-angle-down" />
                    </div>
                  </h3>
                </div>
                <div>
                  {articles.map((article, index) => (
                    <div
                      key={index}
                      className="py-[15px] border-b border-[#eee] flex flex-row max-[1199px]:flex-col max-[991px]:flex-row"
                    >
                      <div className="mr-[15px] max-[1199px]:mb-[15px] max-[991px]:mb-[0]">
                        <img
                          src={article.image}
                          alt="blog"
                          className="w-[100px] rounded-[5px]"
                        />
                      </div>
                      <div>
                        <h5 className="leading-[1.2] mb-[6px]">
                          <a
                            href="blog-detail-left-sidebar.html"
                            className="text-[#777] text-[16px] tracking-[0] leading-[22px] font-semibold capitalize"
                          >
                            {article.title}
                          </a>
                        </h5>
                        <div className="mb-[10px] text-[14px] text-[#999] leading-[1] tracking-[0]">
                          {article.date}
                        </div>
                        <a
                          className="text-[14px] text-blue-900 leading-[20px] capitalize"
                        >
                          - {article.tag}
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="min-[992px]:w-2/3 w-full order-2 min-[768px] px-3">
            <div className="gi-blogs-content">
              <div className="gi-single-blog-item">
                <div className="single-blog-info">
                  <figure className="blog-img mb-4">
                    <a href="#">
                      <img
                        src="https://maraviyainfotech.com/projects/grabit-tailwind/grabit-tailwind/assets/img/blog/8.jpg"
                        alt="blog"
                        className="w-full rounded"
                      />
                    </a>
                  </figure>
                  <div className="single-blog-detail">
                    <label className="mb-4 text-gray-500 inline-block">
                      June 30,2022 -{" "}
                      <a href="#" className="hover:text-blue-600">
                        Organic
                      </a>
                    </label>
                    <h3 className="text-xl font-semibold text-[#4b5966] mb-2 leading-tight">
                      Marketing Guide: 5 Steps to Success.
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Lorem Ipsum is simply dummy text of the printing and
                      typesetting industry...
                    </p>
                    <p className="italic text-gray-600 text-sm font-medium mb-4">
                      The standard chunk of Lorem Ipsum used since the 1500s...
                    </p>
                    <p className="text-sm text-gray-600 mb-4">
                      Contrary to popular belief, Lorem Ipsum is not simply
                      random text...
                    </p>

                    <div className="flex flex-wrap -mx-3 mt-6">
                      <div className="w-full md:w-1/2 px-3 mb-6">
                        <img
                          src="https://maraviyainfotech.com/projects/grabit-tailwind/grabit-tailwind/assets/img/blog/3.jpg"
                          alt="blog"
                          className="w-full rounded"
                        />
                      </div>
                      <div className="w-full md:w-1/2 px-3 mb-6">
                        <img
                          src="https://maraviyainfotech.com/projects/grabit-tailwind/grabit-tailwind/assets/img/blog/4.jpg"
                          alt="blog"
                          className="w-full rounded"
                        />
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-4 leading-7">
                      It is a long established fact that a reader will be
                      distracted...
                    </p>
                    <p className="text-sm text-gray-600 mb-4 leading-7">
                      There are many variations of passages of Lorem Ipsum...
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-between items-center border-t border-gray-200 flex-wrap max-[575px]:flex-col">
                <span className="text-sm text-gray-600 mb-2">
                  Showing 1–6 of 20 items
                </span>
                <ul className="flex space-x-2">
                  {[1, 2, 3].map((page) => (
                    <li key={page}>
                      <a
                        href=""
                        className={`w-8 h-8 flex items-center justify-center rounded text-sm ${
                          page === 1
                            ? "bg-blue-900 text-white"
                            : "bg-gray-200 text-gray-700 hover:bg-blue-600 hover:text-white"
                        }`}
                      >
                        {page}
                      </a>
                    </li>
                  ))}
                  <li className="text-gray-600 px-2">...</li>
                  <li>
                    <a
                      href=""
                      className="w-8 h-8 flex items-center justify-center rounded bg-gray-200 text-gray-700 hover:bg-blue-600 hover:text-white"
                    >
                      8
                    </a>
                  </li>
                </ul>
              </div>

              <div className="mt-20 max-[575px]:mt-14">
                <h4 className="mb-6 p-3 bg-gray-100 rounded text-[#4b5966] font-semibold text-base">
                  Comments : 05
                </h4>

                <div className="flex mb-6">
                  <img
                    src="https://maraviyainfotech.com/projects/grabit-tailwind/grabit-tailwind/assets/img/user/1.jpg"
                    alt="user"
                    className="w-[50px] h-[50px] rounded mr-4"
                  />
                  <div>
                    <h5 className="text-[#4b5966] font-semibold text-sm">
                      John Deo
                    </h5>
                    <span className="text-xs text-gray-500">
                      October 14, 2018
                    </span>
                    <p className="text-sm text-gray-600 mt-2 mb-1">
                      Lorem ipsum dolor sit amet, consectetur adipisicing
                      elit...
                    </p>
                    <a href="#" className="text-sm text-blue-900">
                      Reply
                    </a>
                  </div>
                </div>

                {/* Comment 2 (nested) */}
                <div className="flex ml-16 max-[420px]:ml-8 mb-6">
                  <img
                    src="https://maraviyainfotech.com/projects/grabit-tailwind/grabit-tailwind/assets/img/user/2.jpg"
                    alt="user"
                    className="w-[50px] h-[50px] rounded mr-4"
                  />
                  <div>
                    <h5 className="text-[#4b5966] font-semibold text-sm">
                      Jenifer Lowes
                    </h5>
                    <span className="text-xs text-gray-500">
                      October 14, 2018
                    </span>
                    <p className="text-sm text-gray-600 mt-2 mb-1">
                      Lorem ipsum dolor sit amet, consectetur adipisicing
                      elit...
                    </p>
                    <a href="#" className="text-sm text-blue-900">
                      Reply
                    </a>
                  </div>
                </div>
              </div>

              {/* Leave a Reply */}
              <div className="mt-12">
                <h4 className="mb-6 p-3 bg-gray-100 rounded text-[#4b5966] font-semibold text-base">
                  Leave A Reply
                </h4>
                <form className="space-y-4">
                  <div className="flex flex-wrap -mx-3">
                    <div className="w-full md:w-1/2 px-3">
                      <input
                        type="text"
                        placeholder="Full Name"
                        className="w-full h-11 mb-4 px-4 border border-gray-200 rounded text-sm text-gray-600"
                      />
                    </div>
                    <div className="w-full md:w-1/2 px-3">
                      <input
                        type="email"
                        placeholder="Email Address"
                        className="w-full h-11 mb-4 px-4 border border-gray-200 rounded text-sm text-gray-600"
                      />
                    </div>
                  </div>
                  <div className="px-3">
                    <textarea
                      placeholder="Message"
                      className="w-full h-48 p-4 border border-gray-200 rounded text-sm text-gray-600"
                    ></textarea>
                  </div>
                  <div className="px-3">
                    <button
                      type="submit"
                      className="py-2 px-4 bg-blue-900 hover:bg-blue-600 text-white rounded text-sm font-medium"
                    >
                      Submit
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogDetails;
