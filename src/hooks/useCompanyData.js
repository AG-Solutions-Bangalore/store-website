import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import BASE_URL from '../config/BaseUrl';



const fetchCompanyData = async () => {
  const response = await axios.get(`${BASE_URL}/api/web-fetch-company`);
  return response.data;
};

export const useCompanyData = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['companyData'],
    queryFn: fetchCompanyData,
  });


  const companyImageUrl = data?.image_url?.find(img => img.image_for === "Company")?.image_url;
  const noImageUrl = data?.image_url?.find(img => img.image_for === "No Image")?.image_url;

  return {
    companyData: data?.data,
    imageUrls: {
      companyImageUrl,
      noImageUrl,
    },
    isLoading,
    error,
 
    storeName: data?.data?.store_name,
    storeDescription: data?.data?.store_description,
    storeOwnerName: data?.data?.store_owner_name,
    supportEmail: data?.data?.support_email,
    supportPhone: data?.data?.support_phone,
    supportWhatsapp: data?.data?.support_whatsapp,
    storeAddress: data?.data?.store_address,
    googleMapUrl: data?.data?.google_map_url,
    storeBannerImage: companyImageUrl ? `${companyImageUrl}${data?.data?.store_banner_image}` : null,
    storeLogoImage: companyImageUrl ? `${companyImageUrl}${data?.data?.store_logo_image}` : null,
    appStoreUrl: data?.data?.app_store_url,
    googleStoreUrl: data?.data?.google_store_url,
  };
};