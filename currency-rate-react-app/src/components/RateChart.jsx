import { useEffect, useRef } from "react";

export default function RateChart({ rates }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    drawChart(canvasRef.current, rates);
  }, [rates]);

  return <canvas ref={canvasRef} width="1000" height="420" aria-label="Графік курсу валют" />;
}

function drawChart(canvas, rates) {
  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;
  const padding = { top: 34, right: 34, bottom: 64, left: 78 };

  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#fbfdff";
  ctx.fillRect(0, 0, width, height);

  if (!rates.length) {
    ctx.fillStyle = "#667085";
    ctx.font = "24px Segoe UI, Arial";
    ctx.fillText("Оберіть параметри та завантажте дані", 290, 210);
    return;
  }

  const values = rates.map((rate) => rate.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const spread = max - min || 1;
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  ctx.strokeStyle = "#d9e2ef";
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let i = 0; i <= 4; i += 1) {
    const y = padding.top + (chartHeight / 4) * i;
    ctx.moveTo(padding.left, y);
    ctx.lineTo(width - padding.right, y);
  }
  ctx.stroke();

  ctx.fillStyle = "#667085";
  ctx.font = "16px Segoe UI, Arial";
  ctx.textAlign = "right";
  for (let i = 0; i <= 4; i += 1) {
    const value = max - (spread / 4) * i;
    const y = padding.top + (chartHeight / 4) * i + 5;
    ctx.fillText(value.toFixed(4), padding.left - 12, y);
  }

  const points = rates.map((rate, index) => {
    const x = padding.left + (chartWidth / Math.max(rates.length - 1, 1)) * index;
    const y = padding.top + chartHeight - ((rate.value - min) / spread) * chartHeight;
    return { x, y, rate };
  });

  ctx.strokeStyle = "#0b6bcb";
  ctx.lineWidth = 4;
  ctx.beginPath();
  points.forEach((point, index) => {
    if (index === 0) {
      ctx.moveTo(point.x, point.y);
    } else {
      ctx.lineTo(point.x, point.y);
    }
  });
  ctx.stroke();

  points.forEach((point) => {
    ctx.fillStyle = "#ffffff";
    ctx.strokeStyle = "#0b6bcb";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(point.x, point.y, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  });

  ctx.fillStyle = "#14213d";
  ctx.font = "14px Segoe UI, Arial";
  ctx.textAlign = "center";
  const labelStep = Math.ceil(points.length / 8);
  points.forEach((point, index) => {
    if (index % labelStep === 0 || index === points.length - 1) {
      ctx.fillText(point.rate.date.slice(0, 5), point.x, height - 26);
    }
  });
}
