import { ITrashDto } from "@marimo/application/usecases/object/dto/trash-dto"
import { HEADER_HEIGHT } from "@marimo/constants/trash-header"
import { useStore } from "@marimo/stores/use-store"
import { useEffect, useRef, useState } from "react"
import { getTrashImage } from "./level-image"
export const useWorker = () => {
  const worker = useRef<Worker | null>(null);
  const idCounter = useRef(0);
  const { trashItems, addTrashItems } = useStore();
  const [isWorkerRunning, setIsWorkerRunning] = useState(true);

  useEffect(() => {
    const headerHeight = HEADER_HEIGHT;
    if (!isWorkerRunning) return;

    if (window.Worker) {
      worker.current = new Worker(
        new URL("/public/workers/object-worker", import.meta.url),
        { type: "module" }
      );

      worker.current.onmessage = async (event) => {
        const points = event.data.points; // 데이터에서 points 배열 접근
        if (!points || points.length === 0) return; // points 배열이 비어있는지 확인

        // points 배열에서 첫 번째 포인트만 사용
        const point = points[0];
        const level = Math.floor(Math.random() * 3); // 0-2 사이의 레벨 생성
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
        }

        addTrashItems(newTrashItem)
        console.log(newTrashItem)

        await sendTrashData(newTrashItem)
      };

      return () => {
        if (worker.current) {
          worker.current.terminate();
          worker.current = null;
        }
      };
    }
  }, [isWorkerRunning]);

  const sendTrashData = async (newTrashItems: ITrashDto) => {
    try {
      const response = await fetch(`/api/objects`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          marimoId: 29,
          trashData: newTrashItems,
        }),
      });
      if (!response.ok) {
        throw new Error(`마리모 아이디 전송 오류`);
      }
      console.log("📤 모든 객체 API 전송 완료");
    } catch (error) {
      console.error("❌ 변환 중 오류 발생:", error);
    }
  };

  return { worker, isWorkerRunning, setIsWorkerRunning, trashItems };
};
