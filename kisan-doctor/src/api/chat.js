import { API_URL } from "./config";

export async function sendMessageToAI(message) {

  const res = await fetch(`${API_URL}/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ message })
  });

  return await res.json();
}