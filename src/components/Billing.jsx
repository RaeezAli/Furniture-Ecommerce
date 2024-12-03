import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function BillingDetailsForm() {
  const [paymentMethod, setPaymentMethod] = useState("bank-transfer");

  return (
    <div className=" pt-28 max-w-7xl mx-auto p-10">
      <h1 className="text-3xl font-bold mb-8">Billing details</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <form className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label
                htmlFor="lastName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="companyName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Company Name (Optional)
            </label>
            <input
              type="text"
              id="companyName"
              name="companyName"
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label
              htmlFor="country"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Country / Region
            </label>
            <div className="relative">
              <select
                id="country"
                name="country"
                className="w-full p-2 border border-gray-300 rounded-md appearance-none"
                defaultValue="Sri Lanka"
              >
                <option>Sri Lanka</option>
                <option>India</option>
                <option>United States</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>
          <div>
            <label
              htmlFor="streetAddress"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Street address
            </label>
            <input
              type="text"
              id="streetAddress"
              name="streetAddress"
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label
              htmlFor="townCity"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Town / City
            </label>
            <input
              type="text"
              id="townCity"
              name="townCity"
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label
              htmlFor="province"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Province
            </label>
            <div className="relative">
              <select
                id="province"
                name="province"
                className="w-full p-2 border border-gray-300 rounded-md appearance-none"
                defaultValue="Western Province"
              >
                <option>Western Province</option>
                <option>Central Province</option>
                <option>Southern Province</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>
          <div>
            <label
              htmlFor="zipCode"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              ZIP code
            </label>
            <input
              type="text"
              id="zipCode"
              name="zipCode"
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Phone
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
        </form>
        <div>
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Product</h2>
            <div className="flex justify-between mb-2">
              <span>Asgaard sofa x 1</span>
              <span>Rs. 250,000.00</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Subtotal</span>
              <span>Rs. 250,000.00</span>
            </div>
            <div className="flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span className="text-[#B88E2F]">Rs. 250,000.00</span>
            </div>
          </div>
          <div className="mt-6 space-y-4">
            <label className="flex items-center space-x-3">
              <input
                type="radio"
                name="paymentMethod"
                value="bank-transfer"
                checked={paymentMethod === "bank-transfer"}
                onChange={() => setPaymentMethod("bank-transfer")}
                className="form-radio text-[#B88E2F]"
              />
              <span>Direct Bank Transfer</span>
            </label>
            <p className="text-sm text-gray-600 ml-6">
              Make your payment directly into our bank account. Please use your
              Order ID as the payment reference. Your order will not be shipped
              until the funds have cleared in our account.
            </p>
            <label className="flex items-center space-x-3">
              <input
                type="radio"
                name="paymentMethod"
                value="cash-on-delivery"
                checked={paymentMethod === "cash-on-delivery"}
                onChange={() => setPaymentMethod("cash-on-delivery")}
                className="form-radio text-[#B88E2F]"
              />
              <span>Cash On Delivery</span>
            </label>
          </div>
          <p className="mt-6 text-sm text-gray-600">
            Your personal data will be used to support your experience
            throughout this website, to manage access to your account, and for
            other purposes described in our{" "}
            <a href="#" className="text-[#B88E2F] hover:underline">
              privacy policy
            </a>
            .
          </p>
          <button className="mt-6 w-full bg-[#B88E2F] text-white py-3 px-4 rounded-lg hover:bg-[#A47E2A] transition duration-200">
            Place order
          </button>
        </div>
      </div>
    </div>
  );
}
