/* ============================================================
   WIDGET AGENDA — logique de la page
   ============================================================
   Ce fichier ne contient AUCUNE information propre aux Journées
   Portes Ouvertes. Tout l'événement vit dans programme.json.
   Pour un autre événement : remplacer ce fichier JSON, rien d'autre.

   Plan du fichier :
   1. Les textes de l'interface (fr / en)
   2. L'état de l'application
   3. Le temps
   4. Le chargement des données
   5. Le lien « ajouter à mon agenda »
   6. L'affichage
   7. La boucle qui rafraîchit tout, chaque seconde
   ============================================================ */

(function () {
  "use strict";

  /* ============================================================
     1. LES TEXTES DE L'INTERFACE
     Seuls les mots de l'outil lui-même. Les mots de l'événement
     sont dans programme.json.
     ============================================================ */
  var UI = {
    fr: {
      ouvreDans: "Ouverture dans", ouvertureTitre: "Début de l'événement",
      ouvert: "Ouvert", badgeFini: "Terminé",
      enCours: "En cours", aSuivre: "À suivre dans",
      termine: "Événement terminé", mercíTitre: "Merci de votre participation",
      termineSous: "L'événement est achevé.",
      pause: "Pause", pauseTitre: "Fin des activités de la journée",
      puceDirect: "En cours", puceFini: "Terminé", puceAvenir: "À venir",
      seTermineDans: "Se termine dans", jusqua: "jusqu'à",
      enParallele: "en parallèle", aussiOuvert: "Aussi ouvert maintenant :",
      mesSessions: "Mes sessions", toutAgenda: "Tout l'agenda",
      jumpLabel: "Aller à maintenant",
      statutVerrou: "Enregistrez-vous pour ouvrir le programme",
      astuceInstall: "Conseil : ajoutez d'abord l'agenda à votre écran d'accueil, puis enregistrez-vous depuis l'icône. Vous n'aurez à le faire qu'une seule fois.",
      astuceIOS: "Conseil : ajoutez d'abord l'agenda à votre écran d'accueil — touchez le bouton Partager en bas de l'écran, puis « Sur l'écran d'accueil » — et enregistrez-vous ensuite depuis l'icône. Vous n'aurez à le faire qu'une seule fois.",
      astuceGo: "Ajouter à mon écran d'accueil",
      themeClair: "Affichage clair", themeSombre: "Affichage sombre",
      intervenants: "Intervenants", ajouterAgenda: "Ajouter à mon agenda",
      calApple: "iPhone, Apple Calendrier — et tout autre agenda",
      calGoogle: "Google Agenda",
      calOutlookPro: "Outlook professionnel",
      calOutlookPerso: "Outlook.com personnel",
      calYahoo: "Yahoo Agenda",
      marquer: "Marquer cette session",
      videEtoiles: "Aucune session marquée pour ce jour. Touchez l'étoile ★ d'une session pour la retrouver ici.",
      infosTitre: "Informations pratiques",
      libLieu: "Lieu", libDates: "Dates", libHeure: "Heure affichée", libEntree: "Entrée",
      valEntree: "Stands ouverts au grand public",
      howtoTitre: "Garder cet agenda sur votre téléphone",
      howtoCorps:
        "<p><strong>iPhone (Safari)</strong> — appuyez sur l'icône de partage en bas de l'écran, puis sur « Sur l'écran d'accueil ».</p>" +
        "<p><strong>Android (Chrome)</strong> — appuyez sur les trois points en haut à droite, puis sur « Ajouter à l'écran d'accueil ».</p>" +
        "<p>L'agenda se rouvre ensuite d'un seul geste, et fonctionne même sans réseau.</p>",
      credit: "Les horaires suivent le programme officiel. La session en cours et la suivante se mettent à jour automatiquement.",
      annonceInfo: "Information", annonceAlerte: "Changement de programme",
      erreurTitre: "Programme momentanément indisponible",
      erreurTexte: "Le programme n'a pas pu être chargé. Fermez l'application, vérifiez votre connexion, puis rouvrez-la.",
      chargement: "Chargement du programme…",
      jour: "jour", jours: "jours", min: "min",
      installTitre: "Installer l'agenda",
      installDetail: "Un geste pour l'ouvrir, et il fonctionne sans réseau.",
      installBouton: "Installer",
      installIOS: "Touchez ⬆︎ en bas de l'écran, puis « Sur l'écran d'accueil ».",
      installFermer: "Masquer",

      inscrireTitre: "Vous participez à l'événement ?",
      inscrireDetail: "Enregistrez-vous pour recevoir les documents et les suites.",
      inscrireBouton: "S'enregistrer",
      inscrireMasquer: "Masquer",
      formTitre: "Enregistrement des participants",
      formIntro: "Merci de vous enregistrer pour accéder au programme. Les champs marqués d'une étoile sont nécessaires ; les deux derniers sont facultatifs.",
      formIntroVerrou: "Merci de vous enregistrer pour accéder au programme. Quelques secondes, et vous recevrez aussi les documents de l'événement.",
      labNom: "Nom & Prénoms *",
      labTel: "Numéro de téléphone (avec l'indicatif pays)",
      labQualite: "Vous êtes *",
      labQualiteVide: "— Choisissez —",
      labAutre: "Précisez *",
      labEmail: "Adresse e-mail — pour recevoir les documents de l'événement",
      avisTitre: "Ce que deviennent vos informations",
      labConsent: "J'ai lu ce qui précède et j'accepte que mes informations soient utilisées dans ce cadre.",
      formEnvoyer: "Envoyer",
      formEnvoi: "Envoi en cours…",
      formNote: "Ce formulaire est facultatif. Vous pouvez consulter l'agenda sans vous enregistrer.",
      formFermer: "Fermer",
      merciTitre: "C'est enregistré",
      merciTexte: "Merci. Vous recevrez les documents de l'événement à l'adresse indiquée.",
      merciFermer: "Revenir à l'agenda",
      errNom: "Merci d'indiquer votre nom ET votre prénom.",
      errQualite: "Merci de choisir dans la liste.",
      errAutre: "Merci de préciser.",
      errEmail: "Cette adresse e-mail ne semble pas valide.",
      errConsent: "Merci de cocher la case pour poursuivre.",
      errReseau: "Connexion impossible pour le moment. Vérifiez votre réseau, puis touchez à nouveau « Envoyer ».",
      dejaInscrit: "Vous êtes enregistré",
      cadreTermine: "J'ai envoyé le formulaire — voir le programme",
      cadreNote: "Envoyez d'abord le formulaire ci-dessus, puis touchez ce bouton.",
      dejaTitre: "Vous vous êtes déjà enregistré ?",
      dejaGo: "Ouvrir le programme",
      cadreOu: "Sinon, enregistrez-vous ci-dessous — cela prend quelques secondes."
    },
    en: {
      ouvreDans: "Opens in", ouvertureTitre: "Start of the event",
      ouvert: "Open", badgeFini: "Ended",
      enCours: "Happening now", aSuivre: "Up next in",
      termine: "Event ended", mercíTitre: "Thank you for joining us",
      termineSous: "The event has ended.",
      pause: "Break", pauseTitre: "End of today's programme",
      puceDirect: "Live", puceFini: "Finished", puceAvenir: "Upcoming",
      seTermineDans: "Ends in", jusqua: "until",
      enParallele: "in parallel", aussiOuvert: "Also open now:",
      mesSessions: "My sessions", toutAgenda: "Full agenda",
      jumpLabel: "Jump to now",
      statutVerrou: "Register to open the programme",
      astuceInstall: "Tip: add the agenda to your home screen first, then register from the icon. You will only have to do it once.",
      astuceIOS: "Tip: add the agenda to your home screen first — tap the Share button at the bottom of the screen, then « Add to Home Screen » — and register afterwards from the icon. You will only have to do it once.",
      astuceGo: "Add to my home screen",
      themeClair: "Light display", themeSombre: "Dark display",
      intervenants: "Speakers", ajouterAgenda: "Add to my calendar",
      calApple: "iPhone, Apple Calendar — and any other calendar",
      calGoogle: "Google Calendar",
      calOutlookPro: "Outlook for work",
      calOutlookPerso: "Outlook.com personal",
      calYahoo: "Yahoo Calendar",
      marquer: "Mark this session",
      videEtoiles: "No sessions marked for this day. Tap the ★ on a session to find it here.",
      infosTitre: "Practical information",
      libLieu: "Venue", libDates: "Dates", libHeure: "Times shown", libEntree: "Admission",
      valEntree: "Stands open to the general public",
      howtoTitre: "Keep this agenda on your phone",
      howtoCorps:
        "<p><strong>iPhone (Safari)</strong> — tap the share icon at the bottom of the screen, then “Add to Home Screen”.</p>" +
        "<p><strong>Android (Chrome)</strong> — tap the three dots at the top right, then “Add to Home screen”.</p>" +
        "<p>The agenda then reopens in one tap, and works even without a network.</p>",
      credit: "Times follow the official programme. The current and next sessions update automatically.",
      annonceInfo: "Information", annonceAlerte: "Programme change",
      erreurTitre: "Programme temporarily unavailable",
      erreurTexte: "The programme could not be loaded. Check your connection, then reload the page.",
      chargement: "Loading the programme…",
      jour: "day", jours: "days", min: "min",
      installTitre: "Install the agenda",
      installDetail: "One tap to open it, and it works offline.",
      installBouton: "Install",
      installIOS: "Tap ⬆︎ at the bottom of the screen, then “Add to Home Screen”.",
      installFermer: "Dismiss",

      inscrireTitre: "Attending the event?",
      inscrireDetail: "Register to receive the event's documents and follow-up.",
      inscrireBouton: "Register",
      inscrireMasquer: "Dismiss",
      formTitre: "Participant registration",
      formIntro: "Please register to open the programme. Fields marked with a star are required; the last two are optional.",
      formIntroVerrou: "Please register to view the programme. It takes a few seconds, and you will also receive the event's documents.",
      labNom: "Full name *",
      labTel: "Phone number (with country code)",
      labQualite: "You are *",
      labQualiteVide: "— Please choose —",
      labAutre: "Please specify *",
      labEmail: "Email address — to receive the event's documents",
      avisTitre: "What happens to your information",
      labConsent: "I have read the above and agree that my information may be used for this purpose.",
      formEnvoyer: "Send",
      formEnvoi: "Sending…",
      formNote: "This form is optional. You can use the agenda without registering.",
      formFermer: "Close",
      merciTitre: "You're registered",
      merciTexte: "Thank you. You will receive the event's documents at the address you gave.",
      merciFermer: "Back to the agenda",
      errNom: "Please give your first name AND surname.",
      errQualite: "Please choose from the list.",
      errAutre: "Please specify.",
      errEmail: "That email address does not look valid.",
      errConsent: "Please tick the box to continue.",
      errReseau: "Could not connect right now. Check your network, then tap Send again.",
      dejaInscrit: "You are registered",
      cadreTermine: "I've submitted the form — show the programme",
      cadreNote: "Submit the form above first, then tap this button.",
      dejaTitre: "Already registered?",
      dejaGo: "Open the programme",
      cadreOu: "Otherwise, register below — it only takes a few seconds."
    }
  };

  /* ============================================================
     2. L'ÉTAT DE L'APPLICATION
     Toutes les variables qui changent pendant la vie de la page.
     Les regrouper ici évite de les chercher partout.
     ============================================================ */
  var PROGRAMME = null;   // le contenu de programme.json
  var DECALAGE_MS = 0;    // décalage UTC de l'événement, en millisecondes
  var LANGUE = "fr";
  var jourActif = 0;
  var filtreEtoiles = false;
  var noeuds = [];        // les lignes affichées, pour les rafraîchir sans tout reconstruire
  var etoiles = {};

  /* Le thème vaut "auto", "light" ou "dark".
     "auto" n'est pas un troisième habillage : c'est l'absence de choix,
     et la feuille de style laisse alors décider le téléphone. */
  var THEME = "auto";

  var CLE_LANGUE = "agenda-langue";
  var CLE_ETOILES = "agenda-etoiles";
  var CLE_THEME = "agenda-theme";   // la même clé que le script de l'en-tête

  /* Le raccourci vers un élément de la page.

     Il rend un élément JETABLE quand l'élément demandé n'existe pas, au
     lieu de rendre null. La raison est cuisante : une seule ligne
     cherchant un élément absent — parce qu'un fichier n'avait pas été
     mis en ligne avec les autres — faisait échouer tout le démarrage,
     et l'application restait figée sur « Chargement du programme »,
     sans un mot d'explication.

     Désormais l'élément manquant est signalé dans la console, la ligne
     qui le visait ne fait rien, et TOUT LE RESTE continue de
     fonctionner. Une pièce absente ne doit jamais emporter l'ensemble. */
  var $ = function (id) {
    var el = document.getElementById(id);
    if (el) return el;
    console.warn("Élément introuvable dans la page :", id,
                 "— le fichier index.html est-il à jour ?");
    return document.createElement("span");
  };

  /* ============================================================
     3. LE TEMPS
     ============================================================ */

  /* Le décalage horaire vient des DONNÉES, jamais du code : c'est
     ce qui rend le widget réutilisable hors de la Côte d'Ivoire.
     "+00:00" -> 0 ;  "+02:00" -> 7 200 000 ms ;  "-05:00" -> -18 000 000 ms */
  function lireDecalage(txt) {
    var m = /^([+-])(\d{2}):(\d{2})$/.exec(txt || "+00:00");
    if (!m) return 0;
    var signe = m[1] === "-" ? -1 : 1;
    return signe * ((+m[2]) * 60 + (+m[3])) * 60000;
  }

  /* Transforme une date et une heure locales de l'événement en un
     INSTANT universel, comparable à Date.now(). */
  function instant(dateISO, hhmm) {
    return Date.parse(dateISO + "T" + hhmm + ":00Z") - DECALAGE_MS;
  }

  /* Aperçu de test : ajouter ?t=2026-09-21T10:30 à l'adresse.
     On garde un simple décalage pour que l'horloge continue d'avancer. */
  var APERCU = 0;
  try {
    var q = new URLSearchParams(window.location.search).get("t");
    if (q) {
      var v = q.trim().replace(" ", "T");
      if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(v)) v += ":00Z";
      else if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/.test(v)) v += "Z";
      var p = Date.parse(v);
      if (!isNaN(p)) APERCU = p - Date.now();
    }
  } catch (e) { /* une adresse malformée ne doit pas casser la page */ }

  function maintenant() { return Date.now() + APERCU; }

  /* La date d'un instant, exprimée dans l'heure de l'événement.
     On ajoute le décalage AVANT de lire la date universelle : c'est ce
     qui fait que 23 h à Abidjan reste le 21, et non le 22. */
  function dateEvenement(t) {
    return new Date(t + DECALAGE_MS).toISOString().slice(0, 10);
  }

  /* La seule question qui compte pour chaque session. */
  function etatDe(s, t) {
    if (t < s.t0) return "avenir";
    if (t >= s.t1) return "passee";
    return "direct";
  }

  function deuxChiffres(n) { return (n < 10 ? "0" : "") + n; }

  function duree(ms) {
    var T = UI[LANGUE];
    if (ms < 0) ms = 0;
    var min = Math.floor(ms / 60000);
    var h = Math.floor(min / 60);
    var j = Math.floor(h / 24);
    if (j >= 1) return j + " " + (j > 1 ? T.jours : T.jour) + " " + (h % 24) + " h";
    if (h >= 1) return h + " h " + deuxChiffres(min % 60);
    return min + " " + T.min;
  }

  /* Les heures s'écrivent « 13h00 » en français, « 13:00 » en anglais. */
  function heure(hhmm) { return LANGUE === "fr" ? hhmm.replace(":", "h") : hhmm; }

  /* Le compte à rebours détaillé, jusqu'à la seconde.
     Les heures, minutes et secondes sont toujours sur DEUX chiffres :
     sans cela, le passage de « 9 s » à « 10 s » changerait la largeur
     du texte et tout le compteur sautillerait à chaque seconde.
     La police à chasse fixe et font-variant-numeric: tabular-nums,
     côté CSS, achèvent de le stabiliser. */
  function compteARebours(ms) {
    if (ms < 0) ms = 0;
    var s = Math.floor(ms / 1000);
    var j = Math.floor(s / 86400); s -= j * 86400;
    var h = Math.floor(s / 3600);  s -= h * 3600;
    var m = Math.floor(s / 60);    s -= m * 60;

    var U = LANGUE === "fr" ? ["j", "h", "min", "s"] : ["d", "h", "min", "s"];
    var bouts = [];
    if (j > 0) bouts.push(j + " " + U[0]);
    if (j > 0 || h > 0) bouts.push(deuxChiffres(h) + " " + U[1]);
    bouts.push(deuxChiffres(m) + " " + U[2]);
    bouts.push(deuxChiffres(s) + " " + U[3]);
    return bouts.join(" ");
  }

  /* ============================================================
     4. LE CHARGEMENT DES DONNÉES
     ============================================================ */

  /* Lit un fichier JSON et renvoie son contenu.
     Si quoi que ce soit échoue, renvoie null — jamais une exception
     qui ferait mourir la page en silence. */
  function charger(url, options) {
    return fetch(url, options)
      .then(function (r) {
        if (!r.ok) throw new Error("HTTP " + r.status);
        return r.json();
      })
      .catch(function (err) {
        console.warn("Chargement impossible :", url, err.message);
        return null;
      });
  }

  /* Prépare les données une fois pour toutes : on calcule les
     instants de début et de fin, et on donne une clé à chaque session. */
  /* Tant que le visiteur n'est pas enregistré, il n'y a aucune session.
     preparer() suppose au moins une journée — on lui évite ce cas. */
  function preparerOuVide(prog) {
    DECALAGE_MS = lireDecalage(prog.meta.utcOffset);
    if (!prog.jours || !prog.jours.length) {
      prog.jours = [];
      prog.ouverture = 0;
      prog.fermeture = 0;
      return prog;
    }
    return preparer(prog);
  }

  /* Le programme revenu de la base prend la place du vide. */
  function installerProgramme(prog) {
    PROGRAMME.jours = prog.jours;
    if (prog.meta && prog.meta.categories) PROGRAMME.meta.categories = prog.meta.categories;
    PROGRAMME = preparerOuVide(PROGRAMME);
    jourActif = jourParDefaut();
    peindreCadre();
    dessinerListe();
    rafraichir();
  }

  function preparer(prog) {
    DECALAGE_MS = lireDecalage(prog.meta.utcOffset);

    prog.jours.forEach(function (jour) {
      jour.sessions.forEach(function (s, i) {
        s.cle = jour.id + "-" + i;
        s.jour = jour;
        s.cat = prog.meta.categories[s.categorie] || { libelle: { fr: "", en: "" }, priorite: 1 };
        s.estJalon = s.cat.estJalon === true;
        s.t0 = instant(jour.date, s.debut);
        s.t1 = instant(jour.date, s.fin);
        // Un jalon n'a pas de durée : on lui en donne une, courte.
        if (s.t1 <= s.t0) s.t1 = s.t0 + 30 * 60000;
      });
      jour.ouverture = jour.sessions[0].t0;
      jour.fermeture = jour.sessions.reduce(function (m, s) { return Math.max(m, s.t1); }, 0);
    });

    prog.ouverture = prog.jours[0].ouverture;
    prog.fermeture = prog.jours[prog.jours.length - 1].fermeture;
    return prog;
  }

  /* Toutes les sessions, tous jours confondus. */
  function toutesLesSessions() {
    var out = [];
    PROGRAMME.jours.forEach(function (j) {
      j.sessions.forEach(function (s) { out.push(s); });
    });
    return out;
  }

  /* ============================================================
     5. LE LIEN « AJOUTER À MON AGENDA »
     Un vrai téléchargement de fichier .ics est bloqué dans une page
     installée. Un lien vers Google Agenda est une simple navigation :
     il fonctionne partout.
     ============================================================ */
  function horodatageGoogle(ms) {
    var d = new Date(ms);
    return d.getUTCFullYear()
      + deuxChiffres(d.getUTCMonth() + 1)   // les mois vont de 0 à 11 : d'où le + 1
      + deuxChiffres(d.getUTCDate()) + "T"
      + deuxChiffres(d.getUTCHours())
      + deuxChiffres(d.getUTCMinutes()) + "00Z";
  }

  /* Le même instant, écrit dans les trois dialectes que réclament les
     agendas du marché. Aucun n'a voulu se mettre d'accord sur un format.

       Google et l'iCalendar : 20260921T093000Z  (universel, en UTC)
       Outlook              : 2026-09-21T09:30:00Z  (la norme ISO)
       Yahoo                : 20260921T093000  (l'heure LOCALE, sans Z) */
  function horodatageGoogle(ms) {
    var d = new Date(ms);
    return d.getUTCFullYear()
      + deuxChiffres(d.getUTCMonth() + 1)   // les mois vont de 0 à 11 : d'où le + 1
      + deuxChiffres(d.getUTCDate()) + "T"
      + deuxChiffres(d.getUTCHours())
      + deuxChiffres(d.getUTCMinutes()) + "00Z";
  }
  function horodatageOutlook(ms) {
    return new Date(ms).toISOString().replace(/\.\d{3}Z$/, "Z");
  }
  function horodatageYahoo(ms) {
    // Yahoo attend l'heure de l'événement, pas l'heure universelle : on
    // ajoute le décalage AVANT de lire, puis on retire le Z.
    return horodatageGoogle(ms + DECALAGE_MS).replace("Z", "");
  }

  /* Le descriptif, construit une seule fois pour les cinq destinations. */
  function corpsAgenda(s) {
    var corps = [];
    if (s.resume) corps.push(s.resume[LANGUE]);
    if (s.details) corps.push(s.details[LANGUE].map(function (x) { return "• " + x; }).join("\n"));
    if (s.intervenants) {
      corps.push(UI[LANGUE].intervenants + " :\n" + s.intervenants.map(function (p) {
        return "• " + p.nom[LANGUE] + (p.role ? " — " + p.role[LANGUE] : "");
      }).join("\n"));
    }
    return corps.join("\n\n");
  }

  function lienGoogle(s) {
    return "https://calendar.google.com/calendar/render?action=TEMPLATE"
      + "&text=" + encodeURIComponent(s.titre[LANGUE])
      + "&dates=" + horodatageGoogle(s.t0) + "/" + horodatageGoogle(s.t1)
      + "&location=" + encodeURIComponent(PROGRAMME.meta.lieuComplet)
      + "&details=" + encodeURIComponent(corpsAgenda(s));
  }
  /* Deux adresses distinctes pour Outlook, et ce n'est pas un doublon :
     outlook.office.com sert les comptes professionnels, outlook.live.com
     les comptes personnels. Un ministère est sur le premier, un visiteur
     avec une adresse hotmail sur le second, et l'un ne reçoit pas l'autre. */
  function lienOutlook(s, pro) {
    return "https://outlook." + (pro ? "office" : "live") + ".com/calendar/deeplink/compose"
      + "?path=%2Fcalendar%2Faction%2Fcompose&rru=addevent"
      + "&subject=" + encodeURIComponent(s.titre[LANGUE])
      + "&startdt=" + encodeURIComponent(horodatageOutlook(s.t0))
      + "&enddt=" + encodeURIComponent(horodatageOutlook(s.t1))
      + "&location=" + encodeURIComponent(PROGRAMME.meta.lieuComplet)
      + "&body=" + encodeURIComponent(corpsAgenda(s));
  }
  function lienYahoo(s) {
    return "https://calendar.yahoo.com/?v=60"
      + "&TITLE=" + encodeURIComponent(s.titre[LANGUE])
      + "&ST=" + horodatageYahoo(s.t0)
      + "&ET=" + horodatageYahoo(s.t1)
      + "&in_loc=" + encodeURIComponent(PROGRAMME.meta.lieuComplet)
      + "&DESC=" + encodeURIComponent(corpsAgenda(s));
  }

  /* ---------- Le fichier .ics ----------
     C'est la seule pièce vraiment universelle : Apple Calendrier,
     Outlook installé, Thunderbird, les agendas Android et tous les
     autres savent l'ouvrir. Les liens ci-dessus ne servent que les
     agendas consultés dans un navigateur. */
  function echapperIcs(txt) {
    return String(txt)
      .replace(/\\/g, "\\\\").replace(/;/g, "\\;")
      .replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");
  }
  function plier(ligne) {
    /* La norme iCalendar limite chaque ligne à 75 octets ; au-delà, on
       coupe et on reprend avec une espace. Des accents mal comptés ici
       donnent un fichier que certains agendas refusent d'ouvrir — d'où
       le comptage en OCTETS et non en caractères. */
    var sortie = "", courant = "", octets = 0;
    for (var i = 0; i < ligne.length; i++) {
      var c = ligne[i];
      var n = unescape(encodeURIComponent(c)).length;
      if (octets + n > 73) { sortie += courant + "\r\n "; courant = ""; octets = 0; }
      courant += c; octets += n;
    }
    return sortie + courant;
  }
  function fabriquerIcs(s) {
    var lignes = [
      "BEGIN:VCALENDAR", "VERSION:2.0", "CALSCALE:GREGORIAN", "METHOD:PUBLISH",
      "PRODID:-//Journees Portes Ouvertes GBM//Agenda//FR",
      "BEGIN:VEVENT",
      "UID:" + s.jour.date + "-" + s.debut.replace(":", "") + "@agenda-gbm",
      "DTSTAMP:" + horodatageGoogle(Date.now()),
      "DTSTART:" + horodatageGoogle(s.t0),
      "DTEND:" + horodatageGoogle(s.t1),
      "SUMMARY:" + echapperIcs(s.titre[LANGUE]),
      "LOCATION:" + echapperIcs(PROGRAMME.meta.lieuComplet),
      "DESCRIPTION:" + echapperIcs(corpsAgenda(s)),
      "END:VEVENT", "END:VCALENDAR"
    ];
    return lignes.map(plier).join("\r\n") + "\r\n";
  }
  function telechargerIcs(s) {
    try {
      var lien = document.createElement("a");
      var url = URL.createObjectURL(new Blob([fabriquerIcs(s)],
                  { type: "text/calendar;charset=utf-8" }));
      lien.href = url;
      /* Un nom de fichier SANS accent ni ponctuation : c'est ce que
         verra le visiteur dans ses téléchargements, et les accents s'y
         transforment volontiers en caractères illisibles selon le
         téléphone. On garde la date et l'heure, qui suffisent à s'y
         retrouver quand on en a enregistré plusieurs. */
      lien.download = "JPO-GBM-" + s.jour.date + "-" + s.debut.replace(":", "h") + ".ics";
      document.body.appendChild(lien);
      lien.click();
      document.body.removeChild(lien);
      // On libère la mémoire, mais pas avant que le navigateur ait lu.
      window.setTimeout(function () { URL.revokeObjectURL(url); }, 30000);
    } catch (e) {
      console.warn("Téléchargement du fichier .ics impossible :", e.message);
    }
  }

  /* ============================================================
     6. L'AFFICHAGE
     ============================================================ */

  function echapper(txt) {
    return String(txt)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;")
      .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  var CHEMIN_ETOILE = "M12 2.6l2.95 5.98 6.6.96-4.77 4.65 1.12 6.57L12 17.66 6.1 20.76l1.12-6.57L2.45 9.54l6.6-.96z";
  function svgEtoile(pleine) {
    return '<svg viewBox="0 0 24 24" aria-hidden="true" fill="' + (pleine ? "currentColor" : "none")
      + '" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"><path d="'
      + CHEMIN_ETOILE + '"/></svg>';
  }

  /* Le jour à ouvrir par défaut : celui en cours, sinon le prochain. */
  function jourParDefaut() {
    if (!PROGRAMME.jours.length) return 0;
    var t = maintenant();
    for (var i = 0; i < PROGRAMME.jours.length; i++) {
      if (t < PROGRAMME.jours[i].fermeture) return i;
    }
    return PROGRAMME.jours.length - 1;
  }

  /* Les textes fixes : bandeau, onglets, informations pratiques. */
  function peindreCadre() {
    var T = UI[LANGUE];
    var M = PROGRAMME.meta;

    document.documentElement.lang = LANGUE;
    $("mSurtitre").textContent = M.surtitre[LANGUE];
    $("mTitre").textContent = M.titre[LANGUE];
    $("mTheme").textContent = "◆ " + M.theme[LANGUE];
    $("mLieu").textContent = "◆ " + M.lieu[LANGUE];

    $("btnFr").setAttribute("aria-pressed", LANGUE === "fr" ? "true" : "false");
    $("btnEn").setAttribute("aria-pressed", LANGUE === "en" ? "true" : "false");

    /* Les boutons du thème ne portent qu'un dessin : sans ces libellés,
       un lecteur d'écran annoncerait « bouton », sans rien de plus. */
    $("labClair").textContent = T.themeClair;
    $("labSombre").textContent = T.themeSombre;
    $("btnClair").setAttribute("title", T.themeClair);
    $("btnSombre").setAttribute("title", T.themeSombre);

    $("filtreLabel").textContent = filtreEtoiles ? T.toutAgenda : T.mesSessions;
    $("jumpLabel").textContent = T.jumpLabel;

    $("infosTitre").textContent = T.infosTitre;

    /* Les dates viennent des journées ; tant qu'elles ne sont pas
       chargées, on se rabat sur le libellé fixe des données. */
    var j0 = PROGRAMME.jours[0];
    var jN = PROGRAMME.jours[PROGRAMME.jours.length - 1];
    var libDates = j0 ? (j0.dateCourte[LANGUE] + " – " + jN.dateCourte[LANGUE])
                      : (M.dates ? M.dates[LANGUE] : "");
    var infos = [
      [T.libLieu, M.lieuComplet],
      [T.libDates, libDates],
      [T.libHeure, "UTC" + M.utcOffset],
      [T.libEntree, T.valEntree]
    ];
    $("infosListe").innerHTML = infos.map(function (p) {
      return "<dt>" + echapper(p[0]) + "</dt><dd>" + echapper(p[1]) + "</dd>";
    }).join("");

    $("howtoTitre").textContent = T.howtoTitre;
    $("howtoCorps").innerHTML = T.howtoCorps;
    $("credit").textContent = T.credit;

    var tabs = $("tabs");
    tabs.innerHTML = "";
    PROGRAMME.jours.forEach(function (jour, i) {
      var b = document.createElement("button");
      b.className = "tab";
      b.type = "button";
      b.setAttribute("role", "tab");
      b.setAttribute("aria-selected", i === jourActif ? "true" : "false");
      b.innerHTML = echapper(jour.libelle[LANGUE])
        + '<span class="tab-date">' + echapper(jour.dateCourte[LANGUE]) + "</span>";
      b.addEventListener("click", function () {
        jourActif = i;
        peindreCadre();
        dessinerListe();
      });
      tabs.appendChild(b);
    });
  }

  /* Construit la liste des sessions du jour affiché. */
  function dessinerListe() {
    var T = UI[LANGUE];
    var rail = $("rail");

    /* Avant enregistrement, PROGRAMME.jours est vide — le programme est
       encore dans la base. La liste ne doit pas planter pour autant. */
    var jour = PROGRAMME.jours[jourActif];
    if (!jour) { rail.innerHTML = ""; noeuds = []; $("sousTitre").textContent = ""; return; }

    $("sousTitre").textContent = jour.sousTitre[LANGUE];

    var liste = jour.sessions.filter(function (s) {
      return filtreEtoiles ? !!etoiles[s.cle] : true;
    });

    rail.innerHTML = "";
    noeuds = [];

    if (!liste.length) {
      var vide = document.createElement("li");
      vide.className = "vide";
      vide.textContent = T.videEtoiles;
      rail.appendChild(vide);
      rafraichir();
      return;
    }

    liste.forEach(function (s) {
      var li = document.createElement("li");
      li.className = "creneau" + (s.estJalon ? " jalon" : "");
      var html = "";

      if (s.estJalon) {
        html += '<div class="corps">'
          + '<span class="heure-jalon">' + heure(s.debut) + "</span>"
          + "<h3>" + echapper(s.titre[LANGUE]) + "</h3>"
          + '<span class="badges"></span>'
          + "</div>";
      } else {
        html += '<div class="heure">' + heure(s.debut)
          + '<span class="fin">' + heure(s.fin) + "</span></div>";
        html += '<div class="corps">';
        html += '<div class="badges"><p class="categorie">' + echapper(s.cat.libelle[LANGUE])
          + '</p><span class="emplacement-puce"></span></div>';
        html += '<button class="etoile" type="button" aria-pressed="'
          + (etoiles[s.cle] ? "true" : "false") + '" aria-label="' + echapper(T.marquer) + '">'
          + svgEtoile(!!etoiles[s.cle]) + "</button>";
        html += "<h3>" + echapper(s.titre[LANGUE]) + "</h3>";

        if (s.details) {
          html += '<ul class="details">' + s.details[LANGUE].map(function (d) {
            return "<li>" + echapper(d) + "</li>";
          }).join("") + "</ul>";
        }
        if (s.resume) html += '<p class="resume">' + echapper(s.resume[LANGUE]) + "</p>";
        if (s.intervenants && s.intervenants.length) {
          html += '<div class="intervenants"><p class="titre-bloc">' + echapper(T.intervenants)
            + "</p><ul>" + s.intervenants.map(function (p) {
              return '<li><span class="nom">' + echapper(p.nom[LANGUE]) + "</span>"
                + (p.role ? '<span class="role">' + echapper(p.role[LANGUE]) + "</span>" : "")
                + "</li>";
            }).join("") + "</ul></div>";
        }
        html += '<div class="emplacement-progression"></div>';
        /* Un <details> plutôt qu'un menu écrit à la main : le navigateur
           gère l'ouverture, la fermeture, le clavier et la lecture vocale.
           Rien à programmer, rien à maintenir. */
        html += '<details class="agenda-choix"><summary>'
          + '<span aria-hidden="true">+</span> <span>' + echapper(T.ajouterAgenda)
          + "</span></summary><ul>"
          + '<li><button type="button" class="ics" data-ics="' + echapper(s.cle) + '">'
          + echapper(T.calApple) + "</button></li>"
          + '<li><a href="' + echapper(lienGoogle(s)) + '" target="_blank" rel="noopener">'
          + echapper(T.calGoogle) + "</a></li>"
          + '<li><a href="' + echapper(lienOutlook(s, true)) + '" target="_blank" rel="noopener">'
          + echapper(T.calOutlookPro) + "</a></li>"
          + '<li><a href="' + echapper(lienOutlook(s, false)) + '" target="_blank" rel="noopener">'
          + echapper(T.calOutlookPerso) + "</a></li>"
          + '<li><a href="' + echapper(lienYahoo(s)) + '" target="_blank" rel="noopener">'
          + echapper(T.calYahoo) + "</a></li>"
          + "</ul></details>";
        html += "</div>";
      }

      li.innerHTML = html;

      var btn = li.querySelector(".etoile");
      if (btn) {
        btn.addEventListener("click", function () {
          etoiles[s.cle] = !etoiles[s.cle];
          if (!etoiles[s.cle]) delete etoiles[s.cle];
          sauverEtoiles();
          btn.setAttribute("aria-pressed", etoiles[s.cle] ? "true" : "false");
          btn.innerHTML = svgEtoile(!!etoiles[s.cle]);
          if (filtreEtoiles) dessinerListe();
        });
      }

      rail.appendChild(li);
      noeuds.push({
        s: s, li: li,
        puce: li.querySelector(".emplacement-puce"),
        badges: li.querySelector(".badges"),
        prog: li.querySelector(".emplacement-progression")
      });
    });

    rafraichir();
  }

  /* ============================================================
     7. LE RAFRAÎCHISSEMENT — appelé chaque seconde
     Il ne reconstruit RIEN : il ne fait que poser des étiquettes
     et mettre à jour des compteurs. Reconstruire chaque seconde
     ferait sauter le défilement sous le doigt du visiteur.
     ============================================================ */
  function rafraichir() {
    var t = maintenant();
    var T = UI[LANGUE];

    noeuds.forEach(function (n) {
      var etat = etatDe(n.s, t);

      n.li.classList.toggle("en-cours", etat === "direct" && !n.s.estJalon);
      n.li.classList.toggle("passee", etat === "passee");

      var puce = etat === "direct" ? '<span class="puce puce-direct">' + echapper(T.puceDirect) + "</span>"
               : etat === "passee" ? '<span class="puce puce-fini">' + echapper(T.puceFini) + "</span>"
               :                     '<span class="puce puce-avenir">' + echapper(T.puceAvenir) + "</span>";

      if (n.puce) n.puce.innerHTML = puce;
      else if (n.badges) n.badges.innerHTML = puce;

      if (n.prog) {
        if (etat === "direct") {
          var pct = Math.max(0, Math.min(100, ((t - n.s.t0) / (n.s.t1 - n.s.t0)) * 100));
          n.prog.innerHTML = '<div class="progression"><i style="width:' + pct.toFixed(1) + '%"></i></div>'
            + '<p class="progression-txt">' + echapper(T.seTermineDans) + " " + duree(n.s.t1 - t)
            + " · " + echapper(T.jusqua) + " " + heure(n.s.fin) + "</p>";
        } else {
          n.prog.innerHTML = "";
        }
      }
    });

    majStatut(t);
    majBoutonJump();
  }

  /* La barre du haut : la règle de priorité est ici. */
  function majStatut(t) {
    var T = UI[LANGUE];
    var kicker = $("statusKicker"), titre = $("statusTitre");
    var sous = $("statusSous"), aussi = $("statusAussi");
    var toutes = toutesLesSessions();

    aussi.hidden = true;
    titre.className = "status-titre";

    /* Aucune session chargée : la barre de statut invite simplement
       à s'enregistrer, au lieu d'afficher un décompte vers rien. */
    if (!PROGRAMME.jours.length) {
      kicker.className = "status-kicker";
      kicker.textContent = "";
      titre.className = "status-titre";
      titre.textContent = T.statutVerrou;
      sous.textContent = "";
      aussi.hidden = true;
      return;
    }

    /* ---- AVANT L'OUVERTURE : le compte à rebours, à la seconde ---- */
    if (t < PROGRAMME.ouverture) {
      kicker.className = "status-kicker";
      kicker.textContent = T.ouvreDans;
      titre.className = "status-titre compteur";
      titre.textContent = compteARebours(PROGRAMME.ouverture - t);
      sous.innerHTML = echapper(T.ouvertureTitre) + ' <span class="horloge">'
        + echapper(PROGRAMME.jours[0].dateCourte[LANGUE])
        + " · " + heure(PROGRAMME.jours[0].sessions[0].debut) + "</span>";
      return;
    }

    /* ---- APRÈS LA CLÔTURE ---- */
    if (t >= PROGRAMME.fermeture) {
      kicker.className = "status-kicker";
      kicker.innerHTML = '<span class="badge-etat badge-fini">' + echapper(T.badgeFini) + "</span>";
      titre.textContent = T.mercíTitre;
      sous.textContent = T.termineSous;
      return;
    }

    /* ---- PENDANT L'ÉVÉNEMENT : le badge « Ouvert » reste affiché ---- */
    var badgeOuvert = '<span class="badge-etat badge-ouvert"><i></i>'
      + echapper(T.ouvert) + "</span>";

    /* Les sessions en cours, triées par priorité décroissante.
       Une conférence bornée (priorité 2) passe devant un espace
       ouvert sept heures (priorité 1). La priorité vient des DONNÉES. */
    var enCours = toutes
      .filter(function (s) { return etatDe(s, t) === "direct" && !s.estJalon; })
      .sort(function (a, b) { return b.cat.priorite - a.cat.priorite; });

    if (enCours.length) {
      var cur = enCours[0];
      kicker.className = "status-kicker";
      kicker.innerHTML = badgeOuvert + '<span class="kicker-txt">' + echapper(T.enCours) + "</span>";
      titre.textContent = cur.titre[LANGUE];
      var bits = '<span class="horloge">' + heure(cur.debut) + " – " + heure(cur.fin) + "</span>"
        + echapper(T.seTermineDans) + " " + compteARebours(cur.t1 - t);
      if (enCours.length > 1) {
        bits += " · +" + (enCours.length - 1) + " " + echapper(T.enParallele);
      }
      sous.innerHTML = bits;
      return;
    }

    /* Aucun événement borné en cours : c'est un creux.
       Décision de la spec : afficher la prochaine session ET ce qui
       reste ouvert, l'un sous l'autre. */
    var prochaine = toutes
      .filter(function (s) { return s.t0 > t; })
      .sort(function (a, b) { return a.t0 - b.t0; })[0];

    var permanents = toutes.filter(function (s) {
      return etatDe(s, t) === "direct" && s.cat.priorite === 1;
    });

    if (prochaine) {
      /* ATTENTION au piège : comparer prochaine.jour à l'onglet affiché
         ne répond PAS à la question « est-ce le même jour ? ». Le soir
         du jour 1, l'onglet est déjà passé au jour 2, donc la comparaison
         disait « même jour » alors qu'il restait quinze heures d'attente.

         On compare donc les DATES réelles, dans l'heure de l'événement. */
      var memeJour = dateEvenement(t) === prochaine.jour.date;
      kicker.className = "status-kicker";

      /* Le badge dit si quelque chose est ouvert MAINTENANT, pas si
         l'événement court encore.

         Entre deux sessions du même jour, la Patinoire est bien ouverte
         et les gens y sont : « Ouvert » est juste. Mais une fois la
         journée terminée, la prochaine activité est le lendemain — et
         afficher « Ouvert » à 22 h, quand plus rien ne se passe, ferait
         croire à un visiteur qu'il peut encore venir. On bascule alors
         sur le badge neutre « Pause », sans rien changer au reste :
         l'heure et le nom de la prochaine activité restent affichés. */
      kicker.innerHTML = (memeJour
          ? badgeOuvert
          : '<span class="badge-etat badge-fini">' + echapper(T.pause) + "</span>")
        + '<span class="kicker-txt">'
        + echapper(T.aSuivre) + " " + compteARebours(prochaine.t0 - t) + "</span>";
      titre.textContent = prochaine.titre[LANGUE];
      sous.innerHTML = '<span class="horloge">'
        + (memeJour ? "" : echapper(prochaine.jour.dateCourte[LANGUE]) + " · ")
        + heure(prochaine.debut) + "</span>" + echapper(prochaine.cat.libelle[LANGUE]);

      if (permanents.length) {
        aussi.hidden = false;
        aussi.innerHTML = echapper(T.aussiOuvert) + " " + echapper(permanents[0].titre[LANGUE])
          + " <span class=\"horloge\">" + echapper(T.jusqua) + " " + heure(permanents[0].fin) + "</span>";
      }
      return;
    }

    kicker.className = "status-kicker";
    kicker.innerHTML = badgeOuvert + '<span class="kicker-txt">' + echapper(T.pause) + "</span>";
    titre.textContent = T.pauseTitre;
    sous.textContent = "";
  }

  /* ============================================================
     LE BANDEAU D'ANNONCE
     Relu toutes les 3 minutes, en contournant le cache : c'est ce
     qui permet à un message de circuler pendant l'événement.
     ============================================================ */
  function majAnnonce() {
    charger("annonce.json", { cache: "no-store" }).then(function (a) {
      var boite = $("annonce");
      if (!a || a.actif !== true || !a.message || !a.message[LANGUE]) {
        boite.hidden = true;
        return;
      }
      var T = UI[LANGUE];
      $("annonceTag").textContent = a.niveau === "alerte" ? T.annonceAlerte : T.annonceInfo;
      $("annonceTexte").textContent = a.message[LANGUE];
      boite.hidden = false;
    });
  }

  /* ============================================================
     LE BANDEAU D'INSTALLATION
     ============================================================
     Aucune page web ne peut s'installer elle-même : les systèmes
     réservent cette décision au visiteur. Mais on peut réduire
     la manipulation au minimum, différemment selon l'appareil.

     • Android / Chrome — le navigateur prévient la page qu'une
       installation est possible, par l'événement beforeinstallprompt.
       On met cet événement de côté, on affiche notre propre bouton,
       et son clic ouvre la fenêtre officielle du système.
     • iPhone / Safari — Apple n'offre aucun mécanisme équivalent.
       Le mieux possible est d'afficher l'instruction, visiblement.
     • Déjà installée, ou sur ordinateur — on n'affiche rien.
     ============================================================ */
  var evenementInstall = null;
  /* Le nom de cette clé porte un numéro, et ce numéro vient de changer.
     Raison : un visiteur qui a appuyé une fois sur la croix du bandeau
     pendant les essais l'a fait taire DÉFINITIVEMENT sur son téléphone.
     Impossible de savoir, à distance, si un bandeau manquant vient du
     code ou de cette croix. En changeant le nom de la clé, les refus
     posés pendant les essais ne correspondent plus à rien : chaque
     téléphone repart avec un bandeau visible, et la croix continue de
     fonctionner normalement pour la suite. */
  var CLE_INSTALL = "agenda-install-masque-2";

  /* La page tourne-t-elle déjà depuis l'écran d'accueil ? */
  function dejaInstallee() {
    try {
      if (window.matchMedia && window.matchMedia("(display-mode: standalone)").matches) return true;
    } catch (e) { }
    return navigator.standalone === true;   // la façon de Safari sur iOS
  }

  function estIOS() {
    var ua = navigator.userAgent || "";
    // Depuis iPadOS 13, un iPad se déclare comme un Mac.
    // On le démasque au nombre de points de contact tactiles.
    var iPadDeguise = /Macintosh/.test(ua) && navigator.maxTouchPoints > 1;
    return /iPad|iPhone|iPod/.test(ua) || iPadDeguise;
  }

  /* Sur iOS, seul Safari sait ajouter à l'écran d'accueil.
     Chrome ou Firefox sur iPhone en sont incapables. */
  function estSafariIOS() {
    var ua = navigator.userAgent || "";
    return estIOS() && !/CriOS|FxiOS|EdgiOS|OPiOS|GSA/.test(ua);
  }

  function installMasquee() {
    try { return localStorage.getItem(CLE_INSTALL) === "1"; } catch (e) { return false; }
  }
  function masquerInstall() {
    try { localStorage.setItem(CLE_INSTALL, "1"); } catch (e) { }
    cacherBandeauInstall();
  }
  function cacherBandeauInstall() {
    $("install").hidden = true;
    document.body.classList.remove("avec-install");
  }

  function montrerBandeauInstall(mode) {
    var T = UI[LANGUE];
    $("installTitre").textContent = T.installTitre;
    $("installDetail").textContent = mode === "ios" ? T.installIOS : T.installDetail;
    $("installX").textContent = "✕";
    $("installX").setAttribute("aria-label", T.installFermer);

    var go = $("installGo");
    go.hidden = (mode !== "android");
    if (mode === "android") go.textContent = T.installBouton;

    $("install").hidden = false;
    document.body.classList.add("avec-install");
  }

  /* Le bouton d'installation POSÉ DANS le panneau d'enregistrement.
     Il n'apparaît que sur Android, quand Chrome nous a effectivement
     proposé l'installation — sur iPhone aucun bouton n'existe, seule
     la manipulation par le menu Partager est possible, et le texte
     du conseil l'explique. */
  function majInstallPanneau() {
    var b = $("astuceGo");
    if (!b) return;
    b.hidden = !evenementInstall || dejaInstallee();
  }

  function preparerInstall() {
    $("astuceGo").addEventListener("click", function () {
      if (!evenementInstall) return;
      evenementInstall.prompt();
      evenementInstall.userChoice.then(function () {
        evenementInstall = null;
        cacherBandeauInstall();
        majInstallPanneau();
      });
    });

    if (dejaInstallee() || installMasquee()) return;

    // Android : Chrome nous préviendra. On garde l'événement de côté.
    window.addEventListener("beforeinstallprompt", function (e) {
      e.preventDefault();               // on refuse la bannière par défaut
      evenementInstall = e;             // pour l'ouvrir nous-mêmes, plus tard
      /* L'événement arrive souvent APRÈS l'affichage du panneau :
         il faut donc revenir allumer le bouton à ce moment-là. */
      majInstallPanneau();
      if (!dejaInstallee() && !installMasquee()) montrerBandeauInstall("android");
    });

    // iPhone : aucun événement n'existe. On affiche l'instruction.
    if (estSafariIOS()) {
      window.setTimeout(function () {
        if (!dejaInstallee() && !installMasquee()) montrerBandeauInstall("ios");
      }, 1200);
    }

    // L'installation a eu lieu : le bandeau n'a plus lieu d'être.
    window.addEventListener("appinstalled", function () {
      evenementInstall = null;
      cacherBandeauInstall();
    });

    $("installGo").addEventListener("click", function () {
      if (!evenementInstall) return;
      evenementInstall.prompt();                       // la fenêtre du système
      evenementInstall.userChoice.then(function () {
        evenementInstall = null;
        cacherBandeauInstall();
      });
    });

    $("installX").addEventListener("click", masquerInstall);
  }

  /* ============================================================
     L'ENREGISTREMENT DES PARTICIPANTS
     ============================================================
     Le formulaire envoie ses réponses à un petit script Google,
     qui les écrit dans une feuille de calcul. GitHub Pages ne sait
     que SERVIR des fichiers : il ne peut rien recevoir. Il faut
     donc un destinataire ailleurs.

     Deux précautions valent d'être comprises :

     • L'envoi part en "text/plain". C'est volontaire : avec ce
       type, le navigateur envoie directement, sans demander
       d'autorisation préalable au serveur. Avec "application/json"
       il enverrait d'abord une requête OPTIONS, à laquelle les
       scripts Google ne répondent pas — et l'envoi échouerait.

     • Un envoi qui échoue n'est pas perdu : il est gardé sur
       l'appareil et repart au chargement suivant. Dans une salle
       où 400 personnes saturent le wifi, c'est la différence
       entre perdre des inscriptions et n'en perdre aucune.
     ============================================================ */
  var CLE_INSCRIT = "agenda-inscrit";
  var CLE_ATTENTE = "agenda-inscription-attente";
  var CLE_INSCRIRE_MASQUE = "agenda-inscrire-masque";

  /* Le geste unique qui ouvre l'agenda, d'où qu'il vienne : celui qui
     vient d'envoyer le formulaire, comme celui qui revient et le déclare. */
  function ouvrirLAgenda() {
    noterInscrit();
    $("inscrireBandeau").hidden = true;
    $("formFermer").hidden = false;
    document.body.classList.remove("verrouille");
    fermerPanneau();
  }

  function estInscrit() {
    /* EN MODE BASE, la question n'est pas « a-t-on coché quelque part ? »
       mais « a-t-on le programme ? ».

       La nuance a failli coûter cher : les téléphones qui avaient ouvert
       l'agenda AVANT la bascule portaient encore la marque « inscrit »
       des versions précédentes. Le widget leur épargnait donc le
       formulaire — alors qu'ils n'avaient aucun programme, et aucun
       moyen d'en obtenir un. Écran vide, sans issue.

       En liant l'état à la seule chose qui compte vraiment, ces
       appareils repassent naturellement par l'enregistrement. */
    if (modeBase()) return !!lireProgrammeGarde();
    try { return localStorage.getItem(CLE_INSCRIT) === "1"; } catch (e) { return false; }
  }
  function noterInscrit() {
    try { localStorage.setItem(CLE_INSCRIT, "1"); } catch (e) { }
  }
  function inscrireMasque() {
    try { return localStorage.getItem(CLE_INSCRIRE_MASQUE) === "1"; } catch (e) { return false; }
  }

  /* Un identifiant unique par inscription.
     Il sert de filet : si un envoi part deux fois — le cas peut
     arriver quand le navigateur n'arrive pas à lire la réponse du
     serveur alors que celui-ci a bien reçu — deux lignes portent
     le même identifiant, et se repèrent d'un coup d'œil dans Excel. */
  function identifiant() {
    try {
      if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
    } catch (e) { }
    return "id-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 10);
  }

  function lireAttente() {
    try {
      var brut = localStorage.getItem(CLE_ATTENTE);
      return brut ? JSON.parse(brut) : [];
    } catch (e) { return []; }
  }
  function ecrireAttente(liste) {
    try { localStorage.setItem(CLE_ATTENTE, JSON.stringify(liste)); } catch (e) { }
  }

  /* L'envoi lui-même. Renvoie une promesse vraie/fausse. */
  /* ============================================================
     L'ENVOI À LA BASE — et le retour du programme
     ============================================================
     Le changement décisif tient en une phrase : ce n'est plus un
     envoi, c'est un ÉCHANGE. On transmet l'enregistrement, et la
     base renvoie le programme en retour.

     C'est ce qui rend le verrou réel. Auparavant le programme était
     un fichier public : le contrôle s'exécutait dans le navigateur,
     après que les données avaient déjà été livrées, et se contournait
     donc trivialement. Désormais le programme ne quitte la base
     qu'après que la ligne du participant y a été écrite — et cette
     décision-là se prend sur le serveur, hors d'atteinte du visiteur.
     ============================================================ */
  function envoyerInscription(donnees) {
    var conf = PROGRAMME.inscription;
    if (!conf || !conf.baseUrl || !conf.baseCle) return Promise.resolve(null);

    return fetch(conf.baseUrl.replace(/\/+$/, "") + "/rest/v1/rpc/enregistrer", {
      method: "POST",
      headers: {
        "apikey": conf.baseCle,
        "Authorization": "Bearer " + conf.baseCle,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        p_nom_complet: donnees.nom,
        p_qualite:     donnees.qualiteCle,
        p_autre:       donnees.precision || null,
        p_email:       donnees.email || null,
        p_telephone:   donnees.telephone || null,
        p_langue:      donnees.langue
      })
    })
      .then(function (r) {
        if (!r.ok) return r.text().then(function (t) {
          console.warn("Enregistrement refusé :", r.status, t.slice(0, 200));
          return null;
        });
        return r.json();
      })
      .then(function (prog) {
        // On n'accepte la réponse que si elle contient vraiment un programme.
        return (prog && prog.jours && prog.jours.length) ? prog : null;
      })
      .catch(function (e) {
        console.warn("Base injoignable :", e.message);
        return null;
      });
  }

  /* ---------- La réserve locale du programme ----------
     Une fois obtenu, le programme est gardé sur l'appareil : le
     visiteur ne se ré-enregistre pas à chaque ouverture, et l'agenda
     continue de fonctionner sans réseau — ce qui était tout l'intérêt
     du dispositif dans une salle saturée. */
  var CLE_PROG = "agenda-programme";
  var CACHE_PARTAGE = "agenda-partage";
  var URL_PARTAGE = "./programme-du-visiteur.json";

  function lireProgrammeGarde() {
    try {
      var brut = localStorage.getItem(CLE_PROG);
      if (!brut) return null;
      var p = JSON.parse(brut);
      return (p && p.jours && p.jours.length) ? p : null;
    } catch (e) { return null; }
  }

  /* ---------- LE PONT ENTRE SAFARI ET L'ÉCRAN D'ACCUEIL ----------
     Sur iPhone, l'application posée sur l'écran d'accueil ne partage
     avec Safari ni localStorage, ni les cookies, ni IndexedDB : Apple
     les cloisonne. Le CACHE STORAGE, lui, semble franchir cette
     frontière depuis Safari 14 — il sert au hors-connexion, et Apple
     le traite différemment.

     On écrit donc le programme AUX DEUX ENDROITS. Si le pont existe,
     le visiteur qui s'enregistre dans Safari puis installe l'icône
     retrouve son programme sans rien refaire. Si le pont n'existe pas,
     localStorage prend le relais exactement comme avant : cet ajout ne
     peut rien casser, il ne peut que réparer. */
  function partagerProgramme(prog) {
    try {
      if (!window.caches) return;

      /* On met le programme en texte TOUT DE SUITE, avant d'ouvrir le
         cache — et c'est la seule ligne qui compte vraiment ici.

         L'ouverture du cache est asynchrone. Si l'on attendait sa
         réponse pour convertir le programme, la conversion aurait lieu
         APRÈS installerProgramme(), qui relie chaque session à sa
         journée et chaque journée à ses sessions. Cette boucle est
         normale pour l'affichage, mais JSON.stringify refuse de la
         convertir : il tourne en rond. L'erreur partait alors dans le
         .catch et disparaissait sans bruit — localStorage, lui,
         fonctionnait, parce qu'il convertit immédiatement. */
      var texte = JSON.stringify(prog);

      caches.open(CACHE_PARTAGE).then(function (reserve) {
        return reserve.put(URL_PARTAGE, new Response(texte,
          { headers: { "Content-Type": "application/json" } }));
      }).catch(function (e) {
        console.warn("Pont vers l'écran d'accueil indisponible :", e.message);
      });
    } catch (e) {
      console.warn("Pont vers l'écran d'accueil impossible :", e.message);
    }
  }

  /* La lecture est forcément asynchrone : le Cache Storage ne répond
     que par promesse. On ne fait jamais échouer le démarrage pour ça —
     en cas de doute, on rend null et localStorage reprend la main. */
  function lireProgrammePartage() {
    return new Promise(function (resoudre) {
      try {
        if (!window.caches) return resoudre(null);
        var fini = false;
        var rendre = function (v) { if (!fini) { fini = true; resoudre(v); } };
        // Garde-fou : si le cache ne répond pas, on n'attend pas plus d'une seconde.
        window.setTimeout(function () { rendre(null); }, 1000);

        caches.open(CACHE_PARTAGE)
          .then(function (reserve) { return reserve.match(URL_PARTAGE); })
          .then(function (rep) { return rep ? rep.json() : null; })
          .then(function (p) { rendre(p && p.jours && p.jours.length ? p : null); })
          .catch(function () { rendre(null); });
      } catch (e) { resoudre(null); }
    });
  }

  var CLE_JETON = "agenda-jeton";

  /* ---------- LE JETON DE REPRISE ----------
     Sur iPhone, l'application de l'écran d'accueil ne partage avec
     Safari ni localStorage, ni les cookies, ni le cache : Apple
     cloisonne tout. La SEULE chose qui franchit la frontière est
     L'ADRESSE — iOS retient celle qui est affichée au moment où l'on
     ajoute la page à l'écran d'accueil.

     On inscrit donc le jeton dans l'adresse après l'enregistrement.
     L'icône naît avec lui, et peut redemander le programme sans créer
     une seconde inscription. */
  function poserJetonDansAdresse(jeton) {
    try {
      if (!jeton || !window.history || !history.replaceState) return;
      var u = new URL(window.location.href);
      u.searchParams.set("j", jeton);
      history.replaceState(null, "", u.toString());
      localStorage.setItem(CLE_JETON, jeton);
    } catch (e) { }
  }

  function jetonConnu() {
    try {
      var p = new URLSearchParams(window.location.search).get("j");
      if (p) return p;
      return localStorage.getItem(CLE_JETON) || null;
    } catch (e) { return null; }
  }

  /* Redemande le programme avec le jeton. Aucune ligne n'est créée :
     la base vérifie seulement que ce jeton correspond bien à une
     inscription existante. */
  function reprendreAvecJeton(c, jeton) {
    if (!jeton || !c || !c.baseUrl || !c.baseCle) return Promise.resolve(null);

    return fetch(c.baseUrl.replace(/\/+$/, "") + "/rest/v1/rpc/reprendre", {
      method: "POST",
      headers: {
        "apikey": c.baseCle,
        "Authorization": "Bearer " + c.baseCle,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ p_jeton: jeton })
    })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (p) { return (p && p.jours && p.jours.length) ? p : null; })
      .catch(function (e) {
        console.warn("Reprise par jeton impossible :", e.message);
        return null;
      });
  }

  function garderProgramme(prog) {
    try { localStorage.setItem(CLE_PROG, JSON.stringify(prog)); } catch (e) { }
    partagerProgramme(prog);
  }

  /* Au chargement, on retente ce qui n'était pas parti.
     Trois tentatives au maximum, puis on abandonne : si le serveur
     reçoit bien mais que le navigateur n'arrive pas à lire sa réponse,
     réessayer indéfiniment créerait une ligne de plus à chaque
     ouverture de l'application. Trois bornes le dégât. */
  var ESSAIS_MAX = 3;

  function viderLaFileDAttente() {
    var attente = lireAttente();
    if (!attente.length) return;

    var restant = [];
    var suite = Promise.resolve();

    attente.forEach(function (d) {
      suite = suite.then(function () {
        return envoyerInscription(d).then(function (ok) {
          if (ok) return;
          d.essais = (d.essais || 0) + 1;
          if (d.essais < ESSAIS_MAX) restant.push(d);
        });
      });
    });

    suite.then(function () { ecrireAttente(restant); });
  }

  function emailPlausible(v) {
    // Volontairement permissif : refuser une adresse valide est pire
    // que d'en accepter une douteuse, qu'un humain verra dans la feuille.
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
  }

  /* Deux destinations possibles, selon ce que la politique de sécurité
     de l'organisation autorise :
       • "formulaire" — un formulaire Microsoft Forms dans un cadre
       • "flux"       — le formulaire maison qui envoie à Power Automate
     Le code ne privilégie ni l'un ni l'autre : les données décident. */
  function modeFormulaire() {
    var c = PROGRAMME.inscription;
    return !!(c && c.mode === "formulaire");
  }
  /* Mode « base » : le formulaire est le nôtre, et il dialogue
     directement avec Supabase. */
  function modeBase() {
    var c = PROGRAMME.inscription;
    return !!(c && c.mode === "base");
  }

  /* Y a-t-il quelque part où envoyer ? Sans destination, on n'affiche
     rien du tout — surtout pas un verrou qui enfermerait les visiteurs
     dehors sans pouvoir enregistrer personne. */
  function destinationPrete() {
    var c = PROGRAMME.inscription;
    if (!c || c.active !== true) return false;
    if (modeBase()) return !!(c.baseUrl && c.baseCle);
    return modeFormulaire() ? !!c.formulaireUrl : !!c.url;
  }

  function verrouActif() {
    return destinationPrete() && PROGRAMME.inscription.obligatoire === true;
  }

  /* Remplit la liste déroulante des qualités à partir des données. */
  function peindreQualites() {
    var T = UI[LANGUE];
    var conf = PROGRAMME.inscription || {};
    var liste = conf.qualites || [];
    var select = $("fQualite");
    var choisi = select.value;

    select.innerHTML = '<option value="">' + echapper(T.labQualiteVide) + "</option>"
      + liste.map(function (q) {
          return '<option value="' + echapper(q.cle) + '">' + echapper(q[LANGUE] || q.fr) + "</option>";
        }).join("");

    if (choisi) select.value = choisi;   // on garde le choix au changement de langue
  }

  /* La qualité choisie demande-t-elle une précision libre ? */
  function qualiteDemandePrecision(cle) {
    var liste = (PROGRAMME.inscription || {}).qualites || [];
    for (var i = 0; i < liste.length; i++) {
      if (liste[i].cle === cle) return liste[i].champLibre === true;
    }
    return false;
  }

  function peindreFormulaire() {
    var T = UI[LANGUE];
    var conf = PROGRAMME.inscription || {};

    $("inscrireTitre").textContent = T.inscrireTitre;
    $("inscrireDetail").textContent = T.inscrireDetail;
    $("inscrireOuvrir").textContent = T.inscrireBouton;
    $("inscrireMasquer").textContent = "✕";
    $("inscrireMasquer").setAttribute("aria-label", T.inscrireMasquer);

    $("formTitre").textContent = T.formTitre;
    $("formIntro").textContent = verrouActif() ? T.formIntroVerrou : T.formIntro;

    /* Sur iPhone, l'application posée sur l'écran d'accueil ne partage
       pas sa mémoire avec Safari : s'enregistrer d'abord puis installer
       oblige à recommencer. Dans l'autre sens, une seule fois suffit.
       On le dit AVANT le formulaire — après, il est trop tard. */
    var dejaPose = false;
    try {
      dejaPose = window.matchMedia("(display-mode: standalone)").matches
                 || window.navigator.standalone === true;
    } catch (e) { }
    $("astuceInstall").hidden = dejaPose;
    $("astuceTexte").textContent = estSafariIOS() ? T.astuceIOS : T.astuceInstall;
    $("astuceGo").textContent = T.astuceGo;
    majInstallPanneau();
    $("labNom").textContent = T.labNom;
    $("labQualite").textContent = T.labQualite;
    $("labAutre").textContent = T.labAutre;
    peindreQualites();
    $("labEmail").textContent = T.labEmail;
    $("labTel").textContent = T.labTel;
    $("labConsent").textContent = T.labConsent;
    $("formEnvoyer").textContent = T.formEnvoyer;
    $("formNote").textContent = T.formNote;
    $("formFermer").textContent = "✕";
    $("formFermer").setAttribute("aria-label", T.formFermer);
    $("merciTitre").textContent = T.merciTitre;
    $("merciTexte").textContent = T.merciTexte;
    $("merciFermer").textContent = T.merciFermer;

    /* L'avis de confidentialité est assemblé à partir des données,
       jamais écrit en dur : le responsable et le contact changent
       d'un événement à l'autre. */
    $("avisTitre").textContent = T.avisTitre;
    var resp = (conf.responsable && conf.responsable[LANGUE]) || "";
    var fin = (conf.finalite && conf.finalite[LANGUE]) || "";
    var duree = (conf.conservation && conf.conservation[LANGUE]) || "";
    var contact = conf.contact || "";

    /* L'avis doit dire la vérité sur le caractère facultatif : avec le
       verrou, le formulaire ne l'est plus. Une contradiction ici, et
       c'est tout l'avis qui perd sa valeur. */
    var verrou = verrouActif();

    if (LANGUE === "fr") {
      $("avisTexte").textContent =
        "Vos nom et prénoms et votre qualité — ainsi que votre adresse "
        + "e-mail et votre téléphone si vous choisissez de les donner — sont "
        + "collectés par " + resp + ", dans le seul but de " + fin + ". "
        + "Ils ne sont ni vendus, ni cédés à des tiers, ni utilisés à d'autres fins. "
        + "Ils sont conservés " + duree + ", puis supprimés. "
        + (PROGRAMME.inscription.hebergement
            ? PROGRAMME.inscription.hebergement.fr : "");
      $("avisDroits").textContent =
        (verrou
          ? "L'accès au programme suppose cet enregistrement. "
          : "Ce formulaire est facultatif. ")
        + "Vous pouvez demander à consulter, corriger ou supprimer vos informations "
        + "à tout moment en écrivant à " + contact + ".";
    } else {
      $("avisTexte").textContent =
        "Your full name and your role — and your email address and phone "
        + "number if you choose to provide them — are collected by "
        + resp + ", for the sole purpose of " + fin + ". "
        + "They are never sold, passed to third parties, or used for anything else. "
        + "They are kept " + duree + ", then deleted. "
        + (PROGRAMME.inscription.hebergement
            ? PROGRAMME.inscription.hebergement.en : "");
      $("avisDroits").textContent =
        (verrou
          ? "Access to the programme requires this registration. "
          : "This form is optional. ")
        + "You may ask to see, correct or delete your information at any time "
        + "by writing to " + contact + ".";
    }

    // Même exigence pour la note sous le bouton d'envoi.
    $("formNote").textContent = verrou ? "" : T.formNote;
    $("formNote").hidden = verrou;

    /* Le cadre Microsoft reprend la même introduction et le même avis :
       le visiteur lit TES mots avant de voir les champs de Microsoft. */
    if (modeFormulaire()) {
      $("cadreIntro").textContent = $("formIntro").textContent;
      $("cadreAvisTitre").textContent = T.avisTitre;
      $("cadreAvisTexte").textContent = $("avisTexte").textContent + " " + $("avisDroits").textContent;
      $("cadreTermine").textContent = T.cadreTermine;
      $("cadreNote").textContent = T.cadreNote;
      $("cadreForm").setAttribute("title", T.formTitre);
      $("dejaTitre").textContent = T.dejaTitre;
      $("cadreDeja").textContent = T.dejaGo;
      $("cadreOu").textContent = T.cadreOu;
    }
  }

  function montrerBandeauInscrire() {
    var conf = PROGRAMME.inscription;
    // Pas d'adresse de script : le formulaire n'a nulle part où envoyer.
    if (!conf || conf.active !== true || !conf.url) return;
    if (estInscrit() || inscrireMasque()) return;
    $("inscrireBandeau").hidden = false;
  }

  function ouvrirPanneau() {
    $("inscrirePanneau").hidden = false;
    document.body.style.overflow = "hidden";
    window.setTimeout(function () { $("fNom").focus(); }, 80);
  }
  function fermerPanneau() {
    // Tant que le verrou est actif et l'inscription non faite, on ne sort pas.
    if (verrouActif() && !estInscrit()) return;
    $("inscrirePanneau").hidden = true;
    document.body.style.overflow = "";
  }

  function preparerInscription() {
    if (!destinationPrete()) return;

    var conf = PROGRAMME.inscription;
    var verrou = verrouActif();

    peindreFormulaire();

    if (modeBase()) {
      /* Notre propre formulaire, qui parle directement à la base.
         Le cadre Microsoft disparaît : il ne savait pas nous dire si
         l'envoi avait eu lieu, et c'était tout le problème. */
      $("cadreZone").hidden = true;
      $("formInscription").hidden = false;

    } else if (modeFormulaire()) {
      /* On ne charge le formulaire Microsoft QUE si on va l'afficher :
         inutile de solliciter le réseau d'un visiteur déjà enregistré. */
      $("formInscription").hidden = true;
      $("cadreZone").hidden = false;
      if (!estInscrit()) $("cadreForm").setAttribute("src", conf.formulaireUrl);

      /* Le code d'accès remplace la déclaration sur l'honneur.

         Impossible de savoir depuis l'extérieur si le formulaire a été
         envoyé : il appartient à un autre domaine, et le navigateur
         interdit de regarder dedans. Un simple bouton « j'ai terminé »
         échouait donc DANS LES DEUX SENS — on entrait sans rien remplir,
         et celui qui remplissait vraiment sans toucher le bouton n'était
         pas retenu, donc on lui redemandait tout.

         Le code affiché par Microsoft à la fin du formulaire est la seule
         preuve que le visiteur peut nous rapporter lui-même. Ce n'est pas
         une serrure — un code se répète de bouche à oreille — mais il
         faut avoir envoyé le formulaire pour le connaître. */
      $("cadreTermine").addEventListener("click", ouvrirLAgenda);
      $("cadreDeja").addEventListener("click", ouvrirLAgenda);
    } else {
      viderLaFileDAttente();
    }

    if (verrou && !estInscrit()) {
      // Verrou actif ET visiteur inconnu : pas de bandeau, pas de croix,
      // le panneau s'ouvre seul et la page ne défile pas derrière.
      $("inscrireBandeau").hidden = true;
      $("formFermer").hidden = true;
      document.body.classList.add("verrouille");
      ouvrirPanneau();

    } else if (verrou) {
      /* Verrou actif, mais le visiteur s'est DÉJÀ enregistré.
         Il ne doit plus rien voir du dispositif : ni bandeau, ni panneau,
         ni blocage du défilement.

         C'est le cas qui manquait. Le verrou était posé sur le corps de
         la page sans que le panneau ne s'ouvre : le visiteur retrouvait
         son agenda figé sur le premier écran, impossible à faire défiler,
         et sans rien à quoi répondre pour s'en sortir. Le défaut est
         resté invisible tant que l'adresse du formulaire était vide,
         parce que le verrou ne s'activait pas du tout. */
      $("inscrireBandeau").hidden = true;
      $("formFermer").hidden = false;
      document.body.classList.remove("verrouille");

    } else {
      montrerBandeauInscrire();
      $("inscrireOuvrir").addEventListener("click", ouvrirPanneau);
    }

    $("formFermer").addEventListener("click", fermerPanneau);
    $("merciFermer").addEventListener("click", fermerPanneau);

    $("inscrireMasquer").addEventListener("click", function () {
      try { localStorage.setItem(CLE_INSCRIRE_MASQUE, "1"); } catch (e) { }
      $("inscrireBandeau").hidden = true;
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !$("inscrirePanneau").hidden) fermerPanneau();
    });

    // Le champ « Précisez » n'apparaît que si la qualité choisie le demande.
    $("fQualite").addEventListener("change", function () {
      $("champAutre").hidden = !qualiteDemandePrecision(this.value);
    });

    $("formInscription").addEventListener("submit", function (e) {
      e.preventDefault();
      var T = UI[LANGUE];
      var err = $("formErreur");

      var cleQualite = $("fQualite").value;
      var precision = $("fAutre").value.trim();
      var libelle = "";
      ((PROGRAMME.inscription || {}).qualites || []).forEach(function (q) {
        if (q.cle === cleQualite) libelle = q.fr;   // toujours en français dans la feuille
      });

      var d = {
        id: identifiant(),
        nom: $("fNom").value.trim(),
        qualite: libelle,
        qualiteCle: cleQualite,
        precision: precision,
        email: $("fEmail").value.trim(),
        telephone: $("fTel").value.trim(),
        langue: LANGUE,
        consentement: $("fConsent").checked,
        envoyeLe: new Date().toISOString()
      };

      /* « Nom & Prénoms » en un seul champ : on exige au moins deux mots,
         sinon la moitié des lignes n'aurait qu'un prénom. La base refait
         le même contrôle de son côté. */
      var deuxMots = d.nom.split(/\s+/).filter(function (x) { return x.length > 1; }).length >= 2;

      var probleme = !deuxMots ? T.errNom
                   : !cleQualite ? T.errQualite
                   : (qualiteDemandePrecision(cleQualite) && !precision) ? T.errAutre
                   : (d.email && !emailPlausible(d.email)) ? T.errEmail
                   : !d.consentement ? T.errConsent
                   : null;

      if (probleme) {
        err.textContent = probleme;
        err.hidden = false;
        return;
      }
      err.hidden = true;

      var bouton = $("formEnvoyer");
      bouton.disabled = true;
      bouton.textContent = T.formEnvoi;

      envoyerInscription(d).then(function (prog) {
        bouton.disabled = false;
        bouton.textContent = T.formEnvoyer;

        if (prog) {
          /* La base a écrit la ligne ET renvoyé le programme.
             On le garde sur l'appareil, puis on affiche l'agenda. */
          garderProgramme(prog);
          poserJetonDansAdresse(prog.jeton);
          installerProgramme(prog);
          noterInscrit();
          $("inscrireBandeau").hidden = true;
          $("formInscription").hidden = true;
          $("formMerci").hidden = false;
          $("formFermer").hidden = false;
          document.body.classList.remove("verrouille");
          return;
        }

        /* Sans réponse de la base, il n'y a tout simplement PAS de
           programme à montrer : il n'existe plus nulle part ailleurs.
           On ne peut donc pas « laisser entrer » comme avant — on
           explique, et on invite à réessayer. */
        err.textContent = T.errReseau;
        err.hidden = false;
      });
    });
  }

  /* ============================================================
     LE BOUTON « ALLER À MAINTENANT »
     ============================================================ */
  function noeudCible() {
    var vise = noeuds.filter(function (n) { return n.li.classList.contains("en-cours"); })[0];
    if (vise) return vise;
    var t = maintenant();
    return noeuds.filter(function (n) { return n.s.t0 > t; })
                 .sort(function (a, b) { return a.s.t0 - b.s.t0; })[0] || null;
  }

  function majBoutonJump() {
    var btn = $("btnJump");
    var t = maintenant();
    if (t < PROGRAMME.ouverture || t >= PROGRAMME.fermeture || jourActif !== jourParDefaut()) {
      btn.hidden = true;
      return;
    }
    var n = noeudCible();
    if (!n) { btn.hidden = true; return; }
    var r = n.li.getBoundingClientRect();
    btn.hidden = r.top > 120 && r.bottom < window.innerHeight - 40;
  }

  /* ============================================================
     LE THÈME — clair ou sombre
     ============================================================
     Trois états, pas deux :

       "auto"  -> aucun attribut sur <html>. La feuille de style suit
                  le réglage du téléphone, via prefers-color-scheme.
       "light" -> data-theme="light" : le visiteur impose le clair.
       "dark"  -> data-theme="dark"  : le visiteur impose le sombre.

     Tant qu'il n'a rien touché, on ne décide pas à sa place : un
     téléphone en mode nuit ouvre l'agenda en sombre, tout seul.
     Dès qu'il appuie, son choix l'emporte et il est conservé.
     ============================================================ */

  /* Ce que le visiteur VOIT réellement, les trois états ramenés à deux.
     C'est cette valeur qui allume le bon bouton — jamais THEME, sinon
     en mode "auto" les deux boutons resteraient éteints et la barre
     aurait l'air cassée. */
  function themeEffectif() {
    if (THEME === "dark" || THEME === "light") return THEME;
    try {
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    } catch (e) {
      return "light";
    }
  }

  function appliquerTheme() {
    var racine = document.documentElement;

    if (THEME === "auto") racine.removeAttribute("data-theme");
    else racine.setAttribute("data-theme", THEME);

    var vu = themeEffectif();
    $("btnClair").setAttribute("aria-pressed", vu === "light" ? "true" : "false");
    $("btnSombre").setAttribute("aria-pressed", vu === "dark" ? "true" : "false");

    /* La barre système du téléphone doit suivre le bandeau, sinon on
       voit une couture de couleur en haut de l'écran.

       On ne réécrit PAS la couleur en dur ici : on va la lire dans le
       token --bandeau-fond que le CSS vient de recalculer. Le jour où
       tu changes la charte, tu ne modifies que style.css — ce code
       continue de dire vrai sans qu'on y touche. */
    var fond = getComputedStyle(racine).getPropertyValue("--bandeau-fond").trim();
    if (fond) $("metaTheme").setAttribute("content", fond);
  }

  function changerTheme(choix) {
    if (choix === THEME) return;
    THEME = choix;
    try { localStorage.setItem(CLE_THEME, THEME); } catch (e) { }
    appliquerTheme();
  }

  /* ============================================================
     LA MÉMOIRE DU VISITEUR
     Tout est enveloppé : en navigation privée, localStorage peut
     refuser de répondre. La page doit continuer sans lui.
     ============================================================ */
  function lireMemoire() {
    try {
      var l = localStorage.getItem(CLE_LANGUE);
      if (l === "fr" || l === "en") LANGUE = l;
      else if (!/^fr/i.test(navigator.language || "fr")) LANGUE = "en";
    } catch (e) {
      try { if (!/^fr/i.test(navigator.language || "fr")) LANGUE = "en"; } catch (e2) { }
    }
    try {
      var brut = localStorage.getItem(CLE_ETOILES);
      if (brut) etoiles = JSON.parse(brut) || {};
    } catch (e) { etoiles = {}; }
    try {
      var th = localStorage.getItem(CLE_THEME);
      if (th === "dark" || th === "light") THEME = th;
    } catch (e) { }
  }
  function sauverEtoiles() {
    try { localStorage.setItem(CLE_ETOILES, JSON.stringify(etoiles)); } catch (e) { }
  }
  function sauverLangue() {
    try { localStorage.setItem(CLE_LANGUE, LANGUE); } catch (e) { }
  }

  /* ============================================================
     LE DÉMARRAGE
     ============================================================ */
  function afficherErreur() {
    var T = UI[LANGUE];
    $("rail").innerHTML = '<li class="erreur"><h3>' + echapper(T.erreurTitre)
      + "</h3><p>" + echapper(T.erreurTexte) + "</p></li>";
    $("statusKicker").className = "status-kicker repos";
    $("statusKicker").textContent = "—";
    $("statusTitre").textContent = T.erreurTitre;
  }

  function demarrer() {
    lireMemoire();

    /* Avant même de charger le programme : l'attribut a déjà été posé
       par le script de l'en-tête, mais c'est ici qu'on allume le bon
       bouton et qu'on accorde la barre système. */
    appliquerTheme();

    $("statusTitre").textContent = UI[LANGUE].chargement;

    charger("programme.json").then(function (conf) {
      if (!conf || !conf.meta) {
        afficherErreur();
        return;
      }

      /* programme.json ne contient PLUS les sessions : il ne garde que
         l'habillage (titre, lieu, catégories) et les réglages. Les
         sessions vivent dans la base, et n'en sortent qu'après un
         enregistrement. C'est précisément ce qui rend le verrou réel :
         il n'y a plus de fichier public à contourner. */
      /* On interroge les deux réserves. Celle de Safari d'abord, puis
         celle que l'écran d'accueil peut voir. */
      return lireProgrammePartage().then(function (partage) {
        var local = lireProgrammeGarde();
        var garde = local || partage;

        /* LES DEUX RÉSERVES SE RÉPARENT L'UNE L'AUTRE.
           Il y a deux endroits où le programme du visiteur est posé, et
           ils ne se vident pas pour les mêmes raisons. Plutôt que de
           parier sur celui qui survivra, on recopie systématiquement
           dans celui qui manque. Il faut alors DEUX enregistrements
           perdus le même jour pour qu'un visiteur soit renvoyé au
           formulaire — au lieu d'un seul. */
        if (!local && partage) {
          try { localStorage.setItem(CLE_PROG, JSON.stringify(partage)); } catch (e) { }
        }
        if (local && !partage) {
          partagerProgramme(local);
        }
        if (garde) return suiteDuDemarrage(conf, garde);

        /* Aucun programme sur cet appareil — mais peut-être un jeton
           dans l'adresse, hérité de l'installation depuis Safari. On
           le présente à la base : si l'inscription existe, elle rend
           le programme SANS en créer une seconde. */
        var j = jetonConnu();
        if (!j) return suiteDuDemarrage(conf, null);

        return reprendreAvecJeton(conf.inscription, j).then(function (repris) {
          if (repris) {
            try { localStorage.setItem(CLE_PROG, JSON.stringify(repris)); } catch (e) { }
            try { localStorage.setItem(CLE_JETON, j); } catch (e) { }
            partagerProgramme(repris);
          }
          return suiteDuDemarrage(conf, repris || null);
        });
      });
    }).catch(function (e) {
      /* Le filet. Sans lui, la moindre erreur laissait l'écran figé sur
         « Chargement du programme » — le pire des comportements, parce
         qu'il ne dit rien et laisse croire à un réseau lent. */
      console.error("Démarrage interrompu :", e && e.message, e);
      afficherErreur();
    });
  }

  function suiteDuDemarrage(conf, garde) {
    {
      conf.jours = (garde && garde.jours) ? garde.jours : [];
      if (garde && garde.meta && garde.meta.categories) {
        conf.meta.categories = garde.meta.categories;
      }

      PROGRAMME = preparerOuVide(conf);
      jourActif = PROGRAMME.jours.length ? jourParDefaut() : 0;

      peindreCadre();
      dessinerListe();

      majAnnonce();
      preparerInstall();
      preparerInscription();
      setInterval(majAnnonce, 3 * 60 * 1000);   // l'annonce, toutes les 3 minutes
      setInterval(rafraichir, 1000);            // l'horloge, chaque seconde

      // Les boutons
      $("btnFr").addEventListener("click", function () { changerLangue("fr"); });
      $("btnEn").addEventListener("click", function () { changerLangue("en"); });

      $("btnClair").addEventListener("click", function () { changerTheme("light"); });
      $("btnSombre").addEventListener("click", function () { changerTheme("dark"); });

      /* Si le visiteur n'a rien imposé et que son téléphone bascule en
         mode nuit pendant qu'il lit — beaucoup le font au coucher du
         soleil — l'agenda suit sans qu'il ait à recharger. */
      try {
        var veille = window.matchMedia("(prefers-color-scheme: dark)");
        var suivre = function () { if (THEME === "auto") appliquerTheme(); };
        if (veille.addEventListener) veille.addEventListener("change", suivre);
        else if (veille.addListener) veille.addListener(suivre);   // vieux Safari
      } catch (e) { }

      $("btnFiltre").addEventListener("click", function () {
        filtreEtoiles = !filtreEtoiles;
        this.setAttribute("aria-pressed", filtreEtoiles ? "true" : "false");
        $("filtreLabel").textContent = filtreEtoiles ? UI[LANGUE].toutAgenda : UI[LANGUE].mesSessions;
        dessinerListe();
      });

      $("btnJump").addEventListener("click", function () {
        if (jourActif !== jourParDefaut()) {
          jourActif = jourParDefaut();
          peindreCadre();
          dessinerListe();
        }
        var n = noeudCible();
        if (n) n.li.scrollIntoView({ behavior: "smooth", block: "center" });
      });

      /* Un seul écouteur posé sur la liste entière, plutôt qu'un par
         session : la liste est reconstruite à chaque changement de
         langue ou de filtre, et des écouteurs individuels seraient
         reposés — puis oubliés — à chaque fois. */
      $("rail").addEventListener("click", function (e) {
        var b = e.target.closest ? e.target.closest("button.ics") : null;
        if (!b) return;
        e.preventDefault();
        var cle = b.getAttribute("data-ics");
        var trouvee = toutesLesSessions().filter(function (x) { return x.cle === cle; })[0];
        if (trouvee) telechargerIcs(trouvee);
      });

      window.addEventListener("scroll", majBoutonJump, { passive: true });
      window.addEventListener("resize", majBoutonJump);

      // À l'ouverture, amener le visiteur sur ce qui se passe maintenant
      setTimeout(function () {
        var t = maintenant();
        if (t < PROGRAMME.ouverture || t >= PROGRAMME.fermeture) return;
        var n = noeudCible();
        if (n) n.li.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 450);
    }
  }

  function changerLangue(nouvelle) {
    if (nouvelle === LANGUE) return;
    LANGUE = nouvelle;
    sauverLangue();
    peindreCadre();
    dessinerListe();
    majAnnonce();
    // Le bandeau d'installation contient du texte : il suit la langue.
    if (!$("install").hidden) {
      montrerBandeauInstall($("installGo").hidden ? "ios" : "android");
    }
    // Le formulaire aussi, y compris son avis de confidentialité.
    if (PROGRAMME.inscription && PROGRAMME.inscription.url) peindreFormulaire();
  }

  demarrer();

  /* Le service worker : il rend la page installable et utilisable
     hors connexion. Il échoue silencieusement en local sans HTTPS,
     ce qui est normal et sans conséquence pendant le développement. */
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", function () {
      navigator.serviceWorker.register("sw.js").catch(function (e) {
        console.warn("Service worker non enregistré :", e.message);
      });
    });
  }

})();
