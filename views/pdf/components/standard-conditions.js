import React from 'react';
import ReactMarkdown from 'react-markdown';
import STANDARD_CONDITIONS from '../../../client/constants/standard-conditions';

const StandardConditions = () => (
  <section className="section standard-conditions">
    <h2>Standard conditions</h2>
    <ol>
      {
        STANDARD_CONDITIONS.map((condition, index) => (
          <li key={index}>
            <div className="purple-inset">
              <ReactMarkdown>{condition}</ReactMarkdown>
            </div>
          </li>
        ))
      }
    </ol>
  </section>
);

export default StandardConditions;
