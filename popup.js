document.getElementById("summarize").addEventListener("click", () => {
  const result = document.getElementById("responseText");
  const summaryType = document.getElementById("summary-type").value;
  result.innerHTML = "Extracting Text...";

  chrome.storage.sync.get(["geminiApiKey"], ({ geminiApiKey }) => {
    chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
      chrome.tabs.sendMessage(
        tab.id,
        { type: "GET_ARTICLE_TEXT" },
        async (response) => {
          if (response === "No_Text") {
            result.innerHTML = "No Text Found In this Page";
          }

          try {
            const summary = await getGeminiSummary(
              response,
              summaryType,
              geminiApiKey
            );
            result.innerHTML = summary;
          } catch (error) {
            console.log(error);
          }
        }
      );
    });
  });
});

async function getGeminiSummary(rawText, summaryType, geminiApiKey) {
  const max = 20000;
  const text = rawText.length > max ? rawText.slice(0, max) + "..." : rawText;
  console.log(rawText);
  let prompt;
  switch (summaryType) {
    case "brief":
      prompt = `Provide a brief summary of the following article in 2-3 sentences:\n\n${text}`;
      break;
    case "detailed":
      prompt = `Provide a detailed summary of the following article, covering all main points and key details:\n\n${text}`;
      break;
    case "bullets":
      prompt = `Summarize the following article in 5-7 key points. Format each point as a line starting with "- " (dash followed by a space). Do not use asterisks or other bullet symbols, only use the dash. Keep each point concise and focused on a single key insight from the article:\n\n${text}`;
      break;
    default:
      prompt = `Summarize the following article:\n\n${text}`;
  }

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            temperature: 0.2,
          },
        }),
      }
    );

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error?.message || "API request failed");
    }

    const data = await res.json();
    return (
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No summary available."
    );
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to generate summary. Please try again later.");
  }
}
