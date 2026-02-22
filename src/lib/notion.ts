import { OnboardingFormData } from "@/types/onboarding";

const PLAN_DISPLAY: Record<string, string> = {
  starter: "Starter",
  pro: "Pro",
  cabinet: "Cabinet",
};

const ROLE_DISPLAY: Record<string, string> = {
  juridique: "juridique",
  admin: "admin",
  commercial: "commercial",
  polyvalent: "polyvalent",
  autre: "autre",
};

export async function createNotionEntry(
  data: OnboardingFormData,
  markdown: string
): Promise<void> {
  const notionApiKey = process.env.NOTION_API_KEY;
  const databaseId = process.env.NOTION_ONBOARDING_DB_ID;

  if (!notionApiKey || !databaseId) {
    console.warn(
      "[Notion] NOTION_API_KEY or NOTION_ONBOARDING_DB_ID not configured, skipping."
    );
    return;
  }

  const response = await fetch("https://api.notion.com/v1/pages", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${notionApiKey}`,
      "Content-Type": "application/json",
      "Notion-Version": "2022-06-28",
    },
    body: JSON.stringify({
      parent: { database_id: databaseId },
      properties: {
        Client: {
          title: [{ text: { content: data.clientName } }],
        },
        Email: {
          email: data.clientEmail,
        },
        Agent: {
          rich_text: [{ text: { content: data.step2.prenomAgent } }],
        },
        "Rôle": {
          select: {
            name: ROLE_DISPLAY[data.step2.role as string] || "polyvalent",
          },
        },
        Formule: {
          select: {
            name: PLAN_DISPLAY[data.step7.formule as string] || "Starter",
          },
        },
        Statut: {
          status: { name: "Nouveau" },
        },
        Date: {
          date: { start: new Date().toISOString() },
        },
        "Cahier des charges": {
          rich_text: [
            {
              text: {
                content:
                  markdown.length > 2000
                    ? markdown.substring(0, 2000)
                    : markdown,
              },
            },
          ],
        },
      },
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Notion API error ${response.status}: ${errorBody}`);
  }
}
