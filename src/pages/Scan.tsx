import React, { useState, useEffect, useRef } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';
import { analyzeImageWithVision } from '../utils/visionApi';
import { getNutritionData } from '../utils/edamamApi';
import '../styles/LensApp.css';

const LensApp: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [foodData, setFoodData] = useState<{ foodName: string; calories: number } | null>(null);
  const [chatMessages, setChatMessages] = useState<{ sender: string; message: string }[]>([]);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const webcamRef = useRef<Webcam>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isCameraOn) {
      interval = setInterval(() => {
        capture();
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [isCameraOn]);

  const capture = async () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setImage(imageSrc);
      await analyzeImage(imageSrc);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsCameraOn(false);
      const reader = new FileReader();
      reader.onload = async (e) => {
        const imageSrc = e.target?.result as string;
        setImage(imageSrc);
        await analyzeImage(imageSrc);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async (imageSrc: string) => {
    setIsAnalyzing(true);
    try {
        const response = await axios.post('http://localhost:8080/analyze', {
      image: imageSrc,
      });
      setFoodData(response.data);
      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          message: `Detected: ${response.data.foodName}, Calories: ${response.data.calories}`,
        },
      ]);
    } catch (error) {
      console.error('Error analyzing image:', error);
      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          message: 'Unable to analyze image. Check server connection.',
        },
      ]);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const toggleCamera = () => {
    setIsCameraOn(!isCameraOn);
    setImage(null);
    setFoodData(null);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="lens-app">
      <div className="camera-view">
        {isCameraOn && (
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            className="webcam"
          />
        )}
        {image && !isCameraOn && (
          <img src={image} alt="Uploaded" className="uploaded-image" />
        )}
        
        <div className="lens-overlay">
          <div className="scan-area">
            {isAnalyzing && (
              <div className="scanning-effect">
                <div className="scan-line"></div>
              </div>
            )}
          </div>
        </div>

        <div className="controls">
          <button className="action-btn upload-btn" onClick={triggerFileInput} title="Upload Image">
            <span className="material-icons">upload</span>
          </button>
          <button
            className="capture-btn"
            onClick={isCameraOn ? capture : toggleCamera}
            title={isCameraOn ? 'Capture' : 'Open Camera'}
          >
            <span className="material-icons">{isCameraOn ? 'camera' : 'videocam'}</span>
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*"
            style={{ display: 'none' }}
          />
        </div>
      </div>

      <div className="results-panel">
        <div className="chat-section">
          {chatMessages.length > 0 ? (
            chatMessages.map((msg, index) => (
              <div key={index} className={`chat-bubble ${msg.sender}`}>{msg.message}</div>
            ))
          ) : (
            <div className="empty-state">
              {isCameraOn ? 'Point camera at food to analyze' : 'Upload an image to analyze'}
            </div>
          )}
        </div>
        {foodData && (
          <div className="info-card">
            <h2>{foodData.foodName}</h2>
            <div className="nutrition-info">
              <span className="material-icons">local_fire_department</span>
              <p>{foodData.calories} kcal</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LensApp;