import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-20 text-center">
      <h1 className="text-5xl font-extrabold text-gray-900 mb-6">Welcome to TechStore</h1>
      <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
        Buy the best gadgets with the fastest shipping. Need help? Our AI Support Agent is available 24/7 to track your orders.
      </p>
      <div className="flex justify-center gap-4">
        <Link to="/dashboard" className="bg-gray-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800">
          View My Orders
        </Link>
        <Link to="/support" className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700">
          Get Support
        </Link>
      </div>
    </div>
  );
}