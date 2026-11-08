
/* =============================================================
   AUSTRIAN FLIGHT OPERATIONS – TRANSLATIONS V1.3.0

   Complete translations:
   English / Deutsch / Français

   ATC24, Event Flights, Miles & More,
   Academy Applications, Trainings and Instructors.

   Each row:
   [key, English, German, French]
   ============================================================= */

(() => {
  "use strict";

  const rows = [

    // ===== NAVIGATION =====

    ["nav.home", "Home", "Startseite", "Accueil"],
    ["nav.miles", "Miles & More", "Miles & More", "Miles & More"],
    ["nav.atc24", "ATC24", "ATC24", "ATC24"],
    ["nav.events", "Event Flights", "Event-Flüge", "Vols événementiels"],
    ["nav.academy", "Academy", "Academy", "Académie"],
    ["nav.admin", "Admin", "Verwaltung", "Administration"],
    ["auth.login", "Login with Discord", "Mit Discord anmelden", "Se connecter avec Discord"],
    ["auth.logout", "Logout", "Abmelden", "Se déconnecter"],

    // ===== HOME =====

    ["home.title", "Flight Operations.", "Flugbetrieb.", "Opérations aériennes."],
    ["home.description", "Run your scheduled flights, join special Event Flights and build your Miles & More status — all in one place.", "Führe deine Linienflüge durch, nimm an besonderen Event-Flügen teil und verbessere deinen Miles-&-More-Status – alles an einem Ort.", "Effectuez vos vols programmés, participez à des vols événementiels et faites progresser votre statut Miles & More, au même endroit."],
    ["home.atc24", "View ATC24 Flights", "ATC24-Flüge ansehen", "Voir les vols ATC24"],
    ["home.events", "View Event Flights", "Event-Flüge ansehen", "Voir les vols événementiels"],

    // ===== MILES & MORE =====

    ["miles.title", "💳 Miles & More", "💳 Miles & More", "💳 Miles & More"],
    ["miles.description", "Your Event Flight rewards, Points and current status.", "Deine Prämien aus Event-Flügen, Points und dein aktueller Status.", "Vos récompenses de vols événementiels, vos Points et votre statut actuel."],
    ["miles.login", "Sign in to view your Miles & More profile.", "Melde dich an, um dein Miles-&-More-Profil zu sehen.", "Connectez-vous pour consulter votre profil Miles & More."],
    ["miles.track", "Track Miles, Points and your current status.", "Verfolge deine Miles, Points und deinen aktuellen Status.", "Suivez vos Miles, vos Points et votre statut actuel."],
    ["miles.balance", "Miles", "Miles", "Miles"],
    ["miles.points", "Points", "Points", "Points"],
    ["miles.status", "Status", "Status", "Statut"],
    ["miles.lifetime", "Lifetime Miles", "Gesammelte Miles", "Miles cumulés"],
    ["miles.toNext", "{points} point(s) to {status}", "Noch {points} Point(s) bis {status}", "Encore {points} point(s) pour atteindre {status}"],
    ["miles.highest", "Highest status reached", "Höchsten Status erreicht", "Statut le plus élevé atteint"],

    // ===== ATC24 / FLIGHTS =====

    ["atc24.title", "✈️ Today's ATC24 Flights", "✈️ Heutige ATC24-Flüge", "✈️ Vols ATC24 du jour"],
    ["atc24.description", "Scheduled operations and claimable flights.", "Geplante Flüge und verfügbare Flugaufträge.", "Vols programmés et vols disponibles."],
    ["flight.one", "{count} flight", "{count} Flug", "{count} vol"],
    ["flight.many", "{count} flights", "{count} Flüge", "{count} vols"],
    ["flight.noFlights", "No ATC24 flights available today.", "Heute sind keine ATC24-Flüge verfügbar.", "Aucun vol ATC24 disponible aujourd’hui."],
    ["flight.checkLater", "Check back later for the next scheduled operation.", "Schau später wieder vorbei, wenn neue Flüge geplant sind.", "Revenez plus tard pour les prochains vols programmés."],
    ["flight.claim", "CLAIM FLIGHT", "FLUG ÜBERNEHMEN", "PRENDRE EN CHARGE LE VOL"],
    ["flight.loginClaim", "LOGIN WITH DISCORD TO CLAIM", "MIT DISCORD ANMELDEN", "SE CONNECTER AVEC DISCORD"],
    ["flight.start", "START FLIGHT", "FLUG STARTEN", "DÉMARRER LE VOL"],
    ["flight.pushback", "PUSHBACK", "PUSHBACK", "REPOUSSAGE"],
    ["flight.takeoff", "TAKEOFF", "START", "DÉCOLLAGE"],
    ["flight.landing", "LANDING", "LANDUNG", "ATTERRISSAGE"],
    ["flight.end", "END FLIGHT", "FLUG ABSCHLIESSEN", "TERMINER LE VOL"],
    ["flight.claimedByOther", "A pilot has claimed this flight.", "Dieser Flug wurde bereits übernommen.", "Un pilote a déjà pris en charge ce vol."],
    ["flight.operatedByOther", "A pilot is currently operating this flight.", "Dieser Flug wird gerade durchgeführt.", "Un pilote effectue actuellement ce vol."],
    ["flight.completed", "Flight completed", "Flug abgeschlossen", "Vol terminé"],
    ["flight.departure", "Departure", "Abflug", "Départ"],
    ["flight.aircraft", "Aircraft", "Flugzeug", "Appareil"],
    ["flight.operator", "Operator", "Betreiber", "Compagnie exploitante"],
    ["flight.livery", "Livery", "Lackierung", "Livrée"],
    ["flight.startedAt", "Started", "Begonnen", "Commencé"],
    ["flight.pushbackAt", "Pushback", "Pushback", "Repoussage"],
    ["flight.takeoffAt", "Takeoff", "Start", "Décollage"],
    ["flight.landingAt", "Landing", "Landung", "Atterrissage"],
    ["flight.completedAt", "Completed", "Abgeschlossen", "Terminé"],
    ["flight.approvalRequired", "Pilot Approved is required to claim ATC24 flights.", "Du benötigst die Freigabe „Pilot Approved“, um ATC24-Flüge zu übernehmen.", "L’autorisation « Pilot Approved » est nécessaire pour prendre en charge les vols ATC24."],

    // ===== EVENT FLIGHTS =====

    ["events.title", "🌍 Event Flights", "🌍 Event-Flüge", "🌍 Vols événementiels"],
    ["events.description", "Book a seat and earn Miles & More Miles and Points after completing the flight.", "Buche einen Sitzplatz und sammle nach dem abgeschlossenen Flug Miles und Points für Miles & More.", "Réservez une place et gagnez des Miles et des Points Miles & More après avoir terminé le vol."],
    ["event.one", "{count} event", "{count} Event", "{count} événement"],
    ["event.many", "{count} events", "{count} Events", "{count} événements"],
    ["event.noEvents", "No Event Flights are scheduled.", "Derzeit sind keine Event-Flüge geplant.", "Aucun vol événementiel n’est programmé."],
    ["event.newSoon", "New special operations will appear here.", "Neue Sonderflüge erscheinen hier.", "Les nouveaux vols spéciaux apparaîtront ici."],
    ["event.distance", "Distance", "Strecke", "Distance"],
    ["event.economy", "Economy", "Economy", "Économique"],
    ["event.business", "Business", "Business", "Affaires"],
    ["event.first", "First", "First", "Première"],
    ["event.bookEconomy", "BOOK ECONOMY", "ECONOMY BUCHEN", "RÉSERVER EN ÉCONOMIQUE"],
    ["event.bookBusiness", "BOOK BUSINESS — 20,000 MILES", "BUSINESS BUCHEN — 20.000 MILES", "RÉSERVER EN AFFAIRES — 20 000 MILES"],
    ["event.bookFirst", "BOOK FIRST — 100,000 MILES", "FIRST BUCHEN — 100.000 MILES", "RÉSERVER EN PREMIÈRE — 100 000 MILES"],
    ["event.economyFull", "Economy full", "Economy ausgebucht", "Classe économique complète"],
    ["event.businessFull", "Business full", "Business ausgebucht", "Classe affaires complète"],
    ["event.firstFull", "First full", "First ausgebucht", "Première classe complète"],
    ["event.loginBook", "LOGIN WITH DISCORD TO BOOK", "MIT DISCORD ZUM BUCHEN ANMELDEN", "SE CONNECTER AVEC DISCORD POUR RÉSERVER"],
    ["event.cancelled", "This Event Flight has been cancelled.", "Dieser Event-Flug wurde abgesagt.", "Ce vol événementiel a été annulé."],
    ["event.finished", "This Event Flight is completed.", "Dieser Event-Flug ist abgeschlossen.", "Ce vol événementiel est terminé."],
    ["event.booked", "Your booking", "Deine Buchung", "Votre réservation"],
    ["event.checkedIn", "Checked in", "Eingecheckt", "Enregistré"],
    ["event.notCheckedIn", "Not checked in", "Noch nicht eingecheckt", "Pas encore enregistré"],
    ["event.boarded", "Boarded", "Boarding abgeschlossen", "Embarquement effectué"],
    ["event.notBoarded", "Not boarded", "Noch nicht geboardet", "Pas encore embarqué"],
    ["event.checkIn", "CHECK IN", "EINCHECKEN", "S’ENREGISTRER"],
    ["event.board", "BOARD", "BOARDING", "EMBARQUER"],
    ["event.complete", "COMPLETE EVENT FLIGHT", "EVENT-FLUG ABSCHLIESSEN", "TERMINER LE VOL ÉVÉNEMENTIEL"],
    ["event.short", "Short-haul", "Kurzstrecke", "Court-courrier"],
    ["event.medium", "Medium-haul", "Mittelstrecke", "Moyen-courrier"],
    ["event.long", "Long-haul", "Langstrecke", "Long-courrier"],
    ["event.businessLocked", "Frequent Traveller status and 20,000 Miles required", "Frequent-Traveller-Status und 20.000 Miles erforderlich", "Statut Frequent Traveller et 20 000 Miles requis"],
    ["event.firstLocked", "Senator status and 100,000 Miles required", "Senator-Status und 100.000 Miles erforderlich", "Statut Senator et 100 000 Miles requis"],

    // ===== ACADEMY =====

    ["academy.title", "🎓 Austrian Academy", "🎓 Austrian Academy", "🎓 Austrian Academy"],
    ["academy.description", "Applications, training and qualifications for our virtual pilots and ATC members.", "Bewerbungen, Ausbildungen und Qualifikationen für unsere virtuellen Piloten und ATC-Mitglieder.", "Candidatures, formations et qualifications pour nos pilotes virtuels et membres ATC."],
    ["academy.pilot", "✈️ Pilot Academy", "✈️ Pilotenakademie", "✈️ Académie des pilotes"],
    ["academy.pilotDescription", "Apply for ATC24 or Event Flight pilot training.", "Bewirb dich für die Ausbildung zum ATC24- oder Event-Flight-Piloten.", "Postulez à une formation de pilote ATC24 ou de vol événementiel."],
    ["academy.atc", "📡 ATC Academy", "📡 ATC-Akademie", "📡 Académie ATC"],
    ["academy.atcDescription", "Apply to train as a virtual air traffic controller.", "Bewirb dich für die Ausbildung zum virtuellen Fluglotsen.", "Postulez pour devenir contrôleur aérien virtuel."],
    ["academy.training", "📅 Training Sessions", "📅 Trainingstermine", "📅 Sessions de formation"],
    ["academy.trainingDescription", "View upcoming sessions and manage your training progress.", "Sieh dir kommende Trainings an und verfolge deinen Ausbildungsfortschritt.", "Consultez les prochaines sessions et suivez votre progression."],
    ["academy.comingSoon", "Coming soon in V1.3.0", "Demnächst in V1.3.0", "Bientôt dans la V1.3.0"],
    ["academy.formTitle", "Apply to the Austrian Academy", "Bei der Austrian Academy bewerben", "Candidater à l’Austrian Academy"],
    ["academy.formDescription", "Choose a training category and tell us why you would like to join.", "Wähle einen Ausbildungsbereich und erzähle uns, warum du teilnehmen möchtest.", "Choisissez un domaine de formation et expliquez-nous pourquoi vous souhaitez nous rejoindre."],
    ["academy.loginRequired", "Please log in with Discord before submitting an application.", "Bitte melde dich mit Discord an, bevor du eine Bewerbung abschickst.", "Veuillez vous connecter avec Discord avant d’envoyer votre candidature."],
    ["academy.category", "Training category", "Ausbildungsbereich", "Domaine de formation"],
    ["academy.chooseCategory", "Choose an Academy programme", "Academy-Ausbildung auswählen", "Choisissez un programme de l’Académie"],
    ["academy.categoryAtc24", "ATC24 Pilot", "ATC24-Pilot", "Pilote ATC24"],
    ["academy.categoryEvent", "Event Flight Pilot", "Event-Flight-Pilot", "Pilote de vol événementiel"],
    ["academy.categoryAtc", "Air Traffic Controller (ATC)", "Fluglotse (ATC)", "Contrôleur aérien (ATC)"],
    ["academy.motivation", "Why would you like to join?", "Warum möchtest du teilnehmen?", "Pourquoi souhaitez-vous nous rejoindre ?"],
    ["academy.motivationPlaceholder", "Tell us why you would like to join (10–2000 characters)", "Erzähle uns, warum du teilnehmen möchtest (10–2000 Zeichen)", "Expliquez pourquoi vous souhaitez nous rejoindre (10 à 2 000 caractères)"],
    ["academy.motivationHelp", "Please write at least 10 characters. Maximum 2000 characters.", "Bitte schreibe mindestens 10 und höchstens 2000 Zeichen.", "Veuillez écrire au moins 10 caractères et au maximum 2 000 caractères."],
    ["academy.experience", "Previous experience (optional)", "Bisherige Erfahrung (optional)", "Expérience antérieure (facultatif)"],
    ["academy.experiencePlaceholder", "Optional: your experience with PTFS or flight simulation", "Optional: Deine Erfahrung mit PTFS oder Flugsimulation", "Facultatif : votre expérience sur PTFS ou en simulation de vol"],
    ["academy.experienceHelp", "Maximum 1000 characters.", "Maximal 1000 Zeichen.", "1 000 caractères maximum."],
    ["academy.submit", "SUBMIT APPLICATION", "BEWERBUNG ABSCHICKEN", "ENVOYER LA CANDIDATURE"],
    ["academy.connecting", "Application submissions will be enabled once the website connection is complete.", "Bewerbungen können abgeschickt werden, sobald die Website-Anbindung fertig ist.", "L’envoi des candidatures sera disponible une fois la connexion au site terminée."],
    ["academy.submitting", "Submitting application...", "Bewerbung wird abgeschickt...", "Envoi de la candidature..."],
    ["academy.submitted", "Your Academy application was submitted successfully.", "Deine Academy-Bewerbung wurde erfolgreich eingereicht.", "Votre candidature à l’Académie a été envoyée avec succès."],
    ["academy.submitFailed", "Could not submit your Academy application.", "Deine Academy-Bewerbung konnte nicht abgeschickt werden.", "Impossible d’envoyer votre candidature à l’Académie."],
    ["academy.myApplications", "My applications", "Meine Bewerbungen", "Mes candidatures"],
    ["academy.myApplicationsDescription", "View the status of your applications here.", "Hier kannst du den Status deiner Bewerbungen verfolgen.", "Consultez ici le statut de vos candidatures."],
    ["academy.statusPreparing", "Application status tracking will be connected in the next step.", "Die Anzeige deiner Bewerbungen wird im nächsten Schritt verbunden.", "Le suivi des candidatures sera connecté à l’étape suivante."],
    ["academy.noApplications", "You have not submitted any Academy applications yet.", "Du hast noch keine Academy-Bewerbung eingereicht.", "Vous n’avez pas encore envoyé de candidature à l’Académie."],
    ["academy.loginToView", "Log in with Discord to view your applications.", "Melde dich mit Discord an, um deine Bewerbungen zu sehen.", "Connectez-vous avec Discord pour voir vos candidatures."],
    ["academy.applicationPending", "Pending review", "Wartet auf Prüfung", "En attente d’examen"],
    ["academy.applicationApproved", "Approved", "Angenommen", "Acceptée"],
    ["academy.applicationRejected", "Rejected", "Abgelehnt", "Refusée"],
    ["academy.submittedAt", "Submitted", "Eingereicht", "Envoyée"],
    ["academy.reviewedAt", "Reviewed", "Geprüft", "Examinée"],
    ["academy.reviewNote", "Management feedback", "Rückmeldung des Managements", "Retour de l’équipe de gestion"],

    // ===== ADMINISTRATION =====

    ["admin.title", "🛠️ Administration", "🛠️ Verwaltung", "🛠️ Administration"],
    ["admin.description", "Manage ATC24, Event Flights, Academy applications and training.", "Verwalte ATC24, Event-Flüge, Academy-Bewerbungen und Trainings.", "Gérez les vols ATC24, les vols événementiels, les candidatures et les formations de l’Académie."],
    ["admin.tabAtc24", "ATC24 Flights", "ATC24-Flüge", "Vols ATC24"],
    ["admin.tabEvents", "Event Flights", "Event-Flüge", "Vols événementiels"],
    ["admin.tabApplications", "Applications", "Bewerbungen", "Candidatures"],
    ["admin.tabTrainings", "Trainings", "Trainings", "Formations"],
    ["admin.tabInstructors", "Instructors", "Instruktoren", "Instructeurs"],
    ["admin.atc24Heading", "ATC24 Flight Management", "ATC24-Flugverwaltung", "Gestion des vols ATC24"],
    ["admin.atc24Intro", "Create and manage scheduled ATC24 operations.", "Erstelle und verwalte geplante ATC24-Flüge.", "Créez et gérez les vols ATC24 programmés."],
    ["admin.createAtc24", "CREATE ATC24 FLIGHT", "ATC24-FLUG ERSTELLEN", "CRÉER UN VOL ATC24"],
    ["admin.existingAtc24", "Existing ATC24 Flights", "Bestehende ATC24-Flüge", "Vols ATC24 existants"],
    ["admin.eventsHeading", "Event Flight Management", "Event-Flight-Verwaltung", "Gestion des vols événementiels"],
    ["admin.eventsIntro", "Create, update and remove Event Flights.", "Erstelle, bearbeite und lösche Event-Flüge.", "Créez, modifiez et supprimez les vols événementiels."],
    ["admin.pointsNote", "Points are automatic: Short-haul = 1, Medium-haul = 2, Long-haul = 3. Miles are entered manually; passengers receive rewards after completing the flight.", "Points werden automatisch vergeben: Kurzstrecke = 1, Mittelstrecke = 2, Langstrecke = 3. Miles werden manuell eingetragen; Teilnehmer erhalten sie nach abgeschlossenem Flug.", "Les Points sont attribués automatiquement : court-courrier = 1, moyen-courrier = 2, long-courrier = 3. Les Miles sont saisis manuellement et attribués aux passagers après le vol."],
    ["admin.createEvent", "CREATE EVENT FLIGHT", "EVENT-FLUG ERSTELLEN", "CRÉER UN VOL ÉVÉNEMENTIEL"],
    ["admin.existingEvents", "Existing Event Flights", "Bestehende Event-Flüge", "Vols événementiels existants"],
    ["admin.applicationsHeading", "Academy Applications", "Academy-Bewerbungen", "Candidatures à l’Académie"],
    ["admin.applicationsIntro", "Review applications, approve or reject them and provide feedback to applicants.", "Prüfe Bewerbungen, nimm sie an oder lehne sie ab und gib den Bewerbern eine Rückmeldung.", "Examinez les candidatures, acceptez-les ou refusez-les et envoyez une réponse aux candidats."],
    ["admin.filterStatus", "Filter by status", "Nach Status filtern", "Filtrer par statut"],
    ["admin.filterAll", "All applications", "Alle Bewerbungen", "Toutes les candidatures"],
    ["admin.filterPending", "Pending", "Ausstehend", "En attente"],
    ["admin.filterApproved", "Approved", "Angenommen", "Acceptées"],
    ["admin.filterRejected", "Rejected", "Abgelehnt", "Refusées"],
    ["admin.applicationsPreparing", "The application review system will be connected in the next step.", "Die Bewerbungsverwaltung wird im nächsten Schritt verbunden.", "Le système de gestion des candidatures sera connecté à l’étape suivante."],
    ["admin.noApplications", "No Academy applications found.", "Keine Academy-Bewerbungen gefunden.", "Aucune candidature trouvée."],
    ["admin.applicant", "Applicant", "Bewerber", "Candidat"],
    ["admin.reviewNote", "Review note (optional)", "Rückmeldung (optional)", "Commentaire (facultatif)"],
    ["admin.approve", "APPROVE", "ANNEHMEN", "ACCEPTER"],
    ["admin.reject", "REJECT", "ABLEHNEN", "REFUSER"],
    ["admin.reviewSuccess", "Application reviewed successfully.", "Bewerbung erfolgreich bearbeitet.", "Candidature traitée avec succès."],
    ["admin.reviewFailed", "Could not review this application.", "Die Bewerbung konnte nicht bearbeitet werden.", "Impossible de traiter cette candidature."],
    ["admin.trainingsHeading", "Academy Trainings", "Academy-Trainings", "Formations de l’Académie"],
    ["admin.instructorsHeading", "Academy Instructors", "Academy-Instruktoren", "Instructeurs de l’Académie"],
    ["admin.comingSoon", "This management area will be activated when the Academy database functions are ready.", "Dieser Verwaltungsbereich wird aktiviert, sobald die Academy-Datenbankfunktionen bereitstehen.", "Cette section sera activée lorsque les fonctions de base de données de l’Académie seront prêtes."],

    // ===== EXISTING FORMS =====

    ["form.flightNumber", "Flight Number — OS101", "Flugnummer — OS101", "Numéro de vol — OS101"],
    ["form.departure", "Departure — VIE", "Abflug — VIE", "Départ — VIE"],
    ["form.arrival", "Arrival — LHR", "Ankunft — LHR", "Arrivée — LHR"],
    ["form.aircraft", "Aircraft Model — Airbus A320", "Flugzeugtyp — Airbus A320", "Type d’appareil — Airbus A320"],
    ["form.operator", "Operator Airline — Austrian Airlines", "Betreibende Airline — Austrian Airlines", "Compagnie exploitante — Austrian Airlines"],
    ["form.livery", "Livery Airline — Austrian Airlines", "Lackierung — Austrian Airlines", "Livrée — Austrian Airlines"],
    ["form.once", "One-time flight", "Einmaliger Flug", "Vol unique"],
    ["form.daily", "Every day", "Jeden Tag", "Tous les jours"],
    ["form.weekdays", "Monday–Friday", "Montag–Freitag", "Du lundi au vendredi"],
    ["form.weekends", "Saturday–Sunday", "Samstag–Sonntag", "Samedi et dimanche"],
    ["form.additional", "Additional Information (optional)", "Zusätzliche Informationen (optional)", "Informations supplémentaires (facultatif)"],
    ["form.pilot", "Pilot Discord ID (optional)", "Discord-ID des Piloten (optional)", "ID Discord du pilote (facultatif)"],
    ["form.pilotHelp", "The pilot must have logged into the website once.", "Der Pilot muss sich mindestens einmal auf der Website angemeldet haben.", "Le pilote doit s’être connecté au site au moins une fois."],
    ["form.distance", "Distance category", "Streckenkategorie", "Catégorie de distance"],
    ["form.short", "Short-haul — 1 Point", "Kurzstrecke — 1 Point", "Court-courrier — 1 Point"],
    ["form.medium", "Medium-haul — 2 Points", "Mittelstrecke — 2 Points", "Moyen-courrier — 2 Points"],
    ["form.long", "Long-haul — 3 Points", "Langstrecke — 3 Points", "Long-courrier — 3 Points"],
    ["form.miles", "Miles", "Miles", "Miles"],
    ["form.milesPlaceholder", "e.g. 750", "z. B. 750", "p. ex. 750"],
    ["form.economyCapacity", "Economy capacity", "Economy-Sitzplätze", "Places en économique"],
    ["form.businessCapacity", "Business capacity", "Business-Sitzplätze", "Places en affaires"],
    ["form.firstCapacity", "First capacity", "First-Sitzplätze", "Places en première"],
    ["status.scheduled", "Scheduled", "Geplant", "Programmé"],
    ["status.boarding", "Boarding", "Boarding", "Embarquement"],
    ["status.departed", "Departed", "Abgeflogen", "Parti"],
    ["status.completed", "Completed", "Abgeschlossen", "Terminé"],
    ["status.cancelled", "Cancelled", "Abgesagt", "Annulé"],

    // ===== TRAININGS: WEBSITE =====

    ["training.scheduleTitle", "📅 Upcoming Academy Trainings", "📅 Kommende Academy-Trainings", "📅 Prochaines formations de l’Académie"],
    ["training.scheduleDescription", "Find the right training after your Academy application has been approved.", "Finde das passende Training, sobald deine Academy-Bewerbung angenommen wurde.", "Trouvez une formation adaptée après l’acceptation de votre candidature à l’Académie."],
    ["training.connecting", "The training schedule will be connected in the next step.", "Die Trainingsübersicht wird im nächsten Schritt verbunden.", "Le calendrier des formations sera connecté à l’étape suivante."],
    ["training.instructorTitle", "👨‍🏫 My Instructor Dashboard", "👨‍🏫 Mein Instruktorenbereich", "👨‍🏫 Mon espace instructeur"],
    ["training.instructorDescription", "View assigned sessions and manage participant attendance.", "Sieh dir deine zugeteilten Trainings an und verwalte die Anwesenheit der Teilnehmer.", "Consultez vos formations attribuées et gérez la présence des participants."],

    // ===== TRAININGS: ADMIN FORM =====

    ["training.adminDescription", "Create training sessions, assign qualified instructors and manage attendance.", "Erstelle Trainings, teile qualifizierte Instruktoren zu und verwalte die Anwesenheit.", "Créez des formations, affectez des instructeurs qualifiés et gérez les présences."],
    ["training.titleLabel", "Training title", "Trainingstitel", "Titre de la formation"],
    ["training.titlePlaceholder", "Example: ATC24 Pilot – Basic Training", "Beispiel: ATC24 Pilot – Grundausbildung", "Exemple : pilote ATC24 – Formation initiale"],
    ["training.startLabel", "Start date and time", "Beginn (Datum und Uhrzeit)", "Date et heure de début"],
    ["training.durationLabel", "Duration (minutes)", "Dauer (Minuten)", "Durée (minutes)"],
    ["training.capacityLabel", "Available places", "Verfügbare Plätze", "Places disponibles"],
    ["training.instructorDiscordLabel", "Instructor Discord ID (optional)", "Discord-ID des Instruktors (optional)", "Identifiant Discord de l’instructeur (facultatif)"],
    ["training.instructorDiscordPlaceholder", "Discord user ID – must be an active qualified instructor", "Discord-Benutzer-ID – aktiver, qualifizierter Instruktor erforderlich", "ID utilisateur Discord – instructeur actif et qualifié requis"],
    ["training.descriptionLabel", "Training description (optional)", "Trainingsbeschreibung (optional)", "Description de la formation (facultatif)"],
    ["training.descriptionPlaceholder", "What will participants learn?", "Was lernen die Teilnehmer?", "Qu’apprendront les participants ?"],
    ["training.create", "CREATE TRAINING", "TRAINING ERSTELLEN", "CRÉER UNE FORMATION"],
    ["training.existingTitle", "Existing trainings", "Bestehende Trainings", "Formations existantes"],
    ["training.participantsTitle", "Training participants", "Trainingsteilnehmer", "Participants à la formation"],

    // ===== INSTRUCTORS: ADMIN FORM =====

    ["training.instructorAdminDescription", "Authorize instructors by their Discord ID and training specialties. Members must have logged in once.", "Ernenne Instruktoren anhand ihrer Discord-ID und Ausbildungsbereiche. Mitglieder müssen sich vorher einmal angemeldet haben.", "Autorisez les instructeurs avec leur identifiant Discord et leurs spécialités. Les membres doivent s’être connectés au moins une fois."],
    ["training.discordIdLabel", "Instructor Discord ID", "Discord-ID des Instruktors", "Identifiant Discord de l’instructeur"],
    ["training.discordIdPlaceholder", "Discord user ID", "Discord-Benutzer-ID", "Identifiant utilisateur Discord"],
    ["training.specialtiesLabel", "Authorized training categories", "Berechtigte Ausbildungsbereiche", "Domaines de formation autorisés"],
    ["training.activeLabel", "Instructor active", "Instruktor aktiv", "Instructeur actif"],
    ["training.saveInstructor", "SAVE INSTRUCTOR", "INSTRUKTOR SPEICHERN", "ENREGISTRER L’INSTRUCTEUR"],
    ["training.instructorListTitle", "Registered instructors", "Eingetragene Instruktoren", "Instructeurs enregistrés"],

    // ===== TRAININGS: DYNAMIC DISPLAY =====

    ["training.loading", "Loading trainings...", "Trainings werden geladen...", "Chargement des formations..."],
    ["training.noSessions", "No Academy trainings scheduled yet.", "Noch keine Academy-Trainings geplant.", "Aucune formation de l’Académie n’est encore programmée."],
    ["training.noInstructor", "No instructor assigned", "Noch kein Instruktor zugewiesen", "Aucun instructeur affecté"],
    ["training.instructor", "Instructor", "Instruktor", "Instructeur"],
    ["training.startsAt", "Start", "Beginn", "Début"],
    ["training.duration", "Duration", "Dauer", "Durée"],
    ["training.minutes", "{count} minutes", "{count} Minuten", "{count} minutes"],
    ["training.places", "Places", "Plätze", "Places"],
    ["training.bookedCount", "{booked} / {capacity} registered", "{booked} / {capacity} angemeldet", "{booked} / {capacity} inscrits"],
    ["training.full", "Training fully booked", "Training ausgebucht", "Formation complète"],
    ["training.register", "REGISTER", "ANMELDEN", "S’INSCRIRE"],
    ["training.cancelRegistration", "CANCEL REGISTRATION", "ANMELDUNG STORNIEREN", "ANNULER L’INSCRIPTION"],
    ["training.alreadyRegistered", "You are registered", "Du bist angemeldet", "Vous êtes inscrit"],
    ["training.requiresApproval", "An approved application in this training category is required.", "Für diese Ausbildung ist eine angenommene Bewerbung erforderlich.", "Une candidature acceptée dans cette catégorie est obligatoire."],
    ["training.loginRequired", "Log in with Discord to register.", "Melde dich mit Discord an, um dich anzumelden.", "Connectez-vous avec Discord pour vous inscrire."],
    ["training.registerSuccess", "Training registration successful.", "Du bist erfolgreich für das Training angemeldet.", "Inscription à la formation réussie."],
    ["training.registerFailed", "Registration failed.", "Die Trainingsanmeldung ist fehlgeschlagen.", "Échec de l’inscription."],
    ["training.cancelSuccess", "Your training registration has been cancelled.", "Deine Trainingsanmeldung wurde storniert.", "Votre inscription à la formation a été annulée."],
    ["training.cancelFailed", "Could not cancel training registration.", "Die Trainingsanmeldung konnte nicht storniert werden.", "Impossible d’annuler l’inscription à la formation."],
    ["training.confirmCancel", "Cancel your registration for this training?", "Möchtest du deine Anmeldung zu diesem Training stornieren?", "Voulez-vous annuler votre inscription à cette formation ?"],
    ["training.loadFailed", "Could not load Academy trainings.", "Academy-Trainings konnten nicht geladen werden.", "Impossible de charger les formations de l’Académie."],

    // ===== TRAININGS: ADMIN ACTIONS =====

    ["training.trainingCreated", "Training created successfully.", "Training erfolgreich erstellt.", "Formation créée avec succès."],
    ["training.trainingCreateFailed", "Could not create training.", "Training konnte nicht erstellt werden.", "Impossible de créer la formation."],
    ["training.instructorSaved", "Instructor saved successfully.", "Instruktor erfolgreich gespeichert.", "Instructeur enregistré avec succès."],
    ["training.instructorSaveFailed", "Could not save instructor.", "Instruktor konnte nicht gespeichert werden.", "Impossible d’enregistrer l’instructeur."],
    ["training.noInstructors", "No instructors registered yet.", "Noch keine Instruktoren eingetragen.", "Aucun instructeur enregistré pour le moment."],
    ["training.active", "Active", "Aktiv", "Actif"],
    ["training.inactive", "Inactive", "Inaktiv", "Inactif"],
    ["training.scheduled", "Scheduled", "Geplant", "Programmée"],
    ["training.completed", "Completed", "Abgeschlossen", "Terminée"],
    ["training.cancelled", "Cancelled", "Abgesagt", "Annulée"],
    ["training.cancelTraining", "CANCEL TRAINING", "TRAINING ABSAGEN", "ANNULER LA FORMATION"],
    ["training.completeTraining", "COMPLETE TRAINING", "TRAINING ABSCHLIESSEN", "TERMINER LA FORMATION"],
    ["training.confirmCancelTraining", "Cancel this training?", "Dieses Training absagen?", "Annuler cette formation ?"],
    ["training.statusUpdated", "Training status updated.", "Trainingsstatus aktualisiert.", "Statut de la formation mis à jour."],
    ["training.statusUpdateFailed", "Could not change training status.", "Trainingsstatus konnte nicht geändert werden.", "Impossible de modifier le statut de la formation."],
    ["training.assignInstructor", "ASSIGN INSTRUCTOR", "INSTRUKTOR ZUWEISEN", "AFFECTER UN INSTRUCTEUR"],
    ["training.assignmentSuccess", "Instructor assignment updated.", "Instruktorenzuweisung aktualisiert.", "Affectation de l’instructeur mise à jour."],
    ["training.assignmentFailed", "Could not assign instructor.", "Instruktor konnte nicht zugewiesen werden.", "Impossible d’affecter l’instructeur."],

    // ===== PARTICIPANTS & ATTENDANCE =====

    ["training.viewParticipants", "VIEW PARTICIPANTS", "TEILNEHMER ANZEIGEN", "VOIR LES PARTICIPANTS"],
    ["training.noParticipants", "No participants registered.", "Noch keine Teilnehmer angemeldet.", "Aucun participant inscrit."],
    ["training.attended", "Attended", "Anwesend", "Présent"],
    ["training.noShow", "Absent", "Nicht erschienen", "Absent"],
    ["training.registered", "Registered", "Angemeldet", "Inscrit"],
    ["training.registrationCancelled", "Registration cancelled", "Anmeldung storniert", "Inscription annulée"],
    ["training.markAttended", "MARK PRESENT", "ALS ANWESEND MARKIEREN", "MARQUER PRÉSENT"],
    ["training.markNoShow", "MARK ABSENT", "ALS ABWESEND MARKIEREN", "MARQUER ABSENT"],
    ["training.attendanceSaved", "Attendance saved.", "Anwesenheit gespeichert.", "Présence enregistrée."],
    ["training.attendanceFailed", "Could not save attendance.", "Anwesenheit konnte nicht gespeichert werden.", "Impossible d’enregistrer la présence."],
    ["training.noAssigned", "You have no assigned trainings.", "Dir sind keine Trainings zugewiesen.", "Aucune formation ne vous est attribuée."],
    ["training.adminOnly", "Administrator access required.", "Administratorrechte erforderlich.", "Accès administrateur requis."],

    // ===== SETTINGS / FOOTER =====

    ["settings.title", "⚙️ Settings", "⚙️ Einstellungen", "⚙️ Paramètres"],
    ["settings.theme", "Appearance", "Darstellung", "Apparence"],
    ["settings.light", "Light mode", "Heller Modus", "Mode clair"],
    ["settings.dark", "Dark mode", "Dunkler Modus", "Mode sombre"],
    ["settings.font", "Font size", "Schriftgröße", "Taille du texte"],
    ["settings.small", "Small", "Klein", "Petite"],
    ["settings.normal", "Normal", "Normal", "Normale"],
    ["settings.large", "Large", "Groß", "Grande"],
    ["settings.language", "Language", "Sprache", "Langue"],
    ["footer.disclaimer", "Unofficial virtual airline / flight simulation project. Not affiliated with or endorsed by Austrian Airlines.", "Inoffizielles virtuelles Airline- und Flugsimulationsprojekt. Keine Verbindung zu Austrian Airlines und keine Unterstützung durch Austrian Airlines.", "Projet non officiel de compagnie aérienne virtuelle et de simulation de vol. Sans affiliation ni soutien de la compagnie Austrian Airlines."]
  ];

  // Build the same dictionaries used by index.html and app.js.

  const dictionaries = {
    en: {},
    de: {},
    fr: {}
  };

  for (const [key, english, german, french] of rows) {
    dictionaries.en[key] = english;
    dictionaries.de[key] = german;
    dictionaries.fr[key] = french;
  }

  window.AFO_TRANSLATIONS = dictionaries;

  // Translation helper for dynamic interface elements.

  window.AFO_t = function (key, values = {}) {

    const language = document.documentElement.lang;

    const dict =
      dictionaries[language] ||
      dictionaries.en;

    const template =
      dict[key] ??
      dictionaries.en[key] ??
      key;

    return String(template).replace(
      /\{([a-zA-Z0-9_]+)\}/g,
      (match, name) =>
        Object.prototype.hasOwnProperty.call(values, name)
          ? String(values[name])
          : match
    );
  };

})();
