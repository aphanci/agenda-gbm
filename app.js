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
      intervenants: "Intervenants", ajouterAgenda: "Ajouter à mon agenda",
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
      erreurTexte: "Le programme n'a pas pu être chargé. Vérifiez votre connexion, puis rechargez la page.",
      chargement: "Chargement du programme…",
      jour: "jour", jours: "jours", min: "min"
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
      intervenants: "Speakers", ajouterAgenda: "Add to my calendar",
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
      jour: "day", jours: "days", min: "min"
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

  var CLE_LANGUE = "agenda-langue";
  var CLE_ETOILES = "agenda-etoiles";

  var $ = function (id) { return document.getElementById(id); };

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

  function lienAgenda(s) {
    var corps = [];
    if (s.resume) corps.push(s.resume[LANGUE]);
    if (s.details) corps.push(s.details[LANGUE].map(function (x) { return "• " + x; }).join("\n"));
    if (s.intervenants) {
      corps.push(UI[LANGUE].intervenants + " :\n" + s.intervenants.map(function (p) {
        return "• " + p.nom[LANGUE] + (p.role ? " — " + p.role[LANGUE] : "");
      }).join("\n"));
    }
    return "https://calendar.google.com/calendar/render?action=TEMPLATE"
      + "&text=" + encodeURIComponent(s.titre[LANGUE])
      + "&dates=" + horodatageGoogle(s.t0) + "/" + horodatageGoogle(s.t1)
      + "&location=" + encodeURIComponent(PROGRAMME.meta.lieuComplet)
      + "&details=" + encodeURIComponent(corps.join("\n\n"));
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

    $("filtreLabel").textContent = filtreEtoiles ? T.toutAgenda : T.mesSessions;
    $("jumpLabel").textContent = T.jumpLabel;

    $("infosTitre").textContent = T.infosTitre;

    var j0 = PROGRAMME.jours[0];
    var jN = PROGRAMME.jours[PROGRAMME.jours.length - 1];
    var infos = [
      [T.libLieu, M.lieuComplet],
      [T.libDates, j0.dateCourte[LANGUE] + " – " + jN.dateCourte[LANGUE]],
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
    var jour = PROGRAMME.jours[jourActif];
    var rail = $("rail");

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
        html += '<a class="agenda-lien" href="' + echapper(lienAgenda(s))
          + '" target="_blank" rel="noopener"><span aria-hidden="true">+</span> <span>'
          + echapper(T.ajouterAgenda) + "</span></a>";
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
      var memeJour = prochaine.jour === PROGRAMME.jours[jourParDefaut()];
      kicker.className = "status-kicker";
      kicker.innerHTML = badgeOuvert + '<span class="kicker-txt">'
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
    $("statusTitre").textContent = UI[LANGUE].chargement;

    charger("programme.json").then(function (prog) {
      if (!prog || !prog.jours || !prog.jours.length) {
        afficherErreur();
        return;
      }

      PROGRAMME = preparer(prog);
      jourActif = jourParDefaut();

      peindreCadre();
      dessinerListe();

      majAnnonce();
      setInterval(majAnnonce, 3 * 60 * 1000);   // l'annonce, toutes les 3 minutes
      setInterval(rafraichir, 1000);            // l'horloge, chaque seconde

      // Les boutons
      $("btnFr").addEventListener("click", function () { changerLangue("fr"); });
      $("btnEn").addEventListener("click", function () { changerLangue("en"); });

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

      window.addEventListener("scroll", majBoutonJump, { passive: true });
      window.addEventListener("resize", majBoutonJump);

      // À l'ouverture, amener le visiteur sur ce qui se passe maintenant
      setTimeout(function () {
        var t = maintenant();
        if (t < PROGRAMME.ouverture || t >= PROGRAMME.fermeture) return;
        var n = noeudCible();
        if (n) n.li.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 450);
    });
  }

  function changerLangue(nouvelle) {
    if (nouvelle === LANGUE) return;
    LANGUE = nouvelle;
    sauverLangue();
    peindreCadre();
    dessinerListe();
    majAnnonce();
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
