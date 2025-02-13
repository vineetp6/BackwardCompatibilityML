// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from "react";
import ReactDOM from "react-dom";
import PerformanceCompatibility from "../common/PerformanceCompatibility.tsx";
import PointSelector from "../common/PointSelector.tsx";
import IntersectionBetweenModelErrors from "../common/IntersectionBetweenModelErrors.tsx";
import ClassStatisticsPanel from "../common/IncompatiblePointDistribution.tsx";
import ErrorInstancesTable from "../common/ErrorInstancesTable.tsx";
import DataSelector from "../common/DataSelector.tsx"
import SweepManager from "../common/SweepManager.tsx";
import SelectedModelDetails from "../common/SelectedModelDetails.tsx";
import LambdaSlider from "../common/LambdaSlider.tsx";
import { bindActionCreators } from "redux";
import { connect } from 'react-redux';
import {
  toggleTraining,
  toggleTesting,
  toggleNewError,
  toggleStrictImitation,
  selectDataPoint,
  setSelectedClass,
  setSelectedRegion,
  setLambdaLowerBound,
  setLambdaUpperBound,
  getTrainingAndTestingData,
  getModelEvaluationData,
  getSweepStatus,
  startSweep,
  filterByInstanceIds,
  setSelectedModelAccuracyClass
} from './actions.ts';


function Container({
  data,
  sweepStatus,
  selectedDataPoint,
  selectedClass,
  selectedRegion,
  selectedModelAccuracyClass,
  setSelectedClass,
  setSelectedRegion,
  lambdaLowerBound,
  lambdaUpperBound,
  setLambdaLowerBound,
  setLambdaUpperBound,
  filterInstances,
  training,
  testing,
  newError,
  strictImitation,
  error,
  loading,
  toggleTraining,
  toggleTesting,
  toggleNewError,
  toggleStrictImitation,
  selectDataPoint,
  getTrainingAndTestingData,
  getModelEvaluationData,
  getSweepStatus,
  startSweep,
  filterByInstanceIds,
  setSelectedModelAccuracyClass}) {

    if (loading) {
      return (
        <div>Loading...</div>
      );
    } else if (error != null) {
      return (
        <div>Error loading data</div>
      );
    } else if (error == null && data == null) {
      getTrainingAndTestingData();
      return (
        <div>Loading...</div>
      );
    } else if (error == null && data.data.length == 0 && sweepStatus == null) {
      return (
        <div className="container">
            <div className="row">
              <SweepManager
                sweepStatus={sweepStatus}
                getSweepStatus={getSweepStatus}
                startSweep={startSweep}
                getTrainingAndTestingData={getTrainingAndTestingData}
              />
            </div>
        </div>
      );
    } else if (sweepStatus != null && sweepStatus.running) {
      return (
        <div className="container">
            <div className="row">
              <SweepManager
                sweepStatus={sweepStatus}
                getSweepStatus={getSweepStatus}
                startSweep={startSweep}
                getTrainingAndTestingData={getTrainingAndTestingData}
              />
            </div>
        </div>
      );
    }

    return (
      <div className="main-container">
        <div className="row">
            <SweepManager
              sweepStatus={sweepStatus}
              getSweepStatus={getSweepStatus}
              startSweep={startSweep}
              getTrainingAndTestingData={getTrainingAndTestingData}
            />
        </div>
        <div className="padded-container">
          <h2>h2 Dataset Distribution</h2>
          <div className="two-column-row">
            <DataSelector
              toggleTraining={toggleTraining}
              toggleTesting={toggleTesting}
              toggleNewError={toggleNewError}
              toggleStrictImitation={toggleStrictImitation}
            />
            <LambdaSlider
              setLambdaLowerBound={setLambdaLowerBound}
              setLambdaUpperBound={setLambdaUpperBound}
              lambdaLowerBound={lambdaLowerBound}
              lambdaUpperBound={lambdaUpperBound}
            />
          </div>
          <div className="plot-container">
            <PointSelector
              testing={testing}
              training={training}
              newError={newError}
              strictImitation={strictImitation}
              lambdaLowerBound={lambdaLowerBound}
              lambdaUpperBound={lambdaUpperBound}
              data={data.data}
              getModelEvaluationData={getModelEvaluationData}
              selectedDataPoint={selectedDataPoint}
            />
            <div className="two-column-row">
              <PerformanceCompatibility
                data={data.data}
                h1Performance={data.h1_performance}
                performanceMetric={data.performance_metric}
                training={training}
                testing={testing}
                newError={newError}
                strictImitation={strictImitation}
                lambdaLowerBound={lambdaLowerBound}
                lambdaUpperBound={lambdaUpperBound}
                compatibilityScoreType="btc"
                selectDataPoint={selectDataPoint}
                getModelEvaluationData={getModelEvaluationData}
                selectedDataPoint={selectedDataPoint}
              />
              <PerformanceCompatibility
                data={data.data}
                h1Performance={data.h1_performance}
                performanceMetric={data.performance_metric}
                training={training}
                testing={testing}
                newError={newError}
                strictImitation={strictImitation}
                lambdaLowerBound={lambdaLowerBound}
                lambdaUpperBound={lambdaUpperBound}
                compatibilityScoreType="bec"
                selectDataPoint={selectDataPoint}
                getModelEvaluationData={getModelEvaluationData}
                selectedDataPoint={selectedDataPoint}
              />
            </div>
          </div>
          {(selectedDataPoint != null)? 
          <>
            <h2>Model Comparison</h2>
            <SelectedModelDetails btc={selectedDataPoint.btc} bec={selectedDataPoint.bec} h1Performance={data.h1_performance} h2Performance={selectedDataPoint.h2_performance} performanceMetric={data.performance_metric} lambdaC={selectedDataPoint.lambda_c} />
          </>
            : null}
          <div className="row">
            <IntersectionBetweenModelErrors selectedDataPoint={selectedDataPoint} setSelectedRegion={setSelectedRegion} selectedRegion={selectedRegion} filterByInstanceIds={filterByInstanceIds}/>
            <ClassStatisticsPanel
              selectedDataPoint={selectedDataPoint}
              setSelectedClass={setSelectedClass}
              selectedClass={selectedClass}
              selectedModelAccuracyClass={selectedModelAccuracyClass}
              setSelectedModelAccuracyClass={setSelectedModelAccuracyClass}
              filterByInstanceIds={filterByInstanceIds}
            />
          </div>
          <h2>Error Instance View</h2>
          <div className="row">
            <ErrorInstancesTable selectedDataPoint={selectedDataPoint} filterInstances={filterInstances} />
          </div>
        </div>
      </div>
    );
}

function mapStateToProps (state) {
  return {
    data: state.data,
    sweepStatus: state.sweepStatus,
    selectedDataPoint: state.selectedDataPoint,
    selectedClass: state.selectedClass,
    selectedRegion: state.selectedRegion,
    selectedModelAccuracyClass: state.selectedModelAccuracyClass,
    filterInstances: state.filterInstances,
    lambdaLowerBound: state.lambdaLowerBound,
    lambdaUpperBound: state.lambdaUpperBound,
    training: state.training,
    testing: state.testing,
    newError: state.newError,
    strictImitation: state.strictImitation,
    error: state.error,
    loading: state.loading
  };
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    toggleTraining: toggleTraining,
    toggleTesting: toggleTesting,
    toggleNewError: toggleNewError,
    toggleStrictImitation: toggleStrictImitation,
    selectDataPoint: selectDataPoint,
    setSelectedClass: setSelectedClass,
    setSelectedRegion: setSelectedRegion,
    setLambdaLowerBound: setLambdaLowerBound,
    setLambdaUpperBound: setLambdaUpperBound,
    getTrainingAndTestingData: getTrainingAndTestingData,
    getModelEvaluationData: getModelEvaluationData,
    getSweepStatus: getSweepStatus,
    startSweep: startSweep,
    filterByInstanceIds: filterByInstanceIds,
    setSelectedModelAccuracyClass: setSelectedModelAccuracyClass,
  }, dispatch);
 }

const MainContainer = connect(mapStateToProps, mapDispatchToProps)(Container)

export default MainContainer;
