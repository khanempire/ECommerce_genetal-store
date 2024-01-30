//domain/.netlify/functions/create-payment-intent
require("dotenv").config();
const shortid = require("shortid");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const cors = require("cors");
const razorpay = new Razorpay({
  key_id: "rzp_test_Ve6VQXggcxoGDJ",
  key_secret: "yBa8qm2Fu6LxaI1p39t12KmP",
});

exports.handler = async function (event, context) {
  const formatPriceToINR = (number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(number * 70);
  };
  if (event.body) {
    const { cart, shipping_fee, total_amount } = JSON.parse(event.body);
    const calculateOrderAmount = () => {
      const shipping_fee_inr = shipping_fee * 70;
      const total_amount_inr = total_amount * 70;
      return shipping_fee_inr + total_amount_inr;
    };
    const options = {
      amount: calculateOrderAmount(),
      currency: "INR",
      receipt: shortid.generate(),
      payment_capture: 1,
    };
    try {
      const paymentIntent = await razorpay.orders.create(options);
      return {
        statusCode: 200,
        body: JSON.stringify({
          clientSecret: paymentIntent.id,
          currency: paymentIntent.currency,
          amount: paymentIntent.amount,
        }),
      };
    } catch (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ msg: error.message }),
      };
    }
  }
  return {
    statusCode: 200,
    body: "Create Payment Intent with stripe",
  };
};
