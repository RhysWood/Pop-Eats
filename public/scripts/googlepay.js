import './node_modules/@google-pay/button-element/dist/index.js';

function onLoadPaymentData(paymentData) {
  console.log('load payment data', paymentData);
}

const staticButton = document.getElementById('static');

staticButton.paymentRequest = {
  apiVersion: 2,
  apiVersionMinor: 0,
  allowedPaymentMethods: [
    {
      type: 'CARD',
      parameters: {
        allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
        allowedCardNetworks: ['MASTERCARD', 'VISA'],
        billingAddressParameters: {
          format: 'MIN',
        },
      },
      tokenizationSpecification: {
        type: 'PAYMENT_GATEWAY',
        parameters: {
          gateway: 'example',
          gatewayMerchantId: 'exampleGatewayMerchantId',
        },
      },
    },
  ],
  merchantInfo: {
    merchantId: '12345678901234567890',
    merchantName: 'Demo Merchant',
  },
  transactionInfo: {
    totalPriceStatus: 'FINAL',
    totalPriceLabel: 'Total',
    totalPrice: '100.00',
    currencyCode: 'CAD',
    countryCode: 'CA',
  },
};
staticButton.onLoadPaymentData = onLoadPaymentData;
