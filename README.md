# Calvin's Coffee Roast - Email Notification Microservice

A simple microservice to process coffee order notifications and send confirmation emails.  
Built with Express.js and Nodemailer, designed to be called by the main ordering system via HTTP POST.

## Live Demo

Hosted on Render at:  
`https://calvins-coffee-roast.render.com`

## Overview

This microservice receives HTTP POST requests at `/api/notify` containing an order ID, then sends a confirmation email to the customer confirming their coffee purchase. It is stateless and designed for quick synchronous processing.

## 🔧 Features

- Accepts POST requests with JSON payload containing `orderId`.
- Sends a hardcoded (mock) confirmation email for demonstration purposes.
- CORS enabled for public requests.
- Logs incoming requests with timestamps, origins, and IP addresses.
- Easy to extend with real email provider credentials.
- Returns JSON `{ "status": "sent" }` on success.

## API Usage

### Endpoint
