import { ITrashDto } from "@marimo/application/usecases/object/dto/trash-dto"
import { HEADER_HEIGHT } from "@marimo/constants/trash-header"
import { useStore } from "@marimo/stores/use-store"
import { useEffect, useRef, useState } from "react"
import { getTrashImage } from "./level-image"

export const useWorker = () => {
  const worker = useRef<Worker | null>(null);
  const idCounter = useRef(0);
  const { addTrashItems } = useStore();
  const [isWorkerRunning, setIsWorkerRunning] = useState(true);

  const headerHeight = HEADER_HEIGHT;

  useEffect(() => {
    if (!isWorkerRunning) {
      console.log("Worker is not running.");
      return;
    }

    const initializeWorker = () => {
      console.log("✅ worker 초기화중...");
      if (window.Worker) {
        // 윈도우가 실행중일때 로직
        try {
          // 워커생성로직
          worker.current = new Worker(
            new URL("/public/workers/object-worker", import.meta.url),
            { type: "module" }
          );
          console.log("✅ Worker 생성 성공적!!");
          // 워커 생성후 points 와 piValue 로직으로 랜덤 위치 값 받음.
          worker.current.onmessage = async (event) => {
          console.log("✅ Message received from worker:", event.data);
          const points = event.data.points;
          if (!points || points.length === 0) {
            // 데이터 잘 받아옴.
            console.log("No points data received.");
            return;
          }
  
          const point = points;
          const level = Math.floor(Math.random() * 3);
          const newTrashItem: ITrashDto = {
            id: idCounter.current++,
            level,
            url: getTrashImage(level),
            rect: {
              x: point.x * 100,
              y: point.y * 100 + (headerHeight / window.innerHeight) * 100,
            },
            isActive: true,
            type: "trash",
          };
  
          console.log("Adding new trash item:", newTrashItem);
          addTrashItems(newTrashItem);
  
          console.log("Sending trash data...");
          await sendTrashData(newTrashItem);
        };

          worker.current.onerror = (error) => {
            console.error("Worker error:", error);
          };
        } catch (error) {
          //워커 통신 실패로직
          console.error("Failed to create worker:", error);
        }
      } else {
        //윈도우 실행종료시
        console.error("Web Workers are not supported in this environment.");
      }
    };
    // 워커 종료후 초기화 돌림.
    initializeWorker();

    return () => {
      if (worker.current) {
        console.log("Terminating worker...");
        worker.current.terminate();
        worker.current = null;
        console.log("Worker terminated.");
      }
    }
  }, [isWorkerRunning])

  const sendTrashData = async (trashData: ITrashDto) => {
    try {
      console.log("✅ Posting data to API:", trashData);
      const response = await fetch(`/api/objects`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          marimoId: 29,
          trashData
        }),
      });
      if (!response.ok) {
        throw new Error(`Failed to send data with marimo ID: ${response.status}`);
      }
      console.log("✅ Data posted successfully to API.");
    } catch (error) {
      console.error("Error while sending data to API:", error);
    }
  };

  return { worker, isWorkerRunning, setIsWorkerRunning };
};
