const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

app.post('/verify-payment', async (req, res) => {
  const { amount, transactionId } = req.body;
  const MERCHANT_CODE = 'EPAYTEST'; // Replace with your eSewa Merchant Code.

  const verificationUrl = 'https://uat.esewa.com.np/epay/transrec';

  const params = new URLSearchParams({
    amt: amount,
    scd: MERCHANT_CODE,
    rid: transactionId,
    pid: transactionId,
  });

  try {
    const response = await axios.post(verificationUrl, params.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    if (response.data.includes('<response>Success</response>')) {
      res.json({ status: 'success', message: 'Payment verified successfully.' });
    } else {
      res.json({ status: 'failure', message: 'Payment verification failed.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: 'Server error.' });
  }
});

const PORT = 5174;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
