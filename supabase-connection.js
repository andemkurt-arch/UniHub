(function () {
  const cfg = window.UNIHUB_SUPABASE_CONFIG || {};
  const url = String(cfg.url || "").trim();
  const key = String(cfg.anonKey || "").trim();
  if (!window.supabase || !window.supabase.createClient) { console.error("Supabase JS failed to load."); return; }
  if (!/^https:\/\/[a-z0-9-]+\.supabase\.co$/i.test(url) || !key || /PASTE_YOUR|YOUR_/.test(key)) {
    console.warn("Supabase not configured. Edit supabase-config.js with Project URL and publishable/anon key."); return;
  }
  window.unihubSupabase = window.supabase.createClient(url, key);
  window.unihubSupabase.auth.getSession().then(({ data, error }) => {
    if (error) console.warn("Supabase session check:", error.message);
    else console.info("Supabase client initialized. Existing session:", !!data.session);
  });
})();
