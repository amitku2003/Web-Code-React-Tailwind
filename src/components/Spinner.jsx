import React from 'react';
import { LineWave } from "react-loader-spinner";

function Spinner(){
  return (
    <LineWave
        visible={true}
        height="100"
        width="100"
        color="#4fa94d"
        ariaLabel="line-wave-loading"
        wrapperStyle={{}}
        wrapperClass=""
        firstLineColor="#1E88E5"
        middleLineColor="#FDD835"
        lastLineColor="#D81B60"
    />
  );
}

export default Spinner;
