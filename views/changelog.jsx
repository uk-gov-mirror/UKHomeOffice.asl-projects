import React from 'react';
import Layout from './layout';

class Index extends React.Component {

  render() {
    return <Layout {...this.props}>
      <main className="main govuk-main-wrapper" id="content">
        <div className="govuk-width-container">
          <h1>Changelog</h1>

          <h2>Version 2.2.2 - 26th March 2019</h2>
          <ul>
            <li>Fixed: protocols species not updating when new species selected</li>
            <li>Fixed: protocols not working when undefined other species added</li>
            <li>Fixed: Unable to export Word document in ppl tool</li>
            <li>Fixed: Reduction number of animals broken for other species</li>
            <li>Fixed: Project duration isn't saved in PPL tool</li>
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
