export default function Dashboard() {
  const mockOrders = [
    { id: "12345", item: "Wireless Headphones", status: "Shipped", date: "Tomorrow" },
    { id: "67890", item: "Gaming Keyboard", status: "Processing", date: "In 3 days" },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="p-4 font-semibold text-gray-600">Order ID</th>
              <th className="p-4 font-semibold text-gray-600">Item</th>
              <th className="p-4 font-semibold text-gray-600">Status</th>
            </tr>
          </thead>
          <tbody>
            {mockOrders.map((order, i) => (
              <tr key={i} className="border-b last:border-0 hover:bg-gray-50">
                <td className="p-4 font-mono font-medium text-blue-600">#{order.id}</td>
                <td className="p-4 text-gray-800">{order.item}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${order.status === 'Shipped' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-6 text-gray-500">Need help tracking these? <a href="/support" className="text-blue-600 hover:underline">Ask our AI Support bot</a>.</p>
    </div>
  );
}