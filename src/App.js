import React from 'react';
import KycContainer from './component/kyc'

function App() {
  
  const webcamRefDoc = React.useRef(null);
  const webcamRefFace = React.useRef(null);

  let webcamImgDoc = null;
  let webcamImgFace = null;
 
  const captureDoc = React.useCallback(
    () => {
      webcamImgDoc = webcamRefDoc.current.getScreenshot();
      return webcamImgDoc;
    },
    [webcamRefDoc]
  );

  return (
    <div className="App">
      <KycContainer webcamRefDoc={webcamRefDoc} captureDoc={captureDoc} />
    </div>
  );
}

export default App;
