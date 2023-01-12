import { generateArtifact } from "../generator/artifact";

function Home() {

  return (
    <div>
      <code className="">{JSON.stringify(generateArtifact("BlizzardStrayer", "HeartOfDepth"))}</code>
    </div>
  );
}

export default Home;
