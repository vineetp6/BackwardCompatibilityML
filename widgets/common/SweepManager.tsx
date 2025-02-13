// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React, { Component } from "react";
import { PrimaryButton } from '@fluentui/react/lib/Button';


type SweepManagerProps = {
  sweepStatus: any,
  getSweepStatus: () => void,
  startSweep: () => void,
  getTrainingAndTestingData: () => void
}

class SweepManager extends Component<SweepManagerProps> {
  constructor(props) {
    super(props);

    this.pollSweepStatus = this.pollSweepStatus.bind(this);
    this.startSweep = this.startSweep.bind(this);
  }

  timeoutVar: NodeJS.Timeout = null

  componentWillUnmount() {
    if (this.timeoutVar != null) {
      clearTimeout(this.timeoutVar);
    }
  }

  pollSweepStatus() {
    this.props.getSweepStatus();
    if (this.timeoutVar != null) {
      clearTimeout(this.timeoutVar);
      this.timeoutVar = null;
    }
    this.timeoutVar = setTimeout(this.pollSweepStatus, 5000);
  }

  startSweep(evt) {
    this.props.startSweep();
    this.timeoutVar = setTimeout(this.pollSweepStatus, 500);
  }

  render() {

    if (this.props.sweepStatus == null || !this.props.sweepStatus.running) {
      if (this.timeoutVar != null && this.props.sweepStatus.percent_complete == 1.0) {
        clearTimeout(this.timeoutVar);
        this.timeoutVar = null;
        this.props.getTrainingAndTestingData();
      }

      return (
        <div className="start-sweep-header">
          <h1>Backward Compatibility Analysis for Updated Model</h1>
          <PrimaryButton text="Start Sweep" onClick={this.startSweep} />
        </div>
      );
    }

    return (
      <div className="table">
        Sweep in progress
        <div>
         {Math.floor(this.props.sweepStatus.percent_complete * 100)} % complete
        </div>
      </div>
    );
  }
}
export default SweepManager;
