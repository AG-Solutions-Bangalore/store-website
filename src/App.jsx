
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Cart from "./pages/cart/Cart";
import Categories from "./pages/categories/Categories";
import Checkout from "./pages/checkout/Checkout";
import Contact from "./pages/contact/Contact";
import Home from "./pages/home/Home";
import Product from "./pages/product/Product";
import ProductAll from "./pages/product/ProductAll";
import ProductDetails from "./pages/product/ProductDetails";
const queryClient = new QueryClient();
function App() {
  return (
    <Router>
      <QueryClientProvider client={queryClient}>
        <MainLayout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/product-details/:id" element={<ProductDetails />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/product/:id" element={<Product />} />
            <Route path="/product" element={<ProductAll />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </MainLayout>
      </QueryClientProvider>
    </Router>
  );
}

export default App;
