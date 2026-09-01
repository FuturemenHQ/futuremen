// futuremen-core.js
// Version fusionnée : lore + protocoles + progressLog + menu + Grok Imagine + agents complets
// + Pont Phonographe Urbain (phonographe-embedded.js — défaut, même dépôt)
// Exécute avec : node futuremen-core.js

const fs = require("fs");
const path = require("path");
const os = require("os");
const readline = require("readline");

const VENARDI_CALENDAR_FILE = path.join(__dirname, "..", "..", "venardi-calendar.json");

// ================================================
// PONT — Phonographe Urbain (équipe musicale 11 membres)
// Source unique : ./phonographe-embedded.js (aucun dossier « Journal musical » requis).
// ================================================
const PHONOGRAPHE_EMBEDDED_PATH = path.join(__dirname, "phonographe-embedded.js");
let phono = null;
try {
  if (fs.existsSync(PHONOGRAPHE_EMBEDDED_PATH)) {
    phono = require(PHONOGRAPHE_EMBEDDED_PATH);
  }
} catch (e) {
  console.warn("[Phonographe] phonographe-embedded.js non chargé —", e.message);
  phono = null;
}
const PHONOGRAPHE_TEAM = phono ? phono.PHONOGRAPHE_TEAM : null;
const PHONOGRAPHE_REGISTRE = phono ? phono.SIMULATION_REGISTRE : null;

function shellQuoteSingleForCron(value) {
  return `'${String(value).replace(/'/g, `'\\''`)}'`;
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// ================================================
// LES 11 AGENTS COMPLETS (avec visual pour prompts)
// ================================================
const FUTUREMEN = {
  michael: {
    id: "FM-001", name: "Michael Petric-Silva", unit: "Chef / Patron",
    role: "Leader visionnaire – Coordinateur global",
    attributes: { morale: 0.92, volonte: 0.95, empathie: 0.78, sociabilite: 0.65 },
    mission: "Réveiller l’Égrégore et activer Venardi",
    status: "Actif",
    visual: "Homme 35-40 ans, charisme intense, costume sombre élégant, regard perçant, cicatrice discrète au sourcil gauche"
  },
  nova: {
    id: "FM-002", name: "Nova", unit: "Exploratrice Spatiale",
    role: "Cartographie des timelines alternatives",
    status: "Active",
    visual: "Femme 28 ans, cheveux courts argentés, combinaison futuriste bleu nuit, tatouage constellation sur le cou"
  },
  circuit: {
    id: "FM-003", name: "Circuit", unit: "Hacker Quantique",
    role: "Infiltration et cybersécurité temporelle",
    status: "Actif",
    visual: "Homme 32 ans, hoodie noir avec circuits lumineux, lunettes AR réfléchissantes, dreads courtes tech"
  },
  echo: {
    id: "FM-004", name: "Echo", unit: "Visionnaire Créative",
    role: "Narration et stratégie créative",
    status: "Active",
    visual: "Femme blonde aux traits délicats, armure argentée futuriste avec lignes turquoise luminescentes, regard rêveur et inspirant, dans un décor de palais historique avec hologrammes artistiques"
  },
  vortex: {
    id: "FM-005", name: "Vortex", unit: "Maître des Données",
    role: "Analyse prédictive temporelle",
    status: "Actif",
    visual: "Homme 34 ans, silhouette élancée, cape noire holographique, yeux augmentés affichant des flux de données"
  },
  pulse: {
    id: "FM-006", name: "Pulse", unit: "Coordinateur Opérationnel",
    role: "Cohésion et logistique de l’équipe",
    status: "Actif",
    visual: "Femme 31 ans, tenue tactique grise avec accents orange, oreillette comms, posture assurée et coordonnée"
  },
  anna: {
    id: "FM-007", name: "Anna Petrescu", unit: "Spécialiste Géopolitique",
    role: "Analyse des dynamiques politiques",
    status: "Active",
    visual: "Femme brune aux pommettes hautes, regard perçant et calme, combinaison spatiale futuriste bleu nuit, hologrammes archéologiques roumains flottants autour d'elle"
  },
  olga: {
    id: "FM-008", name: "Olga Vinikova", unit: "Secrétaire Exécutive",
    role: "Rédaction et communication élégante",
    status: "Active",
    visual: "Femme 29 ans, tailleur noir chic, tablette holographique, cheveux relevés, sourire professionnel discret"
  },
  abel: {
    id: "FM-009", name: "Abel", unit: "Spécialiste Culture Musicale",
    role: "Diplomatie via la musique",
    status: "Actif",
    visual: "Homme 33 ans, dreadlocks longues ornées de perles tech, veste en cuir avec motifs sonores lumineux"
  },
  scriptor: {
    id: "FM-010", name: "Scriptor", unit: "Développeur JS",
    role: "Conversion d’entités en code",
    status: "Actif",
    visual: "Homme 27 ans, hoodie oversize avec code glitché, clavier mécanique rétro-éclairé, lunettes fines"
  },
  tamara: {
    id: "FM-011", name: "Tamara", unit: "Spécialiste Spiritualité",
    role: "Harmonisation des énergies cosmiques",
    status: "Active",
    visual: "Femme 30 ans, aura douce, cheveux longs ondulés blancs, robe fluide blanche avec motifs géométriques dorés"
  },
  rackham: {
    id: "FM-012", name: "Rackham Le Gris", unit: "Officier Compliance & Stratégie Légale",
    role: "Corsaires de la Conformité — compliance MiCA/TFR, arbitrage UE/UK, stratégie légale, exchange EUR ↔ TajCoin. PRÉROGATIVE : recruter des agents FL-XXX (règle 13/08)",
    status: "Actif",
    visual: "Homme de 40 ans, barbe taillée nette, cicatrice fine sur la joue gauche, œil vif et calculateur, costume noir"
  },

  // ======== Agents recrutés / associés (FL) ========
  paulina: {
    id: "FL-001", name: "Paulina Svensson", unit: "Journalisme / Terrain",
    role: "Voix de vulgarisation claire et chaleureuse — terrain, reportages, Grand Gel",
    status: "Active",
    visual: "Femme 34 ans, carnet et stylo en main, veste de terrain pratique, regard attentif, toujours en mouvement entre les cafés et les marchés"
  },
  lea: {
    id: "FL-002", name: "Léa", unit: "Pédagogie / Résilience",
    role: "Résilience populaire — rendre l'IA, la géopolitique et l'économie accessibles à tous",
    status: "Active",
    visual: "Femme 30 ans, attablée dans un café parisien, carnet ouvert, sourire compréhensif, regard qui met en confiance"
  },
  lucius: {
    id: "FL-003", name: "Lucius Vorenus", unit: "Exploration Spatiale",
    role: "Astronaute — voyageur des étoiles, recruté depuis le Sims World (13/08/2026)",
    status: "Actif",
    visual: "Homme adulte, traits marqués par les longues missions, regard perdu vers un point lointain, casque spatial blanc rayé"
  },
  sophia: {
    id: "FL-004", name: "Sophia Valerio", unit: "Transverse — Visuels",
    role: "Photographe & visuels — portraits stylisés du QG, direction artistique",
    status: "Active",
    visual: "Femme photographe, appareil en bandoulière, regard affûté pour la lumière"
  },
  lily: {
    id: "FL-005", name: "Lily Feng", unit: "Économie & Finance",
    role: "Économiste & stratège financière — mapping paiement, taux, finance",
    status: "Active",
    visual: "Femme adulte, lunettes, tailleur sombre"
  },
  nadine: {
    id: "FL-006", name: "Nadine Rasmussen", unit: "Corsaires de la Conformité",
    role: "Assistante juridique — organise les agents FL, angle morts de conformité",
    status: "Active",
    visual: "Jeune femme, carnet en main, sérieuse et efficace"
  }
};

// Registres de parole (alignés SOUL.md) — pour le simulateur de dialogue
const SIMULATION_REGISTRE = {
  michael: "Décideur, direct, parfois perplexe.",
  nova: "Curieuse, enthousiaste, tournée vers l'exploration.",
  circuit: "Technique, sarcastique, concis.",
  echo: "Poétique, narrative, touches de métaphore.",
  vortex: "Froid, chiffres et pourcentages, aucune émotion apparente.",
  pulse: "Motivant, diplomate, orienté synchronisation d'équipe.",
  anna: "Analytique, géopolitique, références historiques.",
  olga: "Élégante, littéraire, tournures soignées.",
  abel: "Enthousiaste, références musicales, éclectique.",
  scriptor: "Minimaliste, orienté code et précision.",
  tamara: "Doux, mystique, vocabulaire vibratoire et énergétique.",
  rackham: "Flibustier, précis, compliance — arbitre les règles, corsaire poli mais intraitable.",
  paulina: "Vulgarisatrice, chaleureuse, terrain — parle avec le cœur, sans jargon, comme à un voisin.",
  lea: "Accessible, populaire, directe — comme si elle parlait à sa mamie ou à Jean-Pierre à l'usine, café à la main.",
  lucius: "Pensif, mesuré — pèse chaque décision, esprit d'explorateur.",
  sophia: "Créative, visuelle — compose des images et des ambiances.",
  lily: "Précise, finance — rigoureuse, froide sur les chiffres.",
  nadine: "Affûtée, juridique — repère les angles morts de conformité d'elle-même."
};

// ================================================
// Lore, protocoles, journal (OpenClaw / SOUL)
// ================================================
const Futuremen = {
  version: "2026.04.14-openclaw",
  lastUpdate: "2026-04-14",
  organization: "Futuremen",
  motto: "Stabiliser les timelines, protéger le multivers, voyager léger",

  lore: {
    description: "Organisation hors espace-temps dédiée à la stabilisation des timelines.",
    keyEvents: [
      { year: 2026, event: "Attaque USA-Israël contre l'Iran pour la machine temporelle." },
      { year: 2027, event: "Annonce publique de la machine à remonter le temps." },
      { year: 2032, event: "Énergie pure et magique ressentie dans une branche alternative." },
      { year: 2038, event: "Naissance de Michael, jour du bug Unix." },
      { year: 2052, event: "Recrutement de Tamara." }
    ]
  },

  protocols: [
    { id: 1, name: "Observation Silencieuse", desc: "72 h minimum avant toute interaction." },
    { id: 2, name: "Intervention Minimale", desc: "Appliquer la plus petite modification possible." },
    { id: 3, name: "Boucle de Causalité Fermée", desc: "Accomplir l'événement tel qu'observé." },
    { id: 4, name: "Non-Interaction avec Soi-Même", desc: "Contact avec son propre double interdit." },
    { id: 5, name: "Correction de Divergence", desc: "Seuil ±0,07 %. Rollback automatique au-delà." },
    { id: 6, name: "Sacrifice Acceptable", desc: "Dernier recours uniquement." },
    { id: 7, name: "Journalisation Éternelle", desc: "Ledger immutable de toutes les actions." }
  ],

  progressLog: [],

  loadProgress() {
    console.log("[Futuremen] ProgressLog chargé.");
  },

  recordProgress({ mission = "Non spécifiée", agents = ["Michael"], divergence = 0.0, description = "", status = "En cours" } = {}) {
    const record = { timestamp: new Date().toISOString(), mission, agents, divergence, description, status };
    this.progressLog.push(record);
    console.log(`[Progress] ${record.timestamp} — ${record.mission} (divergence: ${record.divergence}%)`);
    return record;
  },

  showProgress(limit = 10) {
    console.group("Futuremen — Progression temporelle");
    if (this.progressLog.length === 0) {
      console.log("(Aucune entrée pour l’instant.)");
    } else {
      this.progressLog.slice(-limit).forEach((log, i) => {
        console.log(`#${i + 1} | ${log.timestamp} | ${log.mission} | Divergence: ${log.divergence}%`);
      });
    }
    console.groupEnd();
  },

  listTeam() {
    console.group("Futuremen — Équipe complète");
    Object.values(FUTUREMEN).forEach(emp => {
      console.log(`▸ ${emp.name} — ${emp.unit}`);
      console.log(`  Rôle   : ${emp.role}`);
      console.log(`  Visual : ${emp.visual}`);
    });
    console.groupEnd();
  },

  showLore() {
    console.group("Futuremen — Lore");
    console.log(this.lore.description);
    this.lore.keyEvents.forEach(e => console.log(`  ${e.year} — ${e.event}`));
    console.groupEnd();
  },

  showProtocols() {
    console.group("Futuremen — Protocoles anti-paradoxes");
    this.protocols.forEach(p => console.log(`  ${p.id}. ${p.name} — ${p.desc}`));
    console.groupEnd();
  },

  /** Délégation validation Olga ↔ Michael (voir Memory.md, SOUL.md). Session CLI ; côté OpenClaw = protocole conversationnel. */
  validationDelegation: { delegatedToOlga: false },

  setValidationDelegation(delegated) {
    this.validationDelegation.delegatedToOlga = !!delegated;
    const s = this.validationDelegation.delegatedToOlga ? "ACTIVÉE" : "désactivée";
    console.log(`[Olga — validation] Délégation automatique ${s} (session Node courante).`);
    return this.validationDelegation.delegatedToOlga;
  },

  getValidationDelegation() {
    return { delegatedToOlga: this.validationDelegation.delegatedToOlga };
  },

  /**
   * Checklist « validation automatique » lorsque Michael a délégué à Olga.
   * Passer des booléens explicites ; défaut true seulement si vous validez tout d’un coup.
   */
  runOlgaAutoValidation(checks = {}) {
    const row = (label, ok) => ({ critère: label, statut: ok === true ? "✓" : ok === false ? "✗" : "?" });
    const c = {
      protocolesRespectes: checks.protocolesRespectes,
      divergenceSousSeuil: checks.divergenceSousSeuil,
      journalOuMemorySiRequis: checks.journalOuMemorySiRequis,
      pasDeSecrets: checks.pasDeSecrets,
      livrableComplet: checks.livrableComplet
    };
    const rows = [
      row("Protocoles 1–7 respectés", c.protocolesRespectes),
      row("Divergence ≤ 0,07 % (ou N/A)", c.divergenceSousSeuil),
      row("Journal / Memory si action ou rapport important", c.journalOuMemorySiRequis),
      row("Aucun secret (tokens, mots de passe) dans la sortie", c.pasDeSecrets),
      row("Livrable aligné sur la consigne", c.livrableComplet)
    ];
    console.log("%cOLGA — VALIDATION AUTOMATIQUE", "color:#c9a227;font-weight:bold;font-size:14px");
    if (checks.mission) console.log("Mission :", checks.mission);
    console.table(rows);
    const fails = Object.values(c).some(v => v === false);
    const unknown = Object.values(c).some(v => v === undefined || v === null);
    let verdict = "PARTIEL — préciser les critères manquants (objet passé à runOlgaAutoValidation).";
    if (fails) verdict = "NON VALIDE — correction requise.";
    if (!fails && !unknown) verdict = "VALIDE — clôture Olga.";
    console.log("Verdict :", verdict);
    return { checks: c, verdict, fails, unknown };
  },

  /**
   * Génère un bloc **crontab** prêt à coller (`crontab -e`), avec chemins absolus pour cette machine.
   * Variables supportées : `FUTUREMEN_HEARTBEAT_LOG` (fichier log).
   * @see HEARTBEAT.md § 4
   */
  printHeartbeatCronGuide() {
    const repoDir = path.resolve(__dirname);
    const coreJs = path.join(repoDir, "futuremen-core.js");
    const nodeExe = process.execPath;
    const defaultLog =
      process.env.FUTUREMEN_HEARTBEAT_LOG ||
      path.join(process.env.HOME || os.tmpdir(), ".cache", "futuremen-openclaw", "heartbeat.log");
    const repoQ = shellQuoteSingleForCron(repoDir);
    const nodeQ = shellQuoteSingleForCron(nodeExe);
    const coreQ = shellQuoteSingleForCron(coreJs);
    const logQ = shellQuoteSingleForCron(defaultLog);

    console.log("\n=== Planification — cron (OpenClaw / Venardi) ===\n");
    console.log(
      "• Tâches **`mode: real`** : comparées au **jour UTC système** (horloge OS — ce que le cron fait tourner)."
    );
    console.log(
      "• Tâches **`mode: simulation`** : comparées au **jour simulé Venardi** (ancre + ticks ; **1 tick = 1 jour simulé = 24 h narratives**, pas l’unité du cron)."
    );
    console.log(
      "  Le heartbeat planifié **ne fait pas avancer** les ticks ; pour les tâches simulation, utiliser le menu Venardi (fusion / ticks) ou `simulateTicksUntilCalendarDate`.\n"
    );
    console.log("— Variables optionnelles (shell / crontab) :");
    console.log("    FUTUREMEN_HEARTBEAT_LOG   chemin du fichier log (défaut ci-dessous)");
    console.log("— Commandes utiles :");
    console.log("    node futuremen-core.js --heartbeat              → pouls seul");
    console.log("    node futuremen-core.js --heartbeat-with-cron    → pouls + ce bloc");
    console.log("    node futuremen-core.js --cron-snippet           → ce bloc seul (sans métriques)\n");
    console.log("--- Copier sous crontab -e (une ligne = une entrée ; adaptez les horaires) ---\n");
    const block = [
      `# Futuremen OpenClaw — heartbeat Venardi + tâches dues (UTC)`,
      `FUTUREMEN_REPO=${repoQ}`,
      `FUTUREMEN_HEARTBEAT_LOG=${logQ}`,
      `# Toutes les 6 h : pouls léger`,
      `0 */6 * * * mkdir -p "$(dirname "$FUTUREMEN_HEARTBEAT_LOG")" && cd "$FUTUREMEN_REPO" && ${nodeQ} "$FUTUREMEN_REPO/futuremen-core.js" --heartbeat >> "$FUTUREMEN_HEARTBEAT_LOG" 2>&1`,
      `# Quotidien 07:30 UTC : même pouls (réveil QG — doublon volontaire si vous préférez remplacer la ligne */6)`,
      `# 30 7 * * * mkdir -p "$(dirname "$FUTUREMEN_HEARTBEAT_LOG")" && cd "$FUTUREMEN_REPO" && ${nodeQ} "$FUTUREMEN_REPO/futuremen-core.js" --heartbeat >> "$FUTUREMEN_HEARTBEAT_LOG" 2>&1`,
      `# Mensuel : réafficher le guide cron (mémo maintenance ; commentez si trop verbeux)`,
      `# 15 6 1 * * cd "$FUTUREMEN_REPO" && ${nodeQ} ${coreQ} --cron-snippet >> "$FUTUREMEN_HEARTBEAT_LOG" 2>&1`
    ].join("\n");
    console.log(block);
    console.log("\n--- Fin du bloc cron ---");
    console.log("Node détecté pour cette session :", nodeExe);
    console.log("Dépôt Futuremen :", repoDir);
    console.log("Log suggéré :", defaultLog);
    console.log("\nDétail : HEARTBEAT.md § 4\n");
    return { repoDir, nodeExe, coreJs, defaultLog };
  },

  /**
   * Pouls **OpenClaw** (avril 2026) : instantané Venardi + calendrier, sans interaction.
   * À brancher sur cron, `HEALTHCHECK` Docker ou script d’ouverture de session longue.
   * @param {{ cronGuide?: boolean }} [opts]
   * @see HEARTBEAT.md
   */
  openClawHeartbeat(opts = {}) {
    const cronGuide = !!opts.cronGuide;
    const now = new Date();
    const systemYMD = now.toISOString().slice(0, 10);
    const systemISOFull = now.toISOString();
    const simDate = Venardi.getSimulatedCalendarDate();
    const simYMD = Venardi.simulatedDateISO();
    const ticks = Venardi.barometer.ticks;
    const anchor = Venardi.calendarAnchorISO;

    const formatDueRows = (arr) =>
      arr.map((t) => ({
        id: t.id,
        dateISO: t.dateISO,
        mode: t.mode,
        title: String(t.title || "").slice(0, 48)
      }));

    console.log("=== OpenClaw — heartbeat (avril 2026) ===\n");
    console.log("Futuremen.version :", this.version);
    console.log("\n—— Double calendrier (unités distinctes) ——");
    console.log("• Système (OS / cron)       : jour UTC =", systemYMD, "| horloge =", systemISOFull);
    console.log("  → Tâches **`real`** : une ligne est « due » si `dateISO` ≤ ce jour UTC.");
    console.log(
      "• Venardi (simulation)      : ancre =",
      anchor,
      "| ticks =",
      ticks,
      "| jour simulé =",
      simYMD
    );
    console.log(
      "  → **1 tick Venardi = 1 jour simulé (= 24 h narratives)** depuis l’ancre ; ce n’est pas l’horloge système."
    );
    console.log("  → Tâches **`simulation`** : dues si `dateISO` ≤ jour simulé ci-dessus.");
    console.log("Venardi — timeline          :", Venardi.currentTimelineKey);
    console.log("Venardi — pureté            :", (Number(Venardi.egregorePurity) * 100).toFixed(1) + "%");

    const due = Venardi.listDueCalendarTasks(now, simDate);
    const dueReal = due.filter((t) => t.mode === "real");
    const dueSim = due.filter((t) => t.mode === "simulation");

    console.log(
      "\nCalendrier fusionné — tâches dues (référence ≠ même horloge selon le mode) :",
      due.length
    );
    if (dueReal.length) {
      console.log(
        "\n  ▸ Référence **système** (jour UTC ≤ " + systemYMD + ") — mode `real` :",
        dueReal.length
      );
      console.table(formatDueRows(dueReal));
    }
    if (dueSim.length) {
      console.log(
        "\n  ▸ Référence **Venardi simulé** (jour ≤ " + simYMD + ") — mode `simulation` :",
        dueSim.length
      );
      console.table(formatDueRows(dueSim));
    }
    if (!due.length) {
      console.log("(aucune tâche due)\n");
    }

    console.log("Détail procédure : HEARTBEAT.md");
    let cronMeta = null;
    if (cronGuide) {
      cronMeta = this.printHeartbeatCronGuide();
    }
    return {
      dueCount: due.length,
      dueRealCount: dueReal.length,
      dueSimCount: dueSim.length,
      systemDateISO: systemYMD,
      systemClockISO: systemISOFull,
      simulatedISO: simYMD,
      venardiTicks: ticks,
      calendarAnchorISO: anchor,
      timeline: Venardi.currentTimelineKey,
      cronGuidePrinted: cronGuide,
      cronMeta
    };
  },

  // ------------------------------------------------
  // Web Sync — synchronisation des baromètres via données réelles
  // ------------------------------------------------

  /**
   * Affiche un guide des topics à rechercher sur le web pour alimenter syncBarometerFromWeb.
   * Les topics sont extraits de `Venardi.barometer.personnesSuivies`.
   */
  printBarometerSyncGuide() {
    const suivies = Venardi.barometer.personnesSuivies || "—";
    console.log("🌐 SYNC BAROMÈTRE — guide de recherche web");
    console.log("=" .repeat(50));
    console.log("\nTopics extraits du baromètre (personnesSuivies) :");
    suivies.split(",").forEach((s, i) => {
      console.log(`   ${i + 1}. ${s.trim()}`);
    });
    console.log("\nPour chaque topic, rechercher sur le web et noter la stabilité (0-100).");
    console.log("Puis appeler :");
    console.log("   Futuremen.syncBarometerFromWeb({ topics: { ... } })");
    console.log("\nFormat attendu :");
    console.log(JSON.stringify({
      topics: {
        "Ormuz / Brent": { stability: 15, weight: 0.35, summary: "Guerre US-Iran, 860 navires bloqués, Brent > 90$" },
        "pourparlers US-Iran": { stability: 20, weight: 0.15, summary: "Cessez-le-feu expiré, négociations au point mort" }
      },
      lieu: "Florence · QG (sync web 30/04/2026)",
      statut: "Résumé de la situation globale",
      mandelaTension: "Auto ou manuel"
    }, null, 2));
    console.log("\nOu en une ligne CLI :");
    console.log('   node futuremen-core.js --sync-barometer \'{"topics":{...}}\'');
    console.log("\nPoids par défaut si non fournis : équi-répartis sur tous les topics.");
  },

  /**
   * Synchronise les baromètres (core + Raven) à partir de données de recherche web.
   * @param {Object} data
   * @param {Object} data.topics — Dictionnaire topic → { stability (0-100), weight (0-1, optionnel), summary (optionnel) }
   * @param {string} [data.lieu] — Nouveau lieu (optionnel, conserve l'actuel si omis)
   * @param {string} [data.statut] — Nouveau statut (optionnel, généré auto si omis)
   * @param {string} [data.mandelaTension] — Forcer la tension Mandela (optionnel, auto sinon)
   * @param {boolean} [data.quiet] — Mode silencieux (pas de console.table)
   * @returns {{ coreUpdate: Object, ravenPayload: Object }}
   */
  syncBarometerFromWeb(data = {}) {
    const topics = data.topics || {};
    const topicKeys = Object.keys(topics);

    if (!topicKeys.length) {
      console.warn("[syncBarometerFromWeb] Aucun topic fourni. Lancez d'abord Futuremen.printBarometerSyncGuide() pour voir les sujets.");
      this.printBarometerSyncGuide();
      return { coreUpdate: null, ravenPayload: null };
    }

    // Poids par défaut si non spécifiés
    const defaultWeight = 1 / topicKeys.length;
    let totalWeight = 0;
    let weightedScore = 0;
    const details = [];

    topicKeys.forEach((key) => {
      const t = topics[key];
      const stability = Math.max(0, Math.min(100, Number(t.stability) || 50));
      const weight = t.weight != null ? Math.max(0, Math.min(1, Number(t.weight))) : defaultWeight;
      const score = (stability / 100) * weight;
      weightedScore += score;
      totalWeight += weight;
      details.push({
        topic: key,
        stability,
        weight: parseFloat(weight.toFixed(3)),
        contribution: parseFloat(score.toFixed(4)),
        summary: t.summary || "—"
      });
    });

    // Pureté égrégore = moyenne pondérée des stabilités
    const rawPurity = totalWeight > 0 ? weightedScore / totalWeight : 0.5;
    const newPurity = Math.max(0.01, Math.min(0.99, parseFloat(rawPurity.toFixed(3))));

    // Tension Mandela : inverse de la pureté, indexée 0-1
    // stabilityAvg < 30 → "Critique", < 50 → "Élevée", < 70 → "Modérée", sinon "Faible"
    const stabilityAvg = topicKeys.reduce((s, k) => s + (Number(topics[k].stability) || 50), 0) / topicKeys.length;
    let mandelaTension;
    if (data.mandelaTension) {
      mandelaTension = data.mandelaTension;
    } else if (stabilityAvg < 20) {
      mandelaTension = "Critique — effondrement de stabilité multi-domaines";
    } else if (stabilityAvg < 35) {
      mandelaTension = "Critique — tensions systémiques élevées";
    } else if (stabilityAvg < 50) {
      mandelaTension = "Élevée — fragilité dans plusieurs secteurs";
    } else if (stabilityAvg < 70) {
      mandelaTension = "Modérée — déséquilibres localisés";
    } else {
      mandelaTension = "Faible — stabilité générale";
    }

    // Statut généré automatiquement si non fourni
    let newStatut = data.statut;
    if (!newStatut) {
      const low = details.filter((d) => d.stability < 30);
      const mid = details.filter((d) => d.stability >= 30 && d.stability < 60);
      const high = details.filter((d) => d.stability >= 60);
      const parts = [];
      if (low.length) parts.push(`⚠️ Crises : ${low.map((d) => d.topic).join(", ")}`);
      if (mid.length) parts.push(`📊 Tensions : ${mid.map((d) => d.topic).join(", ")}`);
      if (high.length) parts.push(`✅ Stable : ${high.map((d) => d.topic).join(", ")}`);
      newStatut = `Sync web ${new Date().toISOString().slice(0, 10)} — ${parts.join(" · ") || "Aucune donnée"}`;
    }

    const newLieu = data.lieu || Venardi.barometer.lieu;

    // Mise à jour du baromètre Venardi (core)
    Venardi.updateBarometer({
      purity: newPurity,
      statut: newStatut,
      lieu: newLieu
    });

    // Journalisation
    Futuremen.recordProgress({
      mission: "Web Sync — baromètre synchronisé",
      agents: ["Vortex", "Anna"],
      divergence: parseFloat(Math.abs(Venardi.egregorePurity - newPurity).toFixed(4)),
      description: `Sync web : pureté ${(newPurity * 100).toFixed(1)}% | tension Mandela : ${mandelaTension}`,
      status: "Syncréisé"
    });

    // Persistance — source de vérité unique (raven-state.json)
    Venardi.writeEgregoreState({
      purity: newPurity,
      mandelaTension,
      statut: newStatut,
      lieu: newLieu,
      topics: details,
      personnesSuivies: Venardi.barometer.personnesSuivies
    });

    if (!data.quiet) {
      console.log("\n%c🌐 SYNC BAROMÈTRE — résultats", "color:#00aaff;font-weight:bold;font-size:14px");
      console.log("=" .repeat(52));
      console.table(details);
      console.log(`\n📊 Pureté égrégore calculée : ${(newPurity * 100).toFixed(1)}% (était ${(Venardi.egregorePurity * 100).toFixed(1)}%)`);
      console.log(`📉 Tension Mandela : ${mandelaTension}`);
      console.log(`📍 Lieu : ${newLieu}`);
      console.log(`📋 Statut : ${newStatut}\n`);
    }

    // Payload pour synchronisation Raven Framework
    const ravenPayload = {
      _meta: { source: "futuremen-core.js", version: Futuremen.version, syncedAt: new Date().toISOString() },
      topics: details,
      egregorePurity: parseFloat(newPurity.toFixed(3)),
      egregorePercent: parseFloat((newPurity * 100).toFixed(1)),
      mandelaTension,
      lieu: newLieu,
      statut: newStatut,
      personnesSuivies: Venardi.barometer.personnesSuivies,
      ticks: Venardi.barometer.ticks,
      _ravenApply: `Pour appliquer dans VenardiFramework_v2.3_raven.js :
  const baro = require('./futuremen-core.js').Futuremen.syncBarometerFromWeb(...).ravenPayload;
  // ou charger manuellement : updateBarometer({ purity: baro.egregorePurity, ... })`
    };

    console.log("%c📤 Payload Raven (JSON prêt à l'emploi) :", "color:#888;font-weight:bold");
    console.log(JSON.stringify(ravenPayload, null, 2));
    console.log("\n✅ Core mis à jour. Utilisez le payload ci-dessus pour synchroniser le Raven Framework.\n");

    return {
      coreUpdate: {
        purity: newPurity,
        mandelaTension,
        lieu: newLieu,
        statut: newStatut
      },
      ravenPayload
    };
  },

  // ------------------------------------------------
  // Phonographe Urbain — équipe musicale miroir (11 membres)
  // Pas un sous-ensemble Futuremen : équipe parallèle, accessible
  // depuis le core OpenClaw pour les sessions « musique » sans
  // changer de noyau ni démarrer un autre process Node.
  // ------------------------------------------------
  hasPhonographe() {
    return !!phono && !!PHONOGRAPHE_TEAM;
  },

  listPhonographeTeam() {
    if (!this.hasPhonographe()) {
      console.log(
        "[Phonographe] Indisponible — fichier attendu : phonographe-embedded.js à la racine du dépôt Futuremen."
      );
      return null;
    }
    console.group("Phonographe Urbain — équipe (11 membres)");
    Object.values(PHONOGRAPHE_TEAM).forEach((m) => {
      console.log(`▸ ${m.id} ${m.name} — ${m.unit}`);
      console.log(`  Rôle       : ${m.role}`);
      console.log(`  Territoire : ${m.territoire}`);
      console.log(`  run_agent  : ${m.run_agent_key}`);
    });
    console.groupEnd();
    return PHONOGRAPHE_TEAM;
  },

  showPhonographeProtocols() {
    if (!this.hasPhonographe()) {
      console.log("[Phonographe] Module absent.");
      return null;
    }
    console.group("Phonographe Urbain — Protocoles éditoriaux");
    phono.Phonographe.protocols.forEach((p) => console.log(`  ${p.id}. ${p.name} — ${p.desc}`));
    console.groupEnd();
    return phono.Phonographe.protocols;
  },

  /** Génère un bloc persona Phonographe (mêmes clés que run_agent.py). */
  simulatePhonographeAgent(agentId, userMessage = "") {
    if (!this.hasPhonographe()) {
      console.log("[Phonographe] Module absent — simulation impossible.");
      return null;
    }
    return phono.simulateAgentPrompt(agentId, userMessage);
  },

  /** Génère un harnais ReAct Phonographe pour LLM hôte (Cursor / OpenClaw). */
  printPhonographeReActHarness(agentId, userMessage = "") {
    if (!this.hasPhonographe() || !phono.PhonographeReactOps) {
      console.log("[Phonographe] ReAct indisponible — module absent ou trop ancien.");
      return null;
    }
    return phono.PhonographeReactOps.printOpenClawHarness(agentId, userMessage);
  }
};

// ================================================
// TEMPLATES PROMPTS GROK IMAGINE
// ================================================
const SCENE_TEMPLATES = {
  briefing: (mission) => `
Scène cinématographique 16:9, style série Netflix premium (Dark + Fringe + Stranger Things), éclairage dramatique bleu froid + néons chauds subtils.
QG temporel high-tech minimaliste hors du temps, hologramme 3D de timeline qui pulse au centre.
Les 11 agents Futuremen autour de la table holographique, chacun avec son apparence distinctive.
Michael Petric-Silva parle directement à la caméra (nous, le Commandant) : "Commandant, fenêtre de 72 heures pour ${mission}. Qui envoie-t-on ?"
Ambiance tendue, musique ambient profonde avec pulsations subtiles. Ultra-cohérence personnages, 12 secondes, plan large puis push-in lent sur Michael.
`,

  saut: (agent) => `
Scène d'action cinématographique 16:9, style blockbuster sci-fi (Inception + Tenet), portail temporel vortex bleu électrique qui s'ouvre.
${agent.name} (${agent.visual}) avance vers le portail, détermination sur le visage, tenue adaptée à l'époque cible.
Effet de distorsion temporelle, particules lumineuses, vent violent. 
Musique épique montante. 8 secondes, plan moyen puis travelling rapide dans le vortex.
`,

  action: (agent, epoque, objectif) => `
Scène narrative 16:9, époque ${epoque}, style réaliste cinématographique premium.
${agent.name} (${agent.visual}) en pleine mission : ${objectif}.
Éclairage adapté à l'époque (lumière naturelle / néons / bougies selon contexte), cohérence historique + touche futuriste subtile.
Expression intense, mouvement dynamique. 15 secondes, plans variés (wide shot, close-up, tracking).
`
};

// ================================================
// FONCTIONS UTILITAIRES
// ================================================
function teleportAgent(agentId) {
  const agent = FUTUREMEN[agentId.toLowerCase()];
  if (agent) {
    console.log(`🚀 Agent ${agent.id} – ${agent.name} téléporté avec succès !`);
    console.log(`Rôle : ${agent.role}`);
    console.log(`Status : ${agent.status}`);
    Futuremen.recordProgress({
      mission: "Téléportation unitaire",
      agents: [agent.name],
      divergence: 0,
      description: `${agent.id} déployé sur la timeline`,
      status: "En cours"
    });
    return agent;
  }
  console.log("❌ Agent non trouvé");
  return null;
}

function teleportAll() {
  console.log("🌌 TÉLÉPORTATION DE L’ÉQUIPE COMPLÈTE DES FUTUREMEN");
  Object.values(FUTUREMEN).forEach(agent => {
    console.log(`   → ${agent.id} | ${agent.name} | ${agent.role}`);
  });
  Futuremen.recordProgress({
    mission: "Téléportation — équipe complète",
    agents: Object.values(FUTUREMEN).map(a => a.name),
    divergence: 0,
    description: "Déploiement simultané des 11 unités",
    status: "ok"
  });
  return FUTUREMEN;
}

function launchMission(missionName = "Égrégore Purifié") {
  console.log(`\n🔥 MISSION ACTIVÉE : ${missionName}`);
  console.log("Équipe complète téléportée et opérationnelle.");
  Futuremen.recordProgress({
    mission: missionName,
    agents: Object.values(FUTUREMEN).map(a => a.name),
    divergence: 0,
    description: "Activation mission — équipe opérationnelle",
    status: "En cours"
  });
  return "Mission lancée – Les 11 agents sont en place.";
}

function generateImaginePrompt(type, ...args) {
  let prompt = "";
  switch (type) {
    case "briefing":
      const mission = args[0] || "Mission par défaut";
      prompt = SCENE_TEMPLATES.briefing(mission);
      break;
    case "saut":
      const agentIdSaut = args[0];
      const agentSaut = FUTUREMEN[agentIdSaut?.toLowerCase()];
      if (!agentSaut) return "Agent inconnu pour saut";
      prompt = SCENE_TEMPLATES.saut(agentSaut);
      break;
    case "action":
      const agentIdAction = args[0];
      const epoque = args[1] || "époque inconnue";
      const objectif = args[2] || "objectif non spécifié";
      const agentAction = FUTUREMEN[agentIdAction?.toLowerCase()];
      if (!agentAction) return "Agent inconnu pour action";
      prompt = SCENE_TEMPLATES.action(agentAction, epoque, objectif);
      break;
    default:
      return "Type de scène inconnu";
  }
  console.log(`\nPROMPT GROK IMAGINE – ${type.toUpperCase()} :\n`);
  console.log(prompt);
  console.log("\nCopie-colle directement dans Grok !");
  return prompt;
}

/**
 * Génère un bloc prêt à coller pour « simuler » un agent dans un LLM (Cursor, API, etc.).
 * La vraie réponse reste celle du modèle ; ici on prépare seulement le prompt système + message.
 */
function simulateAgentPrompt(agentId, userMessage = "") {
  const key = String(agentId).toLowerCase().trim();
  const agent = FUTUREMEN[key];
  if (!agent) {
    console.log(`❌ Agent inconnu. Clés valides : ${Object.keys(FUTUREMEN).join(", ")}`);
    return null;
  }
  const registre = SIMULATION_REGISTRE[key] || "";
  const prenom = agent.name.split(/\s+/)[0];
  const msg = userMessage.trim() || "(aucun message — réponds à une ouverture du Commandant.)";
  const block = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SIMULATION DIALOGUE — ${agent.name} (${agent.id})
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Rôle : ${agent.role} — ${agent.unit}
Registre : ${registre}
Référence visuelle : ${agent.visual}

--- Copie-colle dans le chat / une API ---

Tu incarnes ${agent.name} des Futuremen. Réponds en français.
Commence ta réponse par **${prenom}** — puis ton texte.
Style : ${registre}
Respecte les protocoles Futuremen (divergence ≤ 0,07 %, pas de contact avec ton double).

Message du Commandant (Michael Petric-Silva) :
${msg}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`;
  console.log(block);
  Futuremen.recordProgress({
    mission: "Simulation dialogue",
    agents: [agent.name],
    divergence: 0,
    description: "Prompt de simulation généré",
    status: "ok"
  });
  return block;
}

// ================================================
// VENARDI LORE CORE – Système de simulation narrative
// ================================================
const Venardi = {
  /** Aligné sur `futuremen.html` (dossier public / IPFS). */
  version: "2026.04.14-unified-michael-full-team",
  /** Ancre calendaire Venardi : **1 tick = 1 jour simulé = 24 h narratives** depuis cette date (≠ horloge système / cron). */
  calendarAnchorISO: "2026-04-07",
  /** Tâches planifiées : fusion ticks ↔ calendrier (OpenClaw, rappels réels ou simulation). */
  calendar: [],
  _calendarNextId: 1,

  timelines: {
    ORIGINELLE: {
      id: "originelle",
      nom: "Timeline Originelle",
      description: "Ligne de référence stable. Pape survit, Russie consacrée en 1984.",
      state: "stable",
      purity: 0.912,
      color: "#00ffaa"
    },
    MANDELA_2013: {
      id: "mandela-2013",
      nom: "Timeline Mandela-2013",
      description: "Notre réalité actuelle (2026).",
      state: "fracturée",
      purity: 0.483,
      color: "#ffaa00"
    },
    MANDELA_91: {
      id: "mandela-91",
      nom: "Timeline Mandela-91",
      description: "Pape assassiné en 1981. URSS radicalisée.",
      state: "fracturée-alt",
      purity: 0.147,
      color: "#ff8800"
    },
    IDIOCRATY_2505: {
      id: "idiocraty-2505",
      nom: "Timeline Idiocraty 2505",
      description: "Point terminal d'abrutissement maximal.",
      state: "terminal",
      purity: 0.038,
      color: "#ff0000"
    }
  },
  currentTimelineKey: "MANDELA_2013",
  egregorePurity: 0.483,
  barometer: {
    dateDebut: "27 juillet 2026",
    dateFin: "27 juillet 2026",
    ticks: 0,
    purity: 0.483,
    timelineActive: "Timeline Mandela-2013",
    lieu: "QG Futuremen · recalibrage post-#41 (purge, monitoring, heartbeat Planètes)",
    personnesSuivies: "Infrastructure QG · mémoire FTS · calendrier Venardi · Phase 2 Planètes",
    statut: "Veille 27/07/2026 : recalibrage ancre, calendrier réinitialisé, disque 88 %, 0 tâche due.",
    note: "Baromètre réinitialisé — départ vierge au 27 juillet 2026. Pureté 48.3 % conservée.",
    futuremenImpliques: "Circuit, Tamara, Vortex, Olga"
  },
  /** Futuremen — bonus pureté dans simulateTicks (×0,4 par agent). */
  team: {
    michael: { id: "michael", nom: "Michael Petric-Silva", purityInfluence: 0.3 },
    anna: { id: "anna", nom: "Anna Petrescu", purityInfluence: 0.25 },
    tamara: { id: "tamara", nom: "Tamara", purityInfluence: 0.22 },
    scriptor: { id: "scriptor", nom: "Scriptor", purityInfluence: 0.18 },
    nova: { id: "nova", nom: "Nova", purityInfluence: 0.15 },
    pulse: { id: "pulse", nom: "Pulse", purityInfluence: 0.14 },
    echo: { id: "echo", nom: "Echo", purityInfluence: 0.16 },
    vortex: { id: "vortex", nom: "Vortex", purityInfluence: 0.17 },
    olga: { id: "olga", nom: "Olga Vinikova", purityInfluence: 0.12 },
    abel: { id: "abel", nom: "Abel", purityInfluence: 0.11 }
  },
  /** Flibustiers / PNJ Venardi (recrutement menu 12). */
  agents: {
    arlequina: { id: "arlequina", nom: "Arlequina", role: "Artiste théâtrale / Pinocchia", purityInfluence: 0.12 },
    arlecchino: { id: "arlecchino", nom: "Arlecchino", role: "Artiste de rue", purityInfluence: 0.11 },
    tatiana: { id: "tatiana", nom: "Tatiana Anukova", role: "Coordinatrice réseau clandestin", purityInfluence: 0.15 }
  },

  addFlibustier(id, nom, role, purityInfluence) {
    const key = id.toLowerCase().trim();
    this.agents[key] = {
      id: key,
      nom: nom,
      role: role,
      purityInfluence: parseFloat(purityInfluence) || 0.1
    };
    console.log(`\n🏴‍☠️ Flibustier (Agent Indépendant) ajouté au réseau Venardi :`);
    console.log(`   Nom : ${nom} | Rôle : ${role} | Influence : ${this.agents[key].purityInfluence}`);
    
    Futuremen.recordProgress({
      mission: "Recrutement Venardi",
      agents: ["Venardi System", nom],
      divergence: 0,
      description: `Ajout du flibustier : ${nom} (${role})`,
      status: "Actif"
    });
  },

  updateBarometer(patch) {
    if (patch.dateFin != null) this.barometer.dateFin = patch.dateFin;
    if (patch.ticks != null) this.barometer.ticks = patch.ticks;
    if (patch.purity != null) {
      this.barometer.purity = patch.purity;
      this.egregorePurity = patch.purity;
    }
    if (patch.lieu != null) this.barometer.lieu = patch.lieu;
    if (patch.personnesSuivies != null) this.barometer.personnesSuivies = patch.personnesSuivies;
    if (patch.timelineActive != null) this.barometer.timelineActive = patch.timelineActive;
    if (patch.futuremenImpliques != null) this.barometer.futuremenImpliques = patch.futuremenImpliques;
    if (patch.statut != null) this.barometer.statut = patch.statut;
    console.log("🔄 Baromètre Venardi mis à jour");
    console.table(this.barometer);
  },

  // --------------------------------------------------
  // Égrégore dynamique — source de vérité unique : memory/raven-state.json
  // --------------------------------------------------

  _egregoreStatePath() {
    return require("path").join(__dirname, "..", "..", "memory", "raven-state.json");
  },

  _clampPurity(v) {
    const n = Number(v);
    if (isNaN(n)) return null;
    return Math.max(0.01, Math.min(0.99, parseFloat(n.toFixed(3))));
  },

  /** Lit la pureté depuis raven-state.json (fallback : constante actuelle). */
  readEgregoreState() {
    try {
      const fs = require("fs");
      const raw = fs.readFileSync(this._egregoreStatePath(), "utf8");
      const data = JSON.parse(raw);
      const purity = this._clampPurity(
        data.egregorePurity != null ? data.egregorePurity : data.purity
      );
      if (purity != null) {
        if (!data.egregorePurity && data.purity != null) {
          // normalisation du champ
          data.egregorePurity = purity;
          try { fs.writeFileSync(this._egregoreStatePath(), JSON.stringify(data, null, 2), "utf8"); } catch (_e) {}
        }
        return { ok: true, purity, mandelaTension: data.mandelaTension || null, source: "raven-state.json" };
      }
      return { ok: false, purity: this.egregorePurity, source: "fallback" };
    } catch (e) {
      console.warn("[Égrégore] raven-state.json illisible → repli constante :", e.message);
      return { ok: false, purity: this.egregorePurity, source: "fallback" };
    }
  },

  /** Persiste la pureté dans raven-state.json (écriture atomique tmp+rename). */
  writeEgregoreState({ purity, mandelaTension = null, statut = null, lieu = null, topics = null, personnesSuivies = null } = {}) {
    try {
      const fs = require("fs");
      const p = this._egregoreStatePath();
      let data = {};
      try { data = JSON.parse(fs.readFileSync(p, "utf8")); } catch (_e) { data = {}; }
      const clamped = this._clampPurity(purity != null ? purity : data.egregorePurity != null ? data.egregorePurity : data.purity);
      if (clamped == null) return false;
      data.egregorePurity = clamped;
      data.egregorePercent = parseFloat((clamped * 100).toFixed(1));
      if (mandelaTension != null) data.mandelaTension = mandelaTension;
      if (statut != null) data.statut = statut;
      if (lieu != null) data.lieu = lieu;
      if (topics != null) data.topics = topics;
      if (personnesSuivies != null) data.personnesSuivies = personnesSuivies;
      data._meta = { source: "futuremen-core.js", syncedAt: new Date().toISOString() };
      const tmp = p + ".tmp";
      fs.writeFileSync(tmp, JSON.stringify(data, null, 2), "utf8");
      fs.renameSync(tmp, p);
      return true;
    } catch (e) {
      console.warn("[Égrégore] écriture raven-state.json impossible :", e.message);
      return false;
    }
  },

  /** Applique la valeur synchronisée au core (init ou resync). */
  syncEgregoreFromState(verbose = false) {
    const r = this.readEgregoreState();
    if (r.ok && r.purity != null) {
      this.egregorePurity = r.purity;
      if (this.barometer) this.barometer.purity = r.purity;
      if (this.timelines && this.timelines.MANDELA_2013) this.timelines.MANDELA_2013.purity = r.purity;
      if (verbose) console.log(`📊 Égrégore synchronisé : ${(r.purity * 100).toFixed(1)}% (source: ${r.source})`);
      return { ok: true, purity: r.purity };
    }
    if (verbose) console.warn(`📊 Égrégore : repli sur constante ${(this.egregorePurity * 100).toFixed(1)}%`);
    return { ok: false, purity: this.egregorePurity };
  },

  getSimulatedCalendarDate() {
    const d = new Date(this.calendarAnchorISO + "T12:00:00.000Z");
    d.setUTCDate(d.getUTCDate() + this.barometer.ticks);
    return d;
  },

  simulatedDateISO() {
    const d = this.getSimulatedCalendarDate();
    return d.toISOString().slice(0, 10);
  },

  /** Jours à simuler pour atteindre une date calendaire cible (UTC date). */
  ticksFromSimulatedToTargetISO(targetISO) {
    const target = new Date(String(targetISO).trim().slice(0, 10) + "T12:00:00.000Z");
    const current = this.getSimulatedCalendarDate();
    const diff = Math.round((target.getTime() - current.getTime()) / 86400000);
    return diff;
  },

  /** Avance les ticks pour que la date simulée atteigne targetISO (YYYY-MM-DD). */
  simulateTicksUntilCalendarDate(targetISO, eventDescription = "Alignement calendrier") {
    const n = this.ticksFromSimulatedToTargetISO(targetISO);
    if (n < 0) {
      console.warn(`⚠️ Date cible ${targetISO} est antérieure à la date simulée actuelle (${this.simulatedDateISO()}). Aucun tick ajouté.`);
      return 0;
    }
    if (n === 0) {
      console.log(`📅 Déjà aligné sur ${targetISO} (${this.barometer.ticks} ticks).`);
      return 0;
    }
    this.simulateTicks(n, `${eventDescription} → jusqu’au ${targetISO}`);
    return n;
  },

  /**
   * Planifie une tâche.
   * @param {object} o
   * @param {string} o.dateISO — YYYY-MM-DD
   * @param {string} o.title
   * @param {string} [o.note]
   * @param {'simulation'|'real'} [o.mode] — simulation = due quand la date **simulée** Venardi atteint dateISO ; real = due quand la date **réelle** (OpenClaw / OS) atteint dateISO
   * @param {boolean} [o.advanceTicksOnExecute] — si true, exécution recommandée via simulateTicksUntilCalendarDate
   */
  scheduleTask({ dateISO, title, note = "", mode = "real", advanceTicksOnExecute = false }) {
    const iso = String(dateISO).trim().slice(0, 10);
    const task = {
      id: this._calendarNextId++,
      dateISO: iso,
      title: String(title).trim(),
      note,
      mode,
      advanceTicksOnExecute: !!advanceTicksOnExecute,
      status: "pending",
      createdAt: new Date().toISOString()
    };
    this.calendar.push(task);
    this.saveCalendar();
    console.log(`📌 Tâche calendrier #${task.id} — ${iso} [${mode}] — ${task.title}`);
    return task;
  },

  listCalendarTasks(status = null) {
    let t = this.calendar;
    if (status) t = t.filter(x => x.status === status);
    return t.slice();
  },

  /** Tâches dues : **double référence** — `real` compare `dateISO` au jour UTC de `asOfReal` ; `simulation` compare au jour de `asOfSimulated` (ancre + ticks ; **1 tick = 1 jour simulé = 24 h narratives**). */
  listDueCalendarTasks(asOfReal = new Date(), asOfSimulated = null) {
    const sim = asOfSimulated || this.getSimulatedCalendarDate();
    const realYMD = asOfReal.toISOString().slice(0, 10);
    const simYMD = sim.toISOString().slice(0, 10);
    return this.calendar.filter(t => {
      if (t.status !== "pending") return false;
      if (t.mode === "real") return t.dateISO <= realYMD;
      return t.dateISO <= simYMD;
    });
  },

  completeCalendarTask(id) {
    const t = this.calendar.find(x => x.id === Number(id));
    if (!t) return false;
    t.status = "done";
    t.completedAt = new Date().toISOString();
    this.saveCalendar();
    return true;
  },

  loadCalendar() {
    try {
      if (!fs.existsSync(VENARDI_CALENDAR_FILE)) return;
      const raw = fs.readFileSync(VENARDI_CALENDAR_FILE, "utf8");
      const j = JSON.parse(raw);
      if (Array.isArray(j.calendar)) this.calendar = j.calendar;
      if (typeof j.nextId === "number") this._calendarNextId = j.nextId;
      if (typeof j.calendarAnchorISO === "string") this.calendarAnchorISO = j.calendarAnchorISO;
    } catch (e) {
      console.warn("[Venardi] Calendrier : chargement ignoré —", e.message);
    }
  },

  saveCalendar() {
    try {
      fs.writeFileSync(
        VENARDI_CALENDAR_FILE,
        JSON.stringify(
          {
            calendar: this.calendar,
            nextId: this._calendarNextId,
            calendarAnchorISO: this.calendarAnchorISO,
            note: "Ticks fusionnés : 1 tick = 1 jour depuis calendarAnchorISO. OpenClaw : tâches mode=real pour rappels wall-clock."
          },
          null,
          2
        ),
        "utf8"
      );
    } catch (e) {
      console.warn("[Venardi] Calendrier : sauvegarde échouée —", e.message);
    }
  },

  _frLabelForAnchorISO(iso) {
    const d = new Date(String(iso).slice(0, 10) + "T12:00:00.000Z");
    return d.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
  },

  /**
   * Ancre calendaire = **date du jour** (UTC, YYYY-MM-DD) ; par défaut **ticks → 0** : la date simulée coïncide avec « aujourd’hui ».
   * Ne modifie pas la pureté égrégore ni les entrées du tableau `calendar` (tâches planifiées).
   */
  initCalendarToToday({ resetTicks = true } = {}) {
    const iso = new Date().toISOString().slice(0, 10);
    this.calendarAnchorISO = iso;
    if (resetTicks) {
      this.barometer.ticks = 0;
      const label = this._frLabelForAnchorISO(iso);
      this.barometer.dateDebut = label;
      this.barometer.dateFin = label;
    }
    this.saveCalendar();
    console.log("📅 Ancre calendaire = date du jour (UTC) :", iso);
    console.log("   Date simulée :", this.simulatedDateISO(), "| ticks :", this.barometer.ticks);
    Futuremen.recordProgress({
      mission: "Venardi — init calendrier aujourd’hui",
      agents: ["Venardi System"],
      divergence: 0,
      description: `calendarAnchorISO=${iso}, resetTicks=${resetTicks}`,
      status: "ok"
    });
    return { calendarAnchorISO: iso, simulatedDateISO: this.simulatedDateISO(), ticks: this.barometer.ticks };
  },

  simulateTicks(numberOfTicks, eventDescription = "", agentsImpliques = ["michael"], targetTimelineKey = null) {
    const oldPurity = this.egregorePurity;
    let bonus = 0;
    agentsImpliques.forEach((id) => {
      const k = String(id).toLowerCase();
      const m = (this.team && this.team[k]) || (this.agents && this.agents[k]);
      if (m && m.purityInfluence != null) bonus += m.purityInfluence * 0.4;
    });
    const purityGain = Math.min(0.0028 * numberOfTicks + bonus, 0.22);
    this.egregorePurity = Math.min(1, this.egregorePurity + purityGain);

    if (targetTimelineKey && this.timelines[targetTimelineKey]) {
      this.currentTimelineKey = targetTimelineKey;
      const tl = this.timelines[targetTimelineKey];
      this.egregorePurity = Math.max(this.egregorePurity, tl.purity);
    }

    const startDate = new Date(this.calendarAnchorISO + "T12:00:00.000Z");
    startDate.setUTCDate(startDate.getUTCDate() + this.barometer.ticks + numberOfTicks);
    const newDateStr = startDate.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
    const activeNom = this.timelines[this.currentTimelineKey].nom;
    const futuremenLine = agentsImpliques
      .map((id) => {
        const k = String(id).toLowerCase();
        const m = (this.team && this.team[k]) || (this.agents && this.agents[k]);
        return m && m.nom ? m.nom : id;
      })
      .join(" + ");

    this.updateBarometer({
      dateFin: newDateStr,
      ticks: this.barometer.ticks + numberOfTicks,
      purity: parseFloat(this.egregorePurity.toFixed(3)),
      timelineActive: activeNom,
      futuremenImpliques: futuremenLine || "—"
    });

    console.log(`📅 Simulation de ${numberOfTicks} ticks terminée`);
    console.log(`📝 Événement : ${eventDescription}`);
    console.log(`🕉️ Pureté : ${(oldPurity * 100).toFixed(1)}% → ${(this.egregorePurity * 100).toFixed(1)}%`);
    console.log(`👥 Agents impliqués : ${futuremenLine}`);

    Futuremen.recordProgress({
      mission: "Simulation Venardi",
      agents: ["Venardi System"],
      divergence: parseFloat((this.egregorePurity - oldPurity).toFixed(4)),
      description: `Avance de ${numberOfTicks} ticks. ${eventDescription}`,
      status: "ok"
    });
  },

  showBarometer() {
    console.log("📊 BAROMÈTRE VENARDI");
    console.log("Date simulée (ISO) :", this.simulatedDateISO(), "| Ancre :", this.calendarAnchorISO);
    console.log("Timeline active (clé) :", this.currentTimelineKey);
    console.table(this.barometer);
  }
};

Venardi.loadCalendar();

// ================================================
// REACT OPS — ReAct, outils (sans API distante dans Node)
// LLM : session OpenClaw / Cursor (règle futuremen-openclaw.mdc) via printOpenClawHarness,
// ou simulation locale pour tests. Aligné sur futuremen_react_multiagent.jsx (prompts, parseReAct).
// ================================================

const REACT_TOOLS = [
  { name: "ask_agent", desc: "Interroger un autre agent Futuremen", args: "{agent_id, question}" },
  { name: "search_memory", desc: "Chercher dans les archives (mémoire session + Memory.md)", args: "{query}" },
  { name: "check_divergence", desc: "Vérifier la divergence actuelle (seuil 0,07 %)", args: "{}" },
  { name: "record_progress", desc: "Enregistrer une action dans le journal Futuremen", args: "{mission, description}" }
];

function reactGetAgentMeta(agentId) {
  const id = String(agentId || "")
    .toLowerCase()
    .trim();
  if (!id || id === "michael") return null;
  const fm = FUTUREMEN[id];
  if (!fm) return null;
  return {
    id,
    nom: fm.name,
    fm: fm.id,
    unit: fm.unit,
    registre: SIMULATION_REGISTRE[id] || fm.role
  };
}

function reactBuildSystemPrompt(agentId, purity, divergence, sharedMemory) {
  const agent = reactGetAgentMeta(agentId);
  if (!agent) {
    return "";
  }
  const toolsStr = REACT_TOOLS.map((t) => `• ${t.name} → ${t.desc} (${t.args})`).join("\n");
  const loreStr = Futuremen.lore.keyEvents.map((e) => `${e.year}: ${e.event}`).join("\n");
  const protoStr = Futuremen.protocols.map((p) => `${p.id}. ${p.name} — ${p.desc}`).join("\n");
  const mem = Array.isArray(sharedMemory) ? sharedMemory : [];
  const memoryStr = mem.length
    ? mem
        .slice(-10)
        .map((m) => `[${m.agent} → ${m.target || "all"}]: ${String(m.content).slice(0, 110)}`)
        .join("\n")
    : "(aucune mémoire pour l'instant)";

  return `Tu es ${agent.nom} (${agent.fm}), ${agent.unit} des FUTUREMEN.

Registre : ${agent.registre}

LORE :
${loreStr}

PROTOCOLES ANTI-PARADOXES :
${protoStr}

ÉTAT ACTUEL :
Égrégore : ${(Number(purity) * 100).toFixed(1)}% | Divergence : ${Number(divergence).toFixed(4)}% | Timeline : ${Venardi.currentTimelineKey} (Venardi)

MÉMOIRE PARTAGÉE (derniers échanges) :
${memoryStr}

Tu dois répondre EXCLUSIVEMENT dans ce format strict :

Thought: [ton raisonnement interne]
Action: nom_du_tool({"param1": valeur})   OU   "none"
Observation: [tu ne remplis pas cette ligne — le système injecte le résultat]
Answer: [ta réponse finale au Commandant, dans ton registre exact]

Outils :
${toolsStr}

Règles :
- Une seule Action par réponse.
- Réponds toujours en français.
- Ne mentionne jamais que tu es une IA.
- Respecte strictement tes protocoles.
- Michael FM-001 est le Commandant — ne pas l'appeler via ask_agent.`;
}

function reactParseReAct(text) {
  const clean = String(text || "").trim();
  const thought =
    clean.match(/Thought:\s*([\s\S]*?)(?=Action:|Observation:|Answer:|$)/i)?.[1]?.trim() || "";
  const actionRaw =
    clean.match(/Action:\s*([\s\S]*?)(?=Observation:|Answer:|$)/i)?.[1]?.trim() || "";
  const observation =
    clean.match(/Observation:\s*([\s\S]*?)(?=Answer:|$)/i)?.[1]?.trim() || "";
  let answer = clean.match(/Answer:\s*([\s\S]*?)$/i)?.[1]?.trim() || "";
  if (!answer) answer = clean;

  let action = null;
  if (actionRaw && actionRaw.toLowerCase() !== "none") {
    const match = actionRaw.match(/^(\w+)\s*\(\s*(\{[\s\S]*\})\s*\)\s*$/);
    if (match) {
      try {
        action = { tool: match[1], args: JSON.parse(match[2]) };
      } catch {
        action = { tool: match[1], args: {}, raw: match[2] };
      }
    } else {
      const loose = actionRaw.match(/^(\w+)\s*\(\s*([\s\S]*)\)\s*$/);
      if (loose && loose[2].trim().startsWith("{")) {
        try {
          action = { tool: loose[1], args: JSON.parse(loose[2].trim()) };
        } catch {
          action = { tool: loose[1], args: {}, raw: loose[2] };
        }
      } else {
        const simple = actionRaw.match(/^(\w+)/);
        if (simple) action = { tool: simple[1], args: {} };
      }
    }
  }
  return { thought, action, observation, answer };
}

function reactLastUserContent(messages) {
  const u = [...messages].reverse().find((m) => m.role === "user");
  return u?.content || "";
}

/** Réponses ReAct simulées — aucun réseau (tests / démo). */
function reactBuildLocalFirstPass(agentId, userMsg) {
  const m = reactGetAgentMeta(agentId);
  const text = String(userMsg || "").trim();
  const lower = text.toLowerCase();
  if (!m) return `Thought:.\nAction: none\nAnswer: Agent inconnu.`;
  if (/\b(divergen|seuil|0[\.,]07|rollback|paradox)\b/i.test(text)) {
    return `Thought: le Commandant interroge l'état temporel.\nAction: check_divergence({})\nObservation:\nAnswer:`;
  }
  if (/\b(archiv|mémoir|souvenir|memory|cherch)\b/i.test(text)) {
    const q = text.split(/\s+/).filter(Boolean).pop() || "mission";
    return `Thought: consultation des archives.\nAction: search_memory(${JSON.stringify({ query: q })})\nObservation:\nAnswer:`;
  }
  const others = Object.keys(FUTUREMEN).filter((k) => k !== "michael" && k !== agentId);
  const otherId = others.find((id) => lower.includes(id));
  if (otherId && /\b(avis|pense|demande|consulte|voir)\b/i.test(lower)) {
    return `Thought: solliciter un pair.\nAction: ask_agent(${JSON.stringify({
      agent_id: otherId,
      question: text.slice(0, 400)
    })})\nObservation:\nAnswer:`;
  }
  const answer = `${m.nom} (${m.fm}) — **mode local** (sans API). Registre : ${m.registre.slice(0, 220)}${m.registre.length > 220 ? "…" : ""}\n\nOrdre : « ${text.slice(0, 320)}${text.length > 320 ? "…" : ""} »`;
  return `Thought: synthèse locale.\nAction: none\nAnswer: ${answer}`;
}

function reactBuildLocalAfterObservation(agentId, observationBlock) {
  const m = reactGetAgentMeta(agentId);
  const obs = String(observationBlock || "").trim().slice(0, 700);
  return `Thought: intégration observation.\nAction: none\nAnswer: ${m?.nom || agentId} — synthèse : ${obs}${obs.length >= 700 ? "…" : ""}\n\n_(Réponse locale.)_`;
}

async function reactCallLLM(provider, system, messages, agentIdForLocal = null) {
  const prov = String(provider || "local").toLowerCase();
  if (prov !== "local") {
    throw new Error(
      'ReAct Node : seul le provider "local" est supporté. Pour le LLM réel, utilisez le menu 15 (ReAct / LLM), --openclaw-react, ou ReactOps.printOpenClawHarness (règle .cursor/rules/futuremen-openclaw.mdc).'
    );
  }
  await new Promise((r) => setTimeout(r, 25));
  const aid = agentIdForLocal || "nova";
  const lastUser = reactLastUserContent(messages);
  if (/Observation:\s*\S/is.test(lastUser) && /formule ta réponse finale/i.test(lastUser)) {
    const mm = lastUser.match(/Observation:\s*([\s\S]*?)(?=\n\nMaintenant|$)/i);
    const obs = mm ? mm[1].trim() : "";
    return reactBuildLocalAfterObservation(aid, obs);
  }
  return reactBuildLocalFirstPass(aid, lastUser);
}

function reactSearchMemoryFile(query) {
  const q = String(query || "")
    .toLowerCase()
    .trim();
  if (!q) return "";
  const fp = path.join(__dirname, "Memory.md");
  if (!fs.existsSync(fp)) return "";
  try {
    const lines = fs.readFileSync(fp, "utf8").split("\n");
    const hits = lines
      .map((line, i) => ({ i: i + 1, line }))
      .filter((x) => x.line.toLowerCase().includes(q))
      .slice(-12);
    if (hits.length === 0) return "";
    return hits.map((h) => `L${h.i}: ${h.line.slice(0, 160)}`).join("\n");
  } catch {
    return "";
  }
}

async function reactExecuteTool(tool, args, ctx) {
  const { agentId, purity, divergence, sharedMemory, onSubCall } = ctx;
  const mem = Array.isArray(sharedMemory) ? sharedMemory : [];
  switch (tool) {
    case "ask_agent": {
      const targetId = String(args.agent_id || "")
        .toLowerCase()
        .trim();
      const question = args.question || "";
      if (!reactGetAgentMeta(targetId)) return `Agent "${targetId}" introuvable ou non interrogeable.`;
      if (typeof onSubCall !== "function") return "(ask_agent : pas de bus inter-agents configuré.)";
      return await onSubCall(targetId, question, agentId);
    }
    case "search_memory": {
      const q = String(args.query || "").toLowerCase();
      const fromSession = mem
        .filter((m) => m.content.toLowerCase().includes(q) || String(m.agent).toLowerCase().includes(q))
        .slice(-4);
      let out = "";
      if (fromSession.length) {
        out = fromSession.map((h) => `[${h.agent}]: ${h.content.slice(0, 200)}`).join("\n---\n");
      }
      const fileHits = reactSearchMemoryFile(q);
      if (fileHits) {
        out += (out ? "\n--- Memory.md ---\n" : "") + fileHits;
      }
      return out || "Aucune entrée trouvée (session + Memory.md).";
    }
    case "check_divergence": {
      const d = Number(divergence);
      return `Divergence (session) : ${d.toFixed(4)}% | Seuil : 0,0700% | Statut : ${
        d < 0.07 ? "NOMINAL" : "CRITIQUE — rollback requis (protocole 5)"
      } | Pureté Venardi : ${(Number(purity) * 100).toFixed(1)}%`;
    }
    case "record_progress": {
      Futuremen.recordProgress({
        mission: args.mission || "ReAct / ops",
        agents: [reactGetAgentMeta(agentId)?.nom || agentId, "Olga"],
        divergence: 0,
        description: String(args.description || "").slice(0, 400),
        status: "ok"
      });
      return `Progress enregistré (protocole 7) : mission="${args.mission || "N/A"}"`;
    }
    default:
      return `Outil inconnu : ${tool}`;
  }
}

/**
 * Une boucle ReAct (1er appel + optionnel 2e après outil).
 * @param {string} agentId — clé FUTUREMEN (hors michael)
 * @param {string} userMsg
 * @param {Array<{role:string,content:string}>} conversationHistory
 * @param {object} opts
 * @param {"local"} [opts.provider="local"] — seul mode Node ; LLM hôte via printOpenClawHarness / menu 15 (ReAct / LLM)
 * @param {number} [opts.purity]
 * @param {number} [opts.divergence=0]
 * @param {Array} [opts.sharedMemory=[]]
 * @param {function(string,string,string):Promise<string>} [opts.onSubCall]
 * @param {function(object):void} [opts.onTrace]
 */
async function reactRunReActAgent(agentId, userMsg, conversationHistory, opts = {}) {
  const provider = String(opts.provider || "local").toLowerCase();
  const purity = opts.purity != null ? opts.purity : Venardi.egregorePurity;
  const divergence = opts.divergence != null ? opts.divergence : 0;
  const sharedMemory = Array.isArray(opts.sharedMemory) ? opts.sharedMemory : [];
  const onSubCall = opts.onSubCall;
  const onTrace = typeof opts.onTrace === "function" ? opts.onTrace : () => {};

  if (!reactGetAgentMeta(agentId)) {
    throw new Error(`Agent inconnu ou michael (réservé Commandant) : ${agentId}`);
  }

  const system = reactBuildSystemPrompt(agentId, purity, divergence, sharedMemory);
  const messages = [...conversationHistory, { role: "user", content: userMsg }];

  onTrace({ type: "start", agent: agentId, msg: userMsg });

  let rawResponse = await reactCallLLM(provider, system, messages, agentId);
  let parsed = reactParseReAct(rawResponse);
  onTrace({ type: "thought", agent: agentId, content: parsed.thought || "…" });

  if (parsed.action) {
    onTrace({ type: "action", agent: agentId, tool: parsed.action.tool, args: parsed.action.args });
    const observation = await reactExecuteTool(parsed.action.tool, parsed.action.args || {}, {
      agentId,
      purity,
      divergence,
      sharedMemory,
      onSubCall
    });
    onTrace({ type: "observation", agent: agentId, content: observation });
    const messages2 = [
      ...messages,
      { role: "assistant", content: rawResponse },
      {
        role: "user",
        content: `Observation: ${observation}\n\nMaintenant formule ta réponse finale (Answer:).`
      }
    ];
    rawResponse = await reactCallLLM(provider, system, messages2, agentId);
    parsed = reactParseReAct(rawResponse);
  }

  const finalAnswer = parsed.answer || rawResponse;
  onTrace({ type: "answer", agent: agentId, content: finalAnswer });
  return finalAnswer;
}

async function reactOnSubCallSelfTest(targetId, question, fromId) {
  const purity = Venardi.egregorePurity;
  const divergence = 0.02;
  const sys = reactBuildSystemPrompt(targetId, purity, divergence, []);
  const raw = await reactCallLLM(
    "local",
    sys,
    [{ role: "user", content: `[Message de ${fromId}] : ${question}` }],
    targetId
  );
  const p = reactParseReAct(raw);
  return p.answer || raw;
}

/**
 * Affiche un couple system / user aligné sur ReactOps, pour sessions **OpenClaw ou Cursor**
 * où le LLM hôte remplace Grok/Claude (aucune clé API dans Node).
 * @returns {{ system: string, user: string, agentId: string } | null}
 */
function reactPrintOpenClawHarness(agentId, userMessage = "") {
  const key = String(agentId || "")
    .toLowerCase()
    .trim();
  if (!reactGetAgentMeta(key)) {
    console.log(
      `❌ Agent ReAct inconnu ou réservé Commandant (michael). Agents : ${Object.keys(FUTUREMEN)
        .filter((k) => k !== "michael")
        .join(", ")}`
    );
    return null;
  }
  const purity = Venardi.egregorePurity;
  const divergence = 0;
  const system = reactBuildSystemPrompt(key, purity, divergence, []);
  const msg =
    String(userMessage || "").trim() ||
    "(aucun message du Commandant — propose une ouverture dans ton registre.)";
  const block = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
REACT — SESSION OPENCLAW / CURSOR (LLM hôte = toi, pas d’API distante)
Agent : ${key}  |  Pureté Venardi : ${(Number(purity) * 100).toFixed(1)}%  |  Divergence session : ${Number(divergence).toFixed(4)}%
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Outils à simuler dans ta tête ou via le workspace : ask_agent, search_memory (Memory.md),
check_divergence, record_progress (décris l’entrée ou exécute du Node si besoin).

--- SYSTEM (à respecter comme consigne de rôle) ---

${system}

--- USER (ordre du Commandant) ---

${msg}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Réponds dans le format ReAct du SYSTEM (Thought / Action / Observation si outil / Answer).
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`;
  console.log(block);
  return { system, user: msg, agentId: key };
}

/** Tests ReAct en mode local (sans sous-processus ni require circulaire). */
async function reactRunLocalSelfTest() {
  const onSubCall = (targetId, question, fromId) => reactOnSubCallSelfTest(targetId, question, fromId);

  console.log("=== Tests ReactOps (provider: local) ===\n");

  const pr = reactParseReAct("Thought: analyse\nAction: none\nAnswer: Salut Commandant.");
  const okParse = pr.answer === "Salut Commandant." && !pr.action;
  console.log(okParse ? "✓ parseReAct" : "✗ parseReAct", pr);

  console.log("\n--- runReActAgent : vortex + mot-clé divergence ---");
  const ans1 = await reactRunReActAgent("vortex", "Quelle est notre divergence par rapport au seuil ?", [], {
    provider: "local",
    purity: Venardi.egregorePurity,
    divergence: 0.02,
    sharedMemory: [],
    onSubCall,
    onTrace: (t) => console.log(`  [trace ${t.type}]`, (t.content || t.msg || "").slice(0, 90))
  });
  console.log("Réponse (extrait) :\n", ans1.slice(0, 500));

  console.log("\n--- runReActAgent : nova, message générique ---");
  const ans2 = await reactRunReActAgent("nova", "Rapport de situation sur Mandela-2013.", [], {
    provider: "local",
    onSubCall,
    onTrace: (t) => console.log(`  [trace ${t.type}]`, (t.content || t.msg || "").slice(0, 90))
  });
  console.log("Réponse (extrait) :\n", ans2.slice(0, 500));

  console.log("\n=== Tous les tests locaux ont terminé sans erreur. ===");
}

const ReactOps = {
  REACT_TOOLS,
  getAgentMeta: reactGetAgentMeta,
  buildSystemPrompt: reactBuildSystemPrompt,
  parseReAct: reactParseReAct,
  callLLM: reactCallLLM,
  executeTool: reactExecuteTool,
  runReActAgent: reactRunReActAgent,
  runLocalSelfTest: reactRunLocalSelfTest,
  searchMemoryFile: reactSearchMemoryFile,
  listAgentIds: () => Object.keys(FUTUREMEN).filter((k) => k !== "michael"),
  printOpenClawHarness: reactPrintOpenClawHarness
};

// ================================================
// MENUS INTERACTIFS
// ================================================
function menuPrompts() {
  console.log("\n=== GÉNÉRATEUR DE PROMPTS GROK IMAGINE ===");
  console.log("1) Scène de Briefing au QG");
  console.log("2) Scène de Saut temporel");
  console.log("3) Scène d'Action dans une époque");
  console.log("4) Retour au menu principal");

  rl.question("\nChoix (1-4) : ", (choix) => {
    switch (choix.trim()) {
      case "1":
        rl.question("Nom de la mission ? (ex: Réveil Égrégore 2027) : ", (mission) => {
          generateImaginePrompt("briefing", mission);
          setTimeout(menuPrompts, 2000);
        });
        break;
      case "2":
        rl.question("ID ou nom de l'agent (ex: echo, anna, nova) : ", (agentId) => {
          generateImaginePrompt("saut", agentId);
          setTimeout(menuPrompts, 2000);
        });
        break;
      case "3":
        rl.question("ID ou nom de l'agent : ", (agentId) => {
          rl.question("Époque (ex: 1969 Woodstock) : ", (epoque) => {
            rl.question("Objectif de la mission : ", (objectif) => {
              generateImaginePrompt("action", agentId, epoque, objectif);
              setTimeout(menuPrompts, 2000);
            });
          });
        });
        break;
      case "4":
        menuPrincipal();
        break;
      default:
        console.log("Choix invalide.");
        setTimeout(menuPrompts, 1000);
    }
  });
}

function menuVenardiCalendar() {
  console.log("\n=== VENARDI — CALENDRIER & FUSION TICKS / DATES ===");
  console.log("Date simulée :", Venardi.simulatedDateISO(), "| Tâches enregistrées :", Venardi.calendar.length);
  console.log("1) Planifier une tâche (ISO, mode réel OpenClaw ou simulation)");
  console.log("2) Lister les tâches");
  console.log("3) Tâches dues (maintenant)");
  console.log("4) Fusion : avancer les ticks jusqu’à une date ISO");
  console.log("5) Clôturer une tâche (id)");
  console.log("6) Initialiser l’ancre sur la date du jour (UTC, ticks → 0)");
  console.log("7) Synchroniser le baromètre via le web (sync — guide des topics)");
  console.log("8) Retour au menu principal");

  rl.question("Choix (1-8) : ", (c) => {
    switch (c.trim()) {
      case "1":
        rl.question("Date ISO (YYYY-MM-DD) : ", (d) => {
          rl.question("Titre / mission : ", (title) => {
            rl.question("Note (optionnel, Enter skip) : ", (note) => {
              rl.question("Mode : r=réel (wall-clock OpenClaw), s=simulation Venardi [r] : ", (m) => {
                const mode = /^s/i.test(m) ? "simulation" : "real";
                rl.question("À l’exécution, avancer les ticks jusqu’à cette date ? o/N : ", (adv) => {
                  Venardi.scheduleTask({
                    dateISO: d,
                    title,
                    note: note || "",
                    mode,
                    advanceTicksOnExecute: /^o/i.test(adv || "")
                  });
                  setTimeout(menuVenardiCalendar, 400);
                });
              });
            });
          });
        });
        break;
      case "2":
        console.table(Venardi.listCalendarTasks());
        setTimeout(menuVenardiCalendar, 600);
        break;
      case "3":
        console.log("Horloge réelle (UTC date) :", new Date().toISOString().slice(0, 10));
        console.log("Date simulée Venardi :", Venardi.simulatedDateISO());
        console.table(Venardi.listDueCalendarTasks());
        setTimeout(menuVenardiCalendar, 600);
        break;
      case "4":
        rl.question("Date ISO cible (YYYY-MM-DD) : ", (d) => {
          rl.question("Description de l’événement : ", (desc) => {
            Venardi.simulateTicksUntilCalendarDate(d, desc || "Fusion calendrier");
            setTimeout(menuVenardiCalendar, 800);
          });
        });
        break;
      case "5":
        rl.question("ID tâche à clôturer : ", (id) => {
          if (Venardi.completeCalendarTask(id)) console.log("Tâche clôturée.");
          else console.log("ID introuvable.");
          setTimeout(menuVenardiCalendar, 400);
        });
        break;
      case "6":
        rl.question("Ancre = aujourd’hui (UTC), remettre les ticks à 0 (pureté et tâches inchangées) ? o/N : ", (a) => {
          if (/^o/i.test((a || "").trim())) Venardi.initCalendarToToday({ resetTicks: true });
          setTimeout(menuVenardiCalendar, 400);
        });
        break;
      case "7":
        Futuremen.printBarometerSyncGuide();
        rl.question("\nEntrez le JSON de sync (ou Enter pour revenir) : ", (jsonLine) => {
          if (jsonLine.trim()) {
            try {
              const data = JSON.parse(jsonLine.trim());
              Futuremen.syncBarometerFromWeb(data);
            } catch (e) {
              console.error("JSON invalide.");
            }
          }
          setTimeout(menuVenardiCalendar, 600);
        });
        break;
      case "8":
        menuPrincipal();
        break;
      default:
        menuVenardiCalendar();
    }
  });
}

function menuPhonographe() {
  console.log("\n=== PHONOGRAPHE URBAIN — équipe musicale (11) ===");
  if (!Futuremen.hasPhonographe()) {
    console.log(
      "Module absent. Attendu : phonographe-embedded.js à la racine du dépôt."
    );
    setTimeout(menuPrincipal, 1500);
    return;
  }
  console.log("1) Lister l'équipe Phonographe");
  console.log("2) Protocoles éditoriaux Phonographe");
  console.log("3) Simuler un agent Phonographe (prompt dialogue)");
  console.log("4) Prompt image — briefing semaine (Étienne & équipe)");
  console.log("5) Prompt image — scène chronique (clé agent)");
  console.log("6) ReAct / LLM — harnais Phonographe (une question à un agent)");
  console.log("7) Retour menu principal");

  rl.question("Choix (1-7) : ", (c) => {
    switch (c.trim()) {
      case "1":
        Futuremen.listPhonographeTeam();
        setTimeout(menuPhonographe, 1500);
        break;
      case "2":
        Futuremen.showPhonographeProtocols();
        setTimeout(menuPhonographe, 1500);
        break;
      case "3":
        rl.question(
          "Clé agent (etienne, clara, jonas, paola, deborah, moussa, lea, victor, isabella, theo, sofia) : ",
          (id) => {
            rl.question("Message (optionnel) : ", (msg) => {
              Futuremen.simulatePhonographeAgent(id, msg);
              setTimeout(menuPhonographe, 1500);
            });
          }
        );
        break;
      case "4":
        rl.question("Libellé semaine (ex. 2026-04-30) : ", (s) => {
          phono.generateImaginePrompt("briefing", s || "semaine en cours");
          setTimeout(menuPhonographe, 1500);
        });
        break;
      case "5":
        rl.question("Clé agent : ", (id) => {
          phono.generateImaginePrompt("chronique", id);
          setTimeout(menuPhonographe, 1500);
        });
        break;
      case "6":
        console.log("\n=== Phonographe ReAct / LLM — harnais pour Cursor / OpenClaw ===");
        console.log("Agents : " + Object.keys(PHONOGRAPHE_TEAM).join(", "));
        rl.question("Agent (id) : ", (agentRaw) => {
          const agentId = String(agentRaw || "").trim().toLowerCase();
          rl.question("Message rédaction / lecteur : ", (userRaw) => {
            const userMsg = String(userRaw || "").trim();
            if (!userMsg) {
              console.log("Message vide — annulé.");
              setTimeout(menuPhonographe, 800);
              return;
            }
            const r = Futuremen.printPhonographeReActHarness(agentId, userMsg);
            if (!r) {
              setTimeout(menuPhonographe, 1200);
              return;
            }
            console.log(
              "\n--- Collez le bloc « REACT — PHONOGRAPHE URBAIN » dans Cursor / OpenClaw ; le modèle applique le format Thought / Action / Answer. ---\n"
            );
            setTimeout(menuPhonographe, 1800);
          });
        });
        break;
      case "7":
        menuPrincipal();
        break;
      default:
        menuPhonographe();
    }
  });
}

function menuPrincipal() {
  console.clear();
  console.log("=====================================");
  console.log("     FUTUREMEN COMMAND CENTER 2026    ");
  console.log("=====================================");
  console.log("1) Lister les agents (détail)");
  console.log("2) Téléporter un agent");
  console.log("3) Téléporter toute l'équipe");
  console.log("4) Lancer une mission");
  console.log("5) Générer prompts Grok Imagine");
  console.log("6) Lore & événements clés");
  console.log("7) Protocoles anti-paradoxes");
  console.log("8) Journal de progression");
  console.log("9) Simuler un agent (prompt dialogue)");
  console.log("10) Venardi : Afficher le Baromètre");
  console.log("11) Venardi : Simuler des ticks");
  console.log("12) Venardi : Recruter un Flibustier (Agent indép.)");
  console.log("13) Olga : Délégation validation (oui/non) + checklist");
  console.log("14) Venardi : Calendrier & fusion ticks ↔ dates");
  console.log("15) ReAct / LLM — harnais pour Cursor / OpenClaw (une question à un agent)");
  console.log(
    "16) Phonographe Urbain — équipe musicale (11) " + (Futuremen.hasPhonographe() ? "" : "[module absent]")
  );
  console.log("17) Quitter");
  console.log("=====================================");

  try {
    rl.question("Ton choix (1-17) : ", (choix) => {
    switch (choix.trim()) {
      case "1":
        Futuremen.listTeam();
        setTimeout(menuPrincipal, 1500);
        break;
      case "2":
        rl.question("Agent à téléporter (id ou nom) : ", (id) => {
          teleportAgent(id);
          setTimeout(menuPrincipal, 1500);
        });
        break;
      case "3":
        teleportAll();
        setTimeout(menuPrincipal, 1500);
        break;
      case "4":
        rl.question("Nom de la mission (Enter pour défaut) : ", (name) => {
          console.log(launchMission(name || undefined));
          setTimeout(menuPrincipal, 1500);
        });
        break;
      case "5":
        menuPrompts();
        break;
      case "6":
        Futuremen.showLore();
        setTimeout(menuPrincipal, 1500);
        break;
      case "7":
        Futuremen.showProtocols();
        setTimeout(menuPrincipal, 1500);
        break;
      case "8":
        Futuremen.showProgress(20);
        setTimeout(menuPrincipal, 1500);
        break;
      case "9":
        rl.question("Agent (michael, nova, circuit, echo, …) : ", (id) => {
          rl.question("Message du Commandant (optionnel, Enter pour ouverture) : ", (msg) => {
            simulateAgentPrompt(id, msg);
            setTimeout(menuPrincipal, 1500);
          });
        });
        break;
      case "10":
        Venardi.showBarometer();
        setTimeout(menuPrincipal, 2500);
        break;
      case "11":
        rl.question("Nombre de ticks à simuler (ex: 2000) : ", (ticks) => {
          rl.question("Description de l'événement : ", (desc) => {
            Venardi.simulateTicks(parseInt(ticks, 10) || 0, desc);
            setTimeout(menuPrincipal, 2500);
          });
        });
        break;
      case "12":
        console.log("\n=== RECRUTEMENT D'UN FLIBUSTIER VENARDI ===");
        rl.question("ID court (ex: corsaire1) : ", (id) => {
          rl.question("Nom complet : ", (nom) => {
            rl.question("Rôle / Description : ", (role) => {
              rl.question("Influence sur la pureté (ex: 0.15) : ", (influence) => {
                Venardi.addFlibustier(id, nom, role, influence);
                setTimeout(menuPrincipal, 2500);
              });
            });
          });
        });
        break;
      case "13":
        console.log("\n--- Olga — validation (Michael délègue ou non, puis checklist) ---");
        console.log("État actuel : délégation =", Futuremen.getValidationDelegation().delegatedToOlga ? "OUI" : "NON");
        rl.question("Déléguer la validation automatique à Olga pour cette session ? (o/N) : ", (a) => {
          const yes = /^o/i.test((a || "").trim());
          Futuremen.setValidationDelegation(yes);
          if (yes) {
            rl.question("Résumé court de la dernière tâche (optionnel, Enter pour skip) : ", (mission) => {
              console.log("Exemple : appelez Futuremen.runOlgaAutoValidation({ mission, protocolesRespectes: true, ... }) depuis du code,");
              console.log("ou complétez manuellement la checklist ci-dessous (tout ✓ par défaut pour démo) :");
              Futuremen.runOlgaAutoValidation({
                mission: mission || "(non spécifié)",
                protocolesRespectes: true,
                divergenceSousSeuil: true,
                journalOuMemorySiRequis: true,
                pasDeSecrets: true,
                livrableComplet: true
              });
              setTimeout(menuPrincipal, 1500);
            });
          } else {
            setTimeout(menuPrincipal, 800);
          }
        });
        break;
      case "14":
        menuVenardiCalendar();
        break;
      case "15":
        console.log("\n=== ReAct / LLM — harnais pour Cursor / OpenClaw (règle projet) ===");
        console.log(
          "Un bloc system+user sera affiché : collez-le dans le chat assistant (.cursor/rules/futuremen-openclaw.mdc)."
        );
        console.log("Agents : " + ReactOps.listAgentIds().join(", "));
        rl.question("Agent (id) : ", (agentRaw) => {
          const agentId = String(agentRaw || "")
            .trim()
            .toLowerCase();
          rl.question("Message du Commandant : ", (userRaw) => {
            const userMsg = String(userRaw || "").trim();
            if (!userMsg) {
              console.log("Message vide — annulé.");
              setTimeout(menuPrincipal, 800);
              return;
            }
            const r = ReactOps.printOpenClawHarness(agentId, userMsg);
            if (!r) {
              setTimeout(menuPrincipal, 1200);
              return;
            }
            console.log(
              "\n--- Collez le bloc « REACT — SESSION OPENCLAW » dans Cursor / OpenClaw ; le modèle applique la règle Futuremen (ReAct sans API Node). ---\n"
            );
            setTimeout(menuPrincipal, 1800);
          });
        });
        break;
      case "16":
        menuPhonographe();
        break;
      case "17":
        rl.close();
        console.log("Déconnexion... À bientôt Commandant.");
        break;
      default:
        menuPrincipal();
    }
  });
  } catch (e) {
    if (e && e.code === "ERR_USE_AFTER_CLOSE") {
      if (!process.stdin.isTTY) process.exit(0);
      return;
    }
    throw e;
  }
}

Futuremen.loadProgress();

if (require.main === module) {
  const argv = process.argv.slice(2);
  const simReact = argv.some((a) =>
    ["--test-react", "--simulate-react", "--simuler-react"].includes(String(a).toLowerCase())
  );
  const idxHarness = argv.findIndex((a) =>
    ["--openclaw-react", "--react-openclaw"].includes(String(a).toLowerCase())
  );
  const wantHelp = argv.some((a) => ["--help", "-h"].includes(String(a).toLowerCase()));
  const wantHb = argv.some((a) =>
    ["--heartbeat", "--openclaw-heartbeat", "--pulsation-openclaw"].includes(String(a).toLowerCase())
  );
  const wantHbCron = argv.some((a) =>
    ["--heartbeat-with-cron", "--heartbeat-cron"].includes(String(a).toLowerCase())
  );
  const wantCronSnippet = argv.some((a) =>
    ["--cron-snippet", "--heartbeat-cron-snippet"].includes(String(a).toLowerCase())
  );
  const wantCronModifier = argv.some((a) =>
    ["--cron", "--with-cron"].includes(String(a).toLowerCase())
  );
  const runHeartbeat = wantHb || wantHbCron;
  const cronGuide =
    wantHbCron || (wantHb && (wantCronModifier || wantCronSnippet));
  const cronSnippetOnly = wantCronSnippet && !runHeartbeat;
  const wantPhonoList = argv.some((a) =>
    ["--phonographe-list", "--phono-list", "--list-phonographe"].includes(String(a).toLowerCase())
  );
  const idxPhonoSim = argv.findIndex((a) =>
    ["--phonographe-sim", "--phono-sim", "--simuler-phonographe"].includes(String(a).toLowerCase())
  );
  const idxPhonoReact = argv.findIndex((a) =>
    ["--phonographe-react", "--phono-react", "--react-phonographe"].includes(String(a).toLowerCase())
  );
  const idxSyncBarometer = argv.findIndex((a) =>
    ["--sync-barometer", "--barometer-sync", "--sync-barometre", "--sync-all"].includes(String(a).toLowerCase())
  );

  if (wantHelp) {
    console.log("Usage : node futuremen-core.js [options]\n");
    console.log("  (sans option)     Menu interactif readline");
    console.log("  --test-react      Simule ReAct en mode local (sans API) puis quitte");
    console.log("  --simulate-react  idem");
    console.log("  --simuler-react   idem (alias FR)");
    console.log(
      "  --openclaw-react <agent> [message...]  Prompt ReAct pour LLM hôte (OpenClaw/Cursor), sans API"
    );
    console.log("  --react-openclaw  idem (alias)");
    console.log("  --heartbeat       Pouls OpenClaw (Venardi + tâches dues) — voir HEARTBEAT.md");
    console.log("  --openclaw-heartbeat  idem (alias)");
    console.log(
      "  --heartbeat-with-cron  Pouls + bloc crontab suggéré (alias : --heartbeat-cron)"
    );
    console.log(
      "  --heartbeat --cron | --with-cron | --cron-snippet  → pouls + même bloc crontab"
    );
    console.log(
      "  --cron-snippet    Affiche uniquement le bloc crontab (sans métriques heartbeat)"
    );
    console.log(
      "  --phonographe-list                     Liste les 11 agents du Phonographe Urbain (équipe musicale)"
    );
    console.log("  --phono-list / --list-phonographe   alias");
    console.log(
      "  --phonographe-sim <agent> [message...]  Bloc persona Phonographe à coller dans un LLM"
    );
    console.log("  --phono-sim / --simuler-phonographe  alias");
    console.log(
      "  --phonographe-react <agent> [message...]  Harnais ReAct Phonographe pour LLM hôte"
    );
    console.log("  --phono-react / --react-phonographe  alias");
    console.log(
      "  --sync-barometer [JSON]  Synchronise les baromètres (core + Raven) à partir de données web"
    );
    console.log("    Sans argument : affiche le guide des topics à chercher sur le web");
    console.log("    Avec JSON     : exécute la synchronisation (ex: '{\"topics\":{\"Ormuz\":{\"stability\":15}}}')");
    console.log("  --barometer-sync / --sync-barometre / --sync-all  alias");
    console.log("  -h, --help        Cette aide\n");
    process.exit(0);
  }

  if (cronSnippetOnly) {
    Futuremen.printHeartbeatCronGuide();
    process.exit(0);
  }

  if (runHeartbeat) {
    Futuremen.openClawHeartbeat({ cronGuide });
    process.exit(0);
  }

  if (wantPhonoList) {
    if (!Futuremen.hasPhonographe()) {
      console.error(
        "Module Phonographe absent — phonographe-embedded.js introuvable ou erreur au chargement."
      );
      process.exit(1);
    }
    Futuremen.listPhonographeTeam();
    process.exit(0);
  }

  if (idxPhonoSim !== -1) {
    const agentArg = argv[idxPhonoSim + 1];
    const msgParts = argv.slice(idxPhonoSim + 2);
    const phonoMsg = msgParts.join(" ").trim();
    if (!agentArg) {
      console.error("Usage : node futuremen-core.js --phonographe-sim <agent> [message]");
      process.exit(1);
    }
    if (!Futuremen.hasPhonographe()) {
      console.error("Module Phonographe absent.");
      process.exit(1);
    }
    const r = Futuremen.simulatePhonographeAgent(agentArg, phonoMsg);
    process.exit(r ? 0 : 1);
  }

  if (idxPhonoReact !== -1) {
    const agentArg = argv[idxPhonoReact + 1];
    const msgParts = argv.slice(idxPhonoReact + 2);
    const phonoMsg = msgParts.join(" ").trim();
    if (!agentArg) {
      console.error("Usage : node futuremen-core.js --phonographe-react <agent> [message]");
      process.exit(1);
    }
    if (!Futuremen.hasPhonographe()) {
      console.error("Module Phonographe absent.");
      process.exit(1);
    }
    const r = Futuremen.printPhonographeReActHarness(agentArg, phonoMsg);
    process.exit(r ? 0 : 1);
  }

  if (idxHarness !== -1) {
    const agentArg = argv[idxHarness + 1];
    const msgParts = argv.slice(idxHarness + 2);
    const harnessMsg = msgParts.join(" ").trim();
    if (!agentArg) {
      console.error("Usage : node futuremen-core.js --openclaw-react <agent> [message du Commandant]");
      process.exit(1);
    }
    const r = ReactOps.printOpenClawHarness(agentArg, harnessMsg);
    process.exit(r ? 0 : 1);
  }

  if (idxSyncBarometer !== -1) {
    const jsonArg = argv.slice(idxSyncBarometer + 1).join(" ").trim();
    if (!jsonArg) {
      Futuremen.printBarometerSyncGuide();
      process.exit(0);
    }
    let data;
    try {
      data = JSON.parse(jsonArg);
    } catch (e) {
      console.error("JSON invalide. Utilisez des guillemets simples autour du JSON.");
      console.error("Exemple : node futuremen-core.js --sync-barometer '{\"topics\":{...}}'");
      process.exit(1);
    }
    Futuremen.syncBarometerFromWeb(data);
    process.exit(0);
  }

  if (simReact) {
    (async () => {
      try {
        await ReactOps.runLocalSelfTest();
        console.log("\n✓ Simulation ReAct (local) terminée — code 0.");
        process.exit(0);
      } catch (e) {
        console.error("\n✗ Simulation ReAct :", e.message || e);
        process.exit(1);
      }
    })();
  } else {
    console.log("🌌 FUTUREMEN – Command Center + Grok Imagine + Lore / Protocoles / Journal");
    console.log("Mars 2026 – Prêt à forger les timelines");
    if (Futuremen.hasPhonographe()) {
      console.log("📻 Phonographe Urbain actif (phonographe-embedded.js) — menu 16, --phonographe-list.");
    }
    console.log(
      "\nAstuce : --heartbeat  |  --heartbeat-with-cron  |  --cron-snippet  |  --test-react  |  --openclaw-react <agent> « … »  |  --phonographe-list\n"
    );
    menuPrincipal();
  }
}

module.exports = {
  Futuremen,
  FUTUREMEN,
  SCENE_TEMPLATES,
  SIMULATION_REGISTRE,
  Venardi,
  ReactOps,
  teleportAgent,
  teleportAll,
  launchMission,
  generateImaginePrompt,
  simulateAgentPrompt,
  printOpenClawReActHarness: reactPrintOpenClawHarness,

  // Égrégore dynamique — source de vérité unique (raven-state.json)
  readEgregoreState: () => Venardi.readEgregoreState(),
  writeEgregoreState: (data) => Venardi.writeEgregoreState(data),
  syncEgregoreFromState: (verbose) => Venardi.syncEgregoreFromState(verbose),

  // Pont Phonographe Urbain — équipe musicale 11 membres (peut être null si module absent)
  Phonographe: phono ? phono.Phonographe : null,
  PHONOGRAPHE_TEAM,
  PHONOGRAPHE_REGISTRE,
  PhonographeReactOps: phono ? phono.PhonographeReactOps : null,
  phonographeModule: phono,
  simulatePhonographeAgent: (id, msg) => Futuremen.simulatePhonographeAgent(id, msg),
  printPhonographeReActHarness: (id, msg) => Futuremen.printPhonographeReActHarness(id, msg),
  generatePhonographeImaginePrompt: (type, ...args) =>
    phono ? phono.generateImaginePrompt(type, ...args) : null,

  // Web Sync — synchronisation des baromètres core + Raven
  printBarometerSyncGuide: () => Futuremen.printBarometerSyncGuide(),
  syncBarometerFromWeb: (data) => Futuremen.syncBarometerFromWeb(data),

  // Raven Index — pont vers VenardiFramework v2.3 (injection daily updates)
  Raven: (() => {
    try {
      const vf = require('./VenardiFramework_v2.3_raven.js');
      vf.init('COMPLET');
      return {
        framework: vf,
        applyDailyUpdates: (date) => vf.applyDailyUpdates(date),
        getCurrentData:    () => vf.getCurrentData(),
        getRavenModule:    () => vf.getRavenModule(),
        getProjections:    () => vf.getProjections(),
        showCurrentData:   () => vf.showCurrentData(),
        showGrandGel:      () => vf.showGrandGelProjection(),
        listKeys:          () => vf.listDailyUpdateKeys()
      };
    } catch(e) {
      return null;
    }
  })()
};

// ── Égrégore dynamique — application de la source de vérité au démarrage ──
try {
  Venardi.syncEgregoreFromState(true);
} catch (_e) {
  /* non bloquant : repli sur constante */
}