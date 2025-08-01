import { useState, useEffect, useRef } from "react";
import {
  MessageSquare, X, Send, ShoppingCart, ArrowRight,
  Loader2, Maximize2, Minimize2, Info
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../../config/BaseUrl";
import {
  filterProducts, setProducts, setQueryFilters
} from "../../redux/slices/productSlice";
import { addToCart } from "../../redux/slices/CartSlice";
import {
  parseUserQuery, applyProductFilters
} from "../../services/queryParserService";
import botResponses from "../../config/botResponses.json";

const fetchAllProducts = async () => {
  const response = await axios.get(`${BASE_URL}/api/web-fetch-product`);
  return response.data;
};

const transformProductData = (apiData) => {
  if (!apiData || !apiData.data) return [];

  const productImageUrl = apiData.image_url.find(img => img.image_for === "Product")?.image_url || "";
  const noImageUrl = apiData.image_url.find(img => img.image_for === "No Image")?.image_url || "";

  return apiData.data.map(product => {
    const defaultImage = product.subs.find(sub => sub.is_default === "true") || product.subs[0];
    const hoverImage = product.subs.find(sub => sub.is_default === "false") || defaultImage;

    return {
      id: product.id,
      image: defaultImage ? `${productImageUrl}${defaultImage.product_images}` : noImageUrl,
      hoverImage: hoverImage ? `${productImageUrl}${hoverImage.product_images}` : noImageUrl,
      title: product.product_name,
      category: product.category_names,
      price: product.product_mrp,
      originalPrice:
        product.product_spl_offer_price > 0
          ? product.product_spl_offer_price
          : product.product_selling_price,
      weight: `${product.product_unit_value}${product.unit_name}`,
      onSale: product.product_spl_offer_price > 0,
      productData: product
    };
  });
};

const getRandomResponse = (responses) => {
  return responses[Math.floor(Math.random() * responses.length)];
};

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: getRandomResponse(botResponses.greetings.responses),
      sender: "bot",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      followUpQuestions: botResponses.greetings.followUps
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [showProducts, setShowProducts] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { filteredItems } = useSelector((state) => state.products);
  const cartItems = useSelector((state) => state.cart.items);

  const { data, isLoading, error } = useQuery({
    queryKey: ['allProducts'],
    queryFn: fetchAllProducts,
    onSuccess: (data) => {
      if (data?.code === 200) {
        dispatch(setProducts({
          products: data.data,
          imageBaseUrl: data.image_url.find(img => img.image_for === "Product")?.image_url || '',
          noImageUrl: data.image_url.find(img => img.image_for === "No Image")?.image_url || ''
        }));
      }
    }
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, showProducts]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) setIsExpanded(false);
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleSendMessage = async () => {
    if (inputValue.trim() === "") return;

    const newUserMessage = {
     id: Date.now(),
      text: inputValue,
      sender: "user",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, newUserMessage]);
    setInputValue("");
    setShowProducts(false);
    setIsProcessing(true);

    try {
      const parsedQuery = parseUserQuery(inputValue, data?.data || []);
      dispatch(setQueryFilters(parsedQuery));
      const filtered = applyProductFilters(data?.data || [], parsedQuery);
      dispatch(filterProducts(filtered));

    
      let responseMessage = parsedQuery.responseMessage;
      let showRandomProducts = false;
      
      if (filtered.length === 0) {
        responseMessage = getRandomResponse(botResponses.productNotFound.responses);
        showRandomProducts = true;
      
        const randomProducts = [...data?.data || []]
          .sort(() => 0.5 - Math.random())
          .slice(0, 4);
        dispatch(filterProducts(randomProducts));
      }

      const botResponse = {
        id: messages.length + 2,
        text: responseMessage,
        sender: "bot",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        followUpQuestions: parsedQuery.followUpQuestions,
        fuzzyMatch: parsedQuery.fuzzyMatch,
        showHelp: filtered.length === 0
      };

      setMessages(prev => [...prev, botResponse]);
      setShowProducts(filtered.length > 0 || showRandomProducts);
    } catch (error) {
      setMessages(prev => [
        ...prev,
        {
          id: prev.length + 2,
          text: "Sorry, I couldn't process your request. Please try again.",
          sender: "bot",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          followUpQuestions: [
            "Show me best selling products",
            "What's on sale today?",
            "Show me grocery items"
          ]
        }
      ]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSendMessage();
  };

  const handleAddToCart = (product) => {
    if (cartItems.some(item => item.id === product.id)) {
      toast.info(`${product.product_name} is already in your cart`);
      return;
    }

    const allTransformed = transformProductData(data);
    const transformed = allTransformed.find(p => p.id === product.id);

    const cartItem = {
      id: product.id,
      name: product.product_name,
      price: parseFloat(product.product_selling_price),
      quantity: 1,
      image: transformed?.image || "",
      size: `${product.product_unit_value}${product.unit_name}`,
    };

    dispatch(addToCart(cartItem));
    toast.success(`${product.product_name} added to cart`);

  
    setMessages(prev => prev.filter(msg => msg.action?.type !== "cart"));
    
   
    setMessages(prev => [
      ...prev,
      {
        id: prev.length + 1,
        text: `✅ ${product.product_name} added to cart!`,
        sender: "bot",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        action: { type: "cart", productId: product.id }
      }
    ]);
  };

  const handleViewProduct = (productId) => {
    navigate(`/product-details/${productId}`);
    setIsOpen(false);
  };

  const handleViewCart = () => {
    navigate("/cart");
    setIsOpen(false);
  };

  const handleFollowUpQuestion = (question) => {
    setInputValue(question);
    handleSendMessage();
  };

  const handleShowHelpExamples = () => {
    const helpMessage = {
      id: messages.length + 1,
      text: getRandomResponse(botResponses.help.examples),
      sender: "bot",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      followUpQuestions: botResponses.help.queries
    };
    
    setMessages(prev => [...prev, helpMessage]);
  };


  const chatWidth = isExpanded ? 400 : 320;
  const chatHeight = isExpanded ? 600 : 500;
  const productGridHeight = isExpanded ? '300px' : '200px';

  const transformedProducts = transformProductData(data);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen ? (
        <button
          onClick={toggleChat}
          className="w-14 h-14 rounded-full bg-blue-900 text-white shadow-lg flex justify-center items-center "
        >
          <MessageSquare className="h-6 w-6" />
        </button>
      ) : (
        <div 
          className="bg-white rounded-xl shadow-xl flex flex-col transition-all duration-300"
          style={{ width: `${chatWidth}px`, height: `${chatHeight}px` }}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-4 flex justify-between items-center">
            <span className="font-medium">Shopping Assistant</span>
            <div className="flex gap-2">
              <button 
                onClick={toggleExpand}
                className="hover:bg-blue-700 p-1 rounded transition-colors duration-200"
              >
                {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
              </button>
              <button 
                onClick={toggleChat}
                className="hover:bg-blue-700 p-1 rounded transition-colors duration-200"
              >
                <X size={16} />
              </button>
            </div>
          </div>

         
          <div className="flex-1 overflow-y-auto custom-scroll p-4 space-y-4 bg-gradient-to-b from-gray-50 to-white">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div 
                  className={`rounded-xl px-4 py-2 max-w-[80%] text-sm ${
                    msg.sender === "user"
                      ? "bg-blue-600 text-white" 
                      : "bg-gray-200 text-black"
                  }`}
                >
                  <div className="break-words">{msg.text}</div>
                  {msg.fuzzyMatch && (
                    <div className="text-xs text-gray-500 mt-1">
                      Showing similar matches
                    </div>
                  )}
                  <div className="text-[10px] mt-1 text-right opacity-75">
                    {msg.time}
                  </div>
                  
                  {msg.followUpQuestions?.map((q, i) => (
                    <button 
                      key={i}
                      onClick={() => handleFollowUpQuestion(q)}
                      className="block text-left text-xs bg-white border border-gray-200 rounded mt-1 px-2 py-1 hover:bg-gray-50 w-full transition-colors duration-200"
                    >
                      {q}
                    </button>
                  ))}

                  {msg.showHelp && (
                    <button
                      onClick={handleShowHelpExamples}
                      className="mt-2 text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
                    >
                      <Info size={12} /> Need help with searching?
                    </button>
                  )}
                </div>
              </div>
            ))}

            {isProcessing && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Loader2 className="animate-spin w-4 h-4 text-blue-600" /> 
                <span>Thinking...</span>
              </div>
            )}

            {showProducts && filteredItems.length > 0 && (
              <div className="bg-white rounded-lg">
                <p className="text-xs mb-2">{filteredItems.length} products found:</p>
                <div 
                  className="grid grid-cols-2 gap-2 overflow-y-auto custom-scroll"
                  style={{ maxHeight: productGridHeight }}
                >
                  {filteredItems.map((prod) => {
                    const transformed = transformedProducts.find(p => p.id === prod.id);
                    const uniqueKey = `${prod.id}-${prod.product_name.replace(/\s+/g, '-')}`;
                    return (
                      <div 
                        key={uniqueKey} 
                        className="border border-blue-900 p-2 rounded text-xs shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer hover:border-blue-300 bg-white"
                        // onClick={() => handleViewProduct(prod.id)}
                      >
                        <div className="aspect-square w-full mb-1 bg-gray-100 rounded-md overflow-hidden">
                          <img 
                            src={transformed?.image || ""} 
                            alt={prod.product_name} 
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" 
                          />
                        </div>
                        <div className="space-y-1">
                          <div className="font-semibold line-clamp-1">
                            {prod.product_name}
                          </div>
                          <div className="text-green-600 font-bold">
                            ₹{prod.product_selling_price}
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddToCart(prod);
                            }}
                            className="mt-1 w-full bg-blue-600 hover:bg-blue-700 text-white text-xs py-1 rounded transition-colors duration-200 flex items-center justify-center gap-1"
                          >
                            <ShoppingCart size={12} /> 
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

        
            {messages.some(msg => msg.action?.type === "cart") && (
              <div className="flex justify-start">
                <div className="bg-gray-200 text-black shadow-sm rounded-xl px-4 py-2 max-w-[80%] text-sm">
                  <div className="break-words">
                    {messages.find(msg => msg.action?.type === "cart")?.text}
                  </div>
                  <button
                    className="text-blue-700 text-xs underline mt-1 hover:text-blue-800 transition-colors font-medium block"
                    onClick={handleViewCart}
                  >
                    Go to Cart
                  </button>
                  <div className="text-[10px] mt-1 text-right opacity-75">
                    {messages.find(msg => msg.action?.type === "cart")?.time}
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

      
          <div className="p-3 border-t border-gray-200 bg-white">
            <div className="flex gap-2">
              <input
                className="flex-1 border border-gray-200 px-3 py-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500 bg-gray-50 focus:bg-white transition-colors duration-200"
                placeholder="Search products (e.g., 'Flour under 100')"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isProcessing}
              />
              <button
                onClick={handleSendMessage}
                disabled={inputValue.trim() === "" || isProcessing}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-3 py-2 rounded transition-colors duration-200 shrink-0 shadow-sm hover:shadow-md"
              >
                {isProcessing ? (
                  <Loader2 className="animate-spin h-4 w-4" />
                ) : (
                  <Send size={16} />
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;