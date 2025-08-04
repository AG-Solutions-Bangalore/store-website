import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Earth, Mail, MapPin, Phone } from "lucide-react";
import { useState } from "react";
import BASE_URL from "../../config/BaseUrl";
import { toast } from "sonner";
import useNumericInput from "../../hooks/useNumericInput";

const fetchCompanyData = async () => {
  const response = await axios.get(`${BASE_URL}/api/web-fetch-company`);
  return response.data;
};

const Contact = () => {
  const [mapLoaded, setMapLoaded] = useState(false);

  const [loader, setLoader] = useState(false);
  const [contactData, setContactData] = useState({
    fullname: "",
    mobile_no: "",
    email_id: "",
    description: "",
  });
const keyDown = useNumericInput()

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "mobile_no" && value && !/^\d*$/.test(value)) return;

    setContactData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };
  const validate = () => {
    const newErrors = {};
    if (!contactData.fullname.trim()) {
      newErrors.fullname = "Full name is required";
    }
    if (!contactData.email_id.trim()) {
      newErrors.email_id = "Email is required";
    }
    if (!contactData.mobile_no.trim()) {
      newErrors.mobile_no = "Mobile number is required";
    }
    return newErrors;
  };
  const { data } = useQuery({
    queryKey: ["companyData"],
    queryFn: fetchCompanyData,
  });

  const company = data?.data;

  const contactdata = [
    {
      title: "Mail & Website",
      icon: <Mail />,
      entries: [
        { icon: <Mail size={14} />, text: company?.support_email || "N/A" },
        { icon: <Earth size={14} />, text: "www.yourdomain.com" },
      ],
    },
    {
      title: "Contact",
      icon: <Phone />,
      entries: [
        { icon: <Phone size={14} />, text: company?.support_phone || "N/A" },
        {
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-[14px] h-[14px] text-[#4b5966] shrink-0"
              viewBox="0 0 32 32"
              fill="currentColor"
            >
              <path d="M16 0C7.164 0 0 7.163 0 16c0 2.82.735 5.601 2.126 8.049L0 32l8.265-2.086A15.902 15.902 0 0016 32c8.837 0 16-7.163 16-16S24.837 0 16 0zm0 29.333c-2.372 0-4.683-.619-6.72-1.792l-.48-.278-4.897 1.237 1.294-4.768-.313-.491a13.245 13.245 0 01-2.06-7.041c0-7.323 5.956-13.28 13.279-13.28 7.324 0 13.28 5.957 13.28 13.28 0 7.323-5.956 13.28-13.28 13.28zM23.61 19.373c-.327-.164-1.934-.955-2.235-1.065-.3-.11-.52-.164-.74.164s-.847 1.065-1.04 1.287c-.191.218-.382.246-.709.082-.327-.163-1.383-.509-2.637-1.622-.974-.867-1.633-1.934-1.825-2.26-.191-.327-.021-.503.145-.667.149-.148.327-.382.491-.573.164-.191.218-.327.327-.546.11-.218.055-.409-.027-.573-.082-.163-.74-1.788-1.015-2.456-.268-.644-.541-.558-.74-.568-.191-.008-.409-.01-.627-.01-.218 0-.573.082-.873.409-.3.327-1.144 1.117-1.144 2.726 0 1.609 1.172 3.164 1.337 3.383.164.218 2.309 3.523 5.6 4.942.783.337 1.393.538 1.869.686.784.25 1.496.215 2.057.13.627-.094 1.934-.79 2.209-1.552.273-.76.273-1.409.19-1.552-.082-.145-.3-.218-.627-.382z" />
            </svg>
          ),
          text: company?.support_whatsapp || "N/A",
        },
      ],
    },
    {
      title: "Address",
      icon: <MapPin />,
      entries: [
        {
          icon: <MapPin size={14} className="mt-1" />,
          text: <>{company?.store_address || "No address provided"}</>,
          multiline: true,
        },
      ],
    },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoader(true);
      const response = await axios.post(
        `${BASE_URL}/api/web-create-contact`,
        contactData
      );
      if (response.data.code == 201) {
        toast.success(
          response.data.message || "Sucessfully submited",
          "success"
        );
        setContactData({
          fullname: "",
          mobile_no: "",
          email_id: "",
          description: "",
        });
      } else {
        toast.error(response.data.message || "Failed to Submit", "error");
      }
    } catch (err) {
      toast.error(err || "Failed to Submit try again later", "error");
      setLoader(false);
    } finally {
      setLoader(false);
    }
  };
  return (
    <div className="max-w-[85rem] px-4 sm:px-6 md:px-10 lg:px-16 mx-auto py-[40px] mx:auto">
      <div className="w-full mb-6 flex flex-col items-center text-center">
        <h2 className="text-[#4b5966] font-semibold text-[22px] sm:text-[24px] md:text-[28px] leading-tight">
          Get In <span className="text-blue-900">Touch</span>
        </h2>

        <p className="mt-4 text-sm sm:text-base text-[#777] max-w-[480px]">
          Please select a topic below related to your inquiry. If you don't find
          what you need, fill out our contact form.
        </p>
      </div>

      <div className="p-[16px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ">
        {contactdata.map((item, idx) => (
          <div
            key={idx}
            className="py-[24px] px-[28px] bg-[#f8f8fb]  border-[1px] border-solid border-[#eee]  relative rounded-[5px] transition-all duration-[0.3s] ease-in-out"
          >
            <div className="flex flex-col justify-center items-center text-center">
              <div className="w-[70px] h-[70px] mb-[15px] bg-[#4b5966] flex justify-center items-center rounded-[5px] text-white">
                {item.icon}
              </div>
              <div>
                <h3 className="text-[20px] font-semibold text-[#4b5966] capitalize tracking-[0.01rem] leading-[1.2] mb-[6px]">
                  {item.title}
                </h3>
                {item.entries.map((entry, eIdx) => (
                  <p
                    key={eIdx}
                    className={`${
                      entry.multiline ? "items-start" : "items-center"
                    } flex justify-center gap-2 text-[14px] text-[#777] leading-[22px] font-light tracking-[0.02rem]`}
                  >
                    <span className="text-[#4b5966]">{entry.icon}</span>
                    {entry.text}
                  </p>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="pt-16 px-4 max-w-[1200px] mx-auto">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Map Section */}
          <div className="w-full lg:w-1/2 h-[300px] lg:h-auto relative">
            {!mapLoaded && (
              <div className="w-full h-full bg-gray-200 animate-pulse rounded-[5px]" />
            )}

            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3889.4708561108378!2d77.5934283757302!3d12.877416387429395!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae6b2e8944d60f%3A0x9b9d9e3e6d18fa40!2sLohiya&#39;s%20Kitchen!5e0!3m2!1sen!2sin!4v1754306791583!5m2!1sen!2sin"
              className={`w-full h-full border border-[#eee] rounded-[5px] transition-opacity duration-500 ${
                mapLoaded ? "opacity-100" : "opacity-0 absolute top-0 left-0"
              }`}
              allowFullScreen
              loading="lazy"
              onLoad={() => setMapLoaded(true)}
            />

          </div>

          <div className="w-full lg:w-1/2 ">
            <form className="space-y-8" onSubmit={handleSubmit}>
              <div>
                <input
                  type="text"
                  name="fullname"
       
maxLength={50}

                  value={contactData.fullname}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded-[4px] text-sm focus:outline-none focus:ring-2 ${
                    errors.fullname
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
                  }`}
                  placeholder="Full Name"
                />
                {errors.fullname && (
                  <p className="text-red-500 text-xs mt-1">{errors.fullname}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <input
                  type="email"
                  name="email_id"
              
maxLength={80}
                  value={contactData.email_id}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded-[4px] text-sm focus:outline-none focus:ring-2 ${
                    errors.email_id
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
                  }`}
                  placeholder="Email"
                />
                {errors.email_id && (
                  <p className="text-red-500 text-xs mt-1">{errors.email_id}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <input
                  type="text"
                  name="mobile_no"
                  minLength={10}
maxLength={10}
onKeyDown={keyDown}
                  value={contactData.mobile_no}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded-[4px] text-sm focus:outline-none focus:ring-2 ${
                    errors.mobile_no
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
                  }`}
                  placeholder="Phone"
       
                />
                {errors.mobile_no && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.mobile_no}
                  </p>
                )}
              </div>

              {/* Message */}
              <div>
                <textarea
                  name="description"
                  value={contactData.description}
                  onChange={handleChange}
                  rows="4"
                
maxLength={200}
                  className="w-full px-4 py-2 border border-gray-300 rounded-[4px] focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="Your message..."
                />
              </div>

              <button
                type="submit"
                className="bg-blue-900 text-white px-4 py-2 rounded-[4px] hover:bg-blue-600 text-sm cursor-pointer"
              >
                {loader ? "Saving Data .." : "Save"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
