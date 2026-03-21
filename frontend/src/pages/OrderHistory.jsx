 
import React, { useEffect, useState } from "react";
import orderApi from "../api/orderApi";
import { toast } from "react-toastify";

const OrderHistory = () => {

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const BACKEND_URL = "http://localhost:5000";

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {

    try {

      const response = await orderApi.getOrderHistory();

      setOrders(response.data);

    } catch (error) {

      toast.error("Order history could not be loaded.");
      console.error(error);

    } finally {

      setLoading(false);

    }

  };

  const getStatusBadgeClass = (status) => {

    switch (status) {

      case "Payment received":
        return "bg-success";

      case "Preparing":
        return "bg-warning text-dark";

      case "Shipped":
        return "bg-primary";

      case "Canceled":
        return "bg-danger";

      default:
        return "bg-secondary";

    }

  };

  if (loading) {

    return (
      <div className="text-center mt-5">
        Loading...
      </div>
    );

  }

  return (

    <div className="container mt-4">

      <h2 className="mb-4">
        My Order History
      </h2>

      {orders.length === 0 ? (

        <div className="alert alert-info">
          You don't have any orders yet.
        </div>

      ) : (

        <div className="table-responsive shadow-sm rounded">

          <table className="table table-hover align-middle mb-0">

            <thead className="table-dark">
              <tr>
                <th className="px-4 py-3"> Order No </th>
                <th className="px-4 py-3"> Date </th>
                <th className="px-4 py-3"> Total Amount </th>
                <th className="px-4 py-3"> Order Status </th>
                <th className="px-4 py-3"> Products </th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => (

                <tr key={order.id}>
                  <td className="px-4 py-3 fw-bold text-secondary">
                    #ORD-{order.id}
                  </td>

                  <td className="px-4 py-3 text-nowrap">
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleDateString("tr-TR")
                      : "No Date"}
                  </td>

                  <td className="px-4 py-3 fw-bold text-success text-nowrap">
                    {parseFloat(order.total_price).toFixed(2)} TL
                  </td>

                  <td className="px-4 py-3">
                    <span className={`badge ${getStatusBadgeClass(order.payment_status)}`}>
                      {order.payment_status}
                    </span>
                  </td>

                  <td className="px-4 py-3">
                    <ul
                      className="list-unstyled m-0 p-0"
                      style={{ listStyleType: "none" }}
                    >
                      {order.CustomerOrderItems?.map((item, index) => (
                        <li
                          key={index}
                          className="d-flex align-items-center mb-3"
                        >
                          <div className="flex-shrink-0 me-3">
                            {item.Product?.image_url ? (
                              <img
                                src={`${BACKEND_URL}${item.Product.image_url}`}
                                alt="Product"
                                className="border rounded shadow-sm"
                                style={{
                                  width: "45px",
                                  height: "45px",
                                  objectFit: "cover"
                                }}
                              />

                            ) : (

                              <div
                                className="border rounded d-flex align-items-center justify-content-center bg-light text-muted shadow-sm"
                                style={{
                                  width: "45px",
                                  height: "45px",
                                  fontSize: "14px"
                                }}
                              >
                                🖼️
                              </div>
                            )}
                          </div>

                          <div className="flex-grow-1 d-flex flex-column justify-content-center">
                            <span
                              className="fw-medium text-dark mb-0"
                              style={{
                                fontSize: "0.9rem",
                                lineHeight: "1.2"
                              }}
                            >
                              {item.Product?.product_description || "No product description"}
                            </span>

                            <div className="d-flex align-items-center mt-1">
                              <span
                                className="badge bg-secondary-subtle text-secondary border rounded-pill px-2 py-1"
                                style={{ fontSize: "0.75rem" }}
                              >
                                {item.quantity} Quantity
                              </span>

                              <span className="ms-2 text-muted small">
                                x {parseFloat(item.price).toFixed(2)} TL
                              </span>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      )}

    </div>

  );

};

export default OrderHistory;