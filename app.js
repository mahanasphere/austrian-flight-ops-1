
/* ============================================================
   AUSTRIAN AIRLINES FLIGHT OPERATIONS – V1.3.0
   Existing flight/booking logic + multilingual interface
   Requires: Supabase JS v2, translations.js, index.html V1.3.0
   ============================================================ */

const SUPABASE_URL = "https://qdtpwggllgnyzazmshyf.supabase.co";
const SUPABASE_KEY = "sb_publishable_zgfXsfelbYVAGcvKk1wRhA_ok9n8jjl";

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY, {
    auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
    }
});

const ADMIN_DISCORD_ID = "1214124494340493312";

const MILES_AND_MORE_STATUS = {
    member: { name: "Member", points: 0 },
    frequent_traveller: { name: "Frequent Traveller", points: 100 },
    senator: { name: "Senator", points: 350 },
    hon_circle_member: { name: "HON Circle Member", points: 1000 }
};

const DISTANCE_POINTS = { short: 1, medium: 2, long: 3 };

let currentUser = null;
let currentProfile = null;
let authBusy = false;
let lastFlights = [];
let lastEvents = [];

const $ = id => document.getElementById(id);

const esc = value => String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

/* ============================================================
   ADDITIONAL TRANSLATIONS FOR DYNAMIC APP CONTENT
   ============================================================ */

const APP_TEXT = {
    en: {
        "state.available": "AVAILABLE",
        "state.claimed": "CLAIMED",
        "state.inProgress": "IN PROGRESS",
        "event.awarded": "Completed — {miles} Miles / {points} Point(s) awarded.",
        "message.loginFailed": "Discord login failed",
        "message.sessionFailed": "Session error",
        "message.loadFlights": "Could not load flights",
        "message.loadEvents": "Could not load Event Flights",
        "message.loadAdminFlights": "Could not load ATC24 flights",
        "message.loadAdminEvents": "Could not load Event Flights",
        "message.claimFailed": "Could not claim flight",
        "message.claimUnavailable": "Flight could not be claimed.",
        "message.claimSuccess": "Flight successfully claimed.",
        "message.actionFailed": "Flight action failed",
        "message.actionSuccess": "Flight action recorded successfully.",
        "message.flightComplete": "Flight completed successfully.",
        "message.adminOnly": "Admin access required.",
        "message.requiredAtc": "Please fill in all required ATC24 fields.",
        "message.requiredEvent": "Please fill in all required Event Flight fields.",
        "message.invalidDate": "Please enter a valid departure date and time.",
        "message.invalidDistance": "Invalid distance category.",
        "message.invalidNumbers": "Invalid Miles or capacity values.",
        "message.createdAtc": "ATC24 flight created successfully.",
        "message.createdEvent": "Event Flight created successfully — {points} Point(s) / {miles} Miles.",
        "message.deleteAtcConfirm": "Delete this ATC24 flight?",
        "message.deleteEventConfirm": "Delete this Event Flight? Existing bookings and participant records will also be deleted.",
        "message.deletedAtc": "ATC24 flight deleted successfully.",
        "message.deletedEvent": "Event Flight deleted successfully.",
        "message.eventStatusUpdated": "Event status updated.",
        "message.errorCreate": "Could not create flight",
        "message.errorDelete": "Could not delete flight",
        "message.errorEventStatus": "Could not update Event Flight status",
        "message.noAdminAtc": "No ATC24 flights created yet.",
        "message.noAdminEvents": "No Event Flights created yet.",
        "message.bookStatus": "{className} requires {status} status.",
        "message.bookMiles": "You need {miles} Miles for {className}.",
        "message.bookFailed": "Could not book flight",
        "message.bookUnavailable": "Could not complete booking.",
        "message.booked": "Booked {className} successfully.",
        "message.milesDeducted": "{miles} Miles deducted.",
        "message.noMilesDeducted": "No Miles deducted.",
        "message.checkInFailed": "Could not check in",
        "message.checkInSuccess": "Check-in completed.",
        "message.boardFailed": "Could not board",
        "message.boardSuccess": "Boarding completed.",
        "message.completeEventFailed": "Could not complete Event Flight",
        "message.completeEventSuccess": "Event Flight completed! +{miles} Miles / +{points} Point(s). New status: {status}.",
        "admin.delete": "DELETE",
        "event.pointUnit": "Point(s)",
        "flight.eventLabel": "EVENT FLIGHT"
    },

    de: {
        "state.available": "VERFÜGBAR",
        "state.claimed": "ÜBERNOMMEN",
        "state.inProgress": "IN DURCHFÜHRUNG",
        "event.awarded": "Abgeschlossen — {miles} Miles / {points} Point(s) gutgeschrieben.",
        "message.loginFailed": "Discord-Anmeldung fehlgeschlagen",
        "message.sessionFailed": "Sitzungsfehler",
        "message.loadFlights": "ATC24-Flüge konnten nicht geladen werden",
        "message.loadEvents": "Event-Flüge konnten nicht geladen werden",
        "message.loadAdminFlights": "ATC24-Flüge konnten nicht geladen werden",
        "message.loadAdminEvents": "Event-Flüge konnten nicht geladen werden",
        "message.claimFailed": "Flug konnte nicht übernommen werden",
        "message.claimUnavailable": "Dieser Flug kann nicht übernommen werden.",
        "message.claimSuccess": "Flug erfolgreich übernommen.",
        "message.actionFailed": "Flugaktion fehlgeschlagen",
        "message.actionSuccess": "Flugaktion erfolgreich aufgezeichnet.",
        "message.flightComplete": "Flug erfolgreich abgeschlossen.",
        "message.adminOnly": "Administratorrechte erforderlich.",
        "message.requiredAtc": "Bitte fülle alle erforderlichen ATC24-Felder aus.",
        "message.requiredEvent": "Bitte fülle alle erforderlichen Event-Flight-Felder aus.",
        "message.invalidDate": "Bitte gib ein gültiges Abflugdatum und eine Uhrzeit ein.",
        "message.invalidDistance": "Ungültige Streckenkategorie.",
        "message.invalidNumbers": "Ungültige Miles- oder Sitzplatzanzahl.",
        "message.createdAtc": "ATC24-Flug erfolgreich erstellt.",
        "message.createdEvent": "Event-Flug erstellt — {points} Point(s) / {miles} Miles.",
        "message.deleteAtcConfirm": "Diesen ATC24-Flug löschen?",
        "message.deleteEventConfirm": "Diesen Event-Flug löschen? Buchungen und Teilnehmerdaten werden ebenfalls gelöscht.",
        "message.deletedAtc": "ATC24-Flug erfolgreich gelöscht.",
        "message.deletedEvent": "Event-Flug erfolgreich gelöscht.",
        "message.eventStatusUpdated": "Event-Status aktualisiert.",
        "message.errorCreate": "Flug konnte nicht erstellt werden",
        "message.errorDelete": "Flug konnte nicht gelöscht werden",
        "message.errorEventStatus": "Event-Status konnte nicht geändert werden",
        "message.noAdminAtc": "Noch keine ATC24-Flüge erstellt.",
        "message.noAdminEvents": "Noch keine Event-Flüge erstellt.",
        "message.bookStatus": "Für {className} ist der Status {status} erforderlich.",
        "message.bookMiles": "Für {className} brauchst du {miles} Miles.",
        "message.bookFailed": "Buchung fehlgeschlagen",
        "message.bookUnavailable": "Die Buchung konnte nicht abgeschlossen werden.",
        "message.booked": "{className} erfolgreich gebucht.",
        "message.milesDeducted": "{miles} Miles abgezogen.",
        "message.noMilesDeducted": "Keine Miles abgezogen.",
        "message.checkInFailed": "Check-in fehlgeschlagen",
        "message.checkInSuccess": "Check-in abgeschlossen.",
        "message.boardFailed": "Boarding fehlgeschlagen",
        "message.boardSuccess": "Boarding abgeschlossen.",
        "message.completeEventFailed": "Event-Flug konnte nicht abgeschlossen werden",
        "message.completeEventSuccess": "Event-Flug abgeschlossen! +{miles} Miles / +{points} Point(s). Neuer Status: {status}.",
        "admin.delete": "LÖSCHEN",
        "event.pointUnit": "Point(s)",
        "flight.eventLabel": "EVENT-FLUG"
    },

    fr: {
        "state.available": "DISPONIBLE",
        "state.claimed": "ATTRIBUÉ",
        "state.inProgress": "EN COURS",
        "event.awarded": "Terminé — {miles} Miles / {points} Point(s) crédités.",
        "message.loginFailed": "Échec de la connexion Discord",
        "message.sessionFailed": "Erreur de session",
        "message.loadFlights": "Impossible de charger les vols ATC24",
        "message.loadEvents": "Impossible de charger les vols événementiels",
        "message.loadAdminFlights": "Impossible de charger les vols ATC24",
        "message.loadAdminEvents": "Impossible de charger les vols événementiels",
        "message.claimFailed": "Impossible de prendre en charge le vol",
        "message.claimUnavailable": "Ce vol ne peut pas être pris en charge.",
        "message.claimSuccess": "Vol pris en charge avec succès.",
        "message.actionFailed": "Échec de l'action sur le vol",
        "message.actionSuccess": "Étape du vol enregistrée avec succès.",
        "message.flightComplete": "Vol terminé avec succès.",
        "message.adminOnly": "Accès administrateur requis.",
        "message.requiredAtc": "Veuillez remplir tous les champs ATC24 obligatoires.",
        "message.requiredEvent": "Veuillez remplir tous les champs obligatoires du vol événementiel.",
        "message.invalidDate": "Veuillez saisir une date et une heure de départ valides.",
        "message.invalidDistance": "Catégorie de distance invalide.",
        "message.invalidNumbers": "Nombre de Miles ou de places invalide.",
        "message.createdAtc": "Vol ATC24 créé avec succès.",
        "message.createdEvent": "Vol événementiel créé — {points} Point(s) / {miles} Miles.",
        "message.deleteAtcConfirm": "Supprimer ce vol ATC24 ?",
        "message.deleteEventConfirm": "Supprimer ce vol événementiel ? Les réservations et les données des participants seront aussi supprimées.",
        "message.deletedAtc": "Vol ATC24 supprimé avec succès.",
        "message.deletedEvent": "Vol événementiel supprimé avec succès.",
        "message.eventStatusUpdated": "Statut du vol événementiel mis à jour.",
        "message.errorCreate": "Impossible de créer le vol",
        "message.errorDelete": "Impossible de supprimer le vol",
        "message.errorEventStatus": "Impossible de modifier le statut du vol",
        "message.noAdminAtc": "Aucun vol ATC24 créé pour le moment.",
        "message.noAdminEvents": "Aucun vol événementiel créé pour le moment.",
        "message.bookStatus": "Le statut {status} est requis pour la classe {className}.",
        "message.bookMiles": "Il vous faut {miles} Miles pour la classe {className}.",
        "message.bookFailed": "Échec de la réservation",
        "message.bookUnavailable": "Impossible de finaliser la réservation.",
        "message.booked": "Réservation en {className} effectuée.",
        "message.milesDeducted": "{miles} Miles déduits.",
        "message.noMilesDeducted": "Aucun Mile déduit.",
        "message.checkInFailed": "Échec de l'enregistrement",
        "message.checkInSuccess": "Enregistrement terminé.",
        "message.boardFailed": "Échec de l'embarquement",
        "message.boardSuccess": "Embarquement terminé.",
        "message.completeEventFailed": "Impossible de terminer le vol événementiel",
        "message.completeEventSuccess": "Vol événementiel terminé ! +{miles} Miles / +{points} Point(s). Nouveau statut : {status}.",
        "admin.delete": "SUPPRIMER",
        "event.pointUnit": "Point(s)",
        "flight.eventLabel": "VOL ÉVÉNEMENTIEL"
    }
};

/* ============================================================
   LANGUAGE, NUMBERS AND DATES
   ============================================================ */

function lang() {
    const code = document.documentElement.lang || "en";
    return ["en", "de", "fr"].includes(code) ? code : "en";
}

function replaceVars(template, values = {}) {
    return String(template).replace(
        /\{([a-zA-Z0-9_]+)\}/g,
        (match, name) =>
            Object.hasOwn(values, name)
                ? String(values[name])
                : match
    );
}

function t(key, values = {}) {
    const local = APP_TEXT[lang()]?.[key] ?? APP_TEXT.en[key];

    if (typeof local === "string") {
        return replaceVars(local, values);
    }

    if (typeof window.AFO_t === "function") {
        return window.AFO_t(key, values);
    }

    const source =
        window.AFO_TRANSLATIONS?.[lang()]?.[key] ??
        window.AFO_TRANSLATIONS?.en?.[key] ??
        key;

    return replaceVars(source, values);
}

const ht = (key, values = {}) => esc(t(key, values));

const num = value =>
    Number(value || 0).toLocaleString(
        lang() === "de"
            ? "de-AT"
            : lang() === "fr"
                ? "fr-FR"
                : "en-GB"
    );

function date(value) {
    if (!value) return "—";

    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return "—";

    return new Intl.DateTimeFormat(
        lang() === "de"
            ? "de-AT"
            : lang() === "fr"
                ? "fr-FR"
                : "en-GB",
        {
            timeZone: "Europe/Vienna",
            dateStyle: "medium",
            timeStyle: "short"
        }
    ).format(parsed);
}

/* ============================================================
   MESSAGES
   ============================================================ */

function msg(message, type = "info") {
    const element = $("message");
    if (!element) return;

    element.textContent = message;
    element.className = `message ${type}`;
    element.classList.remove("hidden");

    clearTimeout(msg.timeout);

    msg.timeout = setTimeout(() => {
        element.classList.add("hidden");
    }, 6000);
}

function errMsg(prefix, error) {
    return `${t(prefix)}: ${error?.message || String(error)}`;
}

/* ============================================================
   USER AND STATUS HELPERS
   ============================================================ */

function discordId(user = currentUser) {
    const identity = user?.identities?.find(
        item => item.provider === "discord"
    );

    return String(
        identity?.identity_data?.provider_id ||
        identity?.identity_data?.sub ||
        user?.user_metadata?.provider_id ||
        user?.user_metadata?.sub ||
        ""
    );
}

function admin() {
    return discordId() === ADMIN_DISCORD_ID;
}

function statusName(status) {
    return MILES_AND_MORE_STATUS[status]?.name || "Member";
}

function statusPoints(status) {
    return MILES_AND_MORE_STATUS[status]?.points || 0;
}

function canClass(travelClass) {
    const points = statusPoints(
        currentProfile?.miles_and_more_status
    );

    return (
        travelClass === "economy" ||
        (travelClass === "business" && points >= 100) ||
        (travelClass === "first" && points >= 350)
    );
}

function distanceName(distance) {
    const valid = ["short", "medium", "long"];

    return t(
        `event.${valid.includes(distance) ? distance : "short"}`
    );
}

function className(travelClass) {
    const key = ["economy", "business", "first"].includes(
        travelClass
    ) ? travelClass : "economy";

    return t(`event.${key}`);
}

function eventStatusClass(status) {
    return {
        boarding: "progress",
        departed: "claimed",
        completed: "completed",
        cancelled: "cancelled"
    }[status] || "available";
}

function eventStatusText(status) {
    const valid = [
        "scheduled",
        "boarding",
        "departed",
        "completed",
        "cancelled"
    ];

    const key = valid.includes(status)
        ? status
        : "scheduled";

    return t(`status.${key}`).toUpperCase();
}

function flightStatusClass(status) {
    return {
        claimed: "claimed",
        in_progress: "progress",
        completed: "completed"
    }[status] || "available";
}

function flightStatusText(status) {
    if (status === "claimed") {
        return t("state.claimed");
    }

    if (status === "in_progress") {
        return t("state.inProgress");
    }

    if (status === "completed") {
        return t("status.completed").toUpperCase();
    }

    return t("state.available");
}

/* ============================================================
   DISCORD LOGIN
   ============================================================ */

async function loginWithDiscord() {
    if (authBusy) return;
    authBusy = true;

    try {
        const redirectTo =
            window.location.origin +
            window.location.pathname;

        const { error } =
            await supabaseClient.auth.signInWithOAuth({
                provider: "discord",
                options: {
                    redirectTo,
                    scopes: "identify"
                }
            });

        if (error) {
            msg(
                errMsg("message.loginFailed", error),
                "error"
            );
        }

    } catch (error) {
        console.error(error);

        msg(
            errMsg("message.loginFailed", error),
            "error"
        );

    } finally {
        authBusy = false;
    }
}

async function finishOAuth() {
    const code = new URLSearchParams(
        window.location.search
    ).get("code");

    if (!code) return;

    const { error } =
        await supabaseClient.auth.exchangeCodeForSession(
            code
        );

    if (error) {
        console.error(error);

        msg(
            errMsg("message.loginFailed", error),
            "error"
        );

        return;
    }

    window.history.replaceState(
        {},
        document.title,
        window.location.pathname
    );
}

/* ============================================================
   PROFILE
   ============================================================ */

async function ensureProfile() {
    if (!currentUser) return;

    const { error } = await supabaseClient.rpc(
        "ensure_my_profile"
    );

    if (error) {
        console.warn(
            "Profile setup:",
            error.message
        );
    }

    const { data, error: profileError } =
        await supabaseClient
            .from("profiles")
            .select("*")
            .eq("id", currentUser.id)
            .maybeSingle();

    if (profileError) {
        console.error(profileError);
    }

    currentProfile = data || null;
}

async function loadUser() {
    try {
        await finishOAuth();

    } catch (error) {
        console.error(error);

        msg(
            errMsg("message.loginFailed", error),
            "error"
        );
    }

    const { data, error } =
        await supabaseClient.auth.getSession();

    if (error) {
        msg(
            errMsg("message.sessionFailed", error),
            "error"
        );
        return;
    }

    currentUser = data.session?.user || null;

    if (currentUser) {
        await ensureProfile();
    } else {
        currentProfile = null;
    }

    updateUI();
}

async function logout() {
    const { error } =
        await supabaseClient.auth.signOut();

    if (error) {
        return msg(
            errMsg("message.sessionFailed", error),
            "error"
        );
    }

    currentUser = null;
    currentProfile = null;

    updateUI();
    await refresh();
}

function updateUI() {
    $("loginButton")?.classList.toggle(
        "hidden",
        !!currentUser
    );

    $("logoutButton")?.classList.toggle(
        "hidden",
        !currentUser
    );

    $("userPill")?.classList.toggle(
        "hidden",
        !currentUser
    );

    const name = $("userName");

    if (name) {
        const data =
            currentUser?.user_metadata || {};

        name.textContent =
            data.global_name ||
            data.full_name ||
            data.name ||
            data.preferred_username ||
            "Pilot";
    }

    updateMiles();
    updateAdminUI();
}

/* ============================================================
   MILES & MORE
   ============================================================ */

function updateMiles() {
    const panel = $("milesMorePanel");
    if (!panel) return;

    if (!currentUser || !currentProfile) {
        panel.innerHTML = `
            <div class="empty-state compact">
                <span class="empty-icon">💳</span>
                <div>
                    <strong>${ht("miles.login")}</strong>
                    <p>${ht("miles.track")}</p>
                </div>
            </div>
        `;

        return;
    }

    const points = Number(
        currentProfile.points || 0
    );

    const miles = Number(
        currentProfile.miles || 0
    );

    const status =
        currentProfile.miles_and_more_status || "member";

    const next = Object.entries(
        MILES_AND_MORE_STATUS
    ).find(([, item]) => item.points > points);

    const nextText = next
        ? ht("miles.toNext", {
            points: num(next[1].points - points),
            status: next[1].name
        })
        : ht("miles.highest");

    panel.innerHTML = `
        <div class="miles-grid">

            <div class="miles-stat accent-stat">
                <span class="stat-label">
                    ${ht("miles.balance")}
                </span>

                <strong>${num(miles)}</strong>

                <small>${ht("miles.lifetime")}</small>
            </div>

            <div class="miles-stat">
                <span class="stat-label">
                    ${ht("miles.points")}
                </span>

                <strong>${num(points)}</strong>

                <small>Miles &amp; More Points</small>
            </div>

            <div class="miles-stat">
                <span class="stat-label">
                    ${ht("miles.status")}
                </span>

                <strong>${esc(statusName(status))}</strong>

                <small>${nextText}</small>
            </div>

        </div>
    `;
}

/* ============================================================
   ATC24 FLIGHTS
   ============================================================ */

function viennaDay() {
    return new Intl.DateTimeFormat(
        "en-US",
        {
            timeZone: "Europe/Vienna",
            weekday: "short"
        }
    ).format(new Date());
}

function visibleToday(flight) {
    const recurrence =
        flight.recurrence || "once";

    if (["once", "daily"].includes(recurrence)) {
        return true;
    }

    const today = viennaDay();

    if (recurrence === "weekdays") {
        return [
            "Mon",
            "Tue",
            "Wed",
            "Thu",
            "Fri"
        ].includes(today);
    }

    if (recurrence === "weekends") {
        return ["Sat", "Sun"].includes(today);
    }

    return true;
}

async function loadFlights() {
    const board = $("flightBoard");
    if (!board) return;

    const { data, error } =
        await supabaseClient
            .from("flights")
            .select("*")
            .order(
                "scheduled_departure",
                { ascending: true }
            );

    if (error) {
        board.innerHTML = `
            <div class="error-state">
                ${ht("message.loadFlights")}:
                ${esc(error.message)}
            </div>
        `;

        return;
    }

    lastFlights = (data || []).filter(
        visibleToday
    );

    renderFlights(lastFlights);
}

function renderFlights(flights) {
    const board = $("flightBoard");
    const counter = $("flightCount");

    if (!board) return;

    board.innerHTML = "";

    if (counter) {
        counter.textContent = t(
            flights.length === 1
                ? "flight.one"
                : "flight.many",
            {
                count: num(flights.length)
            }
        );
    }

    if (!flights.length) {
        board.innerHTML = `
            <div class="empty-state">

                <span class="empty-icon">✈️</span>

                <div>
                    <strong>
                        ${ht("flight.noFlights")}
                    </strong>

                    <p>
                        ${ht("flight.checkLater")}
                    </p>
                </div>

            </div>
        `;

        return;
    }

    for (const flight of flights) {
        const mine =
            !!currentUser &&
            flight.claimed_by === currentUser.id;

        const id = esc(flight.id);

        let actions = "";

        if (flight.status === "available") {
            actions = currentUser
                ? `
                    <button
                        class="btn btn-primary"
                        onclick="claimFlight('${id}')"
                    >
                        ${ht("flight.claim")}
                    </button>
                `
                : `
                    <button
                        class="btn btn-secondary"
                        onclick="loginWithDiscord()"
                    >
                        ${ht("flight.loginClaim")}
                    </button>
                `;

        } else if (flight.status === "claimed") {
            actions = mine
                ? `
                    <button
                        class="btn btn-primary"
                        onclick="startFlight('${id}')"
                    >
                        ${ht("flight.start")}
                    </button>
                `
                : `
                    <span class="action-note">
                        ${ht("flight.claimedByOther")}
                    </span>
                `;

        } else if (
            flight.status === "in_progress" &&
            mine
        ) {
            actions = `
                <button
                    class="btn btn-secondary"
                    onclick="recordEvent('${id}','pushback')"
                >
                    ${ht("flight.pushback")}
                </button>

                <button
                    class="btn btn-secondary"
                    onclick="recordEvent('${id}','takeoff')"
                >
                    ${ht("flight.takeoff")}
                </button>

                <button
                    class="btn btn-secondary"
                    onclick="recordEvent('${id}','landing')"
                >
                    ${ht("flight.landing")}
                </button>

                <button
                    class="btn btn-dark"
                    onclick="completeFlight('${id}')"
                >
                    ${ht("flight.end")}
                </button>
            `;

        } else if (flight.status === "in_progress") {
            actions = `
                <span class="action-note">
                    ${ht("flight.operatedByOther")}
                </span>
            `;

        } else if (flight.status === "completed") {
            actions = `
                <span class="action-note success-text">
                    ✓ ${ht("flight.completed")}
                </span>
            `;
        }

        const timeline = mine
            ? `
                <div class="timeline-box">

                    ${
                        flight.started_at
                            ? `▶ ${ht("flight.startedAt")}: ${date(flight.started_at)}<br>`
                            : ""
                    }

                    ${
                        flight.pushback_at
                            ? `↪ ${ht("flight.pushbackAt")}: ${date(flight.pushback_at)}<br>`
                            : ""
                    }

                    ${
                        flight.takeoff_at
                            ? `🛫 ${ht("flight.takeoffAt")}: ${date(flight.takeoff_at)}<br>`
                            : ""
                    }

                    ${
                        flight.landing_at
                            ? `🛬 ${ht("flight.landingAt")}: ${date(flight.landing_at)}<br>`
                            : ""
                    }

                    ${
                        flight.completed_at
                            ? `✓ ${ht("flight.completedAt")}: ${date(flight.completed_at)}`
                            : ""
                    }

                </div>
            `
            : "";

        const recurrence =
            flight.recurrence &&
            flight.recurrence !== "once"
                ? `
                    <div class="tag-row">
                        <span class="tag">
                            ${ht(`form.${flight.recurrence}`)}
                        </span>
                    </div>
                `
                : "";

        const card =
            document.createElement("article");

        card.className = "flight-card";

        card.innerHTML = `
            <div class="card-topline">

                <div>
                    <span class="eyebrow">
                        ATC24
                    </span>

                    <h3>
                        ${esc(flight.flight_number)}
                    </h3>
                </div>

                <span class="status ${flightStatusClass(flight.status)}">
                    ${ht(
                        flight.status === "completed"
                            ? "status.completed"
                            : flight.status === "claimed"
                                ? "state.claimed"
                                : flight.status === "in_progress"
                                    ? "state.inProgress"
                                    : "state.available"
                    )}
                </span>

            </div>

            <div class="route-line">

                <span>
                    ${esc(flight.departure_airport)}
                </span>

                <span class="route-arrow">→</span>

                <span>
                    ${esc(flight.arrival_airport)}
                </span>

            </div>

            <div class="info-grid">

                <div class="info-box">
                    <span>
                        ${ht("flight.departure")}
                    </span>

                    <strong>
                        ${date(flight.scheduled_departure)}
                    </strong>
                </div>

                <div class="info-box">
                    <span>
                        ${ht("flight.aircraft")}
                    </span>

                    <strong>
                        ${esc(flight.aircraft_model)}
                    </strong>
                </div>

                <div class="info-box">
                    <span>
                        ${ht("flight.operator")}
                    </span>

                    <strong>
                        ${esc(flight.operator_airline)}
                    </strong>
                </div>

                <div class="info-box">
                    <span>
                        ${ht("flight.livery")}
                    </span>

                    <strong>
                        ${esc(flight.livery_airline)}
                    </strong>
                </div>

            </div>

            ${recurrence}

            ${
                flight.additional_info
                    ? `
                        <div class="additional">
                            ${esc(flight.additional_info)}
                        </div>
                    `
                    : ""
            }

            ${timeline}

            <div class="actions">
                ${actions}
            </div>
        `;

        board.appendChild(card);
    }
}

/* ============================================================
   SECURED ATC24 ACTIONS
   ============================================================ */

async function claimFlight(id) {
    if (!currentUser) {
        return loginWithDiscord();
    }

    await ensureProfile();

    if (!currentProfile?.pilot_approved) {
        return msg(
            t("flight.approvalRequired"),
            "error"
        );
    }

    const { data, error } =
        await supabaseClient.rpc(
            "claim_atc24_flight",
            {
                p_flight_id: id
            }
        );

    if (error) {
        return msg(
            errMsg("message.claimFailed", error),
            "error"
        );
    }

    if (!data?.success) {
        return msg(
            t("message.claimUnavailable"),
            "error"
        );
    }

    msg(
        t("message.claimSuccess"),
        "success"
    );

    await loadFlights();
}

async function runAtc24Action(id, action) {
    if (!currentUser) {
        return loginWithDiscord();
    }

    const { data, error } =
        await supabaseClient.rpc(
            "update_atc24_flight",
            {
                p_flight_id: id,
                p_action: action
            }
        );

    if (error) {
        return msg(
            errMsg("message.actionFailed", error),
            "error"
        );
    }

    if (!data?.success) {
        return msg(
            t("message.actionFailed"),
            "error"
        );
    }

    msg(
        t(
            action === "complete"
                ? "message.flightComplete"
                : "message.actionSuccess"
        ),
        "success"
    );

    await loadFlights();
}

async function startFlight(id) {
    return runAtc24Action(id, "start");
}

async function recordEvent(id, event) {
    if (
        !["pushback", "takeoff", "landing"].includes(
            event
        )
    ) {
        return;
    }

    return runAtc24Action(id, event);
}

async function completeFlight(id) {
    return runAtc24Action(id, "complete");
}

/* ============================================================
   ATC24 ADMIN
   ============================================================ */

async function createFlight() {
    if (!admin()) {
        return msg(
            t("message.adminOnly"),
            "error"
        );
    }

    const ids = [
        "flightNumber",
        "departure",
        "arrival",
        "scheduled",
        "aircraft",
        "operator",
        "livery"
    ];

    const values = Object.fromEntries(
        ids.map(id => [
            id,
            $(id)?.value.trim() || ""
        ])
    );

    if (
        Object.values(values).some(
            value => !value
        )
    ) {
        return msg(
            t("message.requiredAtc"),
            "error"
        );
    }

    const departureTime =
        new Date(values.scheduled);

    if (
        Number.isNaN(departureTime.getTime())
    ) {
        return msg(
            t("message.invalidDate"),
            "error"
        );
    }

    const { error } =
        await supabaseClient
            .from("flights")
            .insert({
                flight_number: values.flightNumber,
                departure_airport: values.departure,
                arrival_airport: values.arrival,

                scheduled_departure:
                    departureTime.toISOString(),

                aircraft_model: values.aircraft,
                operator_airline: values.operator,
                livery_airline: values.livery,

                recurrence:
                    $("recurrence")?.value || "once",

                additional_info:
                    $("additionalInfo")?.value.trim() || null,

                status: "available"
            });

    if (error) {
        return msg(
            errMsg("message.errorCreate", error),
            "error"
        );
    }

    msg(
        t("message.createdAtc"),
        "success"
    );

    [...ids, "additionalInfo"].forEach(id => {
        if ($(id)) {
            $(id).value = "";
        }
    });

    await Promise.all([
        loadFlights(),
        loadAdminFlights()
    ]);
}

async function loadAdminFlights() {
    if (!admin()) return;

    const board = $("adminFlights");
    if (!board) return;

    const { data, error } =
        await supabaseClient
            .from("flights")
            .select("*")
            .order(
                "scheduled_departure",
                { ascending: false }
            );

    if (error) {
        board.innerHTML = `
            <div class="error-state">
                ${ht("message.loadAdminFlights")}:
                ${esc(error.message)}
            </div>
        `;

        return;
    }

    board.innerHTML = data?.length
        ? ""
        : `
            <div class="empty-state compact">
                <span class="empty-icon">📭</span>

                <div>
                    <strong>
                        ${ht("message.noAdminAtc")}
                    </strong>
                </div>
            </div>
        `;

    for (const flight of data || []) {
        const row =
            document.createElement("div");

        row.className = "admin-row";

        row.innerHTML = `
            <div>
                <strong>
                    ${esc(flight.flight_number)}
                </strong>

                <span>
                    ${esc(flight.departure_airport)}
                    →
                    ${esc(flight.arrival_airport)}
                </span>

                <small>
                    ${date(flight.scheduled_departure)}
                    ·
                    ${ht(`form.${flight.recurrence || "once"}`)}
                    ·
                    ${esc(flightStatusText(flight.status))}
                </small>
            </div>

            <button
                class="btn btn-danger"
                onclick="deleteFlight('${esc(flight.id)}')"
            >
                ${ht("admin.delete")}
            </button>
        `;

        board.appendChild(row);
    }
}

async function deleteFlight(id) {
    if (!admin()) {
        return msg(
            t("message.adminOnly"),
            "error"
        );
    }

    if (
        !confirm(
            t("message.deleteAtcConfirm")
        )
    ) {
        return;
    }

    const { error } =
        await supabaseClient
            .from("flights")
            .delete()
            .eq("id", id);

    if (error) {
        return msg(
            errMsg("message.errorDelete", error),
            "error"
        );
    }

    msg(
        t("message.deletedAtc"),
        "success"
    );

    await Promise.all([
        loadFlights(),
        loadAdminFlights()
    ]);
}

/* ============================================================
   EVENT FLIGHTS
   ============================================================ */

async function booking(eventId) {
    if (!currentUser) return null;

    const { data, error } =
        await supabaseClient
            .from("event_bookings")
            .select("*")
            .eq("event_id", eventId)
            .eq("user_id", currentUser.id)
            .maybeSingle();

    if (error) {
        console.warn(
            "Booking lookup:",
            error.message
        );
    }

    return data || null;
}

async function counts(eventId) {
    const { data, error } =
        await supabaseClient.rpc(
            "get_event_booking_counts",
            {
                p_event_id: String(eventId)
            }
        );

    if (error) {
        console.error(
            "Booking counts:",
            error
        );

        return {
            economy: 0,
            business: 0,
            first: 0
        };
    }

    const row = Array.isArray(data)
        ? data[0]
        : data;

    return {
        economy: Number(row?.economy || 0),
        business: Number(row?.business || 0),
        first: Number(row?.first_class || 0)
    };
}

async function loadEvents() {
    const board = $("eventFlightBoard");
    if (!board) return;

    const { data, error } =
        await supabaseClient
            .from("events")
            .select("*")
            .order(
                "departure_time",
                { ascending: true }
            );

    if (error) {
        board.innerHTML = `
            <div class="error-state">
                ${ht("message.loadEvents")}:
                ${esc(error.message)}
            </div>
        `;

        return;
    }

    lastEvents = Array.from(
        new Map(
            (data || []).map(event => [
                String(event.id),
                event
            ])
        ).values()
    );

    await renderEvents(lastEvents);
}

async function renderEvents(events) {
    const board = $("eventFlightBoard");
    const counter = $("eventFlightCount");

    if (!board) return;

    board.innerHTML = "";

    if (counter) {
        counter.textContent = t(
            events.length === 1
                ? "event.one"
                : "event.many",
            {
                count: num(events.length)
            }
        );
    }

    if (!events.length) {
        board.innerHTML = `
            <div class="empty-state">

                <span class="empty-icon">🌍</span>

                <div>
                    <strong>
                        ${ht("event.noEvents")}
                    </strong>

                    <p>
                        ${ht("event.newSoon")}
                    </p>
                </div>

            </div>
        `;

        return;
    }

    for (const event of events) {
        const currentBooking =
            await booking(event.id);

        const capacity =
            await counts(event.id);

        const distance =
            event.distance_type || "short";

        const points = Number(
            event.points ||
            DISTANCE_POINTS[distance] ||
            1
        );

        let actions = "";

        if (event.status === "cancelled") {
            actions = `
                <span class="action-note error-text">
                    ❌ ${ht("event.cancelled")}
                </span>
            `;

        } else if (currentBooking?.completed) {
            actions = `
                <span class="action-note success-text">
                    ✓ ${ht("event.awarded", {
                        miles: num(event.miles),
                        points: num(points)
                    })}
                </span>
            `;

        } else if (currentBooking) {
            const canComplete =
                event.status === "completed" &&
                currentBooking.checked_in &&
                currentBooking.boarded &&
                !currentBooking.completed;

            actions = `
                <div class="booking-status">

                    <strong>
                        🎫 ${ht("event.booked")}
                        ·
                        ${esc(className(currentBooking.travel_class))}
                    </strong>

                    <span>
                        ${
                            currentBooking.checked_in
                                ? "✓"
                                : "•"
                        }

                        ${ht(
                            currentBooking.checked_in
                                ? "event.checkedIn"
                                : "event.notCheckedIn"
                        )}
                    </span>

                    <span>
                        ${
                            currentBooking.boarded
                                ? "✓"
                                : "•"
                        }

                        ${ht(
                            currentBooking.boarded
                                ? "event.boarded"
                                : "event.notBoarded"
                        )}
                    </span>

                </div>

                <div class="actions">

                    ${
                        !currentBooking.checked_in &&
                        event.status !== "completed"
                            ? `
                                <button
                                    class="btn btn-primary"
                                    onclick="checkInEventFlight('${esc(currentBooking.id)}')"
                                >
                                    ${ht("event.checkIn")}
                                </button>
                            `
                            : ""
                    }

                    ${
                        currentBooking.checked_in &&
                        !currentBooking.boarded &&
                        event.status !== "completed"
                            ? `
                                <button
                                    class="btn btn-secondary"
                                    onclick="boardEventFlight('${esc(currentBooking.id)}')"
                                >
                                    ${ht("event.board")}
                                </button>
                            `
                            : ""
                    }

                    ${
                        canComplete
                            ? `
                                <button
                                    class="btn btn-primary"
                                    onclick="completeEventBooking('${esc(currentBooking.id)}')"
                                >
                                    ${ht("event.complete")}
                                </button>
                            `
                            : ""
                    }

                </div>
            `;

        } else if (!currentUser) {
            actions = `
                <button
                    class="btn btn-secondary"
                    onclick="loginWithDiscord()"
                >
                    ${ht("event.loginBook")}
                </button>
            `;

        } else if (event.status === "completed") {
            actions = `
                <span class="action-note">
                    ${ht("event.finished")}
                </span>
            `;

        } else {
            const economyAvailable =
                Number(event.economy_capacity || 0) >
                capacity.economy;

            const businessAvailable =
                Number(event.business_capacity || 0) >
                capacity.business;

            const firstAvailable =
                Number(event.first_capacity || 0) >
                capacity.first;

            const id = esc(event.id);

            actions = `
                <div class="actions">

                    ${
                        economyAvailable
                            ? `
                                <button
                                    class="btn btn-primary"
                                    onclick="bookEventFlight('${id}','economy')"
                                >
                                    ${ht("event.bookEconomy")}
                                </button>
                            `
                            : `
                                <span class="action-note">
                                    ${ht("event.economyFull")}
                                </span>
                            `
                    }

                    ${
                        canClass("business")
                            ? (
                                businessAvailable
                                    ? `
                                        <button
                                            class="btn btn-secondary"
                                            onclick="bookEventFlight('${id}','business')"
                                        >
                                            ${ht("event.bookBusiness")}
                                        </button>
                                    `
                                    : `
                                        <span class="action-note">
                                            ${ht("event.businessFull")}
                                        </span>
                                    `
                            )
                            : `
                                <span class="action-note">
                                    🔒 ${ht("event.businessLocked")}
                                </span>
                            `
                    }

                    ${
                        canClass("first")
                            ? (
                                firstAvailable
                                    ? `
                                        <button
                                            class="btn btn-dark"
                                            onclick="bookEventFlight('${id}','first')"
                                        >
                                            ${ht("event.bookFirst")}
                                        </button>
                                    `
                                    : `
                                        <span class="action-note">
                                            ${ht("event.firstFull")}
                                        </span>
                                    `
                            )
                            : `
                                <span class="action-note">
                                    🔒 ${ht("event.firstLocked")}
                                </span>
                            `
                    }

                </div>
            `;
        }

        const card =
            document.createElement("article");

        card.className = "flight-card";

        card.innerHTML = `
            <div class="card-topline">

                <div>
                    <span class="eyebrow">
                        ${ht("flight.eventLabel")}
                    </span>

                    <h3>
                        ${esc(event.flight_number)}
                    </h3>
                </div>

                <span class="status ${eventStatusClass(event.status)}">
                    ${esc(eventStatusText(event.status))}
                </span>

            </div>

            <div class="route-line">

                <span>
                    ${esc(event.departure)}
                </span>

                <span class="route-arrow">→</span>

                <span>
                    ${esc(event.arrival)}
                </span>

            </div>

            <div class="info-grid">

                <div class="info-box">
                    <span>
                        ${ht("flight.departure")}
                    </span>

                    <strong>
                        ${date(event.departure_time)}
                    </strong>
                </div>

                <div class="info-box">
                    <span>
                        ${ht("flight.aircraft")}
                    </span>

                    <strong>
                        ${esc(event.aircraft_model)}
                    </strong>
                </div>

                <div class="info-box">
                    <span>
                        ${ht("event.distance")}
                    </span>

                    <strong>
                        ${esc(distanceName(distance))}
                    </strong>
                </div>

                <div class="info-box">
                    <span>Miles &amp; More</span>

                    <strong>
                        ${num(points)}
                        ${ht("event.pointUnit")}
                        ·
                        ${num(event.miles)} Miles
                    </strong>
                </div>

            </div>

            <div class="capacity-grid">

                <div>
                    <span>
                        ${ht("event.economy")}
                    </span>

                    <strong>
                        ${num(capacity.economy)}/${num(event.economy_capacity)}
                    </strong>
                </div>

                <div>
                    <span>
                        ${ht("event.business")}
                    </span>

                    <strong>
                        ${num(capacity.business)}/${num(event.business_capacity)}
                    </strong>
                </div>

                <div>
                    <span>
                        ${ht("event.first")}
                    </span>

                    <strong>
                        ${num(capacity.first)}/${num(event.first_capacity)}
                    </strong>
                </div>

            </div>

            <div class="actions booking-actions">
                ${actions}
            </div>
        `;

        board.appendChild(card);
    }
}

/* ============================================================
   EVENT BOOKINGS
   ============================================================ */

async function bookEventFlight(id, travelClass) {
    if (!currentUser) {
        return loginWithDiscord();
    }

    if (!canClass(travelClass)) {
        return msg(
            t("message.bookStatus", {
                className: className(travelClass),

                status:
                    travelClass === "business"
                        ? "Frequent Traveller"
                        : "Senator"
            }),
            "error"
        );
    }

    const cost =
        travelClass === "business"
            ? 20000
            : travelClass === "first"
                ? 100000
                : 0;

    const miles = Number(
        currentProfile?.miles || 0
    );

    if (miles < cost) {
        return msg(
            t("message.bookMiles", {
                miles: num(cost),
                className: className(travelClass)
            }),
            "error"
        );
    }

    const { data, error } =
        await supabaseClient.rpc(
            "book_event_flight_with_miles",
            {
                p_event_id: Number(id),
                p_travel_class: travelClass
            }
        );

    if (error) {
        return msg(
            errMsg("message.bookFailed", error),
            "error"
        );
    }

    if (!data?.success) {
        return msg(
            t("message.bookUnavailable"),
            "error"
        );
    }

    await ensureProfile();
    updateMiles();

    msg(
        `${
            t("message.booked", {
                className: className(travelClass)
            })
        } ${
            cost
                ? t("message.milesDeducted", {
                    miles: num(cost)
                })
                : t("message.noMilesDeducted")
        }`,
        "success"
    );

    await loadEvents();
}

async function checkInEventFlight(id) {
    const { error } =
        await supabaseClient.rpc(
            "check_in_event_flight",
            {
                p_booking_id: id
            }
        );

    if (error) {
        return msg(
            errMsg("message.checkInFailed", error),
            "error"
        );
    }

    msg(
        t("message.checkInSuccess"),
        "success"
    );

    await loadEvents();
}

async function boardEventFlight(id) {
    const { error } =
        await supabaseClient.rpc(
            "board_event_flight",
            {
                p_booking_id: id
            }
        );

    if (error) {
        return msg(
            errMsg("message.boardFailed", error),
            "error"
        );
    }

    msg(
        t("message.boardSuccess"),
        "success"
    );

    await loadEvents();
}

async function completeEventBooking(id) {
    const { data, error } =
        await supabaseClient.rpc(
            "complete_event_flight",
            {
                p_booking_id: id
            }
        );

    if (error) {
        return msg(
            errMsg("message.completeEventFailed", error),
            "error"
        );
    }

    const result = Array.isArray(data)
        ? data[0]
        : data;

    await ensureProfile();

    updateMiles();
    await loadEvents();

    msg(
        t("message.completeEventSuccess", {
            miles: num(
                result?.miles_awarded || 0
            ),

            points: num(
                result?.points_awarded || 0
            ),

            status: statusName(
                result?.new_status
            )
        }),
        "success"
    );
}

/* ============================================================
   EVENT FLIGHT ADMIN
   ============================================================ */

async function createEventFlight() {
    if (!admin()) {
        return msg(
            t("message.adminOnly"),
            "error"
        );
    }

    const get = id =>
        $(id)?.value.trim() || "";

    const flightNumber =
        get("eventFlightNumber");

    const departure =
        get("eventDeparture");

    const arrival =
        get("eventArrival");

    const time =
        $("eventDepartureTime")?.value;

    const aircraft =
        get("eventAircraft");

    const pilot =
        get("eventPilot");

    const distance =
        $("eventDistance")?.value || "short";

    const miles = Number(
        $("eventMiles")?.value || 0
    );

    const economy = Number(
        $("economyCapacity")?.value || 0
    );

    const business = Number(
        $("businessCapacity")?.value || 0
    );

    const first = Number(
        $("firstCapacity")?.value || 0
    );

    const status =
        $("eventStatus")?.value || "scheduled";

    if (
        !flightNumber ||
        !departure ||
        !arrival ||
        !time ||
        !aircraft
    ) {
        return msg(
            t("message.requiredEvent"),
            "error"
        );
    }

    const departureTime =
        new Date(time);

    if (
        Number.isNaN(departureTime.getTime())
    ) {
        return msg(
            t("message.invalidDate"),
            "error"
        );
    }

    if (
        !Object.hasOwn(
            DISTANCE_POINTS,
            distance
        )
    ) {
        return msg(
            t("message.invalidDistance"),
            "error"
        );
    }

    if (
        ![miles, economy, business, first].every(
            Number.isInteger
        ) ||
        [miles, economy, business, first].some(
            value => value < 0
        )
    ) {
        return msg(
            t("message.invalidNumbers"),
            "error"
        );
    }

    const { error } =
        await supabaseClient.rpc(
            "create_event_flight_admin",
            {
                p_flight_number: flightNumber,
                p_departure: departure,
                p_arrival: arrival,

                p_departure_time:
                    departureTime.toISOString(),

                p_aircraft_model: aircraft,
                p_pilot_discord_id: pilot || null,
                p_distance_type: distance,
                p_miles: miles,
                p_economy_capacity: economy,
                p_business_capacity: business,
                p_first_capacity: first,
                p_status: status
            }
        );

    if (error) {
        return msg(
            errMsg("message.errorCreate", error),
            "error"
        );
    }

    msg(
        t("message.createdEvent", {
            points: DISTANCE_POINTS[distance],
            miles: num(miles)
        }),
        "success"
    );

    [
        "eventFlightNumber",
        "eventDeparture",
        "eventArrival",
        "eventDepartureTime",
        "eventAircraft",
        "eventPilot",
        "eventMiles"
    ].forEach(id => {
        if ($(id)) {
            $(id).value = "";
        }
    });

    await Promise.all([
        loadEvents(),
        loadAdminEvents()
    ]);
}

async function loadAdminEvents() {
    if (!admin()) return;

    const board = $("adminEventFlights");
    if (!board) return;

    const { data, error } =
        await supabaseClient
            .from("events")
            .select("*")
            .order(
                "departure_time",
                { ascending: false }
            );

    if (error) {
        board.innerHTML = `
            <div class="error-state">
                ${ht("message.loadAdminEvents")}:
                ${esc(error.message)}
            </div>
        `;

        return;
    }

    board.innerHTML = data?.length
        ? ""
        : `
            <div class="empty-state compact">
                <span class="empty-icon">📭</span>

                <div>
                    <strong>
                        ${ht("message.noAdminEvents")}
                    </strong>
                </div>
            </div>
        `;

    for (const event of data || []) {
        const options = [
            "scheduled",
            "boarding",
            "departed",
            "completed",
            "cancelled"
        ].map(status => `
            <option
                value="${status}"
                ${event.status === status ? "selected" : ""}
            >
                ${esc(eventStatusText(status))}
            </option>
        `).join("");

        const row =
            document.createElement("div");

        row.className = "admin-row";

        row.innerHTML = `
            <div>

                <strong>
                    ${esc(event.flight_number)}
                </strong>

                <span>
                    ${esc(event.departure)}
                    →
                    ${esc(event.arrival)}
                </span>

                <small>
                    ${date(event.departure_time)}
                    ·
                    ${esc(distanceName(event.distance_type))}
                    ·
                    ${num(event.points)}
                    ${ht("event.pointUnit")}
                    ·
                    ${num(event.miles)} Miles
                </small>

            </div>

            <div class="admin-actions">

                <select
                    class="admin-status-select"
                    onchange="updateEventStatus('${esc(event.id)}',this.value)"
                >
                    ${options}
                </select>

                <button
                    class="btn btn-danger"
                    onclick="deleteEventFlight('${esc(event.id)}')"
                >
                    ${ht("admin.delete")}
                </button>

            </div>
        `;

        board.appendChild(row);
    }
}

async function updateEventStatus(id, status) {
    if (!admin()) return;

    const { error } =
        await supabaseClient.rpc(
            "update_event_status_admin",
            {
                p_event_id: String(id),
                p_status: status
            }
        );

    if (error) {
        msg(
            errMsg("message.errorEventStatus", error),
            "error"
        );

        await loadAdminEvents();
        return;
    }

    msg(
        t("message.eventStatusUpdated"),
        "success"
    );

    await Promise.all([
        loadEvents(),
        loadAdminEvents()
    ]);
}

async function deleteEventFlight(id) {
    if (!admin()) {
        return msg(
            t("message.adminOnly"),
            "error"
        );
    }

    if (
        !confirm(
            t("message.deleteEventConfirm")
        )
    ) {
        return;
    }

    const { error } =
        await supabaseClient.rpc(
            "delete_event_flight_admin",
            {
                p_event_id: String(id)
            }
        );

    if (error) {
        return msg(
            errMsg("message.errorDelete", error),
            "error"
        );
    }

    msg(
        t("message.deletedEvent"),
        "success"
    );

    await Promise.all([
        loadEvents(),
        loadAdminEvents()
    ]);
}

/* ============================================================
   ADMIN NAVIGATION
   ============================================================ */

function updateAdminUI() {
    const allowed = admin();

    $("adminPanel")?.classList.toggle(
        "hidden",
        !allowed
    );

    $("eventAdminPanel")?.classList.toggle(
        "hidden",
        !allowed
    );

    $("adminNavLink")?.classList.toggle(
        "hidden",
        !allowed
    );

    if (allowed) {
        loadAdminFlights();
        loadAdminEvents();

    } else if (
        window.location.hash === "#admin"
    ) {
        window.location.hash = "#home";
    }
}

/* ============================================================
   REFRESH
   ============================================================ */

async function refresh() {
    await Promise.all([
        loadFlights(),
        loadEvents()
    ]);

    if (admin()) {
        await Promise.all([
            loadAdminFlights(),
            loadAdminEvents()
        ]);
    }
}

/* ============================================================
   LANGUAGE CHANGE
   ============================================================ */

async function redrawInSelectedLanguage() {
    updateMiles();

    renderFlights(lastFlights);

    await renderEvents(lastEvents);

    if (admin()) {
        await Promise.all([
            loadAdminFlights(),
            loadAdminEvents()
        ]);
    }
}

document.addEventListener(
    "afo-language-change",
    () => {
        redrawInSelectedLanguage().catch(
            error => console.error(
                "Language redraw:",
                error
            )
        );
    }
);

/* ============================================================
   SUPABASE AUTH STATE
   ============================================================ */

supabaseClient.auth.onAuthStateChange(
    (_event, session) => {
        setTimeout(
            async () => {
                currentUser =
                    session?.user || null;

                if (currentUser) {
                    await ensureProfile();
                } else {
                    currentProfile = null;
                }

                updateUI();
                await refresh();
            },
            0
        );
    }
);

/* ============================================================
   START
   ============================================================ */

document.addEventListener(
    "DOMContentLoaded",
    async () => {
        $("loginButton")?.addEventListener(
            "click",
            loginWithDiscord
        );

        $("logoutButton")?.addEventListener(
            "click",
            logout
        );

        await loadUser();
        await refresh();
    }
);
