import React, { useRef, useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import * as faceMesh from '@mediapipe/face_mesh';

const CameraWithFilters = () => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [selectedFilter, setSelectedFilter] = useState('none');

  // Load the FaceMesh model
  useEffect(() => {
    const faceMeshModel = new faceMesh.FaceMesh({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
    });

    faceMeshModel.setOptions({
      maxNumFaces: 1,
      refineLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    faceMeshModel.onResults((results) => {
      drawFilters(results);
    });

    if (webcamRef.current && webcamRef.current.video.readyState === 4) {
      const video = webcamRef.current.video;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      const sendToModel = async () => {
        if (video && faceMeshModel) {
          await faceMeshModel.send({ image: video });
        }
        requestAnimationFrame(sendToModel);
      };

      sendToModel();
    }
  }, []);

  // Draw filters on the canvas
  const drawFilters = (results) => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);

    if (results.multiFaceLandmarks) {
      results.multiFaceLandmarks.forEach((landmarks) => {
        if (selectedFilter === 'dog') {
          drawDogFilter(context, landmarks);
        } else if (selectedFilter === 'clown') {
          drawClownFilter(context, landmarks);
        }
      });
    }
  };

  const drawDogFilter = (context, landmarks) => {
    const nose = landmarks[2]; // Nose landmark
    const leftEar = landmarks[234];
    const rightEar = landmarks[454];

    context.fillStyle = 'brown';
    context.beginPath();
    context.arc(nose.x * canvasRef.current.width, nose.y * canvasRef.current.height, 50, 0, Math.PI * 2);
    context.fill();

    context.fillStyle = 'black';
    context.beginPath();
    context.arc(leftEar.x * canvasRef.current.width, leftEar.y * canvasRef.current.height, 20, 0, Math.PI * 2);
    context.fill();
    context.beginPath();
    context.arc(rightEar.x * canvasRef.current.width, rightEar.y * canvasRef.current.height, 20, 0, Math.PI * 2);
    context.fill();
  };

  const drawClownFilter = (context, landmarks) => {
    const nose = landmarks[2]; // Nose landmark

    context.fillStyle = 'red';
    context.beginPath();
    context.arc(nose.x * canvasRef.current.width, nose.y * canvasRef.current.height, 20, 0, Math.PI * 2);
    context.fill();

    // Add clown smile
    context.strokeStyle = 'red';
    context.lineWidth = 4;
    context.beginPath();
    context.arc(
      nose.x * canvasRef.current.width,
      nose.y * canvasRef.current.height + 40,
      50,
      0,
      Math.PI,
      false
    );
    context.stroke();
  };

  return (
    <div className="camera-container">
      <Webcam
        ref={webcamRef}
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          zIndex: 1,
        }}
      />
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          zIndex: 2,
        }}
      />
      <div className="filter-controls">
        <button onClick={() => setSelectedFilter('none')}>None</button>
        <button onClick={() => setSelectedFilter('dog')}>Dog Filter</button>
        <button onClick={() => setSelectedFilter('clown')}>Clown Filter</button>
      </div>
    </div>
  );
};

export default CameraWithFilters;