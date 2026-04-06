import { AiSandboxClient } from "../src/client.js";

const client = new AiSandboxClient({
  baseUrl: process.env.AI_SANDBOX_BASE_URL ?? "https://www.egroupai.com",
  apiKey: process.env.AI_SANDBOX_API_KEY ?? "",
});

async function main() {
  const agent = await client.createAgent({
    agentDisplayName: "SDK Quickstart Agent",
    agentDescription: "Created by TypeScript SDK quickstart",
  });
  console.log(agent);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
