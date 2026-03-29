import { GRAPHQL_ENDPOINT } from "./constants";
import type { AssemblyPage } from "./types";

const ASSEMBLIES_QUERY = `
  query($type: String!, $first: Int, $after: String) {
    objects(filter: { type: $type }, first: $first, after: $after) {
      pageInfo { hasNextPage endCursor }
      nodes {
        address
        asMoveObject { contents { json } }
      }
    }
  }
`;

export async function queryAssemblies(
  type: string,
  first = 50,
  after?: string,
): Promise<AssemblyPage> {
  const res = await fetch(GRAPHQL_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: ASSEMBLIES_QUERY,
      variables: { type, first, after: after ?? null },
    }),
  });

  if (!res.ok) throw new Error(`GraphQL error: ${res.status}`);

  const json = await res.json();
  if (json.errors) throw new Error(json.errors[0].message);

  const data = json.data.objects;
  return {
    objects: data.nodes.map(
      (n: { address: string; asMoveObject?: { contents?: { json: Record<string, unknown> } } }) => ({
        address: n.address,
        contents: n.asMoveObject?.contents?.json ?? null,
      }),
    ),
    hasNextPage: data.pageInfo.hasNextPage,
    endCursor: data.pageInfo.endCursor,
  };
}
