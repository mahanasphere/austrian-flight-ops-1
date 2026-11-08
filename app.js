
const SUPABASE_URL = "https://qdtpwggllgnyzazmshyf.supabase.co";
const SUPABASE_KEY = "sb_publishable_zgfXsfelbYVAGcvKk1wRhA_ok9n8jjl";

const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY,
    {
        auth: {
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: true
        }
    }
);

const ADMIN_DISCORD_ID = "1214124494340493312";

const MILES_AND_MORE_STATUS = {
    member: { name: "Member", points: 0 },
    frequent_traveller: {
        name: "Frequent Traveller",
        points: 100
    },
    senator: { name: "Senator", points: 350 },
    hon_circle_member: {
        name: "HON Circle Member",
        points: 1000
    }
};

const DISTANCE_POINTS = {
    short: 1,
    medium: 2,
    long: 3
};

let currentUser = null;
let currentProfile = null;
let authBusy = false;

const $ = id => document.getElementById(id);

const esc = value => String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const num = value =>
    Number(value || 0).toLocaleString("en-US");

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

function date(value) {
    if (!value) return "—";

    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return "—";

    return new Intl.DateTimeFormat("en-GB", {
        timeZone: "Europe/Vienna",
        dateStyle: "medium",
        timeStyle: "short"
    }).format(parsed);
}

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
    return {
        short: "Short-haul",
        medium: "Medium-haul",
        long: "Long-haul"
    }[distance] || "Short-haul";
}

function className(travelClass) {
    return {
        economy: "Economy",
        business: "Business",
        first: "First"
    }[travelClass] || "Economy";
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
    return {
        scheduled: "SCHEDULED",
        boarding: "BOARDING",
        departed: "DEPARTED",
        completed: "COMPLETED",
        cancelled: "CANCELLED"
    }[status] || "SCHEDULED";
}

function flightStatusClass(status) {
    return {
        claimed: "claimed",
        in_progress: "progress",
        completed: "completed"
    }[status] || "available";
}

function flightStatusText(status) {
    return {
        claimed: "CLAIMED",
        in_progress: "IN PROGRESS",
        completed: "COMPLETED"
    }[status] || "AVAILABLE";
}

/* =========================================
   DISCORD LOGIN
========================================= */

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
            console.error(error);
            msg(
                `Discord login failed: ${error.message}`,
                "error"
            );
        }
    } catch (error) {
        console.error(error);
        msg(
            `Discord login failed: ${error.message}`,
            "error"
        );
    } finally {
        authBusy = false;
    }
}

async function finishOAuth() {
    const params = new URLSearchParams(
        window.location.search
    );

    const code = params.get("code");
    if (!code) return;

    const { error } =
        await supabaseClient.auth.exchangeCodeForSession(
            code
        );

    if (error) {
        console.error("OAuth exchange failed:", error);
        msg(`Discord login failed: ${error.message}`, "error");
        return;
    }

    window.history.replaceState(
        {},
        document.title,
        window.location.pathname
    );
}

/* =========================================
   PROFILE
========================================= */

async function ensureProfile() {
    if (!currentUser) return;

    const { error } = await supabaseClient.rpc(
        "ensure_my_profile"
    );

    if (error) {
        console.warn("Profile setup:", error.message);
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
        msg(error.message, "error");
    }

    const { data, error } =
        await supabaseClient.auth.getSession();

    if (error) {
        msg(`Session error: ${error.message}`, "error");
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
        msg(error.message, "error");
        return;
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

    const userName = $("userName");

    if (userName) {
        const metadata = currentUser?.user_metadata || {};

        userName.textContent =
            metadata.global_name ||
            metadata.full_name ||
            metadata.name ||
            metadata.preferred_username ||
            "Pilot";
    }

    updateMiles();
    updateAdminUI();
}

/* =========================================
   MILES & MORE
========================================= */

function updateMiles() {
    const panel = $("milesMorePanel");
    if (!panel) return;

    if (!currentUser || !currentProfile) {
        panel.innerHTML = `
            <div class="empty-state compact">
                <span class="empty-icon">💳</span>
                <div>
                    <strong>
                        Sign in to view your Miles & More profile.
                    </strong>
                    <p>
                        Track Miles, Points and your current status.
                    </p>
                </div>
            </div>
        `;
        return;
    }

    const points = Number(currentProfile.points || 0);
    const miles = Number(currentProfile.miles || 0);

    const status =
        currentProfile.miles_and_more_status || "member";

    const next = Object.entries(
        MILES_AND_MORE_STATUS
    ).find(([, value]) => value.points > points);

    panel.innerHTML = `
        <div class="miles-grid">
            <div class="miles-stat accent-stat">
                <span class="stat-label">Miles</span>
                <strong>${num(miles)}</strong>
                <small>Lifetime Miles</small>
            </div>

            <div class="miles-stat">
                <span class="stat-label">Points</span>
                <strong>${num(points)}</strong>
                <small>Miles &amp; More Points</small>
            </div>

            <div class="miles-stat">
                <span class="stat-label">Status</span>
                <strong>${esc(statusName(status))}</strong>
                <small>
                    ${
                        next
                        ? `${next[1].points - points} point(s) to ${esc(next[1].name)}`
                        : "Highest status reached"
                    }
                </small>
            </div>
        </div>
    `;
}

/* =========================================
   ATC24 FLIGHTS
========================================= */

function viennaDay() {
    return new Intl.DateTimeFormat("en-US", {
        timeZone: "Europe/Vienna",
        weekday: "short"
    }).format(new Date());
}

function visibleToday(flight) {
    const recurrence = flight.recurrence || "once";

    if (["once", "daily"].includes(recurrence)) {
        return true;
    }

    const today = viennaDay();

    if (recurrence === "weekdays") {
        return ["Mon", "Tue", "Wed", "Thu", "Fri"]
            .includes(today);
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
            .order("scheduled_departure", {
                ascending: true
            });

    if (error) {
        board.innerHTML = `
            <div class="error-state">
                Could not load flights:
                ${esc(error.message)}
            </div>
        `;
        return;
    }

    renderFlights((data || []).filter(visibleToday));
}

function renderFlights(flights) {
    const board = $("flightBoard");
    const counter = $("flightCount");

    if (!board) return;

    board.innerHTML = "";

    if (counter) {
        counter.textContent =
            `${flights.length} ${
                flights.length === 1 ? "flight" : "flights"
            }`;
    }

    if (!flights.length) {
        board.innerHTML = `
            <div class="empty-state">
                <span class="empty-icon">✈️</span>
                <div>
                    <strong>
                        No ATC24 flights available today.
                    </strong>
                    <p>
                        Check back later for the next scheduled operation.
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

        let actions = "";

        if (flight.status === "available") {
            actions = currentUser
                ? `
                    <button class="btn btn-primary"
                        onclick="claimFlight('${flight.id}')">
                        CLAIM FLIGHT
                    </button>
                `
                : `
                    <button class="btn btn-secondary"
                        onclick="loginWithDiscord()">
                        LOGIN WITH DISCORD TO CLAIM
                    </button>
                `;
        } else if (flight.status === "claimed") {
            actions = mine
                ? `
                    <button class="btn btn-primary"
                        onclick="startFlight('${flight.id}')">
                        START FLIGHT
                    </button>
                `
                : `
                    <span class="action-note">
                        Pilot has claimed this flight.
                    </span>
                `;
        } else if (
            flight.status === "in_progress" && mine
        ) {
            actions = `
                <button class="btn btn-secondary"
                    onclick="recordEvent('${flight.id}','pushback')">
                    PUSHBACK
                </button>

                <button class="btn btn-secondary"
                    onclick="recordEvent('${flight.id}','takeoff')">
                    TAKEOFF
                </button>

                <button class="btn btn-secondary"
                    onclick="recordEvent('${flight.id}','landing')">
                    LANDING
                </button>

                <button class="btn btn-dark"
                    onclick="completeFlight('${flight.id}')">
                    END FLIGHT
                </button>
            `;
        } else if (flight.status === "in_progress") {
            actions = `
                <span class="action-note">
                    Pilot is currently operating this flight.
                </span>
            `;
        } else if (flight.status === "completed") {
            actions = `
                <span class="action-note success-text">
                    ✓ Flight completed
                </span>
            `;
        }

        const timeline = mine
            ? `
                <div class="timeline-box">
                    ${
                        flight.started_at
                        ? `▶ Started: ${date(flight.started_at)}<br>`
                        : ""
                    }
                    ${
                        flight.pushback_at
                        ? `↪ Pushback: ${date(flight.pushback_at)}<br>`
                        : ""
                    }
                    ${
                        flight.takeoff_at
                        ? `🛫 Takeoff: ${date(flight.takeoff_at)}<br>`
                        : ""
                    }
                    ${
                        flight.landing_at
                        ? `🛬 Landing: ${date(flight.landing_at)}<br>`
                        : ""
                    }
                    ${
                        flight.completed_at
                        ? `✓ Completed: ${date(flight.completed_at)}`
                        : ""
                    }
                </div>
            `
            : "";

        const card = document.createElement("article");
        card.className = "flight-card";

        card.innerHTML = `
            <div class="card-topline">
                <div>
                    <span class="eyebrow">ATC24</span>
                    <h3>${esc(flight.flight_number)}</h3>
                </div>

                <span class="status ${flightStatusClass(flight.status)}">
                    ${flightStatusText(flight.status)}
                </span>
            </div>

            <div class="route-line">
                <span>${esc(flight.departure_airport)}</span>
                <span class="route-arrow">→</span>
                <span>${esc(flight.arrival_airport)}</span>
            </div>

            <div class="info-grid">
                <div class="info-box">
                    <span>Departure</span>
                    <strong>${date(flight.scheduled_departure)}</strong>
                </div>

                <div class="info-box">
                    <span>Aircraft</span>
                    <strong>${esc(flight.aircraft_model)}</strong>
                </div>

                <div class="info-box">
                    <span>Operator</span>
                    <strong>${esc(flight.operator_airline)}</strong>
                </div>

                <div class="info-box">
                    <span>Livery</span>
                    <strong>${esc(flight.livery_airline)}</strong>
                </div>
            </div>

            ${
                flight.recurrence &&
                flight.recurrence !== "once"
                ? `
                    <div class="tag-row">
                        <span class="tag">
                            ${esc(flight.recurrence)}
                        </span>
                    </div>
                `
                : ""
            }

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

            <div class="actions">${actions}</div>
        `;

        board.appendChild(card);
    }
}

/* =========================================
   ATC24 CLAIM
========================================= */

async function claimFlight(id) {
    if (!currentUser) {
        return loginWithDiscord();
    }

    await ensureProfile();

    if (!currentProfile?.pilot_approved) {
        return msg(
            "Pilot Approved is required to claim ATC24 flights.",
            "error"
        );
    }

    const { data, error } = await supabaseClient.rpc(
        "claim_atc24_flight",
        {
            p_flight_id: id
        }
    );

    if (error) {
        console.error("Claim flight error:", error);

        return msg(
            `Could not claim flight: ${error.message}`,
            "error"
        );
    }

    if (!data?.success) {
        return msg(
            "Flight could not be claimed.",
            "error"
        );
    }

    msg("Flight successfully claimed.", "success");
    await loadFlights();
}

/* =========================================
   SECURED ATC24 OPERATIONS
========================================= */

async function runAtc24Action(id, action) {
    if (!currentUser) {
        return loginWithDiscord();
    }

    const { data, error } = await supabaseClient.rpc(
        "update_atc24_flight",
        {
            p_flight_id: id,
            p_action: action
        }
    );

    if (error) {
        console.error("ATC24 action error:", error);

        msg(
            `Could not ${action} flight: ${error.message}`,
            "error"
        );

        return;
    }

    if (!data?.success) {
        msg(
            `Could not ${action} flight.`,
            "error"
        );
        return;
    }

    const message = action === "complete"
        ? "Flight completed successfully."
        : `${
            action.charAt(0).toUpperCase() +
            action.slice(1)
        } recorded successfully.`;

    msg(message, "success");
    await loadFlights();
}

async function startFlight(id) {
    return runAtc24Action(id, "start");
}

async function recordEvent(id, event) {
    if (!["pushback", "takeoff", "landing"].includes(event)) {
        return;
    }

    return runAtc24Action(id, event);
}

async function completeFlight(id) {
    return runAtc24Action(id, "complete");
}

/* =========================================
   ATC24 ADMIN
========================================= */

async function createFlight() {
    if (!admin()) {
        msg("Admin access required.", "error");
        return;
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
        ids.map(id => [id, $(id)?.value.trim()])
    );

    if (Object.values(values).some(value => !value)) {
        msg(
            "Please fill in all required ATC24 fields.",
            "error"
        );
        return;
    }

    const { error } = await supabaseClient
        .from("flights")
        .insert({
            flight_number: values.flightNumber,
            departure_airport: values.departure,
            arrival_airport: values.arrival,
            scheduled_departure:
                new Date(values.scheduled).toISOString(),
            aircraft_model: values.aircraft,
            operator_airline: values.operator,
            livery_airline: values.livery,
            recurrence: $("recurrence").value || "once",
            additional_info:
                $("additionalInfo").value.trim() || null,
            status: "available"
        });

    if (error) {
        msg(
            `Could not create flight: ${error.message}`,
            "error"
        );
        return;
    }

    msg(
        "ATC24 flight created successfully.",
        "success"
    );

    [...ids, "additionalInfo"].forEach(id => {
        $(id).value = "";
    });

    await loadFlights();
    await loadAdminFlights();
}

async function loadAdminFlights() {
    if (!admin()) return;

    const board = $("adminFlights");
    if (!board) return;

    const { data, error } = await supabaseClient
        .from("flights")
        .select("*")
        .order("scheduled_departure", {
            ascending: false
        });

    if (error) {
        board.innerHTML = `
            <div class="error-state">
                Could not load ATC24 flights:
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
                        No ATC24 flights created yet.
                    </strong>
                </div>
            </div>
        `;

    for (const flight of data || []) {
        const row = document.createElement("div");
        row.className = "admin-row";

        row.innerHTML = `
            <div>
                <strong>${esc(flight.flight_number)}</strong>

                <span>
                    ${esc(flight.departure_airport)}
                    →
                    ${esc(flight.arrival_airport)}
                </span>

                <small>
                    ${date(flight.scheduled_departure)}
                    · ${esc(flight.recurrence || "once")}
                    · ${esc(flight.status)}
                </small>
            </div>

            <button class="btn btn-danger"
                onclick="deleteFlight('${flight.id}')">
                DELETE
            </button>
        `;

        board.appendChild(row);
    }
}

async function deleteFlight(id) {
    if (!admin()) {
        msg("Admin access required.", "error");
        return;
    }

    if (!confirm("Delete this flight?")) {
        return;
    }

    const { error } = await supabaseClient
        .from("flights")
        .delete()
        .eq("id", id);

    if (error) {
        msg(
            `Could not delete flight: ${error.message}`,
            "error"
        );
        return;
    }

    msg(
        "ATC24 flight deleted successfully.",
        "success"
    );

    await loadFlights();
    await loadAdminFlights();
}

/* =========================================
   EVENT FLIGHTS
========================================= */

async function booking(eventId) {
    if (!currentUser) return null;

    const { data } = await supabaseClient
        .from("event_bookings")
        .select("*")
        .eq("event_id", eventId)
        .eq("user_id", currentUser.id)
        .maybeSingle();

    return data || null;
}

async function counts(eventId) {
    const { data, error } = await supabaseClient.rpc(
        "get_event_booking_counts",
        {
            p_event_id: String(eventId)
        }
    );

    if (error) {
        console.error(error);
        return {
            economy: 0,
            business: 0,
            first: 0
        };
    }

    const result = Array.isArray(data)
        ? data[0]
        : data;

    return {
        economy: Number(result?.economy || 0),
        business: Number(result?.business || 0),
        first: Number(result?.first_class || 0)
    };
}

async function loadEvents() {
    const board = $("eventFlightBoard");
    if (!board) return;

    const { data, error } = await supabaseClient
        .from("events")
        .select("*")
        .order("departure_time", {
            ascending: true
        });

    if (error) {
        board.innerHTML = `
            <div class="error-state">
                Could not load event flights:
                ${esc(error.message)}
            </div>
        `;
        return;
    }

    const uniqueEvents = Array.from(
        new Map(
            (data || []).map(event => [
                String(event.id),
                event
            ])
        ).values()
    );

    await renderEvents(uniqueEvents);
}

async function renderEvents(events) {
    const board = $("eventFlightBoard");
    const counter = $("eventFlightCount");

    if (!board) return;

    board.innerHTML = "";

    if (counter) {
        counter.textContent =
            `${events.length} ${
                events.length === 1 ? "event" : "events"
            }`;
    }

    if (!events.length) {
        board.innerHTML = `
            <div class="empty-state">
                <span class="empty-icon">🌍</span>
                <div>
                    <strong>
                        No Event Flights are scheduled.
                    </strong>
                    <p>
                        New special operations will appear here.
                    </p>
                </div>
            </div>
        `;
        return;
    }

    for (const event of events) {
        const currentBooking = await booking(event.id);
        const capacity = await counts(event.id);

        const distance = event.distance_type || "short";

        const points = Number(
            event.points || DISTANCE_POINTS[distance]
        );

        let actions = "";

        if (event.status === "cancelled") {
            actions = `
                <span class="action-note error-text">
                    ❌ This event flight has been cancelled.
                </span>
            `;
        } else if (currentBooking?.completed) {
            actions = `
                <span class="action-note success-text">
                    ✓ Completed —
                    ${num(event.miles)} Miles /
                    ${points} Point(s) awarded.
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
                        🎫 Your booking ·
                        ${esc(className(currentBooking.travel_class))}
                    </strong>

                    <span>
                        ${
                            currentBooking.checked_in
                            ? "✓ Checked in"
                            : "• Not checked in"
                        }
                    </span>

                    <span>
                        ${
                            currentBooking.boarded
                            ? "✓ Boarded"
                            : "• Not boarded"
                        }
                    </span>
                </div>

                <div class="actions">
                    ${
                        !currentBooking.checked_in &&
                        event.status !== "completed"
                        ? `
                            <button class="btn btn-primary"
                                onclick="checkInEventFlight('${currentBooking.id}')">
                                CHECK IN
                            </button>
                        `
                        : ""
                    }

                    ${
                        currentBooking.checked_in &&
                        !currentBooking.boarded &&
                        event.status !== "completed"
                        ? `
                            <button class="btn btn-secondary"
                                onclick="boardEventFlight('${currentBooking.id}')">
                                BOARD
                            </button>
                        `
                        : ""
                    }

                    ${
                        canComplete
                        ? `
                            <button class="btn btn-primary"
                                onclick="completeEventBooking('${currentBooking.id}')">
                                COMPLETE EVENT FLIGHT
                            </button>
                        `
                        : ""
                    }
                </div>
            `;
        } else if (!currentUser) {
            actions = `
                <button class="btn btn-secondary"
                    onclick="loginWithDiscord()">
                    LOGIN WITH DISCORD TO BOOK
                </button>
            `;
        } else if (event.status === "completed") {
            actions = `
                <span class="action-note">
                    This event flight is completed.
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

            actions = `
                <div class="actions">
                    ${
                        economyAvailable
                        ? `
                            <button class="btn btn-primary"
                                onclick="bookEventFlight('${event.id}','economy')">
                                BOOK ECONOMY
                            </button>
                        `
                        : `
                            <span class="action-note">
                                Economy full
                            </span>
                        `
                    }

                    ${
                        canClass("business")
                        ? (
                            businessAvailable
                            ? `
                                <button class="btn btn-secondary"
                                    onclick="bookEventFlight('${event.id}','business')">
                                    BOOK BUSINESS — 20,000 MILES
                                </button>
                            `
                            : `
                                <span class="action-note">
                                    Business full
                                </span>
                            `
                        )
                        : `
                            <span class="action-note">
                                🔒 Business —
                                Frequent Traveller required +
                                20,000 Miles required
                            </span>
                        `
                    }

                    ${
                        canClass("first")
                        ? (
                            firstAvailable
                            ? `
                                <button class="btn btn-dark"
                                    onclick="bookEventFlight('${event.id}','first')">
                                    BOOK FIRST — 100,000 MILES
                                </button>
                            `
                            : `
                                <span class="action-note">
                                    First full
                                </span>
                            `
                        )
                        : `
                            <span class="action-note">
                                🔒 First —
                                Senator required +
                                100,000 Miles required
                            </span>
                        `
                    }
                </div>
            `;
        }

        const card = document.createElement("article");
        card.className = "flight-card";

        card.innerHTML = `
            <div class="card-topline">
                <div>
                    <span class="eyebrow">EVENT FLIGHT</span>
                    <h3>${esc(event.flight_number)}</h3>
                </div>

                <span class="status ${eventStatusClass(event.status)}">
                    ${eventStatusText(event.status)}
                </span>
            </div>

            <div class="route-line">
                <span>${esc(event.departure)}</span>
                <span class="route-arrow">→</span>
                <span>${esc(event.arrival)}</span>
            </div>

            <div class="info-grid">
                <div class="info-box">
                    <span>Departure</span>
                    <strong>${date(event.departure_time)}</strong>
                </div>

                <div class="info-box">
                    <span>Aircraft</span>
                    <strong>${esc(event.aircraft_model)}</strong>
                </div>

                <div class="info-box">
                    <span>Distance</span>
                    <strong>${esc(distanceName(distance))}</strong>
                </div>

                <div class="info-box">
                    <span>Miles &amp; More</span>
                    <strong>
                        ${points} Point(s) ·
                        ${num(event.miles)} Miles
                    </strong>
                </div>
            </div>

            <div class="capacity-grid">
                <div>
                    <span>Economy</span>
                    <strong>
                        ${capacity.economy}/
                        ${Number(event.economy_capacity || 0)}
                    </strong>
                </div>

                <div>
                    <span>Business</span>
                    <strong>
                        ${capacity.business}/
                        ${Number(event.business_capacity || 0)}
                    </strong>
                </div>

                <div>
                    <span>First</span>
                    <strong>
                        ${capacity.first}/
                        ${Number(event.first_capacity || 0)}
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

/* =========================================
   EVENT BOOKINGS
========================================= */

async function bookEventFlight(id, travelClass) {
    if (!currentUser) {
        return loginWithDiscord();
    }

    if (!canClass(travelClass)) {
        const required = travelClass === "business"
            ? "Frequent Traveller"
            : "Senator";

        return msg(
            `${className(travelClass)} requires ${required} status.`,
            "error"
        );
    }

    const cost = travelClass === "business"
        ? 20000
        : travelClass === "first"
            ? 100000
            : 0;

    const miles = Number(currentProfile?.miles || 0);

    if (miles < cost) {
        return msg(
            `You need ${num(cost)} Miles for ${className(travelClass)}.`,
            "error"
        );
    }

    const { data, error } = await supabaseClient.rpc(
        "book_event_flight_with_miles",
        {
            p_event_id: Number(id),
            p_travel_class: travelClass
        }
    );

    if (error) {
        console.error("Event booking error:", error);

        return msg(
            `Could not book flight: ${error.message}`,
            "error"
        );
    }

    if (!data?.success) {
        return msg(
            "Could not complete booking.",
            "error"
        );
    }

    await ensureProfile();
    updateMiles();

    msg(
        `Booked ${className(travelClass)} successfully. ${
            cost > 0
            ? `${num(cost)} Miles deducted.`
            : "No Miles deducted."
        }`,
        "success"
    );

    await loadEvents();
}

async function checkInEventFlight(id) {
    const { error } = await supabaseClient.rpc(
        "check_in_event_flight",
        {
            p_booking_id: id
        }
    );

    if (error) {
        msg(
            `Could not check in: ${error.message}`,
            "error"
        );
        return;
    }

    msg("Check-in completed.", "success");
    await loadEvents();
}

async function boardEventFlight(id) {
    const { error } = await supabaseClient.rpc(
        "board_event_flight",
        {
            p_booking_id: id
        }
    );

    if (error) {
        msg(
            `Could not board: ${error.message}`,
            "error"
        );
        return;
    }

    msg("Boarding completed.", "success");
    await loadEvents();
}

async function completeEventBooking(id) {
    const { data, error } = await supabaseClient.rpc(
        "complete_event_flight",
        {
            p_booking_id: id
        }
    );

    if (error) {
        msg(
            `Could not complete event flight: ${error.message}`,
            "error"
        );
        return;
    }

    const result = Array.isArray(data)
        ? data[0]
        : data;

    await ensureProfile();
    updateMiles();
    await loadEvents();

    msg(
        `Event flight completed! +${
            num(result?.miles_awarded || 0)
        } Miles / +${
            result?.points_awarded || 0
        } Point(s). New status: ${
            statusName(result?.new_status)
        }.`,
        "success"
    );
}

/* =========================================
   EVENT FLIGHT ADMIN
========================================= */

async function createEventFlight() {
    if (!admin()) {
        return msg("Admin access required.", "error");
    }

    const get = id => $(id)?.value.trim();

    const flightNumber = get("eventFlightNumber");
    const departure = get("eventDeparture");
    const arrival = get("eventArrival");
    const time = $("eventDepartureTime")?.value;
    const aircraft = get("eventAircraft");
    const pilot = get("eventPilot");

    const distance =
        $("eventDistance")?.value || "short";

    const miles = Number(
        $("eventMiles")?.value || 0
    );

    const economyCapacity = Number(
        $("economyCapacity")?.value || 0
    );

    const businessCapacity = Number(
        $("businessCapacity")?.value || 0
    );

    const firstCapacity = Number(
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
            "Please fill in all required Event Flight fields.",
            "error"
        );
    }

    if (!Object.hasOwn(DISTANCE_POINTS, distance)) {
        return msg(
            "Invalid distance category.",
            "error"
        );
    }

    const values = [
        miles,
        economyCapacity,
        businessCapacity,
        firstCapacity
    ];

    if (
        !values.every(Number.isInteger) ||
        values.some(value => value < 0)
    ) {
        return msg(
            "Invalid Miles or capacity values.",
            "error"
        );
    }

    const { error } = await supabaseClient.rpc(
        "create_event_flight_admin",
        {
            p_flight_number: flightNumber,
            p_departure: departure,
            p_arrival: arrival,
            p_departure_time:
                new Date(time).toISOString(),
            p_aircraft_model: aircraft,
            p_pilot_discord_id: pilot || null,
            p_distance_type: distance,
            p_miles: miles,
            p_economy_capacity: economyCapacity,
            p_business_capacity: businessCapacity,
            p_first_capacity: firstCapacity,
            p_status: status
        }
    );

    if (error) {
        console.error(
            "Event creation RPC error:",
            error
        );

        return msg(
            `Could not create event flight: ${error.message}`,
            "error"
        );
    }

    msg(
        `Event flight created successfully — ${
            DISTANCE_POINTS[distance]
        } Point(s) / ${num(miles)} Miles.`,
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
        $(id).value = "";
    });

    await loadEvents();
    await loadAdminEvents();
}

async function loadAdminEvents() {
    if (!admin()) return;

    const board = $("adminEventFlights");
    if (!board) return;

    const { data, error } = await supabaseClient
        .from("events")
        .select("*")
        .order("departure_time", {
            ascending: false
        });

    if (error) {
        board.innerHTML = `
            <div class="error-state">
                Could not load event flights:
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
                        No Event Flights created yet.
                    </strong>
                </div>
            </div>
        `;

    for (const event of data || []) {
        const row = document.createElement("div");
        row.className = "admin-row";

        const statusOptions = [
            "scheduled",
            "boarding",
            "departed",
            "completed",
            "cancelled"
        ].map(status => `
            <option
                value="${status}"
                ${
                    event.status === status
                    ? "selected"
                    : ""
                }
            >
                ${eventStatusText(status)}
            </option>
        `).join("");

        row.innerHTML = `
            <div>
                <strong>${esc(event.flight_number)}</strong>

                <span>
                    ${esc(event.departure)}
                    →
                    ${esc(event.arrival)}
                </span>

                <small>
                    ${date(event.departure_time)}
                    · ${esc(distanceName(event.distance_type))}
                    · ${event.points} Point(s)
                    · ${num(event.miles)} Miles
                </small>
            </div>

            <div class="admin-actions">
                <select
                    class="admin-status-select"
                    onchange="updateEventStatus('${event.id}',this.value)"
                >
                    ${statusOptions}
                </select>

                <button class="btn btn-danger"
                    onclick="deleteEventFlight('${event.id}')">
                    DELETE
                </button>
            </div>
        `;

        board.appendChild(row);
    }
}

async function updateEventStatus(id, status) {
    if (!admin()) return;

    const { error } = await supabaseClient.rpc(
        "update_event_status_admin",
        {
            p_event_id: String(id),
            p_status: status
        }
    );

    if (error) {
        return msg(
            `Could not update event status: ${error.message}`,
            "error"
        );
    }

    msg("Event status updated.", "success");

    await loadEvents();
    await loadAdminEvents();
}

async function deleteEventFlight(id) {
    if (!admin()) {
        return msg(
            "Admin access required.",
            "error"
        );
    }

    if (!confirm(
        "Delete this event flight? Existing bookings and participant records will also be deleted."
    )) {
        return;
    }

    const { error } = await supabaseClient.rpc(
        "delete_event_flight_admin",
        {
            p_event_id: String(id)
        }
    );

    if (error) {
        return msg(
            `Could not delete event flight: ${error.message}`,
            "error"
        );
    }

    msg(
        "Event flight deleted successfully.",
        "success"
    );

    await loadEvents();
    await loadAdminEvents();
}

/* =========================================
   ADMIN / REFRESH
========================================= */

function updateAdminUI() {
    const isAdmin = admin();

    $("adminPanel")?.classList.toggle(
        "hidden",
        !isAdmin
    );

    $("eventAdminPanel")?.classList.toggle(
        "hidden",
        !isAdmin
    );

    if (isAdmin) {
        loadAdminFlights();
        loadAdminEvents();
    }
}

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

/* =========================================
   AUTH STATE
========================================= */

supabaseClient.auth.onAuthStateChange(
    (_event, session) => {
        setTimeout(async () => {
            currentUser = session?.user || null;

            if (currentUser) {
                await ensureProfile();
            } else {
                currentProfile = null;
            }

            updateUI();
            await refresh();
        }, 0);
    }
);

/* =========================================
   START
========================================= */

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
