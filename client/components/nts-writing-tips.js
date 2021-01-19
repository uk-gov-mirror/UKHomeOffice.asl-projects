import React from 'react';
import { Details } from '@asl/components';

export default function NTSWritingTips() {
  return (
    <Details summary="Tips on writing for the public">
      <ul>
        <li>use short sentences - these are easier to read</li>
        <li>use bullet points to break up long paragraphs of text</li>
        <li>if you have several points to make, separate them with headings</li>
        <li>leave out extensive detail or background information - give the information required and no more</li>
        <li>{`use simple words instead of long words, for example, instead of saying "The findings are indicative of..." say, "The findings suggest" or "The findings show"`}</li>
        <li>explain technical terms in brackets wherever possible</li>
      </ul>
    </Details>
  );
}
