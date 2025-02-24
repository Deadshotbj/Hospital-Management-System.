import { EsewaPaymentGateway, EsewaCheckStatus } from "esewajs"; 
import { Transaction } from "../models/Transactionmodel.js";

const EsewaInitiatePayment = async (req, res) => {
  const { amount, productId } = req.body;  // frontend bata ako
  try {
    const reqPayment = await EsewaPaymentGateway(
      amount, 0, 0, 0, productId, process.env.MERCHANT_ID, process.env.SECRET, 
      process.env.SUCCESS_URL, process.env.FAILURE_URL, process.env.ESEWAPAYMENT_URL, 
      undefined, undefined
    );
    
    if (!reqPayment) {
      console.error("Error initiating payment:", reqPayment);
      return res.status(400).json("Error sending data");
    }
    
    if (reqPayment.status === 200) {
      const transaction = new Transaction({
        product_id: productId,
        amount: amount,
      });
      await transaction.save();
      console.log("Transaction passed");
      return res.send({
        url: reqPayment.request.res.responseUrl,
      });
    } else {
      console.error("Error initiating payment:", reqPayment);
      return res.status(400).json({ message: "Payment initiation failed" });
    }
  } catch (error) {
    console.error("Error during payment initiation:", error);
    return res.status(400).json("Error sending data");
  }
};

const paymentStatus = async (req, res) => {
  const { product_id } = req.body; // Extract data from request body
  try {
    // Find the transaction by its product_id
    const transaction = await Transaction.findOne({ product_id });
    if (!transaction) {
      console.error("Transaction not found for product_id:", product_id);
      return res.status(404).json({ message: "Transaction not found" });
    }

    const paymentStatusCheck = await EsewaCheckStatus(
      transaction.amount, transaction.product_id, process.env.MERCHANT_ID, process.env.ESEWAPAYMENT_STATUS_CHECK_URL
    );

    if (paymentStatusCheck.status === 200) {
      // Update the transaction status
      transaction.status = paymentStatusCheck.data.status;
      await transaction.save();
      res.status(200).json({ message: "Transaction status updated successfully" });
    } else {
      console.error("Error checking payment status:", paymentStatusCheck);
      return res.status(400).json({ message: "Payment status check failed" });
    }
  } catch (error) {
    console.error("Error updating transaction status:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export { EsewaInitiatePayment, paymentStatus };
