import React, { useState }  from "react";
import { useSelector } from "react-redux";
import { PaymentElement } from "@stripe/react-stripe-js";
import { useStripe, useElements } from "@stripe/react-stripe-js";
import Button from "@mui/material/Button";
import {
  Card,
  CardContent
} from "@mui/material";
import { selectCompanies } from "./slices/companyInformationSlice";

export default function CheckoutForm(props) {
  console.log(props.amount);
  const stripe = useStripe();
  const elements = useElements();
  const companies = useSelector(selectCompanies);
  const countOfCompany = (Object.keys(companies)).length;
  console.log("countOfCompany", countOfCompany);

  const [message, setMessage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isStripeReady, setIsStripeReady] = useState(false);

  const onStripeReady = () => {
    setIsStripeReady(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setIsProcessing(true);

    const { error } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required'
    });

    if (error) {
      if (error.type === "card_error" || error.type === "validation_error") {
        setMessage(error.message);
      } else {
        setMessage("An unexpected error occured.");
      }
    }

    await props.saveData();
    
    setIsProcessing(false);
  };

  return (
    <Card id="payment-form" className="card company-information">
        <CardContent>
          <PaymentElement id="payment-element" onReady={onStripeReady} />
          <Button
            variant="contained"
            className="submit-button"
            disabled={!isStripeReady || isProcessing || !stripe || !elements}
            onClick={handleSubmit}
          >
            {isProcessing ? "Processing ... " : `Submit & Pay $${countOfCompany * 100}`}
          </Button>
          {message && <div id="payment-message">{message}</div>}
        </CardContent>
      </Card>
  );
}
