import { setKeyMapping } from "../data/Data";
import { IArtifact, StatKeyMapping } from "../generator/artifact";

type Props = {
  artifact: IArtifact;
};

export default (props: Props) => {
  return (
    <div className="bg-yellow-200">
      <div className="">{setKeyMapping[props.artifact.setKey!]}</div>
      <div className="">
        {StatKeyMapping[props.artifact.mainStatKey!]} - {props.artifact.slotKey}
      </div>
      {props.artifact.substats.map((substat, i) => (
        <div key={i}>
          {StatKeyMapping[substat.key!]}: {substat.value}
        </div>
      ))}
    </div>
  );
};
