import React, { useEffect, useRef, useState } from "react";
import Navigation from "./Navigation";
import { toast } from "sonner";
import * as faceapi from "face-api.js";

const Voter = ({ state, handleCase }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);

  // 1. Load face-api.js models on mount
  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = "/models";
      await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
      await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
      await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
      setModelsLoaded(true);
      startVideo();
    };
    loadModels();
  }, []);

  // 2. Start webcam stream
  const startVideo = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => (videoRef.current.srcObject = stream))
      .catch((err) => console.error("Webcam error:", err));
  };

  // 3. Capture face descriptor for biometric proof
  const captureFaceDescriptor = async () => {
    if (!modelsLoaded) {
      toast.error("Face models still loading…");
      throw new Error("Models not loaded");
    }
    const detection = await faceapi
      .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceDescriptor();
    if (!detection) {
      toast.error("No face detected—please center yourself in view");
      throw new Error("No face detected");
    }
    // draw a box on the overlay canvas
    faceapi.matchDimensions(canvasRef.current, {
      width: videoRef.current.width,
      height: videoRef.current.height,
    });
    const resized = faceapi.resizeResults(detection, {
      width: videoRef.current.width,
      height: videoRef.current.height,
    });
    faceapi.draw.drawDetections(canvasRef.current, resized);
    return JSON.stringify(detection.descriptor);
  };

  // 4. Handle voter registration (with biometric descriptor & voter ID)
  const handleVoterInfo = async (e) => {
    e.preventDefault();
    try {
      const descriptor = await captureFaceDescriptor();
      const voterId = document.querySelector("#voterId").value;
      const name = handleCase(document.querySelector("#nameV").value);
      const age = handleCase(document.querySelector("#ageV").value);
      const gender = handleCase(document.querySelector("#genderV").value);

      // Pass voterId to the contract as well
      await state.contract.voterRegister.send(
        voterId,
        name,
        age,
        gender,
        descriptor
      );
      toast.success(`Voter ${name} (ID: ${voterId}) registered successfully`);
    } catch (err) {
      console.error(err);
      toast.error(err.reason || "Registration failed");
    }
  };

  // 5. Handle casting a vote
  const handleVoting = async (e) => {
    e.preventDefault();
    try {
      const voterId = document.querySelector("#voterIdVote").value;
      const candidateId = document.querySelector("#candidateId").value;
      await state.contract.vote.send(voterId, candidateId);
      toast.success("Vote cast successfully");
    } catch (err) {
      console.error(err);
      toast.error(err.reason || "Voting failed");
    }
  };

  return (
    <div className="flex h-full space-x-32">
      <Navigation />

      <div className="w-3/5 h-4/5 flex flex-col items-center mt-10">
        <h1 className="text-2xl mb-8 text-gray-600 dark:text-gray-400">
          Voter Registration
        </h1>

        {/* Webcam + Canvas Overlay */}
        <div className="relative mb-6">
          <video
            ref={videoRef}
            autoPlay
            muted
            width="320"
            height="240"
            className="rounded-lg"
          />
          <canvas
            ref={canvasRef}
            width="320"
            height="240"
            className="absolute top-0 left-0"
          />
        </div>

        {/* Registration Form */}
        <form
          className="grid grid-cols-2 gap-6"
          onSubmit={handleVoterInfo}
        >
          <input
            id="voterId"
            type="text"
            placeholder="Voter ID"
            className="p-3 rounded-lg bg-white dark:bg-gray-900"
          />
          <input
            id="nameV"
            placeholder="Name"
            className="p-3 rounded-lg bg-white dark:bg-gray-900"
          />
          <input
            id="ageV"
            placeholder="Age"
            className="p-3 rounded-lg bg-white dark:bg-gray-900"
          />
          <input
            id="genderV"
            placeholder="Gender"
            className="p-3 rounded-lg bg-white dark:bg-gray-900"
          />
          <button
            type="submit"
            disabled={!modelsLoaded}
            className={`col-span-2 py-3 rounded-lg text-white font-medium ${
              modelsLoaded
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            {modelsLoaded ? "Register" : "Loading Models…"}
          </button>
        </form>

        {/* Voting Section */}
        <h1 className="mt-12 text-2xl mb-4 text-gray-600 dark:text-gray-400">
          Cast Your Vote
        </h1>
        <form
          className="grid grid-cols-2 gap-6"
          onSubmit={handleVoting}
        >
          <input
            id="voterIdVote"
            type="text"
            placeholder="Voter ID"
            className="p-3 rounded-lg bg-white dark:bg-gray-900"
          />
          <input
            id="candidateId"
            type="number"
            placeholder="Candidate ID"
            className="p-3 rounded-lg bg-white dark:bg-gray-900"
          />
          <button
            type="submit"
            className="col-span-2 py-3 rounded-lg bg-green-600 hover:bg-green-700 text-white font-medium"
          >
            Vote
          </button>
        </form>
      </div>
    </div>
  );
};

export default Voter;