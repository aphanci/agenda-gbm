/* ============================================================
   SERVICE WORKER — le hors-connexion
   ============================================================
   Un service worker est un petit programme qui s'installe dans le
   navigateur du visiteur et s'intercale entre la page et le réseau.
   Chaque fois que la page demande un fichier, c'est lui qui répond :
   soit depuis sa réserve locale, soit en allant chercher sur le réseau.

   C'est ce qui permet à l'agenda de fonctionner dans une salle où
   400 personnes saturent le wifi.

   ------------------------------------------------------------
   LE POINT DÉLICAT — deux stratégies dans le même fichier
   ------------------------------------------------------------
   Deux besoins s'opposent ici, et c'est le piège n°2 de la spec :

   • La page, le style, le code et le programme doivent fonctionner
     SANS réseau            -> stratégie « cache d'abord »
   • L'annonce doit pouvoir changer PENDANT l'événement
                            -> stratégie « réseau d'abord »

   Si on mettait tout en cache d'abord, une annonce publiée à 10h30
   n'atteindrait jamais les téléphones déjà ouverts.
   ============================================================ */

/* Le numéro de version. À INCRÉMENTER à chaque modification d'un
   fichier : c'est ce qui force les navigateurs à reprendre la
   nouvelle version au lieu de servir l'ancienne indéfiniment. */
const VERSION = "agenda-v24";

/* La réserve du programme du visiteur. Elle ne porte PAS de numéro de
   version, et c'est voulu : elle ne contient pas des fichiers de
   l'application, mais la copie personnelle du programme obtenue à
   l'enregistrement. Elle doit survivre à toutes les mises à jour.
   Voir le filtre dans « activate » plus bas — sans lui, chaque
   changement de version effaçait l'enregistrement des visiteurs. */
const CACHE_PARTAGE = "agenda-partage";

/* Les fichiers mis en réserve dès l'installation. */
const FICHIERS = [
  "./",
  "./index.html",
  "./style.css",
  "./app.js",
  "./programme.json",
  "./manifest.json",
  "./icones/icone-192.png",
  "./icones/icone-512.png"
];

/* ---------- Installation ----------
   Se produit une seule fois, au premier passage du visiteur. */
self.addEventListener("install", (evenement) => {
  evenement.waitUntil(
    caches.open(VERSION)
      .then((reserve) => reserve.addAll(FICHIERS))
      // skipWaiting : la nouvelle version prend la main tout de suite,
      // sans attendre que le visiteur ferme tous ses onglets.
      .then(() => self.skipWaiting())
  );
});

/* ---------- Activation ----------
   On profite du passage pour jeter les réserves des versions
   précédentes, sinon elles s'accumuleraient sur l'appareil.

   LE PIÈGE, corrigé ici : « toutes celles qui ne sont pas la version
   courante » incluait aussi la réserve du programme du visiteur, qui
   ne porte volontairement pas de numéro. Résultat, chaque mise à jour
   effaçait l'enregistrement des gens. Il faut donc l'exclure
   NOMMÉMENT, et non se fier au seul numéro de version. */
self.addEventListener("activate", (evenement) => {
  evenement.waitUntil(
    caches.keys()
      .then((noms) => Promise.all(
        noms.filter((nom) => nom !== VERSION && nom !== CACHE_PARTAGE)
            .map((nom) => caches.delete(nom))
      ))
      .then(() => self.clients.claim())
  );
});

/* ---------- Interception des requêtes ----------
   Le cœur du service worker : c'est ici qu'on choisit la stratégie. */
self.addEventListener("fetch", (evenement) => {
  const requete = evenement.request;

  // On ne s'occupe que des lectures simples, sur notre propre domaine.
  if (requete.method !== "GET") return;
  if (new URL(requete.url).origin !== self.location.origin) return;

  const chemin = new URL(requete.url).pathname;

  /* ===== STRATÉGIE 1 : RÉSEAU D'ABORD =====
     Pour les DONNÉES : l'annonce et le programme.

     On tente le réseau ; s'il répond, on sert sa réponse ET on la
     range en réserve. S'il ne répond pas, on sert la dernière version
     connue. Résultat : les données sont toujours aussi fraîches que
     possible, sans jamais empêcher la page de fonctionner hors réseau.

     Pourquoi le programme est ici et non en cache d'abord : un agenda
     qui change la veille — ou une adresse d'inscription qu'on active
     le matin même — doit atteindre les téléphones qui ont DÉJÀ ouvert
     l'application. En cache d'abord, ils garderaient l'ancienne version
     jusqu'au prochain changement de numéro de version, et personne ne
     comprendrait pourquoi. Le coût est de quelques dizaines de
     millisecondes au chargement ; le bénéfice est de ne jamais afficher
     un programme faux. */
  if (chemin.endsWith("annonce.json") || chemin.endsWith("programme.json")) {
    evenement.respondWith(
      fetch(requete)
        .then((reponse) => {
          const copie = reponse.clone();
          caches.open(VERSION).then((reserve) => reserve.put(requete, copie));
          return reponse;
        })
        .catch(() => caches.match(requete))
    );
    return;
  }

  /* ===== STRATÉGIE 2 : CACHE D'ABORD =====
     Pour tout le reste.
     Si le fichier est en réserve, on le sert immédiatement — c'est
     instantané, et ça marche sans réseau. Sinon on va le chercher,
     et on le range au passage pour la prochaine fois. */
  evenement.respondWith(
    caches.match(requete).then((enReserve) => {
      if (enReserve) return enReserve;

      return fetch(requete)
        .then((reponse) => {
          // On ne range que les réponses valides.
          if (!reponse || reponse.status !== 200 || reponse.type !== "basic") {
            return reponse;
          }
          const copie = reponse.clone();
          caches.open(VERSION).then((reserve) => reserve.put(requete, copie));
          return reponse;
        })
        .catch(() => {
          // Hors connexion et rien en réserve : pour une navigation,
          // on renvoie au moins la page d'accueil.
          if (requete.mode === "navigate") return caches.match("./index.html");
          return undefined;
        });
    })
  );
});
