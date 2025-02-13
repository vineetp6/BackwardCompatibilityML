// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { DirectionalHint } from '@fluentui/react';
import React from 'react'
import { InfoTooltip } from "./InfoTooltip.tsx"
import { Dropdown, DropdownMenuItemType, IDropdownStyles, IDropdownOption } from '@fluentui/react/lib/Dropdown';

type PointSelectorProps = {
  testing: boolean,
  training: boolean,
  newError: boolean,
  strictImitation: boolean,
  lambdaLowerBound: number,
  lambdaUpperBound: number,
  data: any,
  getModelEvaluationData: Function,
  selectedDataPoint: any
}

const PointSelector: React.FunctionComponent<PointSelectorProps> = ({ testing, training, newError, strictImitation,
                                                                      lambdaLowerBound, lambdaUpperBound, data,
                                                                      getModelEvaluationData, selectedDataPoint }) => {
  const [selectedLambda, setSelectedLambda] = React.useState("");
  const [selectedDataset, setSelectedDataset] = React.useState("");
  const [selectedDissonance, setSelectedDissonance] = React.useState("");
  const legendEntries: Array<JSX.Element> = [];

  if (selectedDataPoint) {
    // Sync state with selected data
    const point = data.find(d => d.datapoint_index === selectedDataPoint.datapoint_index);
    if (!point) {
      console.log(`Unable to find data point with index=${selectedDataPoint.datapoint_index}`);
      return;
    }

    if (point["new-error"] && selectedDissonance !== "new-error") {
      setSelectedDissonance("new-error");
    } else if (point["strict-imitation"] && selectedDissonance !== "strict-imitation") {
      setSelectedDissonance("strict-imitation");
    }

    if (point["testing"] && selectedDataset !== "testing") {
      setSelectedDataset("testing");
    } else if (point["training"] && selectedDataset !== "training") {
      setSelectedDataset("training");
    }

    if (point.lambda_c.toString() !== selectedLambda) {
      setSelectedLambda(point.lambda_c.toString());
    }
  }

  if (training) {
    if (newError) {
      legendEntries.push(
        <div className="point-legend-entry">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="8" cy="8" r="7" fill="#76C5FF" stroke="black" />
          </svg>
          New Error - Training
        </div>
      );
    }
    if (strictImitation) {
      legendEntries.push(
        <div className="point-legend-entry">
          <svg width="17" height="15" viewBox="0 0 17 15" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8.5 1L15.8612 13.75H1.13878L8.5 1Z" fill="#76C5FF" stroke="black" />
          </svg>
          Strict Imitation - Training
        </div>
      );
    }
  }

  if (testing) {
    if (newError) {
      legendEntries.push(
        <div className="point-legend-entry">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="8" cy="8" r="7" fill="#F551B3" stroke="black" />
          </svg>
          New Error - Testing
        </div>
      );
    }
    if (strictImitation) {
      legendEntries.push(
        <div className="point-legend-entry">
          <svg width="17" height="15" viewBox="0 0 17 15" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8.5 1L15.8612 13.75H1.13878L8.5 1Z" fill="#F551B3" stroke="black" />
          </svg>
          Strict Imitation - Testing
        </div>
      );
    }
  }

  const datasetOptions: IDropdownOption[] = [
    { key: 'training', text: 'Training' },
    { key: 'testing', text: 'Testing' }
  ];

  const dissonanceOptions: IDropdownOption[] = [
    { key: 'new-error', text: 'New Error' },
    { key: 'strict-imitation', text: 'Strict Imitation' }
  ];

  const lambdaSet = new Set<number>();
  data.forEach(d => lambdaSet.add(d.lambda_c));
  const lambdaValues = Array.from(lambdaSet).filter(n => n >= lambdaLowerBound && n <= lambdaUpperBound).sort();

  const lambdaOptions = lambdaValues.map(lambda => {
    const rounded = lambda.toFixed(2);
    return { key: lambda.toString(), text: rounded }
  });

  const selectPoint = (dataset: string, dissonance: string, lambda: string) => {
    console.log(`Point selected from dropdown: dataset=${dataset} dissonance=${dissonance} λ=${lambda}`);
    if (dataset !== "" && dissonance !== "" && lambda !== "") {
      const point = data.find(d => d[dataset] && d[dissonance] && d.lambda_c.toString() === lambda);
      if (point) {
        console.log(`Point index=${point.datapoint_index}`);
        getModelEvaluationData(point.datapoint_index);
      } else {
        console.log("Point not found in data");
      }
    }
  }

  const onDatasetChange = (event: React.FormEvent<HTMLDivElement>, item: IDropdownOption) => {
    const dataset = item.key.toString()
    setSelectedDataset(dataset);
    selectPoint(dataset, selectedDissonance, selectedLambda);
  };

  const onDissonanceChange = (event: React.FormEvent<HTMLDivElement>, item: IDropdownOption) => {
    const dissonance = item.key.toString()
    setSelectedDissonance(dissonance);
    selectPoint(selectedDataset, dissonance, selectedLambda);
  };

  const onLambdaChange = (event: React.FormEvent<HTMLDivElement>, item: IDropdownOption) => {
    const lambda = item.key.toString();
    setSelectedLambda(lambda);
    selectPoint(selectedDataset, selectedDissonance, lambda);
  };

  const keyHelper = (s: string) => s === "" ? undefined : s;

  return (
    <div className="point-selector">
      <div className="point-selector-row">
        {legendEntries}
      </div>
      <div className="point-selector-row" style={{ marginTop: "20px" }}>
        <span style={{ marginRight: "12px" }}>Select a point</span>
        <InfoTooltip message="Choose a point by dataset, dissonance function, and lambda value" direction={DirectionalHint.bottomCenter} />
        <Dropdown placeholder="Dataset" selectedKey={keyHelper(selectedDataset)} options={datasetOptions} onChange={onDatasetChange} styles={{ root: { marginLeft: "26px", marginRight: "16px" } }} />
        <Dropdown placeholder="Dissonance function" selectedKey={keyHelper(selectedDissonance)} options={dissonanceOptions}  onChange={onDissonanceChange} styles={{ root: { marginRight: "32px" } }} />
        <span>λ value:</span>
        <Dropdown placeholder="λ value" options={lambdaOptions} selectedKey={keyHelper(selectedLambda)} onChange={onLambdaChange} styles={{ root: { marginLeft: "20px" } }} />
      </div>
    </div>
  )
}

export default PointSelector;