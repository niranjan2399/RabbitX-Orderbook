import React from "react";
import classNames from "classnames";

const EntryDetails = ({ price, amount, type = "ask" }) => {
  return (
    <div className={classNames("entry", type)}>
      <span className="price">{price}</span>
      <span className="amount">{amount}</span>
    </div>
  );
};

export default EntryDetails;
