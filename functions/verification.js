const crypto = require("crypto");
exports.handler = async (event, context, cb) => {
  const req_val = JSON.parse(event.body);
  console.log(req_val);
  console.log(typeof req_val);
  const secret = "12345678";
  const shasum = crypto.createHmac("sha256", secret);
  shasum.update(JSON.stringify(req_val));
  const digest = shasum.digest("hex");
  console.log(digest, event.headers["x-razorpay-signature"]);
  if (digest === event.headers["x-razorpay-signature"]) {
    console.log("request is legit");
    // process it
    console.log("payment", req_val.payload.payment);
    require("fs").writeFileSync(
      `payments/${req_val.payload.payment.entity.order_id}-payment`,
      JSON.stringify(req_val, null, 4)
    );
  } else {
    // pass it
    return {
      statusCode: 500,
      body: "error",
    };
  }
  return {
    statusCode: 200,
    body: JSON.stringify(req_val),
  };
};
