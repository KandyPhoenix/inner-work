/* Inner Work — the AI guide. Talks to the Claude API straight from the browser,
   using the official Anthropic SDK (bundled in vendor/anthropic.js) and the person's own API key. */
import Anthropic from "../vendor/anthropic.js";

function explain(err) {
  const detail = err && err.error && err.error.error && err.error.error.message;
  const tail = detail ? ` (${detail})` : "";
  if (err instanceof Anthropic.AuthenticationError) return "That API key wasn't accepted. Check it in Settings.";
  if (err instanceof Anthropic.PermissionDeniedError) return "That API key doesn't have access to this model." + tail;
  if (err instanceof Anthropic.RateLimitError) return "The guide is being rate-limited. Wait a minute and try again.";
  if (err instanceof Anthropic.APIConnectionError) return "Couldn't reach the guide. Check your internet connection.";
  if (err instanceof Anthropic.APIError) return `The guide service returned an error${err.status ? " " + err.status : ""}.` + tail;
  return "Something went wrong reaching the guide.";
}

/* Sends the whole conversation and streams the reply.
   Returns { content, refused }. `content` is the full content array, which the app stores and
   sends back unchanged on later turns (it can include thinking blocks the API expects to see again). */
export async function askGuide({ apiKey, model, system, messages, onText, effort = "medium" }) {
  const client = new Anthropic({ apiKey, dangerouslyAllowBrowser: true });
  const base = {
    model,
    max_tokens: 64000,
    output_config: { effort },
    cache_control: { type: "ephemeral" },
    system,
    messages
  };
  let streamed = false;
  const run = async stream => {
    stream.on("text", delta => { streamed = true; onText(delta); });
    return stream.finalMessage();
  };
  try {
    let final;
    try {
      // If the model's safety filters decline a message, the API retries it on another Claude model.
      final = await run(client.beta.messages.stream({ ...base, betas: ["server-side-fallback-2026-07-01"], fallbacks: "default" }));
    } catch (err) {
      // Some accounts don't have the fallback beta. Retry once as a plain request.
      if (!(err instanceof Anthropic.BadRequestError) || streamed) throw err;
      final = await run(client.messages.stream(base));
    }
    return { content: final.content, refused: final.stop_reason === "refusal" };
  } catch (err) {
    err.userMessage = explain(err);
    throw err;
  }
}
