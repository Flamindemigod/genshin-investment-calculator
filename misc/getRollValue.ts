import { IArtifact, StatKey } from "../generator/artifact";
import { Substats } from "../generator/artifactProbabilities";

export const getRollValue = (
  artifact: IArtifact,
  optimizationContributions: StatKey[]
) => {
  let rollValue = 0;
  if (optimizationContributions.includes(artifact.mainStatKey)) {
    rollValue = rollValue + 1;
  }
  artifact.substats.forEach((subStat) => {
    const maxRoll = subStat.substats * Math.max(...Substats[subStat.key!]);
    if (optimizationContributions.includes(subStat.key)) {
      rollValue = rollValue + subStat.value / maxRoll;
    }
  });
  return rollValue;
};
