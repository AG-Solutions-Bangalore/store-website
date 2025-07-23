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
                Lohiya is the biggest market of grocery products. Get your daily
                needs from our store.
              </p>

              <div className="flex flex-col md:flex-row items-center  justify-start gap-2">
                <div className="flex items-center bg-blue-900 text-white px-3 py-2 rounded-lg cursor-pointer hover:bg-blue-800 transition-colors w-full md:w-auto">
                  <PlaySquare className="mr-2" />
                  <div className="flex flex-col leading-tight">
                    <div className="text-[10px] uppercase">GET IT ON</div>
                    <div className="text-xs font-medium truncate">
                      Google Play
                    </div>
                  </div>
                </div>

                <div className="flex items-center bg-blue-900 text-white px-3 py-2 rounded-lg cursor-pointer hover:bg-blue-800 transition-colors w-full md:w-auto">
                  <Apple className="mr-2" />
                  <div className="flex flex-col leading-tight">
                    <div className="text-[10px] uppercase">DOWNLOAD ON</div>
                    <div className="text-xs font-medium truncate">
                      App Store
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full lg:hidden space-y-4  ">
              {/* Category */}
              <div className="border-b border-gray-200 pb-4">
                <button
                  className="w-full flex justify-between items-center text-lg font-semibold text-gray-900"
                  onClick={() => toggleSection("category")}
                >
                  Category
                  {openSections.category ? (
                    <ChevronUp size={20} />
                  ) : (
                    <ChevronDown size={20} />
                  )}
                </button>
                <div
                  className={`mt-2 ${
                    openSections.category ? "block" : "hidden"
                  }`}
                >
                  <ul className="space-y-3">
                    {categoryData?.data?.map((category, index) => (
                      <li key={index}>
                        <button







                        onClick={() => 
                        {
                          const encryptedId = encryptId(category.id);
                          
                          navigate(`/product/${encodeURIComponent(encryptedId)}`)
                        }
                      
                      
                      
                      }

                      


                          className="text-gray-600 cursor-pointer hover:text-blue-600 transition-colors"
                        >
                          {category.category_name}
                        </button>
                      </li>
                    ))}
                   
                  </ul>
                </div>
              </div>

              {/* Quick link */}
              <div className="border-b border-gray-200 pb-4">
                <button
                  className="w-full flex justify-between items-center text-lg font-semibold text-gray-900"
                  onClick={() => toggleSection("quicklink")}
                >
                  Quick link
                  {openSections.quicklink ? (
                    <ChevronUp size={20} />
                  ) : (
                    <ChevronDown size={20} />
                  )}
                </button>
                <div
                  className={`mt-2 ${
                    openSections.quicklink ? "block" : "hidden"
                  }`}
                >
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
                           onClick={()=>navigate('/terms-condition')}
                        className="text-gray-600 hover:text-blue-600 transition-colors cursor-pointer"
                      >
                        Terms & conditions
                      </button>
                    </li>
                    <li>
                      <button
                                onClick={()=>navigate('/contact')}
                        className="text-gray-600 hover:text-blue-600 transition-colors cursor-pointer"
                      >
                        Contact us
                      </button>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Contact */}
              <div className="border-b border-gray-200 pb-4">
                <button
                  className="w-full flex justify-between items-center text-lg font-semibold text-gray-900"
                  onClick={() => toggleSection("contact")}
                >
                  Contact
                  {openSections.contact ? (
                    <ChevronUp size={20} />
                  ) : (
                    <ChevronDown size={20} />
                  )}
                </button>
                <div
                  className={`mt-2 ${
                    openSections.contact ? "block" : "hidden"
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <MapPin className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div className="text-gray-600 text-sm">
                        <div>{storeAddress}</div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Phone className="w-5 h-5 text-blue-600 flex-shrink-0" />
                      <a
                        href={`tel:${supportPhone}`}
                        className="text-gray-600 hover:text-blue-600 transition-colors text-sm"
                      >
                        {supportPhone}
                      </a>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Mail className="w-5 h-5 text-blue-600 flex-shrink-0" />
                      <a
                        href={`mailto:${supportEmail}`}
                        className="text-gray-600 hover:text-blue-600 transition-colors text-sm"
                      >
                        {supportEmail}
                      </a>
                    </div>

                    <div className="flex space-x-3 pt-2">
                      <a
                        href="#"
                        className="w-8 h-8 bg-gray-600 text-white rounded flex items-center justify-center hover:bg-blue-600 transition-colors"
                      >
                        <Facebook size={16} />
                      </a>
                      <a
                        href="#"
                        className="w-8 h-8 bg-gray-600 text-white rounded flex items-center justify-center hover:bg-blue-600 transition-colors"
                      >
                        <Twitter size={16} />
                      </a>
                      <a
                        href="#"
                        className="w-8 h-8 bg-gray-600 text-white rounded flex items-center justify-center hover:bg-blue-600 transition-colors"
                      >
                        <Linkedin size={16} />
                      </a>
                      <a
                        href="#"
                        className="w-8 h-8 bg-gray-600 text-white rounded flex items-center justify-center hover:bg-blue-600 transition-colors"
                      >
                        <Instagram size={16} />
                      </a>
                    </div>
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
                        onClick={() => 
                          {
                            const encryptedId = encryptId(category.id);
                            
                            navigate(`/product/${encodeURIComponent(encryptedId)}`)
                          }
                        
                        
                        
                        }
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
                        onClick={() => 
                          {
                            const encryptedId = encryptId(category.id);
                            
                            navigate(`/product/${encodeURIComponent(encryptedId)}`)
                          }
                        
                        
                        
                        }
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
                </ul>
              </div>

              {/* Contact */}
              <div>
                <h3 className="text-xl  text-gray-900 mb-4">Contact</h3>
                <hr className="mb-4 text-gray-200" />
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="text-gray-600 text-sm">
                      <div>{storeAddress}</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-blue-600 flex-shrink-0" />
                    <a
                      href={`tel:${supportPhone}`}
                      className="text-gray-600 hover:text-blue-600 transition-colors text-sm"
                    >
                      {supportPhone}
                    </a>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-blue-600 flex-shrink-0" />
                    <a
                      href={`mailto:${supportEmail}`}
                      className="text-gray-600 hover:text-blue-600 transition-colors text-sm"
                    >
                      {supportEmail}
                    </a>
                  </div>

                  <div className="flex space-x-3 pt-2">
                    <a
                      href="#"
                      className="w-8 h-8 bg-gray-600 text-white rounded flex items-center justify-center hover:bg-blue-600 transition-colors"
                    >
                      <Facebook size={16} />
                    </a>
                    <a
                      href="#"
                      className="w-8 h-8 bg-gray-600 text-white rounded flex items-center justify-center hover:bg-blue-600 transition-colors"
                    >
                      <Twitter size={16} />
                    </a>
                    <a
                      href="#"
                      className="w-8 h-8 bg-gray-600 text-white rounded flex items-center justify-center hover:bg-blue-600 transition-colors"
                    >
                      <Linkedin size={16} />
                    </a>
                    <a
                      href="#"
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
            Copyright © <span className="text-blue-600">Lohiya's</span> all
            rights reserved. Powered by{" "}
            <a href="https://ag-solutions.in/"  target="_blank"
    rel="noreferrer" className="text-blue-600">Ag-Solutions</a>.
          </div>
        </div>
      </div>
    </>
  );
};

export default Footer;
