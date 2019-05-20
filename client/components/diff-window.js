import React, { Fragment } from 'react';
import { Button } from '@ukhomeoffice/react-components';
import ModalWindow from './modal';

class DiffWindow extends React.Component {
  state = { open: false };

  render() {
    return (
      <Fragment>
        <Button onClick={() => this.setState({ open: true })}>Open</Button>
        {this.state.open && <ModalWindow versions={this.props.versions} />}
      </Fragment>
    );
  }
}
export default DiffWindow;
