import React from 'react'
import InfoCard from '../../components/Cards/InfoCard'


const AboutUs = () => {
  return (
    <div className="w-full py-12 ">
      <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Left side - Images */}
          <div className="grid grid-cols-2 gap-4 h-full">
            {/* First column - Full height image */}
            <div className="h-full bg-gray-200 rounded-md overflow-hidden">
              <img 
                src="https://maraviyainfotech.com/projects/grabit-tailwind/grabit-tailwind/assets/img/common/about.png" 
                alt="Market interior with customers" 
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Second column - Two images stacked */}
            <div className="grid grid-cols-1 gap-4 h-full">
              {/* Top right image */}
              <div className="h-full bg-gray-200 rounded-md overflow-hidden">
                <img 
                  src="https://maraviyainfotech.com/projects/grabit-tailwind/grabit-tailwind/assets/img/common/about-2.png" 
                  alt="Farmer harvesting tomatoes" 
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Bottom right image */}
              <div className="h-full bg-gray-200 rounded-md overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
                  alt="Greenhouse interior" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Right side - Content */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 sm:mb-6">
                Who We <span className="text-blue-500">Are?</span>
              </h2>
              
              <p className="text-md font-medium text-gray-600 mb-4 sm:mb-6 uppercase tracking-wide leading-relaxed">
                WE'RE HERE TO SERVE ONLY THE BEST PRODUCTS FOR YOU. ENRICHING YOUR HOMES WITH THE BEST ESSENTIALS.
              </p>
            </div>

            <div className="space-y-3 sm:space-y-4 text-gray-500 leading-relaxed">
              <p className="text-sm text-gray-500 leading-relaxed">
                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.
              </p>
              
              <p className="text-sm text-gray-500 leading-relaxed">
                Lorem Ipsum has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.
              </p>
              
              <p className="text-sm text-gray-500 leading-relaxed">
                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
              </p>
            </div>
          </div>
        </div>

        <div className="mb-6 md:mb-8 mt-8 md:mt-12 flex flex-col items-center justify-between gap-3 md:gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl text-center font-medium text-gray-900">
              Our <span className="text-blue-900">Services</span>
            </h2>
            <p className="text-gray-600 text-center mt-1 md:mt-2 text-sm md:text-base">
            Customer service should not be a department. It should be the entire company.


            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <InfoCard 
            icon={
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <path d="M19 7h-3V6a4 4 0 0 0-8 0v1H5a1 1 0 0 0-1 1v11a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V8a1 1 0 0 0-1-1ZM10 6a2 2 0 0 1 4 0v1h-4V6Z"/>
                <path d="M12 13v4"/>
                <path d="m8 21 8-8"/>
              </svg>
            }
            title="Free Shipping"
            subtitle1="Free shipping on all US order or"
            subtitle2="order above $200"
          />
          
          <InfoCard 
            icon={
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/>
                <path d="M8 11h8"/>
                <path d="M8 15h8"/>
              </svg>
            }
            title="24X7 Support"
            subtitle1="Contact us 24 hours a day, 7"
            subtitle2="days a week"
          />
          
          <InfoCard 
            icon={
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                <path d="M3 3v5h5"/>
              </svg>
            }
            title="30 Days Return"
            subtitle1="Simply return it within 30 days"
            subtitle2="for an exchange"
          />
          
          <InfoCard 
            icon={
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 6v6l4 2"/>
              </svg>
            }
            title="Payment Secure"
            subtitle1="Contact us 24 hours a day, 7"
            subtitle2="days a week"
          />
        </div>

      </div>
    </div>
  )
}

export default AboutUs