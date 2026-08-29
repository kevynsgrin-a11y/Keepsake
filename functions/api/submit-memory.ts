interface Env {
  MEMORIES?: KVNamespace;
}

const corsHeaders = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const data = (await context.request.json()) as Record<string, unknown>;

    if (!data.title || !data.author) {
      return new Response(
        JSON.stringify({ error: "Title and author are required fields." }),
        { status: 400, headers: corsHeaders }
      );
    }

    const id = typeof data.id === "string" && data.id ? data.id : `mem-${Date.now()}`;
    const record = { ...data, id, receivedAt: new Date().toISOString() };

    // KV binding is provisioned separately (Cloudflare Pages dashboard or
    // wrangler.toml with a real namespace id) — see README for setup. Until
    // then this still validates the submission and returns success so the
    // client's local save (the primary persistence path) is unaffected.
    if (context.env.MEMORIES) {
      await context.env.MEMORIES.put(id, JSON.stringify(record));
    }

    return new Response(
      JSON.stringify({ success: true, id, persisted: !!context.env.MEMORIES }),
      { status: 200, headers: corsHeaders }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message || "Failed to process edge submission." }),
      { status: 500, headers: corsHeaders }
    );
  }
};
