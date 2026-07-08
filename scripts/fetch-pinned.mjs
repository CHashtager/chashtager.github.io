import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
const username = process.env.GITHUB_USERNAME || "CHashtager";
const outputPath = resolve(process.env.PINNED_OUTPUT || "data/pinned.json");

if (!token) {
  throw new Error("Missing GITHUB_TOKEN or GH_TOKEN environment variable.");
}

const query = `
  query PinnedItems($login: String!) {
    user(login: $login) {
      pinnedItems(first: 6, types: REPOSITORY) {
        nodes {
          ... on Repository {
            name
            description
            url
            homepageUrl
            stargazerCount
            forkCount
            isArchived
            isFork
            primaryLanguage { name }
            repositoryTopics(first: 8) {
              nodes { topic { name } }
            }
          }
        }
      }
    }
  }
`;

const response = await fetch("https://api.github.com/graphql", {
  method: "POST",
  headers: {
    "Authorization": `bearer ${token}`,
    "Content-Type": "application/json",
    "User-Agent": "chashtager.github.io pinned-projects-fetcher",
  },
  body: JSON.stringify({ query, variables: { login: username } }),
});

if (!response.ok) {
  const body = await response.text();
  throw new Error(`GitHub GraphQL request failed: ${response.status} ${response.statusText}\n${body}`);
}

const payload = await response.json();

if (payload.errors?.length) {
  throw new Error(`GitHub GraphQL returned errors: ${JSON.stringify(payload.errors, null, 2)}`);
}

const nodes = payload.data?.user?.pinnedItems?.nodes || [];
const items = nodes.filter(Boolean).map((repo) => ({
  name: repo.name,
  description: repo.description,
  url: repo.url,
  homepageUrl: repo.homepageUrl,
  stargazerCount: repo.stargazerCount,
  forkCount: repo.forkCount,
  isArchived: repo.isArchived,
  isFork: repo.isFork,
  primaryLanguage: repo.primaryLanguage,
  topics: (repo.repositoryTopics?.nodes || [])
    .map((node) => node?.topic?.name)
    .filter(Boolean),
}));

const document = {
  generatedAt: new Date().toISOString(),
  source: `github-graphql:user/${username}/pinnedItems`,
  items,
};

await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(document, null, 2)}\n`, "utf8");
console.log(`Wrote ${items.length} pinned repositories to ${outputPath}`);
