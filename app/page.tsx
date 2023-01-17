"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Props } from "../calculator";
import { CharacterStats } from "../common";

import { artifactGroups } from "../data/Data";
import { IArtifact } from "../generator/artifact";

function Home() {
  const workerRef = useRef<Worker>();
  const dmgRef = useRef<{
    dmg: number;
    build: IArtifact[];
    characterStats: CharacterStats;
    props: Props;
  }>();

  const [displayString, setDisplayString] = useState<string>();
  const [runningState, setrunningState] = useState<number>();

  useEffect(() => {
    workerRef.current = new Worker(
      new URL("../workers/worker.ts", import.meta.url)
    );
    workerRef.current.onmessage = (e: MessageEvent) => {
      const dmg = e.data[0];
      setrunningState(e.data[4]);
      if (dmg > (dmgRef.current?.dmg ?? 0)) {
        dmgRef.current = {
          dmg: dmg,
          build: e.data[1],
          characterStats: e.data[2],
          props: e.data[3],
        };
        setDisplayString(
          `${dmg} ${JSON.stringify(
            dmgRef.current.build,
            null,
            2
          )} ${JSON.stringify(
            dmgRef.current.characterStats,
            null,
            2
          )} ${JSON.stringify(dmgRef.current.props, null, 2)}`
        );
      }
    };
    return () => {
      workerRef.current?.postMessage(["close"]);
    };
  }, []);

  const handleWork = useCallback(async () => {
    workerRef.current?.postMessage([
      "start",
      100000,
      artifactGroups[7],
      artifactGroups[2],
    ]);
  }, []);
  return (
    <div className="">
      <button onClick={handleWork}>Start Worker</button>
      <div>{runningState}</div>
      <pre className="">{displayString}</pre>
    </div>
  );
}

export default Home;
