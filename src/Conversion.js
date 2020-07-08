import { render } from "react-dom";
import React from "react";
import debounce from "lodash.debounce";
import axios from "axios";

class FeesTable extends React.Component {
  render() {
    return <div />;
  }
}

class Conversion extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      originAmount: "0.00",
      originCurrency: "USD",
      destinationAmount: "0.00",
      destinationCurrency: "EUR",
      feeAmount: 0.0,
      conversionRate: 1.5,
      totalCost: 0.0,
      errorMsg: ""
    };

    this.handleOriginAmountChange = this.handleOriginAmountChange.bind(this);
  }

  componentDidMount() {
    this.makeConversionAjaxCall = debounce(this._makeConversionAjaxCall, 350);
    this.makeFeeAjaxCall = debounce(this._makeFeeAjaxCall, 350);
  }

  handleAjaxFailure(resp) {
    let msg = "Error. Please try again later";
    if (resp && resp.request && resp.request.status === 0) {
      msg = "App appears to be offline";
    }
    this.setState({
      errorMsg: msg
    });
  }

  clearErrorMessage() {
    if (this.state.errorMsg) {
      this.setState({
        errorMsg: ""
      });
    }
  }
  handleOriginAmountChange(event) {
    var newAmount = event.target.value;
    newAmount = newAmount.replace(",", "");
    this.setState({ originAmount: newAmount });

    //get new dst amt
    this.makeConversionAjaxCall(
      {
        currentlyEditing: "origin",
        newValue: newAmount
      },
      resp => {
        this.clearErrorMessage();
        this.setState({
          conversionRate: resp.xRate,
          destinationAmount: resp.destAmount
        });
      },
      this.handleAjaxFailure
    );

    this.makeFeeAjaxCall(
      {
        originAmount: newAmount,
        originCurrency: this.state.originCurrency,
        destCurrency: this.state.destinationCurrency
      },
      resp => {
        this.setState({
          feeAmount: resp.feeAmount
        });
        this.calcNewTotal();
      }
    );
  }

  calcNewTotal() {
    var newTotal =
      parseFloat(this.state.originAmount, 10) +
      parseFloat(this.state.feeAmount, 10);
    this.setState({
      totalCost: parseFloat(newTotal)
    });
  }
  _makeConversionAjaxCall(data, successCallback, failureCallback) {
    var originCurrency = this.state.originCurrency;
    var destCurrency = this.state.destinationCurrency;
    var payload = {
      originAmount: data.newValue,
      destAmount: data.newValue,
      originCurrency: originCurrency,
      destCurrency: destCurrency,
      calcOriginAmount: false
    };

    //check whether we need to calculate origin or destination amount
    if (data.currentlyEditing === "dest") {
      payload.calcOriginAmount = true;
    }
    axios
      .get("/api/conversion", {
        params: payload
      })
      .then(resp => {
        successCallback(resp.data);
      })
      .catch(failureCallback);
  }
  _makeFeeAjaxCall(payload, successCallback, failureCallback) {
    axios
      .get("/api/fees", {
        params: payload
      })
      .then(resp => {
        successCallback(resp.data);
      })
      .catch(failureCallback);
  }
  render() {
    if (this.state.errorMsg) {
      var errorMsg = <div className="errorMsg">{this.state.errorMsg}</div>;
    }
    return (
      <div>
        <p>Hello World!!</p>
        {errorMsg}
        <label>Convert</label>
        <input
          className="amount-field"
          ref={input => (this.originAmountInput = input)}
          onChange={this.handleOriginAmountChange}
          value={this.state.originAmount}
        />
        <select
          value={this.state.originCurrency}
          onChange={this.handleOriginCurrencyChange}
        >
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
          <option value="JPY">JPY</option>
        </select>
        to{" "}
        <input
          className="amount-field"
          onChange={this.handleDestAmountChange}
          value={this.state.destinationAmount}
        />
        <select
          value={this.state.destinationCurrency}
          onChange={this.handleDestCurrencyChange}
        >
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
          <option value="JPY">JPY</option>
        </select>
      </div>
    );
  }
}
export default Conversion;
