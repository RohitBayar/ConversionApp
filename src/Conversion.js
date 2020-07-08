import { render } from "react-dom";
import React from "react";

class Conversion extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      originCurrency: "USD",
      destinationAmount: "0.00",
      destinationCurrency: "EUR",
      feeAmount: 0.0,
      conversionRate: 1.5,
      totalCost: 0.0,
      errorMsg: ""
    };
  }
  render() {
    return (
      <div>
        <p>Hello World!!</p>
      </div>
    );
  }
}
export default Conversion;
