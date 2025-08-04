import {
  Apple,
  ChevronDown,
  ChevronUp,
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  PlaySquare,
  Twitter,
} from "lucide-react";
import { useState } from "react";
import { useCompanyData } from "../../hooks/useCompanyData";
import BASE_URL from "../../config/BaseUrl";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { encryptId } from "../../utils/Encyrption";
const fetchCategories = async () => {
  const response = await axios.get(`${BASE_URL}/api/web-fetch-category`);
  return response.data;
};

const Footer = () => {
  const [openSections, setOpenSections] = useState({
    category: false,

    quicklink: false,
    contact: false,
  });
  const {
    data: categoryData,
    isLoading: isCategoryLoading,
    error: categoryError,
  } = useQuery({
    queryKey: ["categoriesFooter"],
    queryFn: fetchCategories,
  });
  const navigate = useNavigate();

  const {
    storeName,
    storeDescription,
    storeLogoImage,
    supportEmail,
    supportPhone,
    storeAddress,
    appStoreUrl,
    googleStoreUrl,
    isLoading,
    error,
  } = useCompanyData();

  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <>
      <footer className="border-t  border-gray-200 pt-12 pb-4">
        <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="w-full flex flex-col lg:flex-row gap-4 mb-20 lg:mb-8">
            <div className="w-full lg:w-[25%] ">
              <div className="flex items-center mb-4">
                <div
                  className="flex-shrink-0 flex items-center cursor-pointer"
                  onClick={() => navigate("/")}
                >
                  <img
                    src={storeLogoImage}
                    alt="Lohiya's Logo"
                    className="h-10 w-auto"
                  />
                </div>
              </div>

              <p className="text-gray-600 text-sm mb-6 leading-relaxed">
            {storeDescription}
              </p>

              <div
               
                   
              className="flex flex-col md:flex-row items-center  justify-start gap-2">


                <a
                 href={googleStoreUrl}
                 target="_blank"
                rel="noreferrer"
                className="flex items-center bg-blue-900 text-white px-3 py-2 rounded-lg cursor-pointer hover:bg-blue-800 transition-colors w-full md:w-auto">
                  <PlaySquare className="mr-2" />
                  <div className="flex flex-col leading-tight">
                    <div
                  
                    className="text-[10px] uppercase">GET IT ON</div>
                    <div className="text-xs font-medium truncate">
                      Google Play
                    </div>
                  </div>
                </a>

                <a
                  href={appStoreUrl}
                     target="_blank"
                    rel="noreferrer"
                className="flex items-center bg-blue-900 text-white px-3 py-2 rounded-lg cursor-pointer hover:bg-blue-800 transition-colors w-full md:w-auto">
                  <Apple className="mr-2" />
                  <div className="flex flex-col leading-tight">
                    <div className="text-[10px] uppercase">DOWNLOAD ON</div>
                    <div className="text-xs font-medium truncate">
                      App Store
                    </div>
                  </div>
                </a>
              </div>
            </div>

            {/* Mobile Accordions */}
            <div className="w-full lg:hidden space-y-4">
              {/* Category Accordion */}
              <div className="border-b border-gray-200 pb-4">
                <button
                  className="w-full flex justify-between items-center text-base font-medium text-gray-900"
                  onClick={() => toggleSection("category")}
                >
                  <span>Categories</span>
                  {openSections.category ? (
                    <ChevronUp size={20} />
                  ) : (
                    <ChevronDown size={20} />
                  )}
                </button>
                <div
                  className={`mt-3 space-y-2 ${
                    openSections.category ? "block" : "hidden"
                  }`}
                >
                  {categoryData?.data?.map((category, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        const encryptedId = encryptId(category.id);
                        navigate(`/product/${encodeURIComponent(encryptedId)}`);
                      }}
                      className="block w-full text-left text-gray-600 hover:text-blue-600 transition-colors py-1"
                    >
                      {category.category_name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Links Accordion */}
              <div className="border-b border-gray-200 pb-4">
                <button
                  className="w-full flex justify-between items-center text-base font-medium text-gray-900"
                  onClick={() => toggleSection("quicklink")}
                >
                  <span>Quick Links</span>
                  {openSections.quicklink ? (
                    <ChevronUp size={20} />
                  ) : (
                    <ChevronDown size={20} />
                  )}
                </button>
                <div
                  className={`mt-3 space-y-2 ${
                    openSections.quicklink ? "block" : "hidden"
                  }`}
                >
                  <button
                    onClick={() => navigate("/products")}
                    className="block w-full text-left text-gray-600 hover:text-blue-600 transition-colors py-1"
                  >
                    Products
                  </button>
                  <button
                    onClick={() => navigate("/cart")}
                    className="block w-full text-left text-gray-600 hover:text-blue-600 transition-colors py-1"
                  >
                    View Cart
                  </button>
                  <button
                    onClick={() => navigate("/about")}
                    className="block w-full text-left text-gray-600 hover:text-blue-600 transition-colors py-1"
                  >
                    About us
                  </button>
                  <button
                    onClick={() => navigate("/terms-condition")}
                    className="block w-full text-left text-gray-600 hover:text-blue-600 transition-colors py-1"
                  >
                    Terms & Conditions
                  </button>
                  <button
                    onClick={() => navigate("/contact")}
                    className="block w-full text-left text-gray-600 hover:text-blue-600 transition-colors py-1"
                  >
                    Contact us
                  </button>
                  {/* <button
                    onClick={() => navigate("/compare")}
                    className="block w-full text-left text-gray-600 hover:text-blue-600 transition-colors py-1"
                  >
                 Compare
                  </button> */}
                  {/* <button
                    onClick={() => navigate("/order-status-checker")}
                    className="block w-full text-left text-gray-600 hover:text-blue-600 transition-colors py-1"
                  >
                    Order Status
                  </button> */}
                  <button
                    onClick={() => navigate("/recently-viewed")}
                    className="block w-full text-left text-gray-600 hover:text-blue-600 transition-colors py-1"
                  >
                    Recently Viewed 
                  </button>
                </div>
              </div>

              {/* Contact Accordion */}
              <div className="border-b border-gray-200 pb-4">
                <button
                  className="w-full flex justify-between items-center text-base font-medium text-gray-900"
                  onClick={() => toggleSection("contact")}
                >
                  <span>Contact</span>
                  {openSections.contact ? (
                    <ChevronUp size={20} />
                  ) : (
                    <ChevronDown size={20} />
                  )}
                </button>
                <div
                  className={`mt-3 space-y-3 ${
                    openSections.contact ? "block" : "hidden"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <MapPin className="flex-shrink-0 h-5 w-5 text-blue-900 mt-0.5" />
                    <span className="text-gray-600 text-sm">
                      {storeAddress}
                    </span>
                  </div>
                  <a
                    href={`tel:${supportPhone}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    <Phone className="flex-shrink-0 h-5 w-5 text-blue-900" />
                    <span className="text-sm">{supportPhone}</span>
                  </a>
                  <a
                    href={`mailto:${supportEmail}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    <Mail className="flex-shrink-0 h-5 w-5 text-blue-900" />
                    <span className="text-sm">{supportEmail}</span>
                  </a>
                  <div className="flex gap-3 pt-2">
                    {[Facebook, Twitter, Linkedin, Instagram].map(
                      (Icon, index) => (
                        <a
                          key={index}
                          // href="/"
                          // target="_blank"
                          rel="noreferrer"
                          className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 hover:bg-blue-900 hover:text-white transition-colors"
                        >
                          <Icon size={16} />
                        </a>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="hidden w-full lg:grid lg:grid-cols-4 lg:w-[75%] gap-2">
              <div className="lg:col-span-2">
                <h3 className="text-xl text-gray-900 mb-4">Category</h3>
                <hr className="mb-4 text-gray-200" />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Left column */}
                  <ul className="space-y-3">
                    {categoryData?.data?.slice(0, 5).map((category, index) => (
                      <li key={index}>
                        <button
                          onClick={() => {
                            const encryptedId = encryptId(category.id);

                            navigate(
                              `/product/${encodeURIComponent(encryptedId)}`
                            );
                          }}
                          className="text-gray-600 hover:text-blue-600 transition-colors cursor-pointer"
                        >
                          {category.category_name}
                        </button>
                      </li>
                    ))}
                  </ul>

                  {/* Right column */}
                  <ul className="space-y-3">
                    {categoryData?.data?.slice(5, 10).map((category, index) => (
                      <li key={index}>
                        <button
                          onClick={() => {
                            const encryptedId = encryptId(category.id);

                            navigate(
                              `/product/${encodeURIComponent(encryptedId)}`
                            );
                          }}
                          className="text-gray-600 hover:text-blue-600 transition-colors cursor-pointer"
                        >
                          {category.category_name}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* quicklink */}
              <div>
                <h3 className="text-xl  text-gray-900 mb-4">Quick Link</h3>
                <hr className="mb-4 text-gray-200" />
                <ul className="space-y-3">
                  <li>
                    <button
                      onClick={() => navigate("/products")}
                      className="text-gray-600 hover:text-blue-600 transition-colors cursor-pointer"
                    >
                      Products
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => navigate("/cart")}
                      className="text-gray-600 hover:text-blue-600 transition-colors cursor-pointer"
                    >
                      View Cart
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => navigate("/about")}
                      className="text-gray-600 hover:text-blue-600 transition-colors cursor-pointer"
                    >
                      About us
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => navigate("/blog")}
                      className="text-gray-600 hover:text-blue-600 transition-colors cursor-pointer"
                    >
                      Blog
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => navigate("/terms-condition")}
                      className="text-gray-600 hover:text-blue-600 transition-colors cursor-pointer"
                    >
                      Terms & conditions
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => navigate("/contact")}
                      className="text-gray-600 hover:text-blue-600 transition-colors cursor-pointer"
                    >
                      Contact us
                    </button>
                  </li>
                  {/* <li>
                    <button
                      onClick={() => navigate("/compare")}
                  
                      className="text-gray-600 hover:text-blue-600 transition-colors cursor-pointer"
                    >
                     Compare
                    </button>
                  </li> */}
                  {/* <li>
                    <button
                      onClick={() => navigate("/order-status-checker")}
                  
                      className="text-gray-600 hover:text-blue-600 transition-colors cursor-pointer"
                    >
                     Order Status
                    </button>
                  </li> */}
                  <li>
                    <button
                      onClick={() => navigate("/recently-viewed")}
                  
                      className="text-gray-600 hover:text-blue-600 transition-colors cursor-pointer"
                    >
                 Recently Viewed
                    </button>
                  </li>
                </ul>
              </div>

              {/* Contact */}
              <div>
                <h3 className="text-xl  text-gray-900 mb-4">Contact</h3>
                <hr className="mb-4 text-gray-200" />
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-5 h-5 text-blue-900 mt-0.5 flex-shrink-0" />
                    <div className="text-gray-600 text-sm">
                      <div>{storeAddress}</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-blue-900 flex-shrink-0" />
                    <a
                      target="_blank"
                      rel="noreferrer"
                      href={`tel:${supportPhone}`}
                      className="text-gray-600 hover:text-blue-600 transition-colors text-sm"
                    >
                      {supportPhone}
                    </a>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-blue-900 flex-shrink-0" />
                    <a
                      target="_blank"
                      rel="noreferrer"
                      href={`mailto:${supportEmail}`}
                      className="text-gray-600 hover:text-blue-600 transition-colors text-sm"
                    >
                      {supportEmail}
                    </a>
                  </div>

                  <div className="flex space-x-3 pt-2">
                    <a
                      // href="#"
                      // target="_blank"
                      rel="noreferrer"
                      className="w-8 h-8 bg-gray-600 text-white rounded flex items-center justify-center hover:bg-blue-600 transition-colors"
                    >
                      <Facebook size={16} />
                    </a>
                    <a
                      // href="#"
                      // target="_blank"
                      rel="noreferrer"
                      className="w-8 h-8 bg-gray-600 text-white rounded flex items-center justify-center hover:bg-blue-600 transition-colors"
                    >
                      <Twitter size={16} />
                    </a>
                    <a
                      // href="#"
                      // target="_blank"
                      rel="noreferrer"
                      className="w-8 h-8 bg-gray-600 text-white rounded flex items-center justify-center hover:bg-blue-600 transition-colors"
                    >
                      <Linkedin size={16} />
                    </a>
                    <a
                      // href="#"
                      // target="_blank"
                      rel="noreferrer"
                      className="w-8 h-8 bg-gray-600 text-white rounded flex items-center justify-center hover:bg-blue-600 transition-colors"
                    >
                      <Instagram size={16} />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Bottom */}
        </div>
      </footer>
      <div className=" bg-gray-100 border-t border-gray-200 pt-2 pb-2">
        <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-gray-600 text-sm text-center ">
            Copyright © <span className="text-blue-900">{storeName}</span> all
            rights reserved. Powered by{" "}
            <a
              href="https://ag-solutions.in/"
              target="_blank"
              rel="noreferrer"
              className="text-blue-900"
            >
              Ag-Solutions
            </a>
            .
          </div>
        </div>
      </div>
    </>
  );
};

export default Footer;

