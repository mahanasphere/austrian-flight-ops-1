
/* ============================================================
   AUSTRIAN AIRLINES FLIGHT OPERATIONS
   V1.3.0 – TRANSLATIONS

   English / Deutsch / Français
   Includes Austrian Academy applications
   ============================================================ */

window.AFO_TRANSLATIONS = {

    /* ========================================================
       ENGLISH
       ======================================================== */

    en: {

        // NAVIGATION

        "nav.home": "Home",
        "nav.miles": "Miles & More",
        "nav.atc24": "ATC24",
        "nav.events": "Event Flights",
        "nav.academy": "Academy",
        "nav.admin": "Admin",

        // AUTHENTICATION

        "auth.login": "Login with Discord",
        "auth.logout": "Logout",

        // HOME

        "home.title": "Flight Operations.",
        "home.description": "Run your scheduled flights, join special Event Flights and build your Miles & More status — all in one place.",
        "home.atc24": "View ATC24 Flights",
        "home.events": "View Event Flights",

        // MILES & MORE

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

        // EVENT FLIGHTS

        "events.title": "🌍 Event Flights",
        "events.description": "Book a seat and earn Miles & More Miles and Points after completing the flight.",

        // FLIGHT CARDS

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

        // EVENT BOOKINGS

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

        // AUSTRIAN ACADEMY

        "academy.title": "🎓 Austrian Academy",
        "academy.description": "Applications, training and qualifications for our virtual pilots and ATC members.",
        "academy.pilot": "✈️ Pilot Academy",
        "academy.pilotDescription": "Apply for ATC24 or Event Flight pilot training.",
        "academy.atc": "📡 ATC Academy",
        "academy.atcDescription": "Apply to train as a virtual air traffic controller.",
        "academy.training": "📅 Training Sessions",
        "academy.trainingDescription": "View upcoming sessions and manage your training progress.",
        "academy.comingSoon": "Coming soon in V1.3.0",

        // ACADEMY APPLICATION FORM

        "academy.formTitle": "Apply to the Austrian Academy",
        "academy.formDescription": "Choose a training category and tell us why you would like to join.",
        "academy.loginRequired": "Please log in with Discord before submitting an application.",

        "academy.category": "Training category",
        "academy.chooseCategory": "Choose an Academy programme",
        "academy.categoryAtc24": "ATC24 Pilot",
        "academy.categoryEvent": "Event Flight Pilot",
        "academy.categoryAtc": "Air Traffic Controller (ATC)",

        "academy.motivation": "Why would you like to join?",
        "academy.motivationPlaceholder": "Tell us why you would like to join (10–2000 characters)",
        "academy.motivationHelp": "Please write at least 10 characters. Maximum 2000 characters.",

        "academy.experience": "Previous experience (optional)",
        "academy.experiencePlaceholder": "Optional: your experience with PTFS or flight simulation",
        "academy.experienceHelp": "Maximum 1000 characters.",

        "academy.submit": "SUBMIT APPLICATION",
        "academy.connecting": "Application submissions will be enabled once the website connection is complete.",
        "academy.submitting": "Submitting application...",
        "academy.submitted": "Your Academy application was submitted successfully.",
        "academy.submitFailed": "Could not submit your Academy application.",

        // MY APPLICATIONS

        "academy.myApplications": "My applications",
        "academy.myApplicationsDescription": "View the status of your applications here.",
        "academy.statusPreparing": "Application status tracking will be connected in the next step.",
        "academy.noApplications": "You have not submitted any Academy applications yet.",
        "academy.loginToView": "Log in with Discord to view your applications.",
        "academy.applicationPending": "Pending review",
        "academy.applicationApproved": "Approved",
        "academy.applicationRejected": "Rejected",
        "academy.submittedAt": "Submitted",
        "academy.reviewedAt": "Reviewed",
        "academy.reviewNote": "Management feedback",

        // ADMINISTRATION

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

        // ADMIN ACADEMY APPLICATIONS

        "admin.applicationsHeading": "Academy Applications",
        "admin.applicationsIntro": "Review applications, approve or reject them and provide feedback to applicants.",
        "admin.filterStatus": "Filter by status",
        "admin.filterAll": "All applications",
        "admin.filterPending": "Pending",
        "admin.filterApproved": "Approved",
        "admin.filterRejected": "Rejected",
        "admin.applicationsPreparing": "The application review system will be connected in the next step.",
        "admin.noApplications": "No Academy applications found.",
        "admin.applicant": "Applicant",
        "admin.reviewNote": "Review note (optional)",
        "admin.approve": "APPROVE",
        "admin.reject": "REJECT",
        "admin.reviewSuccess": "Application reviewed successfully.",
        "admin.reviewFailed": "Could not review this application.",

        // ADMIN TRAINING AREAS

        "admin.trainingsHeading": "Academy Trainings",
        "admin.instructorsHeading": "Academy Instructors",
        "admin.comingSoon": "This management area will be activated when the Academy database functions are ready.",

        // FORMS

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

        // EVENT STATUS

        "status.scheduled": "Scheduled",
        "status.boarding": "Boarding",
        "status.departed": "Departed",
        "status.completed": "Completed",
        "status.cancelled": "Cancelled",

        // SETTINGS

        "settings.title": "⚙️ Settings",
        "settings.theme": "Appearance",
        "settings.light": "Light mode",
        "settings.dark": "Dark mode",
        "settings.font": "Font size",
        "settings.small": "Small",
        "settings.normal": "Normal",
        "settings.large": "Large",
        "settings.language": "Language",

        // FOOTER

        "footer.disclaimer": "Unofficial virtual airline / flight simulation project. Not affiliated with or endorsed by Austrian Airlines."

    },


    /* ========================================================
       DEUTSCH
       ======================================================== */

    de: {

        // NAVIGATION

        "nav.home": "Startseite",
        "nav.miles": "Miles & More",
        "nav.atc24": "ATC24",
        "nav.events": "Event-Flüge",
        "nav.academy": "Academy",
        "nav.admin": "Verwaltung",

        // ANMELDUNG

        "auth.login": "Mit Discord anmelden",
        "auth.logout": "Abmelden",

        // STARTSEITE

        "home.title": "Flugbetrieb.",
        "home.description": "Führe deine Linienflüge durch, nimm an besonderen Event-Flügen teil und verbessere deinen Miles-&-More-Status – alles an einem Ort.",
        "home.atc24": "ATC24-Flüge ansehen",
        "home.events": "Event-Flüge ansehen",

        // MILES & MORE

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

        // EVENT-FLÜGE

        "events.title": "🌍 Event-Flüge",
        "events.description": "Buche einen Sitzplatz und sammle nach dem abgeschlossenen Flug Miles und Points für Miles & More.",

        // FLUGKARTEN

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

        // EVENT-BUCHUNGEN

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

        // AUSTRIAN ACADEMY

        "academy.title": "🎓 Austrian Academy",
        "academy.description": "Bewerbungen, Ausbildungen und Qualifikationen für unsere virtuellen Piloten und ATC-Mitglieder.",
        "academy.pilot": "✈️ Pilotenakademie",
        "academy.pilotDescription": "Bewirb dich für die Ausbildung zum ATC24- oder Event-Flight-Piloten.",
        "academy.atc": "📡 ATC-Akademie",
        "academy.atcDescription": "Bewirb dich für die Ausbildung zum virtuellen Fluglotsen.",
        "academy.training": "📅 Trainingstermine",
        "academy.trainingDescription": "Sieh dir kommende Trainings an und verfolge deinen Ausbildungsfortschritt.",
        "academy.comingSoon": "Demnächst in V1.3.0",

        // ACADEMY-BEWERBUNG

        "academy.formTitle": "Bei der Austrian Academy bewerben",
        "academy.formDescription": "Wähle einen Ausbildungsbereich und erzähle uns, warum du teilnehmen möchtest.",
        "academy.loginRequired": "Bitte melde dich mit Discord an, bevor du eine Bewerbung abschickst.",

        "academy.category": "Ausbildungsbereich",
        "academy.chooseCategory": "Academy-Ausbildung auswählen",
        "academy.categoryAtc24": "ATC24-Pilot",
        "academy.categoryEvent": "Event-Flight-Pilot",
        "academy.categoryAtc": "Fluglotse (ATC)",

        "academy.motivation": "Warum möchtest du teilnehmen?",
        "academy.motivationPlaceholder": "Erzähle uns, warum du teilnehmen möchtest (10–2000 Zeichen)",
        "academy.motivationHelp": "Bitte schreibe mindestens 10 und höchstens 2000 Zeichen.",

        "academy.experience": "Bisherige Erfahrung (optional)",
        "academy.experiencePlaceholder": "Optional: Deine Erfahrung mit PTFS oder Flugsimulation",
        "academy.experienceHelp": "Maximal 1000 Zeichen.",

        "academy.submit": "BEWERBUNG ABSCHICKEN",
        "academy.connecting": "Bewerbungen können abgeschickt werden, sobald die Website-Anbindung fertig ist.",
        "academy.submitting": "Bewerbung wird abgeschickt...",
        "academy.submitted": "Deine Academy-Bewerbung wurde erfolgreich eingereicht.",
        "academy.submitFailed": "Deine Academy-Bewerbung konnte nicht abgeschickt werden.",

        // MEINE BEWERBUNGEN

        "academy.myApplications": "Meine Bewerbungen",
        "academy.myApplicationsDescription": "Hier kannst du den Status deiner Bewerbungen verfolgen.",
        "academy.statusPreparing": "Die Anzeige deiner Bewerbungen wird im nächsten Schritt verbunden.",
        "academy.noApplications": "Du hast noch keine Academy-Bewerbung eingereicht.",
        "academy.loginToView": "Melde dich mit Discord an, um deine Bewerbungen zu sehen.",
        "academy.applicationPending": "Wartet auf Prüfung",
        "academy.applicationApproved": "Angenommen",
        "academy.applicationRejected": "Abgelehnt",
        "academy.submittedAt": "Eingereicht",
        "academy.reviewedAt": "Geprüft",
        "academy.reviewNote": "Rückmeldung des Managements",

        // VERWALTUNG

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

        // ACADEMY-VERWALTUNG

        "admin.applicationsHeading": "Academy-Bewerbungen",
        "admin.applicationsIntro": "Prüfe Bewerbungen, nimm sie an oder lehne sie ab und gib den Bewerbern eine Rückmeldung.",
        "admin.filterStatus": "Nach Status filtern",
        "admin.filterAll": "Alle Bewerbungen",
        "admin.filterPending": "Ausstehend",
        "admin.filterApproved": "Angenommen",
        "admin.filterRejected": "Abgelehnt",
        "admin.applicationsPreparing": "Die Bewerbungsverwaltung wird im nächsten Schritt verbunden.",
        "admin.noApplications": "Keine Academy-Bewerbungen gefunden.",
        "admin.applicant": "Bewerber",
        "admin.reviewNote": "Rückmeldung (optional)",
        "admin.approve": "ANNEHMEN",
        "admin.reject": "ABLEHNEN",
        "admin.reviewSuccess": "Bewerbung erfolgreich bearbeitet.",
        "admin.reviewFailed": "Die Bewerbung konnte nicht bearbeitet werden.",

        // AUSBILDUNGSVERWALTUNG

        "admin.trainingsHeading": "Academy-Trainings",
        "admin.instructorsHeading": "Academy-Instruktoren",
        "admin.comingSoon": "Dieser Verwaltungsbereich wird aktiviert, sobald die Academy-Datenbankfunktionen bereitstehen.",

        // FORMULARE

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

        // EVENT-STATUS

        "status.scheduled": "Geplant",
        "status.boarding": "Boarding",
        "status.departed": "Abgeflogen",
        "status.completed": "Abgeschlossen",
        "status.cancelled": "Abgesagt",

        // EINSTELLUNGEN

        "settings.title": "⚙️ Einstellungen",
        "settings.theme": "Darstellung",
        "settings.light": "Heller Modus",
        "settings.dark": "Dunkler Modus",
        "settings.font": "Schriftgröße",
        "settings.small": "Klein",
        "settings.normal": "Normal",
        "settings.large": "Groß",
        "settings.language": "Sprache",

        // FOOTER

        "footer.disclaimer": "Inoffizielles virtuelles Airline- und Flugsimulationsprojekt. Keine Verbindung zu Austrian Airlines und keine Unterstützung durch Austrian Airlines."

    },


    /* ========================================================
       FRANÇAIS
       ======================================================== */

    fr: {

        // NAVIGATION

        "nav.home": "Accueil",
        "nav.miles": "Miles & More",
        "nav.atc24": "ATC24",
        "nav.events": "Vols événementiels",
        "nav.academy": "Académie",
        "nav.admin": "Administration",

        // CONNEXION

        "auth.login": "Se connecter avec Discord",
        "auth.logout": "Se déconnecter",

        // ACCUEIL

        "home.title": "Opérations aériennes.",
        "home.description": "Effectuez vos vols programmés, participez à des vols événementiels et faites progresser votre statut Miles & More, au même endroit.",
        "home.atc24": "Voir les vols ATC24",
        "home.events": "Voir les vols événementiels",

        // MILES & MORE

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

        // VOLS ÉVÉNEMENTIELS

        "events.title": "🌍 Vols événementiels",
        "events.description": "Réservez une place et gagnez des Miles et des Points Miles & More après avoir terminé le vol.",

        // CARTES DE VOL

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

        // RÉSERVATIONS

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

        // AUSTRIAN ACADEMY

        "academy.title": "🎓 Austrian Academy",
        "academy.description": "Candidatures, formations et qualifications pour nos pilotes virtuels et membres ATC.",
        "academy.pilot": "✈️ Académie des pilotes",
        "academy.pilotDescription": "Postulez à une formation de pilote ATC24 ou de vol événementiel.",
        "academy.atc": "📡 Académie ATC",
        "academy.atcDescription": "Postulez pour devenir contrôleur aérien virtuel.",
        "academy.training": "📅 Sessions de formation",
        "academy.trainingDescription": "Consultez les prochaines sessions et suivez votre progression.",
        "academy.comingSoon": "Bientôt dans la V1.3.0",

        // FORMULAIRE DE CANDIDATURE

        "academy.formTitle": "Candidater à l’Austrian Academy",
        "academy.formDescription": "Choisissez un domaine de formation et expliquez-nous pourquoi vous souhaitez nous rejoindre.",
        "academy.loginRequired": "Veuillez vous connecter avec Discord avant d’envoyer votre candidature.",

        "academy.category": "Domaine de formation",
        "academy.chooseCategory": "Choisissez un programme de l’Académie",
        "academy.categoryAtc24": "Pilote ATC24",
        "academy.categoryEvent": "Pilote de vol événementiel",
        "academy.categoryAtc": "Contrôleur aérien (ATC)",

        "academy.motivation": "Pourquoi souhaitez-vous nous rejoindre ?",
        "academy.motivationPlaceholder": "Expliquez pourquoi vous souhaitez nous rejoindre (10 à 2 000 caractères)",
        "academy.motivationHelp": "Veuillez écrire au moins 10 caractères et au maximum 2 000 caractères.",

        "academy.experience": "Expérience antérieure (facultatif)",
        "academy.experiencePlaceholder": "Facultatif : votre expérience sur PTFS ou en simulation de vol",
        "academy.experienceHelp": "1 000 caractères maximum.",

        "academy.submit": "ENVOYER LA CANDIDATURE",
        "academy.connecting": "L’envoi des candidatures sera disponible une fois la connexion au site terminée.",
        "academy.submitting": "Envoi de la candidature...",
        "academy.submitted": "Votre candidature à l’Académie a été envoyée avec succès.",
        "academy.submitFailed": "Impossible d’envoyer votre candidature à l’Académie.",

        // MES CANDIDATURES

        "academy.myApplications": "Mes candidatures",
        "academy.myApplicationsDescription": "Consultez ici le statut de vos candidatures.",
        "academy.statusPreparing": "Le suivi des candidatures sera connecté à l’étape suivante.",
        "academy.noApplications": "Vous n’avez pas encore envoyé de candidature à l’Académie.",
        "academy.loginToView": "Connectez-vous avec Discord pour voir vos candidatures.",
        "academy.applicationPending": "En attente d’examen",
        "academy.applicationApproved": "Acceptée",
        "academy.applicationRejected": "Refusée",
        "academy.submittedAt": "Envoyée",
        "academy.reviewedAt": "Examinée",
        "academy.reviewNote": "Retour de l’équipe de gestion",

        // ADMINISTRATION

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

        // ADMINISTRATION DES CANDIDATURES

        "admin.applicationsHeading": "Candidatures à l’Académie",
        "admin.applicationsIntro": "Examinez les candidatures, acceptez-les ou refusez-les et envoyez une réponse aux candidats.",
        "admin.filterStatus": "Filtrer par statut",
        "admin.filterAll": "Toutes les candidatures",
        "admin.filterPending": "En attente",
        "admin.filterApproved": "Acceptées",
        "admin.filterRejected": "Refusées",
        "admin.applicationsPreparing": "Le système de gestion des candidatures sera connecté à l’étape suivante.",
        "admin.noApplications": "Aucune candidature trouvée.",
        "admin.applicant": "Candidat",
        "admin.reviewNote": "Commentaire (facultatif)",
        "admin.approve": "ACCEPTER",
        "admin.reject": "REFUSER",
        "admin.reviewSuccess": "Candidature traitée avec succès.",
        "admin.reviewFailed": "Impossible de traiter cette candidature.",

        // GESTION DES FORMATIONS

        "admin.trainingsHeading": "Formations de l’Académie",
        "admin.instructorsHeading": "Instructeurs de l’Académie",
        "admin.comingSoon": "Cette section sera activée lorsque les fonctions de base de données de l’Académie seront prêtes.",

        // FORMULAIRES

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

        // STATUTS

        "status.scheduled": "Programmé",
        "status.boarding": "Embarquement",
        "status.departed": "Parti",
        "status.completed": "Terminé",
        "status.cancelled": "Annulé",

        // PARAMÈTRES

        "settings.title": "⚙️ Paramètres",
        "settings.theme": "Apparence",
        "settings.light": "Mode clair",
        "settings.dark": "Mode sombre",
        "settings.font": "Taille du texte",
        "settings.small": "Petite",
        "settings.normal": "Normale",
        "settings.large": "Grande",
        "settings.language": "Langue",

        // PIED DE PAGE

        "footer.disclaimer": "Projet non officiel de compagnie aérienne virtuelle et de simulation de vol. Sans affiliation ni soutien de la compagnie Austrian Airlines."

    }

};


/* ============================================================
   TRANSLATION HELPER

   Supports:
   - English, German and French
   - Automatic English fallback
   - Variables such as {count}, {points}, {status}

   Example:
   AFO_t("academy.applicationPending")
   ============================================================ */

window.AFO_t = function (key, values = {}) {

    const language =
        document.documentElement.lang || "en";

    const translations =
        window.AFO_TRANSLATIONS;

    const raw =
        translations[language]?.[key] ??
        translations.en[key] ??
        key;

    return String(raw).replace(
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
