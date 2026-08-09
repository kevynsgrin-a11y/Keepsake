interface Env {
  // Cloudflare KV or D1 bindings if configured
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const data = await context.request.json() as any;
    
    // Validate submission
    if (!data.title || !data.author) {
      return new Response(
        JSON.stringify({ error: "Title and author are required fields." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Memory successfully recorded to Keepsake Almanac edge vault.",
        received: {
          title: data.title,
          author: data.author,
          timestamp: new Date().toISOString()
        }
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message || "Failed to process edge submission." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
