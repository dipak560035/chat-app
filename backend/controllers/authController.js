const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

//     Register a new user
// route,   POST /api/auth/register
// access,  Public
const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const userExists = await User.findOne({ $or: [{ email }, { username }] });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      username,
      email,
      password,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//     Authenticate a user
// route,   POST /api/auth/login
// access,  Public
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.comparePassword(password))) {
      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerUser, loginUser };




























































import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageHero from "../components/common/PageHero";
import Container from "../components/layout/Container";
import { useAdminAllOrdersQuery, useAdminUpdateOrderStatusMutation } from "../services/api";
import { toast } from "sonner";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4001";

export default function AdminOrders() {
  const { data, isLoading } = useAdminAllOrdersQuery();
  const [updateStatus] = useAdminUpdateOrderStatusMutation();
  const [orders, setOrders] = useState([]);

  // populate local state when query loads
  useEffect(() => {
    if (data?.data) setOrders(data.data);
  }, [data]);

  const handleChange = async (id, status) => {
    try {
      const updatedOrder = await updateStatus({ id, status }).unwrap();
      toast.success("Order status updated");
      setOrders((prev) =>
        prev.map((o) => (o._id === id ? updatedOrder : o))
      );
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update status");
    }
  };

  if (isLoading) {
    return (
      <Container className="py-12 space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-24 animate-pulse rounded-lg bg-neutral-100" />
        ))}
      </Container>
    );
  }

  if (!orders.length) {
    return (
      <Container className="py-12 text-center">
        <p className="text-neutral-700">No orders found</p>
      </Container>
    );
  }

  return (
    <>
      <PageHero title="All Orders" />
      <Container className="py-12 space-y-8">
        {orders.map((o) => (
          <div key={o._id} className="rounded-lg border p-6 shadow-sm">
            {/* Order Info */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-4">
              <div className="space-y-1">
                <div className="text-sm text-neutral-500">Order ID</div>
                <div className="font-medium">{o._id}</div>
              </div>
              <div className="space-y-1">
                <div className="text-sm text-neutral-500">User</div>
                <div className="font-medium">{o.user?.name || "Unknown"}</div>
              </div>
              <div className="space-y-1">
                <div className="text-sm text-neutral-500">Placed</div>
                <div className="font-medium">
                  {o.createdAt ? new Date(o.createdAt).toLocaleString() : "-"}
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-sm text-neutral-500">Total</div>
                <div className="font-medium">Rs. {Number(o.total || 0).toLocaleString()}</div>
              </div>
            </div>

            {/* Items & Shipping */}
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div>
                <div className="text-sm text-neutral-500 mb-2">Items</div>
                <ul className="space-y-3">
                  {(o.items || []).map((it, idx) => (
                    <li key={idx} className="flex items-center gap-4">
                      <div className="h-16 w-16 overflow-hidden rounded bg-neutral-100">
                        <img
                          src={it.image ? `${BASE_URL}${it.image}` : "https://placehold.co/200x200?text=No+Image"}
                          alt={it.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{it.name}</div>
                        <div className="text-sm text-neutral-500">
                          Qty: {it.qty} • Rs. {Number(it.price).toLocaleString()}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <div className="text-sm text-neutral-500 mb-2">Shipping Address</div>
                <div className="rounded bg-neutral-50 p-4 text-sm space-y-1">
                  <div>{o.shippingAddress?.firstName} {o.shippingAddress?.lastName}</div>
                  <div>{o.shippingAddress?.line1}</div>
                  {o.shippingAddress?.line2 && <div>{o.shippingAddress.line2}</div>}
                  <div>{o.shippingAddress?.city}, {o.shippingAddress?.state} {o.shippingAddress?.postalCode}</div>
                  <div>{o.shippingAddress?.country}</div>
                  <div>Email: {o.shippingAddress?.email}</div>
                  <div>Phone: {o.shippingAddress?.phone}</div>
                </div>
              </div>
            </div>

            {/* Admin Actions */}
            <div className="mt-6 flex items-center gap-3">
              <Link
                to={`/orders/${o._id}`}
                className="rounded-md border border-black px-4 py-2 text-sm hover:bg-black hover:text-white"
              >
                View Details
              </Link>

              <select
                value={o.status || "pending"}
                onChange={(e) => handleChange(o._id, e.target.value)}
                className="rounded-md border px-4 py-2 text-sm cursor-pointer"
              >
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        ))}
      </Container>
    </>
  );
}