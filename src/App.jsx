import Home from "./pages/home/Home";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Categories from "./pages/categories/Categories";
import ProductDetails from "./pages/product/ProductDetails";
import Cart from "./pages/cart/Cart";
import Checkout from "./pages/checkout/Checkout";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Product from "./pages/product/Product";
import Contact from "./pages/contact/Contact";
import ProductAll from "./pages/product/ProductAll";
import OrderSuccess from "./pages/order/OrderSuccess";
import OrderFailed from "./pages/order/OrderFailed";
import { Toaster } from "sonner";
import ScrollToTop from "./components/ScrollToTop/ScrollToTop.jsx";
import TermsCondition from "./pages/terms-condition/TermsCondition.jsx";
import AboutUs from "./pages/about/AboutUs.jsx";
import Compare from "./pages/compare/Compare.jsx";
import OrderStatusChecker from "./pages/order-status-checker/OrderStatusChecker.jsx";
import RecentlyViewed from "./pages/recently-viewed/RecentlyViewed.jsx";
import Chatbot from "./components/Chatbot/Chatbot.jsx";
import Blog from "./pages/blog/Blog.jsx";
import BlogDetails from "./pages/blog/BlogDetails.jsx";
const queryClient = new QueryClient();

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Toaster richColors position="top-right" />
      <QueryClientProvider client={queryClient}>
        <MainLayout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/product-details/:id" element={<ProductDetails />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/product/:id" element={<Product />} />
            <Route path="/products" element={<ProductAll />} />
            <Route path="/order-success" element={<OrderSuccess />} />
            <Route path="/order-failed" element={<OrderFailed />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog-details" element={<BlogDetails />} />
            <Route path="/terms-condition" element={<TermsCondition />} />
            <Route path="/compare" element={<Compare />} />
            <Route
              path="/order-status-checker"
              element={<OrderStatusChecker />}
            />
            <Route path="/recently-viewed" element={<RecentlyViewed />} />
          </Routes>
          {/* <Chatbot /> */}
        </MainLayout>
      </QueryClientProvider>
    </Router>
  );
}

export default App;
