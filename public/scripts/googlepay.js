// $(document).ready(function() {

//Google pay config

const tokenizationSpecification = {
  type: 'PAYMENT_GATEWAY',
  parameters: {
    gateway: 'example',
    gatewayMerchantId: 'exampleGatewayMerchantId',
  }
};

const cardPaymentMethod = {
  type: 'CARD',
  parameters: {
    allowedCardNetworks: ['VISA', 'MASTERCARD'],
    allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
  }
};

const googlePayConfiguration = {
  apiVersion: 2,
  apiVersionMinor: 0,
  allowedPaymentMethods: [cardPaymentMethod],
};

//Payments client

let googlePayClient;

//Function that runs when google pay is loaded

function onGooglePayLoaded() {
  googlePayClient = new google.payments.api.PaymentsClient({
    environment: 'TEST',
  });
  console.log('google pay loaded!')

  googlePayClient.isReadyToPay(googlePayConfiguration)
  .then(response => {
    if(response.result) {
      createAndAddButton();
    } else {
      //no button generated. Don't do anything.
    }
  })
  .catch(error => console.error('isReadyToPay error:', error));
};



//google pay button creation

function createAndAddButton() {
  const googlePayButton = googlePayClient.createButton({
    onClick: onGooglePayButtonClicked,
  })

  document.getElementById('buy-now').append(googlePayButton);
};

function onGooglePayButtonClicked() {

  const paymentDataRequest = {... googlePayConfiguration };
  paymentDataRequest.merchantInfo = {
    merchantId: 'example',
    merchantName: 'Pop.Eats',
  };

  paymentDataRequest.transactionInfo = {
    totalPriceStatus: 'FINAL',
    totalPrice: selectedItem.price,
    currencyCode: 'CAD',
    countryCode: 'CA'
  };

  googlePayClient.loadPaymentData(paymentDataRequest)
  .then(paymentData => { processPaymentData(paymentData)
  })
  .catch(error => console.error('loadPaymentData error: ', error));
};

function processPaymentData(paymentData) {
  fetch(ordersEndPointUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: paymentData
  })
}

// });
