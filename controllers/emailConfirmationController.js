// Load .env variables
require("dotenv").config();
// Util to deep-compare two objects
const lodash = require("lodash");
const nodemailer = require("nodemailer");

// Returns status of new confirmation email
const createEmailConfirmation = async (req, res) => {
  try {
    const orderId   = req.params.orderId;
    console.log(orderId)

    // Validate missing or non-numeric orderId,
    if (!orderId || isNaN(Number(orderId))) {
      return res.status(400).json({ error: "invalid orderId" });
    }

    const { order, customer } = req.body;
    if (!order || !customer) {
        return res.status(400).json({error: "missing order or customer payload"});
    }

    const { order_id, items } = order;
    const { name: customerName, email: customerEmail } = customer

    // Calculate total cost of coffee order
    let total = 0;
    for (let item of items) {
        total += item.quantity * item.unitPrice;
    }
    const totalStr = total.toFixed(2);



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
    // For each item, format "name x quantity", then join all items into a single string
    const mailOptions = {
      from: `"Calvin's Coffee Roast Team" <orders@roastandbrew.com>`,
      to: customerEmail,
      subject: `Order Confirmation - #${order_id}`,
      text: `
      Hi ${customerName},

          Thank you for your order!

          Order Number: ${order_id}

          Roasted Coffee:
          -- ${items.map(i => `${i.name} x ${i.quantity}`).join("\n-- ")}
          
          Total: $${totalStr}

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

    // Validate missing or non-numeric memberId,
    if (!memberId || isNaN(Number(memberId))) {
      return res.status(400).json({ error: "invalid request" });
    }

   const { customer } = req.body;
   if (!customer || !customer.name || !customer.email) {
       return res.status(400).json({ error: "missing customer payload" });
   }

   const { name, email } = customer;

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
      to: email,
      subject: `Wake Up, ${name}, to Something Bold..... Limited-Time Coffee Deals!!!!`,
      html: ` <p>Hi <strong>${name}</strong>,</p>
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
