import React from 'react';
import Layout from './layout';

class Index extends React.Component {

  render() {
    return <Layout {...this.props}>
      <main className="main govuk-main-wrapper" id="content">
        <div className="govuk-width-container">
          <h1>Changelog</h1>

          <h2>Version 3.3.1 - 3rd May 2019</h2>
          <ul>
            <li>Feature: add questions for non-research licences</li>
            <li>Feature: add hint text markdown support for all fields</li>
            <li>Fixed: include NTS questions in document export</li>
            <li>Fixed: layout of questions in protocols - experimental design</li>
          </ul>

          <h2>Version 3.0.5 - 9th April 2019</h2>
          <ul>
            <li>Feature: style improvements to exported Word document</li>
            <li>Fixed: issue with species selection being exported into Word</li>
          </ul>

          <h2>Version 3.0.2 - 1st April 2019</h2>
          <ul>
            <li>Feature: confirm protocol/step removal</li>
            <li>Feature: infer primary establishment</li>
            <li>Content: strategy section renamed to Action plan</li>
            <li>Content: various issues</li>
          </ul>

          <h2>Version 2.2.3 - 26th March 2019</h2>
          <ul>
            <li>Content: minor copy updates</li>
          </ul>

          <h2>Version 2.2.2 - 26th March 2019</h2>
          <ul>
            <li>Fixed: protocols species not updating when new species selected</li>
            <li>Fixed: protocols not working when undefined other species added</li>
            <li>Fixed: unable to export Word document</li>
            <li>Fixed: reduction number of animals broken for other species</li>
            <li>Fixed: project duration isn't saved</li>
          </ul>

          <h2>Version 1.7.0 - 21st March 2019</h2>
          <ul>
            <li>Feature: protocols review page</li>
            <li>Feature: remove &quot;Protocols setup&quot; section</li>
            <li>Fixed: performance issues when multiple texteditors on page</li>
            <li>Fixed: issue exporting word documents when applications contain nested lists</li>
            <li>Fixed: rich text editors exceeding the height of the window when containing large amounts of text</li>
          </ul>

          <h2>Version 1.6.1 - 5th March 2019</h2>
          <ul>
            <li>Fixed: other species not showing in Word export</li>
            <li>Fixed: protocol species questions not appearing in Word export</li>
            <li>Fixed: &quot;minimise the suffering&quot; text-editor disappearing when given focus</li>
            <li>Fixed: &quot;animals taken from the wild&quot; review page shows questions that were not asked</li>
          </ul>

          <h2>Version 1.6.0 - 26th February 2019</h2>
          <ul>
            <li>Fixed: certain questions not being included in Word export</li>
            <li>Feature: add call to action on non-technical summary review page</li>
          </ul>
          <p><a href="/">Return to project list</a></p>
        </div>
      </main>
    </Layout>
  }

}

export default Index;
