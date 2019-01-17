import React from 'react';
import { Button } from '@ukhomeoffice/react-components';

const NTS = ({ accepted, onAccept, review, hideTitle }) => (
  <div className="nts">
    {
      !hideTitle && <h3>Creating your non-technical summary</h3>
    }
    <p>Any information you enter on this screen will form part of a non-technical summary (NTS) on GOV.UK, so use everyday language that can be easily understood by members of the public.</p>
    <p>As an NTS is a public document, do not include any information that could identify any people, locations, or intellectual property related to your project. You will be able to review your NTS as a whole before you send your licence application to the Home Office.</p>
    {
      !review && (
        <Button disabled={accepted} onClick={onAccept}>Continue</Button>
      )
    }
  </div>
);

export default NTS;
