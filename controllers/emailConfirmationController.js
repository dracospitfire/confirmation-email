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
    res.status(200).json({ status: "Confirmation Email Sent Successfully", preview: nodemailer.getTestMessageUrl(info) });
  } catch (error) {
    // Print the error for the microservice terminal
    console.error("Error creating Confirmation email:", error);
    // Inform the client of the error
    res.status(500).json({ error: "Confirmation Email Not Sent" });
  }
};


// Returns status of new promotional email
const createPromotionalAnnouncement = async (req, res) => {
  try {
    const memberId = req.params.memberId;

    // Hardcoded retrieved order details 
    const customer = {
      id: memberId,
      customerName: "Austin Flores",
      email: "austin3flores@dracospitfire.com",
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
      to: customer.email,
      subject: `Wake Up, ${customer.customerName}, to Something Bold..... Limited-Time Coffee Deals!!!!`,
      html: ` <p>Hi <strong>${customer.customerName}</strong>,</p>
              <p>We’re brewing up something special just for YOU.</p>
              <p>As our favorite coffee lovers, we have an exclusive deal.</p>
              <p>For this week only, enjoy:<br></p>
              <ul>
                <li><strong>20% OFF</strong> our best-selling roasts</li>
                <li><strong>Free shipping</strong> on orders over $50</li>
                <li><strong>Surprise gift</strong> in every order</li>
              </ul>
              <p><em>Sip, Save, and <strong>Snap</strong></em> into flavor. Fuel your day the Calvin way.</p>
              <p>Cheers,<br></p>
              <p>Calvin's Coffee Roast Team</p>
            `.trim(),
    };

    const info = await transporter.sendMail(mailOptions);
    res.status(200).json({ status: "Promotional Announcement Sent Successfully", preview: nodemailer.getTestMessageUrl(info) });
  } catch (error) {
    // Print the error for the microservice terminal
    console.error("Error creating Promotional email:", error);
    // Inform the client of the error
    res.status(500).json({ error: "Promotional Announcement Not Sent" });
  }
};

// Export the functions as methods of an object
module.exports = {
  createEmailConfirmation,
  createPromotionalAnnouncement,
};
