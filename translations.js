
/* =============================================
   AUSTRIAN AIRLINES FLIGHT OPERATIONS
   V1.3.0 — TRANSLATIONS
   English / Deutsch / Français
   ============================================= */

window.AFO_TRANSLATIONS = {

  // ===========================================
  // ENGLISH
  // ===========================================

  en: {

    // Navigation
    "nav.home": "Home",
    "nav.miles": "Miles & More",
    "nav.atc24": "ATC24",
    "nav.events": "Event Flights",
    "nav.academy": "Academy",
    "nav.admin": "Admin",

    // Authentication
    "auth.login": "Login with Discord",
    "auth.logout": "Logout",

    // Home
    "home.title": "Flight Operations.",
    "home.description": "Run your scheduled flights, join special Event Flights and build your Miles & More status — all in one place.",
    "home.atc24": "View ATC24 Flights",
    "home.events": "View Event Flights",

    // Miles & More
    "miles.title": "💳 Miles & More",
    "miles.description": "Your Event Flight rewards, Points and current status.",
    "miles.login": "Sign in to view your Miles & More profile.",
    "miles.track": "Track Miles, Points and your current status.",
    "miles.balance": "Miles",
    "miles.points": "Points",
    "miles.status": "Status",
    "miles.lifetime": "Lifetime Miles",
    "miles.toNext": "{points} point(s) to {status}",
    "miles.highest": "Highest status reached",

    // ATC24
    "atc24.title": "✈️ Today's ATC24 Flights",
    "atc24.description": "Scheduled operations and claimable flights.",

    // Event Flights
    "events.title": "🌍 Event Flights",
    "events.description": "Book a seat and earn Miles & More Miles and Points after completing the flight.",

    // Flight cards
    "flight.one": "{count} flight",
    "flight.many": "{count} flights",
    "flight.noFlights": "No ATC24 flights available today.",
    "flight.checkLater": "Check back later for the next scheduled operation.",
    "flight.claim": "CLAIM FLIGHT",
    "flight.loginClaim": "LOGIN WITH DISCORD TO CLAIM",
    "flight.start": "START FLIGHT",
    "flight.pushback": "PUSHBACK",
    "flight.takeoff": "TAKEOFF",
    "flight.landing": "LANDING",
    "flight.end": "END FLIGHT",
    "flight.claimedByOther": "A pilot has claimed this flight.",
    "flight.operatedByOther": "A pilot is currently operating this flight.",
    "flight.completed": "Flight completed",
    "flight.departure": "Departure",
    "flight.aircraft": "Aircraft",
    "flight.operator": "Operator",
    "flight.livery": "Livery",
    "flight.startedAt": "Started",
    "flight.pushbackAt": "Pushback",
    "flight.takeoffAt": "Takeoff",
    "flight.landingAt": "Landing",
    "flight.completedAt": "Completed",
    "flight.approvalRequired": "Pilot Approved is required to claim ATC24 flights.",

    // Event bookings
    "event.one": "{count} event",
    "event.many": "{count} events",
    "event.noEvents": "No Event Flights are scheduled.",
    "event.newSoon": "New special operations will appear here.",
    "event.distance": "Distance",
    "event.economy": "Economy",
    "event.business": "Business",
    "event.first": "First",
    "event.bookEconomy": "BOOK ECONOMY",
    "event.bookBusiness": "BOOK BUSINESS — 20,000 MILES",
    "event.bookFirst": "BOOK FIRST — 100,000 MILES",
    "event.economyFull": "Economy full",
    "event.businessFull": "Business full",
    "event.firstFull": "First full",
    "event.loginBook": "LOGIN WITH DISCORD TO BOOK",
    "event.cancelled": "This Event Flight has been cancelled.",
    "event.finished": "This Event Flight is completed.",
    "event.booked": "Your booking",
    "event.checkedIn": "Checked in",
    "event.notCheckedIn": "Not checked in",
    "event.boarded": "Boarded",
    "event.notBoarded": "Not boarded",
    "event.checkIn": "CHECK IN",
    "event.board": "BOARD",
    "event.complete": "COMPLETE EVENT FLIGHT",
    "event.short": "Short-haul",
    "event.medium": "Medium-haul",
    "event.long": "Long-haul",
    "event.businessLocked": "Frequent Traveller status and 20,000 Miles required",
    "event.firstLocked": "Senator status and 100,000 Miles required",

    // Academy
    "academy.title": "🎓 Austrian Academy",
    "academy.description": "Applications, training and qualifications for our virtual pilots and ATC members.",
    "academy.pilot": "✈️ Pilot Academy",
    "academy.pilotDescription": "Apply for ATC24 or Event Flight pilot training.",
    "academy.atc": "📡 ATC Academy",
    "academy.atcDescription": "Apply to train as a virtual air traffic controller.",
    "academy.training": "📅 Training Sessions",
    "academy.trainingDescription": "View upcoming sessions and manage your training progress.",
    "academy.comingSoon": "Coming soon in V1.3.0",

    // Administration
    "admin.title": "🛠️ Administration",
    "admin.description": "Manage ATC24, Event Flights, Academy applications and training.",
    "admin.tabAtc24": "ATC24 Flights",
    "admin.tabEvents": "Event Flights",
    "admin.tabApplications": "Applications",
    "admin.tabTrainings": "Trainings",
    "admin.tabInstructors": "Instructors",
    "admin.atc24Heading": "ATC24 Flight Management",
    "admin.atc24Intro": "Create and manage scheduled ATC24 operations.",
    "admin.createAtc24": "CREATE ATC24 FLIGHT",
    "admin.existingAtc24": "Existing ATC24 Flights",
    "admin.eventsHeading": "Event Flight Management",
    "admin.eventsIntro": "Create, update and remove Event Flights.",
    "admin.pointsNote": "Points are automatic: Short-haul = 1, Medium-haul = 2, Long-haul = 3. Miles are entered manually; passengers receive rewards after completing the flight.",
    "admin.createEvent": "CREATE EVENT FLIGHT",
    "admin.existingEvents": "Existing Event Flights",
    "admin.applicationsHeading": "Academy Applications",
    "admin.trainingsHeading": "Academy Trainings",
    "admin.instructorsHeading": "Academy Instructors",
    "admin.comingSoon": "This management area will be activated when the Academy database functions are ready.",

    // Forms
    "form.flightNumber": "Flight Number — OS101",
    "form.departure": "Departure — VIE",
    "form.arrival": "Arrival — LHR",
    "form.aircraft": "Aircraft Model — Airbus A320",
    "form.operator": "Operator Airline — Austrian Airlines",
    "form.livery": "Livery Airline — Austrian Airlines",
    "form.once": "One-time flight",
    "form.daily": "Every day",
    "form.weekdays": "Monday–Friday",
    "form.weekends": "Saturday–Sunday",
    "form.additional": "Additional Information (optional)",
    "form.pilot": "Pilot Discord ID (optional)",
    "form.pilotHelp": "The pilot must have logged into the website once.",
    "form.distance": "Distance category",
    "form.short": "Short-haul — 1 Point",
    "form.medium": "Medium-haul — 2 Points",
    "form.long": "Long-haul — 3 Points",
    "form.miles": "Miles",
    "form.milesPlaceholder": "e.g. 750",
    "form.economyCapacity": "Economy capacity",
    "form.businessCapacity": "Business capacity",
    "form.firstCapacity": "First capacity",

    // Event status
    "status.scheduled": "Scheduled",
    "status.boarding": "Boarding",
    "status.departed": "Departed",
    "status.completed": "Completed",
    "status.cancelled": "Cancelled",

    // Settings
    "settings.title": "⚙️ Settings",
    "settings.theme": "Appearance",
    "settings.light": "Light mode",
    "settings.dark": "Dark mode",
    "settings.font": "Font size",
    "settings.small": "Small",
    "settings.normal": "Normal",
    "settings.large": "Large",
    "settings.language": "Language",

    // Footer
    "footer.disclaimer": "Unofficial virtual airline / flight simulation project. Not affiliated with or endorsed by Austrian Airlines."

  },


  // ===========================================
  // DEUTSCH
  // ===========================================

  de: {

    // Navigation
    "nav.home": "Startseite",
    "nav.miles": "Miles & More",
    "nav.atc24": "ATC24",
    "nav.events": "Event-Flüge",
    "nav.academy": "Academy",
    "nav.admin": "Verwaltung",

    // Anmeldung
    "auth.login": "Mit Discord anmelden",
    "auth.logout": "Abmelden",

    // Startseite
    "home.title": "Flugbetrieb.",
    "home.description": "Führe deine Linienflüge durch, nimm an besonderen Event-Flügen teil und verbessere deinen Miles-&-More-Status – alles an einem Ort.",
    "home.atc24": "ATC24-Flüge ansehen",
    "home.events": "Event-Flüge ansehen",

    // Miles & More
    "miles.title": "💳 Miles & More",
    "miles.description": "Deine Prämien aus Event-Flügen, Points und dein aktueller Status.",
    "miles.login": "Melde dich an, um dein Miles-&-More-Profil zu sehen.",
    "miles.track": "Verfolge deine Miles, Points und deinen aktuellen Status.",
    "miles.balance": "Miles",
    "miles.points": "Points",
    "miles.status": "Status",
    "miles.lifetime": "Gesammelte Miles",
    "miles.toNext": "Noch {points} Point(s) bis {status}",
    "miles.highest": "Höchsten Status erreicht",

    // ATC24
    "atc24.title": "✈️ Heutige ATC24-Flüge",
    "atc24.description": "Geplante Flüge und verfügbare Flugaufträge.",

    // Event-Flüge
    "events.title": "🌍 Event-Flüge",
    "events.description": "Buche einen Sitzplatz und sammle nach dem abgeschlossenen Flug Miles und Points für Miles & More.",

    // Flugkarten
    "flight.one": "{count} Flug",
    "flight.many": "{count} Flüge",
    "flight.noFlights": "Heute sind keine ATC24-Flüge verfügbar.",
    "flight.checkLater": "Schau später wieder vorbei, wenn neue Flüge geplant sind.",
    "flight.claim": "FLUG ÜBERNEHMEN",
    "flight.loginClaim": "MIT DISCORD ANMELDEN",
    "flight.start": "FLUG STARTEN",
    "flight.pushback": "PUSHBACK",
    "flight.takeoff": "START",
    "flight.landing": "LANDUNG",
    "flight.end": "FLUG ABSCHLIESSEN",
    "flight.claimedByOther": "Dieser Flug wurde bereits übernommen.",
    "flight.operatedByOther": "Dieser Flug wird gerade durchgeführt.",
    "flight.completed": "Flug abgeschlossen",
    "flight.departure": "Abflug",
    "flight.aircraft": "Flugzeug",
    "flight.operator": "Betreiber",
    "flight.livery": "Lackierung",
    "flight.startedAt": "Begonnen",
    "flight.pushbackAt": "Pushback",
    "flight.takeoffAt": "Start",
    "flight.landingAt": "Landung",
    "flight.completedAt": "Abgeschlossen",
    "flight.approvalRequired": "Du benötigst die Freigabe „Pilot Approved“, um ATC24-Flüge zu übernehmen.",

    // Event-Buchungen
    "event.one": "{count} Event",
    "event.many": "{count} Events",
    "event.noEvents": "Derzeit sind keine Event-Flüge geplant.",
    "event.newSoon": "Neue Sonderflüge erscheinen hier.",
    "event.distance": "Strecke",
    "event.economy": "Economy",
    "event.business": "Business",
    "event.first": "First",
    "event.bookEconomy": "ECONOMY BUCHEN",
    "event.bookBusiness": "BUSINESS BUCHEN — 20.000 MILES",
    "event.bookFirst": "FIRST BUCHEN — 100.000 MILES",
    "event.economyFull": "Economy ausgebucht",
    "event.businessFull": "Business ausgebucht",
    "event.firstFull": "First ausgebucht",
    "event.loginBook": "MIT DISCORD ZUM BUCHEN ANMELDEN",
    "event.cancelled": "Dieser Event-Flug wurde abgesagt.",
    "event.finished": "Dieser Event-Flug ist abgeschlossen.",
    "event.booked": "Deine Buchung",
    "event.checkedIn": "Eingecheckt",
    "event.notCheckedIn": "Noch nicht eingecheckt",
    "event.boarded": "Boarding abgeschlossen",
    "event.notBoarded": "Noch nicht geboardet",
    "event.checkIn": "EINCHECKEN",
    "event.board": "BOARDING",
    "event.complete": "EVENT-FLUG ABSCHLIESSEN",
    "event.short": "Kurzstrecke",
    "event.medium": "Mittelstrecke",
    "event.long": "Langstrecke",
    "event.businessLocked": "Frequent-Traveller-Status und 20.000 Miles erforderlich",
    "event.firstLocked": "Senator-Status und 100.000 Miles erforderlich",

    // Academy
    "academy.title": "🎓 Austrian Academy",
    "academy.description": "Bewerbungen, Ausbildungen und Qualifikationen für unsere virtuellen Piloten und ATC-Mitglieder.",
    "academy.pilot": "✈️ Pilotenakademie",
    "academy.pilotDescription": "Bewirb dich für die Ausbildung zum ATC24- oder Event-Flight-Piloten.",
    "academy.atc": "📡 ATC-Akademie",
    "academy.atcDescription": "Bewirb dich für die Ausbildung zum virtuellen Fluglotsen.",
    "academy.training": "📅 Trainingstermine",
    "academy.trainingDescription": "Sieh dir kommende Trainings an und verfolge deinen Ausbildungsfortschritt.",
    "academy.comingSoon": "Demnächst in V1.3.0",

    // Verwaltung
    "admin.title": "🛠️ Verwaltung",
    "admin.description": "Verwalte ATC24, Event-Flüge, Academy-Bewerbungen und Trainings.",
    "admin.tabAtc24": "ATC24-Flüge",
    "admin.tabEvents": "Event-Flüge",
    "admin.tabApplications": "Bewerbungen",
    "admin.tabTrainings": "Trainings",
    "admin.tabInstructors": "Instruktoren",
    "admin.atc24Heading": "ATC24-Flugverwaltung",
    "admin.atc24Intro": "Erstelle und verwalte geplante ATC24-Flüge.",
    "admin.createAtc24": "ATC24-FLUG ERSTELLEN",
    "admin.existingAtc24": "Bestehende ATC24-Flüge",
    "admin.eventsHeading": "Event-Flight-Verwaltung",
    "admin.eventsIntro": "Erstelle, bearbeite und lösche Event-Flüge.",
    "admin.pointsNote": "Points werden automatisch vergeben: Kurzstrecke = 1, Mittelstrecke = 2, Langstrecke = 3. Miles werden manuell eingetragen; Teilnehmer erhalten sie nach abgeschlossenem Flug.",
    "admin.createEvent": "EVENT-FLUG ERSTELLEN",
    "admin.existingEvents": "Bestehende Event-Flüge",
    "admin.applicationsHeading": "Academy-Bewerbungen",
    "admin.trainingsHeading": "Academy-Trainings",
    "admin.instructorsHeading": "Academy-Instruktoren",
    "admin.comingSoon": "Dieser Verwaltungsbereich wird aktiviert, sobald die Academy-Datenbankfunktionen bereitstehen.",

    // Formulare
    "form.flightNumber": "Flugnummer — OS101",
    "form.departure": "Abflug — VIE",
    "form.arrival": "Ankunft — LHR",
    "form.aircraft": "Flugzeugtyp — Airbus A320",
    "form.operator": "Betreibende Airline — Austrian Airlines",
    "form.livery": "Lackierung — Austrian Airlines",
    "form.once": "Einmaliger Flug",
    "form.daily": "Jeden Tag",
    "form.weekdays": "Montag–Freitag",
    "form.weekends": "Samstag–Sonntag",
    "form.additional": "Zusätzliche Informationen (optional)",
    "form.pilot": "Discord-ID des Piloten (optional)",
    "form.pilotHelp": "Der Pilot muss sich mindestens einmal auf der Website angemeldet haben.",
    "form.distance": "Streckenkategorie",
    "form.short": "Kurzstrecke — 1 Point",
    "form.medium": "Mittelstrecke — 2 Points",
    "form.long": "Langstrecke — 3 Points",
    "form.miles": "Miles",
    "form.milesPlaceholder": "z. B. 750",
    "form.economyCapacity": "Economy-Sitzplätze",
    "form.businessCapacity": "Business-Sitzplätze",
    "form.firstCapacity": "First-Sitzplätze",

    // Event-Status
    "status.scheduled": "Geplant",
    "status.boarding": "Boarding",
    "status.departed": "Abgeflogen",
    "status.completed": "Abgeschlossen",
    "status.cancelled": "Abgesagt",

    // Einstellungen
    "settings.title": "⚙️ Einstellungen",
    "settings.theme": "Darstellung",
    "settings.light": "Heller Modus",
    "settings.dark": "Dunkler Modus",
    "settings.font": "Schriftgröße",
    "settings.small": "Klein",
    "settings.normal": "Normal",
    "settings.large": "Groß",
    "settings.language": "Sprache",

    // Footer
    "footer.disclaimer": "Inoffizielles virtuelles Airline- und Flugsimulationsprojekt. Keine Verbindung zu Austrian Airlines und keine Unterstützung durch Austrian Airlines."

  },


  // ===========================================
  // FRANÇAIS
  // ===========================================

  fr: {

    // Navigation
    "nav.home": "Accueil",
    "nav.miles": "Miles & More",
    "nav.atc24": "ATC24",
    "nav.events": "Vols événementiels",
    "nav.academy": "Académie",
    "nav.admin": "Administration",

    // Connexion
    "auth.login": "Se connecter avec Discord",
    "auth.logout": "Se déconnecter",

    // Accueil
    "home.title": "Opérations aériennes.",
    "home.description": "Effectuez vos vols programmés, participez à des vols événementiels et faites progresser votre statut Miles & More, au même endroit.",
    "home.atc24": "Voir les vols ATC24",
    "home.events": "Voir les vols événementiels",

    // Miles & More
    "miles.title": "💳 Miles & More",
    "miles.description": "Vos récompenses de vols événementiels, vos Points et votre statut actuel.",
    "miles.login": "Connectez-vous pour consulter votre profil Miles & More.",
    "miles.track": "Suivez vos Miles, vos Points et votre statut actuel.",
    "miles.balance": "Miles",
    "miles.points": "Points",
    "miles.status": "Statut",
    "miles.lifetime": "Miles cumulés",
    "miles.toNext": "Encore {points} point(s) pour atteindre {status}",
    "miles.highest": "Statut le plus élevé atteint",

    // ATC24
    "atc24.title": "✈️ Vols ATC24 du jour",
    "atc24.description": "Vols programmés et vols disponibles.",

    // Vols événementiels
    "events.title": "🌍 Vols événementiels",
    "events.description": "Réservez une place et gagnez des Miles et des Points Miles & More après avoir terminé le vol.",

    // Cartes de vol
    "flight.one": "{count} vol",
    "flight.many": "{count} vols",
    "flight.noFlights": "Aucun vol ATC24 disponible aujourd’hui.",
    "flight.checkLater": "Revenez plus tard pour les prochains vols programmés.",
    "flight.claim": "PRENDRE EN CHARGE LE VOL",
    "flight.loginClaim": "SE CONNECTER AVEC DISCORD",
    "flight.start": "DÉMARRER LE VOL",
    "flight.pushback": "REPOUSSAGE",
    "flight.takeoff": "DÉCOLLAGE",
    "flight.landing": "ATTERRISSAGE",
    "flight.end": "TERMINER LE VOL",
    "flight.claimedByOther": "Un pilote a déjà pris en charge ce vol.",
    "flight.operatedByOther": "Un pilote effectue actuellement ce vol.",
    "flight.completed": "Vol terminé",
    "flight.departure": "Départ",
    "flight.aircraft": "Appareil",
    "flight.operator": "Compagnie exploitante",
    "flight.livery": "Livrée",
    "flight.startedAt": "Commencé",
    "flight.pushbackAt": "Repoussage",
    "flight.takeoffAt": "Décollage",
    "flight.landingAt": "Atterrissage",
    "flight.completedAt": "Terminé",
    "flight.approvalRequired": "L’autorisation « Pilot Approved » est nécessaire pour prendre en charge les vols ATC24.",

    // Réservations
    "event.one": "{count} événement",
    "event.many": "{count} événements",
    "event.noEvents": "Aucun vol événementiel n’est programmé.",
    "event.newSoon": "Les nouveaux vols spéciaux apparaîtront ici.",
    "event.distance": "Distance",
    "event.economy": "Économique",
    "event.business": "Affaires",
    "event.first": "Première",
    "event.bookEconomy": "RÉSERVER EN ÉCONOMIQUE",
    "event.bookBusiness": "RÉSERVER EN AFFAIRES — 20 000 MILES",
    "event.bookFirst": "RÉSERVER EN PREMIÈRE — 100 000 MILES",
    "event.economyFull": "Classe économique complète",
    "event.businessFull": "Classe affaires complète",
    "event.firstFull": "Première classe complète",
    "event.loginBook": "SE CONNECTER AVEC DISCORD POUR RÉSERVER",
    "event.cancelled": "Ce vol événementiel a été annulé.",
    "event.finished": "Ce vol événementiel est terminé.",
    "event.booked": "Votre réservation",
    "event.checkedIn": "Enregistré",
    "event.notCheckedIn": "Pas encore enregistré",
    "event.boarded": "Embarquement effectué",
    "event.notBoarded": "Pas encore embarqué",
    "event.checkIn": "S’ENREGISTRER",
    "event.board": "EMBARQUER",
    "event.complete": "TERMINER LE VOL ÉVÉNEMENTIEL",
    "event.short": "Court-courrier",
    "event.medium": "Moyen-courrier",
    "event.long": "Long-courrier",
    "event.businessLocked": "Statut Frequent Traveller et 20 000 Miles requis",
    "event.firstLocked": "Statut Senator et 100 000 Miles requis",

    // Académie
    "academy.title": "🎓 Austrian Academy",
    "academy.description": "Candidatures, formations et qualifications pour nos pilotes virtuels et membres ATC.",
    "academy.pilot": "✈️ Académie des pilotes",
    "academy.pilotDescription": "Postulez à une formation de pilote ATC24 ou de vol événementiel.",
    "academy.atc": "📡 Académie ATC",
    "academy.atcDescription": "Postulez pour devenir contrôleur aérien virtuel.",
    "academy.training": "📅 Sessions de formation",
    "academy.trainingDescription": "Consultez les prochaines sessions et suivez votre progression.",
    "academy.comingSoon": "Bientôt dans la V1.3.0",

    // Administration
    "admin.title": "🛠️ Administration",
    "admin.description": "Gérez les vols ATC24, les vols événementiels, les candidatures et les formations de l’Académie.",
    "admin.tabAtc24": "Vols ATC24",
    "admin.tabEvents": "Vols événementiels",
    "admin.tabApplications": "Candidatures",
    "admin.tabTrainings": "Formations",
    "admin.tabInstructors": "Instructeurs",
    "admin.atc24Heading": "Gestion des vols ATC24",
    "admin.atc24Intro": "Créez et gérez les vols ATC24 programmés.",
    "admin.createAtc24": "CRÉER UN VOL ATC24",
    "admin.existingAtc24": "Vols ATC24 existants",
    "admin.eventsHeading": "Gestion des vols événementiels",
    "admin.eventsIntro": "Créez, modifiez et supprimez les vols événementiels.",
    "admin.pointsNote": "Les Points sont attribués automatiquement : court-courrier = 1, moyen-courrier = 2, long-courrier = 3. Les Miles sont saisis manuellement et attribués aux passagers après le vol.",
    "admin.createEvent": "CRÉER UN VOL ÉVÉNEMENTIEL",
    "admin.existingEvents": "Vols événementiels existants",
    "admin.applicationsHeading": "Candidatures à l’Académie",
    "admin.trainingsHeading": "Formations de l’Académie",
    "admin.instructorsHeading": "Instructeurs de l’Académie",
    "admin.comingSoon": "Cette section sera activée lorsque les fonctions de base de données de l’Académie seront prêtes.",

    // Formulaires
    "form.flightNumber": "Numéro de vol — OS101",
    "form.departure": "Départ — VIE",
    "form.arrival": "Arrivée — LHR",
    "form.aircraft": "Type d’appareil — Airbus A320",
    "form.operator": "Compagnie exploitante — Austrian Airlines",
    "form.livery": "Livrée — Austrian Airlines",
    "form.once": "Vol unique",
    "form.daily": "Tous les jours",
    "form.weekdays": "Du lundi au vendredi",
    "form.weekends": "Samedi et dimanche",
    "form.additional": "Informations supplémentaires (facultatif)",
    "form.pilot": "ID Discord du pilote (facultatif)",
    "form.pilotHelp": "Le pilote doit s’être connecté au site au moins une fois.",
    "form.distance": "Catégorie de distance",
    "form.short": "Court-courrier — 1 Point",
    "form.medium": "Moyen-courrier — 2 Points",
    "form.long": "Long-courrier — 3 Points",
    "form.miles": "Miles",
    "form.milesPlaceholder": "p. ex. 750",
    "form.economyCapacity": "Places en économique",
    "form.businessCapacity": "Places en affaires",
    "form.firstCapacity": "Places en première",

    // Statuts
    "status.scheduled": "Programmé",
    "status.boarding": "Embarquement",
    "status.departed": "Parti",
    "status.completed": "Terminé",
    "status.cancelled": "Annulé",

    // Paramètres
    "settings.title": "⚙️ Paramètres",
    "settings.theme": "Apparence",
    "settings.light": "Mode clair",
    "settings.dark": "Mode sombre",
    "settings.font": "Taille du texte",
    "settings.small": "Petite",
    "settings.normal": "Normale",
    "settings.large": "Grande",
    "settings.language": "Langue",

    // Pied de page
    "footer.disclaimer": "Projet non officiel de compagnie aérienne virtuelle et de simulation de vol. Sans affiliation ni soutien de la compagnie Austrian Airlines."

  }

};


/* =============================================
   TRANSLATION HELPER

   Used by app.js in the next step.
   Supports replacement values such as
   {count}, {points} and {status}.
   ============================================= */

window.AFO_t = function (key, values = {}) {

  const language = document.documentElement.lang;

  const translations = window.AFO_TRANSLATIONS;

  const raw =
    translations[language]?.[key] ??
    translations.en[key] ??
    key;

  return raw.replace(
    /\{([a-zA-Z0-9_]+)\}/g,
    (match, name) => {

      if (
        Object.prototype.hasOwnProperty.call(
          values,
          name
        )
      ) {
        return String(values[name]);
      }

      return match;

    }
  );

};
