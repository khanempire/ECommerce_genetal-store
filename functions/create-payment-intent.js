//domain/.netlify/functions/create-payment-intent
require("dotenv").config();

const stripe = require("stripe")(process.env.REACT_APP_STRIPE_SECRET_KEY);

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
      console.log("shipping", shipping_fee_inr);
      console.log("shipping$", shipping_fee);
      console.log("total", total_amount_inr);
      console.log("total$", total_amount);
      console.log("total_amount_into_inr", shipping_fee_inr + total_amount_inr);
      return shipping_fee_inr + total_amount_inr;
    };
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: calculateOrderAmount(),
        //currency: "usd",
        currency: "inr",
      });
      return {
        statusCode: 200,
        body: JSON.stringify({ clientSecret: paymentIntent.client_secret }),
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
