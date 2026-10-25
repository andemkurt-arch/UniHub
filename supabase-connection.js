(function () {
  const cfg = window.UNIHUB_SUPABASE_CONFIG || {};
  const url = String(cfg.url || "").trim();
  const key = String(cfg.anonKey || "").trim();

  if (!window.supabase || !window.supabase.createClient) {
    console.error("Supabase JS failed to load.");
    return;
  }
  if (!/^https:\/\/[a-z0-9-]+\.supabase\.co$/i.test(url) || !key || /PASTE_YOUR|YOUR_KEY/i.test(key)) {
    console.warn("Supabase not configured. Check supabase-config.js.");
    return;
  }

  const client = window.supabase.createClient(url, key, {
    auth: {
      flowType: "implicit",
      detectSessionInUrl: true,
      persistSession: true,
      autoRefreshToken: true,
      storageKey: "unihub_supabase_session"
    }
  });
  window.unihubSupabase = client;

  // Register before UniHub_Prototype.js loads, so a fast recovery event isn't missed.
  client.auth.onAuthStateChange(function (event) {
    if (event === "PASSWORD_RECOVERY") {
      window.UNIHUB_PASSWORD_RECOVERY = true;
      window.dispatchEvent(new Event("unihub-password-recovery"));
    }
  });

  client.auth.getSession().then(({ error, data }) => {
    if (error) console.warn("Supabase session check:", error.message);
    else console.info("Supabase client initialized. Existing session:", !!data.session);
  });
})();
