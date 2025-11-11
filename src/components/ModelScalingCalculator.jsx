import React, { useState, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function ModelScalingCalculator() {
  const [P, setP] = useState(30);

  // Constants
  const GPU_FLOPS = 0.5e15; // 0.5 PFLOPs per GPU
  const SECONDS_PER_DAY = 86400;

  // Computed values (approximate, for visualization)
  const trainingCompute = 120 * P ** 2; // FLOPs
  const memory = 2 * P; // bytes per parameter (simplified)
  const speed = 1 / P; // tokens/s per GPU (idealized)
  const gpuDays = trainingCompute / (GPU_FLOPS * SECONDS_PER_DAY); // total GPU-days

  // Generate data points for chart
  const data = useMemo(() => {
    const sizes = [7, 30, 70, 100, 200, 400];
    return sizes.map((s) => ({
      P: s,
      trainingCompute: 120 * s ** 2,
      memory: 2 * s,
      speed: 1 / s,
    }));
  }, []);

  return (
    <div className="p-8 bg-gray-50 rounded-2xl shadow-lg max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-2 text-center text-gray-800">
        AI Model Scaling Calculator
      </h2>
      <p className="text-center text-gray-500 mb-6">
        Estimate how model size affects training cost, memory, and inference
        speed
      </p>

      {/* Slider control */}
      <div className="flex flex-col items-center mb-8">
        <label className="font-semibold text-gray-700 mb-2">
          Model Size: {P} Billion Parameters
        </label>
        <input
          type="range"
          min="7"
          max="400"
          step="1"
          value={P}
          onChange={(e) => setP(Number(e.target.value))}
          className="w-3/4 accent-blue-500"
        />
      </div>

      {/* Results summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 text-center">
        <div className="p-4 bg-white rounded-xl shadow">
          <p className="text-sm text-gray-500">Training Compute</p>
          <p className="text-xl font-bold text-blue-600">
            {(trainingCompute / 1e6).toFixed(2)} ×10⁶ FLOPs
          </p>
        </div>
        <div className="p-4 bg-white rounded-xl shadow">
          <p className="text-sm text-gray-500">GPU-Days (Est.)</p>
          <p className="text-xl font-bold text-purple-600">
            {gpuDays.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </p>
        </div>
        <div className="p-4 bg-white rounded-xl shadow">
          <p className="text-sm text-gray-500">Memory Needed</p>
          <p className="text-xl font-bold text-green-600">{memory} GB</p>
        </div>
      </div>

      {/* Line Chart */}
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="P"
            label={{
              value: "Model Size (B Parameters)",
              position: "insideBottom",
              offset: -5,
            }}
          />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="trainingCompute"
            stroke="#3b82f6"
            name="Training Compute (120×P²)"
            dot
          />
          <Line
            type="monotone"
            dataKey="memory"
            stroke="#10b981"
            name="Memory (2×P)"
            dot
          />
          <Line
            type="monotone"
            dataKey="speed"
            stroke="#ef4444"
            name="Inference Speed (1/P)"
            dot
          />
        </LineChart>
      </ResponsiveContainer>

      <p className="text-sm text-gray-500 mt-6 text-center">
        💡 Training compute grows quadratically, memory grows linearly, and
        inference speed per GPU decreases with model size.
      </p>
    </div>
  );
}
