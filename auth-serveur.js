import supabaseAdmin from "./supabaseAdmin";

/*
  Le composant client doit envoyer le token de session dans le header
  Authorization: Bearer <access_token> (récupéré via
  supabase.auth.getSession() côté client). Cette fonction le vérifie
  côté serveur avec la clé admin, pour ne jamais faire confiance à un
  user_id envoyé tel quel dans le body de la requête.
*/
export async function utilisateurConnecte(req) {
  const authHeader = req.headers.get("authorization") || "";
  const token = authHeader.replace("Bearer ", "");
  if (!token) return null;

  const { data, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !data?.user) return null;
  return data.user;
}
