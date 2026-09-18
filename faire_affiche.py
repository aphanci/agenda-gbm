#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
============================================================
 AFFICHE DE SCAN — Journées Portes Ouvertes GBM
============================================================
Fabrique, à partir d'UNE seule adresse :
  · affiche-A4.png / .pdf   -> à imprimer et poser sur site
  · carre-reseaux.png       -> WhatsApp, écrans, invitations
  · qr-seul.png             -> le QR nu, à insérer ailleurs

Si l'adresse change, il n'y a que la ligne URL à modifier,
puis :  python3 faire_affiche.py
============================================================
"""
import os
import qrcode
from qrcode.constants import ERROR_CORRECT_H
from PIL import Image, ImageDraw, ImageFont

# ---------------- CE QUI PEUT CHANGER ----------------
URL    = "https://aphanci.github.io/agenda-gbm/"
VISUEL = "/root/.claude/uploads/352570ce-0e76-54e1-ba80-d0a674349966/358a0a48-image.png"
SORTIE = "/home/claude/affiche/"

SURTITRE = "JOURNÉES PORTES OUVERTES  ·  OPEN DAYS"
TITRE_FR = ["Le Groupe de la Banque mondiale", "en action en Côte d'Ivoire"]
TITRE_EN = "The World Bank Group in action in Côte d'Ivoire"
DATES    = "21 – 22 SEPTEMBRE 2026"
LIEU     = "Patinoire · Sofitel Abidjan Hôtel Ivoire"
APPEL_FR = "Scannez pour suivre le programme en direct"
APPEL_EN = "Scan to follow the live programme"
PIED     = "Horaires, salles et changements de dernière minute — sans installer d'application."

# ---------------- LA CHARTE ----------------
NAVY      = (12, 35, 64)     # #0C2340
ORANGE    = (232, 144, 31)   # #E8901F — l'orange de la charte éclairci pour tenir sur fond sombre
BLANC     = (255, 255, 255)
BLEU_PALE = (170, 192, 212)  # #AAC0D4
GRIS      = (100, 125, 155)

P = "/home/claude/polices/"
def fonte(nom, taille):
    return ImageFont.truetype(P + nom, taille)

# ============================================================
#  OUTILS DE MISE EN PAGE
# ============================================================

def largeur(d, texte, f, tracking=0):
    return d.textlength(texte, font=f) + tracking * max(0, len(texte) - 1)

def ajuster(d, texte, police, taille, dispo, tracking=0):
    """Rend la plus grande taille de police qui tient dans la largeur.

       Sans ce garde-fou, un titre plus long que prévu déborderait en
       silence : le fichier serait produit, l'affiche serait fausse, et
       on ne s'en apercevrait qu'à l'impression. Il rend aussi le script
       réutilisable pour un autre événement, dont on ignore les textes."""
    while taille > 14:
        f = fonte(police, taille)
        if largeur(d, texte, f, tracking) <= dispo:
            return f
        taille -= 2
    return fonte(police, 14)

def centrer(d, y, texte, f, couleur, tracking=0, cx=None, L=None):
    """Écrit un texte centré. Avec tracking, les lettres sont posées une
       à une : PIL ne sait pas espacer les caractères tout seul."""
    cx = cx if cx is not None else L / 2
    x = cx - largeur(d, texte, f, tracking) / 2
    if tracking == 0:
        d.text((x, y), texte, font=f, fill=couleur)
    else:
        for c in texte:
            d.text((x, y), c, font=f, fill=couleur)
            x += d.textlength(c, font=f) + tracking
    haut = f.getbbox("Hg")
    return y + (haut[3] - haut[1])

def fleur_sur(fond, taille):
    """Détoure la fleur de son bleu d'origine et la repose sur le navy
       institutionnel, sans laisser de cadre visible.

       DEUX PIÈGES, tous deux rencontrés :

       1. Le remplissage part des QUATRE COINS, donc il ne touche que le
          fond relié au bord. Un pixel bleu foncé enfermé dans la photo
          d'un pétale n'est pas connecté aux coins : il survit. Un simple
          « remplace toute couleur proche » aurait percé des trous.

       2. Le seuil doit rester SOUS l'écart entre les deux bleus (37).
          Pillow commence par comparer la couleur de remplissage au fond :
          si l'écart tient sous le seuil, il conclut « c'est déjà rempli »
          et ressort sans rien faire. Avec un seuil de 42, la fonction
          s'exécutait, ne renvoyait aucune erreur, et l'affiche gardait
          son cadre. 24 couvre le bruit de compression (~15) et reste
          bien en dessous de 37."""
    im = Image.open(VISUEL).convert("RGB")
    w, h = im.size
    for coin in [(0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1)]:
        ImageDraw.floodfill(im, coin, fond, thresh=24)
    return im.resize((taille, taille), Image.LANCZOS)

def qr_medaille(module_px=30, part=0.21):
    """Le QR, avec la fleur en médaillon au centre.

       Correction d'erreur H : le code embarque de quoi se reconstituer
       même si 30 % de sa surface est illisible. Le médaillon en couvre
       environ 4 %. En correction basse, le même médaillon rendrait le
       code indéchiffrable — c'est la contrepartie d'un logo au centre,
       et la raison pour laquelle on ne le pose jamais sans monter la
       correction d'abord."""
    qr = qrcode.QRCode(error_correction=ERROR_CORRECT_H, box_size=module_px, border=3)
    qr.add_data(URL)
    qr.make(fit=True)
    img = qr.make_image(fill_color=NAVY, back_color=BLANC).convert("RGB")

    c = int(img.size[0] * part); c -= c % 2
    socle = Image.new("RGB", (c, c), BLANC)          # respiration blanche
    d = int(c * 0.84)
    socle.paste(fleur_sur(NAVY, d), ((c - d) // 2, (c - d) // 2))

    m = Image.new("L", (c * 4, c * 4), 0)
    ImageDraw.Draw(m).rounded_rectangle((0, 0, c * 4 - 1, c * 4 - 1),
                                        radius=c * 4 // 7, fill=255)
    img.paste(socle, ((img.size[0] - c) // 2, (img.size[1] - c) // 2),
              m.resize((c, c), Image.LANCZOS))
    return img, qr.version

# ============================================================
#  L'AFFICHE A4
# ============================================================

def affiche_a4():
    L, H = 2480, 3508                      # A4 à 300 points par pouce
    MARGE = 190
    dispo = L - MARGE * 2
    page = Image.new("RGB", (L, H), NAVY)
    d = ImageDraw.Draw(page)

    d.rectangle((0, 0, L, 26), fill=ORANGE)          # la signature du bandeau de l'app

    y = 196
    y = centrer(d, y, SURTITRE, ajuster(d, SURTITRE, "PlexSans-700.ttf", 48, dispo, 9),
                ORANGE, tracking=9, L=L)

    y += 74
    for ligne in TITRE_FR:
        y = centrer(d, y, ligne, ajuster(d, ligne, "SourceSerif-700.ttf", 124, dispo),
                    BLANC, L=L) + 24
    y += 14
    y = centrer(d, y, TITRE_EN, ajuster(d, TITRE_EN, "PlexSans-400.ttf", 54, dispo),
                BLEU_PALE, L=L)

    tf = 960
    page.paste(fleur_sur(NAVY, tf), ((L - tf) // 2, y + 66))
    y = y + 66 + tf + 70

    y = centrer(d, y, DATES, ajuster(d, DATES, "PlexSans-700.ttf", 68, dispo, 5),
                ORANGE, tracking=5, L=L)
    y += 28
    y = centrer(d, y, LIEU, ajuster(d, LIEU, "PlexSans-400.ttf", 50, dispo),
                BLEU_PALE, L=L)

    # ---- La carte blanche. Elle est plus large que le QR : c'est la
    #      place dont l'appel à l'action a besoin pour ne pas déborder.
    qr, version = qr_medaille()
    cote = 900                                   # ≈ 76 mm : lisible à 2-3 m
    qr = qr.resize((cote, cote), Image.LANCZOS)

    carte_l, haut_marge = 1300, 66
    carte_h = haut_marge * 2 + cote + 186
    cx0, cy0 = (L - carte_l) // 2, y + 92

    d.rounded_rectangle((cx0, cy0, cx0 + carte_l, cy0 + carte_h), radius=44, fill=BLANC)
    page.paste(qr, (cx0 + (carte_l - cote) // 2, cy0 + haut_marge))

    interieur = carte_l - 80
    ty = cy0 + haut_marge + cote + 26
    ty = centrer(d, ty, APPEL_FR, ajuster(d, APPEL_FR, "PlexSans-700.ttf", 54, interieur),
                 NAVY, cx=L / 2, L=L) + 12
    centrer(d, ty, APPEL_EN, ajuster(d, APPEL_EN, "PlexSans-400.ttf", 44, interieur),
            GRIS, cx=L / 2, L=L)

    py = cy0 + carte_h + 70
    py = centrer(d, py, PIED, ajuster(d, PIED, "PlexSans-400.ttf", 40, dispo),
                 BLEU_PALE, L=L) + 20
    bas = centrer(d, py, URL.replace("https://", ""),
                  fonte("PlexSans-600.ttf", 42), ORANGE, L=L)

    d.rectangle((0, H - 26, L, H), fill=ORANGE)

    if bas > H - 60:
        raise SystemExit("Le contenu déborde de la page : %d px de trop." % (bas - H + 60))
    print("  A4  : dernière ligne à %d px, marge basse restante %d px" % (bas, H - bas))
    return page, version

# ============================================================
#  LA VERSION CARRÉE (écrans, WhatsApp, invitations)
# ============================================================

def carre():
    C, M = 1600, 108
    page = Image.new("RGB", (C, C), NAVY)
    d = ImageDraw.Draw(page)
    d.rectangle((0, 0, C, 14), fill=ORANGE)
    dispo = C - M * 2

    y = 130
    s = "JOURNÉES PORTES OUVERTES"
    y = centrer(d, y, s, ajuster(d, s, "PlexSans-700.ttf", 34, dispo, 7), ORANGE,
                tracking=7, L=C)
    y += 44
    for ligne in TITRE_FR:
        y = centrer(d, y, ligne, ajuster(d, ligne, "SourceSerif-700.ttf", 74, dispo),
                    BLANC, L=C) + 10

    y += 60
    tf, cq, pad = 540, 620, 40
    page.paste(fleur_sur(NAVY, tf), (M, y + 30))

    qr, _ = qr_medaille()
    qr = qr.resize((cq, cq), Image.LANCZOS)
    cl = cq + pad * 2
    cx0 = C - M - cl
    d.rounded_rectangle((cx0, y, cx0 + cl, y + cl), radius=30, fill=BLANC)
    page.paste(qr, (cx0 + pad, y + pad))

    y += max(tf + 30, cl) + 76
    y = centrer(d, y, DATES, ajuster(d, DATES, "PlexSans-700.ttf", 50, dispo, 4),
                ORANGE, tracking=4, L=C) + 24
    y = centrer(d, y, LIEU, ajuster(d, LIEU, "PlexSans-400.ttf", 38, dispo),
                BLEU_PALE, L=C) + 36
    bas = centrer(d, y, APPEL_FR, ajuster(d, APPEL_FR, "PlexSans-600.ttf", 42, dispo),
                  BLANC, L=C)

    d.rectangle((0, C - 14, C, C), fill=ORANGE)
    print("  carré : dernière ligne à %d px, marge basse restante %d px" % (bas, C - bas))
    return page

# ============================================================
if __name__ == "__main__":
    os.makedirs(SORTIE, exist_ok=True)

    a4, version = affiche_a4()
    a4.save(SORTIE + "affiche-A4.png", dpi=(300, 300))
    a4.save(SORTIE + "affiche-A4.pdf", "PDF", resolution=300.0)

    carre().save(SORTIE + "carre-reseaux.png")

    q, _ = qr_medaille()
    q.resize((1400, 1400), Image.LANCZOS).save(SORTIE + "qr-seul.png", dpi=(300, 300))

    print("QR version %d, correction H — fichiers écrits dans %s" % (version, SORTIE))
