// Load db config
//const db = require("../database/config");
// Load .env variables
require("dotenv").config();
// Util to deep-compare two objects
const lodash = require("lodash");
const nodemailer = require("nodemailer");

// Returns status of new confirmation email
const createEmailConfirmation = async (req, res) => {
  try {
    const orderId = req.params.orderId;

    // Hardcoded retrieved order details 
    const order = {
      id: orderId,
      customerName: "Austin Flores",
      email: "austin3flores@dracospitfire.com",
      items: ["Columbia Dark Roast -------------- x2", "Ethiopia Light Roast ---------------- x1"],
      shippingAddress: "42 Wallaby Way, Sydney, USA",
      total: 88.69,
    };

    // Automatically create test account on Ethereal
    const testAccount = await nodemailer.createTestAccount();

    const transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    // Email content (plain text)
    const mailOptions = {
      from: `"Calvin's Coffee Roast Team" <orders@roastandbrew.com>`,
      to: order.email,
      subject: `Order Confirmation - #${order.id}`,
      text: `
      Hi ${order.customerName},

          Thank you for your order!

          Order Number: ${order.id}

          Roasted Coffee:
          -- ${order.items.join("\n-- ")}
          
          Total: $${order.total}

          You'll get another email when it’s on its way.

          Warmly, 

          Calvin's Coffee Roast Team`.trim(),
    };

    const info = await transporter.sendMail(mailOptions);
    res.status(200).json({ status: "Confrimation Email Sent Successfully", preview: nodemailer.getTestMessageUrl(info) });
  } catch (error) {
    // Print the error for the microservice terminal
    console.error("Error creating confrimation email:", error);
    // Inform the client of the error
    res.status(500).json({ error: "Confrimation Email Not Sent" });
  }
};

// Export the functions as methods of an object
module.exports = {
  createEmailConfirmation,
};
