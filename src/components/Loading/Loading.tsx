import React from 'react';
import { LoadPanel } from 'devextreme-react/load-panel';

type LoadingProps = {
  visible: boolean;
};

class Loading extends React.Component<LoadingProps> {
  render() {
    const { visible } = this.props;

    return (
      <div className="__loading">
        <LoadPanel
          shadingColor="rgba(0,0,0,0.4)"
          visible={visible}
          showIndicator={true}
          shading={true}
          showPane={true}
        />
      </div>
    );
  }
}

export default Loading;