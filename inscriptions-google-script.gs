/* ============================================================
   SCRIPT DE RÉCEPTION DES INSCRIPTIONS
   ============================================================
   Ce fichier ne va PAS sur GitHub. Il se colle dans Google Apps
   Script, qui l'exécute chez Google. Son rôle : recevoir les
   envois du widget et les écrire dans ta feuille de calcul.

   ⚠ À créer depuis ton compte PROFESSIONNEL, pas ton compte
   personnel : les données collectées appartiennent au bureau.

   ------------------------------------------------------------
   INSTALLATION — 10 minutes, dans l'ordre
   ------------------------------------------------------------
   1. Va sur sheets.google.com, crée une feuille de calcul et
      nomme-la « Inscriptions Portes Ouvertes 2026 ».

   2. En bas, renomme l'onglet « Feuille 1 » en « Inscriptions ».
      Le nom doit être exact : le script le cherche.

   3. Dans cette feuille : menu Extensions → Apps Script.
      Un éditeur de code s'ouvre dans un nouvel onglet.

   4. Efface tout ce qu'il contient, et colle ce fichier entier.

   5. Clique l'icône de disquette pour enregistrer.

   6. Bouton bleu « Déployer » (en haut à droite)
      → Nouveau déploiement
      → l'engrenage à gauche → Application Web
      → Description : « Réception des inscriptions »
      → Exécuter en tant que : Moi
      → Qui a accès : TOUT LE MONDE        ← indispensable
      → Déployer

   7. Google demande une autorisation. Accepte : le script a
      besoin d'écrire dans TA feuille, rien d'autre. Si un écran
      « Google n'a pas validé cette application » apparaît, clique
      « Paramètres avancés » puis « Accéder à … ». C'est normal
      pour un script que tu viens d'écrire toi-même.

   8. Copie l'adresse affichée à la fin. Elle ressemble à :
      https://script.google.com/macros/s/AKfy...../exec

      Elle doit finir par /exec, jamais par /dev.

   9. Ouvre programme.json, et colle-la dans le bloc inscription :
         "url": "https://script.google.com/macros/s/..../exec"
      Complète aussi "contact" avec l'adresse e-mail à laquelle
      un participant pourra demander la suppression de ses données.

   ------------------------------------------------------------
   POUR VÉRIFIER QUE ÇA MARCHE
   ------------------------------------------------------------
   Colle l'adresse /exec dans ton navigateur. Tu dois voir :
      {"ok":true,"message":"Le service repond."}
   Si tu vois une erreur, reprends l'étape 6.

   ------------------------------------------------------------
   ⚠ LE PIÈGE À CONNAÎTRE
   ------------------------------------------------------------
   Chaque fois que tu MODIFIES ce script, enregistrer ne suffit
   pas. Il faut refaire : Déployer → Gérer les déploiements →
   l'icône crayon → Version : Nouvelle version → Déployer.
   Sans cela, Google continue d'exécuter l'ancien code, en
   silence. C'est le même piège que le numéro de version du
   service worker.
   ============================================================ */

/* Le nom de l'onglet dans la feuille de calcul. */
var NOM_ONGLET = 'Inscriptions';

/* Les colonnes, dans l'ordre. Changer cette liste change l'en-tête
   ET l'ordre d'écriture : les deux restent cohérents tout seuls. */
var COLONNES = [
  'Reçu le',
  'Nom et prénom',
  'Qualité / fonction',
  'Organisation',
  'Adresse e-mail',
  'Langue',
  'Consentement',
  'Saisi le (appareil)'
];


/* ------------------------------------------------------------
   Réception d'une inscription.
   Le widget envoie du JSON en "text/plain" : c'est volontaire.
   Ce type de contenu évite la requête de vérification préalable
   (OPTIONS) à laquelle les scripts Google ne savent pas répondre.
   ------------------------------------------------------------ */
function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return repondre({ ok: false, erreur: 'Aucune donnée reçue.' });
    }

    var d = JSON.parse(e.postData.contents);

    // Validation côté serveur. Celle du navigateur peut être contournée :
    // on ne fait jamais confiance à ce qui arrive de l'extérieur.
    var nom = nettoyer(d.nom);
    var qualite = nettoyer(d.qualite);
    var email = nettoyer(d.email);

    if (!nom || !qualite || !email) {
      return repondre({ ok: false, erreur: 'Champs obligatoires manquants.' });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      return repondre({ ok: false, erreur: 'Adresse e-mail invalide.' });
    }
    if (d.consentement !== true) {
      return repondre({ ok: false, erreur: 'Consentement non donné.' });
    }

    var feuille = feuillePrete();

    feuille.appendRow([
      new Date(),
      nom,
      qualite,
      nettoyer(d.organisation),
      email,
      nettoyer(d.langue) || 'fr',
      'Oui',
      nettoyer(d.envoyeLe)
    ]);

    return repondre({ ok: true });

  } catch (err) {
    // On répond toujours quelque chose : un script qui plante en
    // silence est impossible à déboguer depuis un téléphone.
    return repondre({ ok: false, erreur: String(err) });
  }
}


/* ------------------------------------------------------------
   Ouvrir l'adresse dans un navigateur tombe ici. Sert à vérifier
   que le déploiement fonctionne, sans rien écrire.
   ------------------------------------------------------------ */
function doGet() {
  return repondre({ ok: true, message: 'Le service repond.' });
}


/* ------------------------------------------------------------
   Outils
   ------------------------------------------------------------ */

/* Retourne l'onglet, en créant l'en-tête au premier passage. */
function feuillePrete() {
  var classeur = SpreadsheetApp.getActiveSpreadsheet();
  var feuille = classeur.getSheetByName(NOM_ONGLET);

  if (!feuille) feuille = classeur.insertSheet(NOM_ONGLET);

  if (feuille.getLastRow() === 0) {
    feuille.appendRow(COLONNES);
    feuille.getRange(1, 1, 1, COLONNES.length)
      .setFontWeight('bold')
      .setBackground('#0C2340')
      .setFontColor('#FFFFFF');
    feuille.setFrozenRows(1);
    feuille.setColumnWidth(1, 150);
    feuille.setColumnWidth(2, 200);
    feuille.setColumnWidth(3, 200);
    feuille.setColumnWidth(4, 200);
    feuille.setColumnWidth(5, 240);
  }
  return feuille;
}

/* Nettoie une valeur venue de l'extérieur : on force le texte,
   on retire les espaces inutiles, et on borne la longueur pour
   qu'un envoi malveillant ne remplisse pas la feuille. */
function nettoyer(v) {
  if (v === null || v === undefined) return '';
  return String(v).trim().slice(0, 300);
}

/* Toutes les réponses passent par ici, au même format. */
function repondre(objet) {
  return ContentService
    .createTextOutput(JSON.stringify(objet))
    .setMimeType(ContentService.MimeType.JSON);
}


/* ------------------------------------------------------------
   À exécuter une fois, depuis l'éditeur, pour tester sans
   passer par le widget : sélectionne « testerEcriture » dans la
   liste déroulante en haut, puis clique Exécuter.
   Une ligne d'essai apparaîtra dans ta feuille — pense à la
   supprimer ensuite.
   ------------------------------------------------------------ */
function testerEcriture() {
  var faux = {
    postData: {
      contents: JSON.stringify({
        nom: 'Essai — à supprimer',
        qualite: 'Test',
        organisation: 'Banque mondiale',
        email: 'essai@example.com',
        langue: 'fr',
        consentement: true,
        envoyeLe: new Date().toISOString()
      })
    }
  };
  Logger.log(doPost(faux).getContent());
}
