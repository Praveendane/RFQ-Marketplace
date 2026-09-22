import { BrowserRouter, Routes, Route } from "react-router-dom";

import Register from "./pages/Register";
import Login from "./pages/Login";
import BuyerDashboard from "./pages/BuyerDashboard";
import SupplierDashboard from "./pages/SupplierDashboard";
import RFQDetails from "./pages/RFQDetails";
import QuotationForm from "./pages/QuotationForm";
import MyQuotations from "./pages/MyQuotations";

import ProtectedRoute from "./components/ProtectedRoute";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<ProtectedRoute allowedRole="buyer" />}/>
        <Route path="/buyer" element={<BuyerDashboard />} />
        <Route element={<ProtectedRoute allowedRole="supplier" />}/>
        <Route path="/supplier" element={<SupplierDashboard />} />
        <Route path="/supplier/rfq/:rfqId" element={<RFQDetails/>}/>
        <Route path="/supplier/rfq/:rfqId/quote" element={<QuotationForm/>}/>
        <Route path="/supplier/quotations" element={<MyQuotations/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;