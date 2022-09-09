import React, { Fragment } from 'react';
import Protocols from '../protocols/review';
import PdfProtocols from './pdf-protocols';

const GrantedProtocols = ({ pdf, ...props }) => (
  <Fragment>
    {
      pdf
        ? <PdfProtocols {...props} />
        : <Protocols {...props} />
    }
  </Fragment>
);

export default GrantedProtocols;
