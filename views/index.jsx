import React from 'react';
import Layout from './layout';

class Index extends React.Component {

  render() {
    return <Layout {...this.props}>
      <main className="main govuk-main-wrapper" id="content">
        <div className="govuk-width-container">
          <div id="app"/>
        </div>
      </main>
    </Layout>
  }

}

export default Index;