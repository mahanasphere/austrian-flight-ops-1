const SUPABASE_URL = "https://qdtpwggllgnyzazmshyf.supabase.co";

// WICHTIG:
// Hier deinen BISHERIGEN Supabase Publishable/Anon Key einsetzen.
// NICHT den Service-Role-Key verwenden.
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


// ============================================================
// ADMIN
// ============================================================

const ADMIN_DISCORD_ID = "1214124494340493312";


// ============================================================
// MILES & MORE
// ============================================================

const MILES_AND_MORE_STATUS = {
    member: {
        name: "Member",
        points: 0
    },

    frequent_traveller: {
        name: "Frequent Traveller",
        points: 30
    },

    senator: {
        name: "Senator",
        points: 60
    },

    hon_circle_member: {
        name: "HON Circle Member",
        points: 120
    }
};


// ============================================================
// EVENT DISTANCE
// ============================================================

const EVENT_DISTANCE_POINTS = {
    short: 1,
    medium: 2,
    long: 3
};


let currentUser = null;
let currentProfile = null;


// ============================================================
// GENERAL HELPERS
// ============================================================

function showMessage(text) {
    const el = document.getElementById("message");

    if (!el) return;

    el.textContent = text;
    el.classList.remove("hidden");
}


function hideMessage() {
    const el = document.getElementById("message");

    if (el) {
        el.classList.add("hidden");
    }
}


function escapeHTML(value) {
    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


function formatDate(value) {
    if (!value) return "-";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "-";
    }

    return new Intl.DateTimeFormat(
        undefined,
        {
            dateStyle: "medium",
            timeStyle: "short"
        }
    ).format(date);
}


function formatNumber(value) {
    return Number(value || 0).toLocaleString();
}


// ============================================================
// DISCORD
// ============================================================

function getDiscordId(user) {
    if (!user) return null;

    const identity = user.identities?.find(
        i => i.provider === "discord"
    );

    return String(
        identity?.identity_data?.provider_id ||
        identity?.identity_data?.sub ||
        user.user_metadata?.provider_id ||
        user.user_metadata?.sub ||
        ""
    );
}


function isAdmin() {
    return (
        !!currentUser &&
        getDiscordId(currentUser) === ADMIN_DISCORD_ID
    );
}


// ============================================================
// MILES & MORE HELPERS
// ============================================================

function getStatusName(status) {
    return (
        MILES_AND_MORE_STATUS[status]?.name ||
        "Member"
    );
}


function getStatusPoints(status) {
    return (
        MILES_AND_MORE_STATUS[status]?.points ||
        0
    );
}


function calculateStatus(points) {
    if (points >= 120) {
        return "hon_circle_member";
    }

    if (points >= 60) {
        return "senator";
    }

    if (points >= 30) {
        return "frequent_traveller";
    }

    return "member";
}


// ============================================================
// EVENT HELPERS
// ============================================================

function getDistancePoints(type) {
    return EVENT_DISTANCE_POINTS[type] || 1;
}


function getDistanceName(type) {
    return {
        short: "Short-haul",
        medium: "Medium-haul",
        long: "Long-haul"
    }[type] || "Short-haul";
}


function className(type) {
    return {
        economy: "Economy",
        business: "Business",
        first: "First"
    }[type] || "Economy";
}


function canBookClass(type, status) {
    const points = getStatusPoints(
        status || "member"
    );

    if (type === "economy") {
        return true;
    }

    if (type === "business") {
        return points >= 30;
    }

    if (type === "first") {
        return points >= 60;
    }

    return false;
}


function getClassRequirement(type) {
    if (type === "business") {
        return "Frequent Traveller";
    }

    if (type === "first") {
        return "Senator";
    }

    return "Member";
}


function eventStatusClass(status) {
    if (status === "boarding") return "progress";
    if (status === "departed") return "claimed";
    if (status === "completed") return "completed";
    if (status === "cancelled") return "cancelled";

    return "available";
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


// ============================================================
// ATC24 STATUS
// ============================================================

function statusClass(status) {
    if (status === "claimed") return "claimed";
    if (status === "in_progress") return "progress";
    if (status === "completed") return "completed";

    return "available";
}


function statusText(status) {
    if (status === "claimed") return "CLAIMED";
    if (status === "in_progress") return "IN PROGRESS";
    if (status === "completed") return "COMPLETED";

    return "AVAILABLE";
}


// ============================================================
// AUTH
// ============================================================

async function loginWithDiscord() {

    hideMessage();

    const redirectTo =
        "https://mahanasphere.github.io/austrian-flight-ops-1/";

    const { error } =
        await supabaseClient.auth.signInWithOAuth({
            provider: "discord",

            options: {
                redirectTo
            }
        });

    if (error) {

        console.error(
            "Discord login error:",
            error
        );

        showMessage(
            "Discord login failed: " +
            error.message
        );
    }
}


async function finishOAuthRedirect() {

    const params =
        new URLSearchParams(
            window.location.search
        );

    const code =
        params.get("code");

    if (!code) {
        return;
    }

    const { error } =
        await supabaseClient.auth.exchangeCodeForSession(
            code
        );

    if (error) {

        console.error(
            "OAuth code exchange failed:",
            error
        );

        showMessage(
            "Discord login failed: " +
            error.message
        );

        return;
    }

    window.history.replaceState(
        {},
        document.title,
        window.location.pathname
    );
}


async function logout() {

    const { error } =
        await supabaseClient.auth.signOut();

    if (error) {

        showMessage(
            error.message
        );

        return;
    }

    currentUser = null;
    currentProfile = null;

    updateLoginUI();

    await loadFlights();
    await loadEventFlights();
}


async function loadUser() {

    await finishOAuthRedirect();

    const {
        data,
        error
    } = await supabaseClient.auth.getSession();

    if (error) {

        console.error(
            "Session error:",
            error
        );
    }

    currentUser =
        data?.session?.user || null;

    if (currentUser) {

        await loadCurrentProfile();

    } else {

        currentProfile = null;
    }

    updateLoginUI();
}


async function loadCurrentProfile() {

    if (!currentUser) {

        currentProfile = null;

        return;
    }

    const {
        data,
        error
    } = await supabaseClient
        .from("profiles")
        .select("*")
        .eq("id", currentUser.id)
        .maybeSingle();

    if (error) {

        console.error(
            "Profile loading error:",
            error
        );

        currentProfile = null;

        return;
    }

    currentProfile = data || null;
}


// ============================================================
// LOGIN UI
// ============================================================

function updateLoginUI() {

    const login =
        document.getElementById("loginButton");

    const logoutButton =
        document.getElementById("logoutButton");

    const userName =
        document.getElementById("userName");

    if (!login || !logoutButton) {
        return;
    }


    if (!currentUser) {

        login.classList.remove("hidden");

        logoutButton.classList.add("hidden");

        if (userName) {
            userName.textContent = "";
        }

    } else {

        login.classList.add("hidden");

        logoutButton.classList.remove("hidden");

        const metadata =
            currentUser.user_metadata || {};

        if (userName) {

            userName.textContent =
                metadata.full_name ||
                metadata.name ||
                metadata.preferred_username ||
                "Pilot";
        }
    }

    updateAdminUI();
    updateMilesUI();
}


// ============================================================
// MILES & MORE UI
// ============================================================

function updateMilesUI() {

    const box =
        document.getElementById(
            "milesMorePanel"
        );

    if (!box) {
        return;
    }


    if (!currentUser || !currentProfile) {

        box.innerHTML = `
            <p>
                Login with Discord to view
                your Miles & More profile.
            </p>
        `;

        return;
    }


    const points =
        Number(
            currentProfile.points || 0
        );

    const miles =
        Number(
            currentProfile.miles || 0
        );

    const status =
        currentProfile.miles_and_more_status ||
        calculateStatus(points);


    const next =
        status === "hon_circle_member"
            ? null
            : Object.entries(
                MILES_AND_MORE_STATUS
            ).find(
                ([, value]) =>
                    value.points > points
            );


    box.innerHTML = `

        <div class="miles-grid">

            <div class="miles-stat">

                <strong>
                    ${formatNumber(miles)}
                </strong>

                <span>
                    Miles
                </span>

            </div>


            <div class="miles-stat">

                <strong>
                    ${formatNumber(points)}
                </strong>

                <span>
                    Points
                </span>

            </div>


            <div class="miles-stat">

                <strong>
                    ${escapeHTML(
                        getStatusName(status)
                    )}
                </strong>

                <span>
                    Status
                </span>

            </div>

        </div>


        ${
            next
                ? `
                    <p class="muted">

                        Next status:
                        <strong>
                            ${escapeHTML(
                                next[1].name
                            )}
                        </strong>

                        at
                        ${next[1].points}
                        Points.

                    </p>
                `
                : `
                    <p class="muted">
                        🏆 Highest status reached.
                    </p>
                `
        }

    `;
}


// ============================================================
// ADMIN UI
// ============================================================

function updateAdminUI() {

    const panel =
        document.getElementById(
            "adminPanel"
        );

    const eventPanel =
        document.getElementById(
            "eventAdminPanel"
        );


    if (isAdmin()) {

        panel?.classList.remove(
            "hidden"
        );

        eventPanel?.classList.remove(
            "hidden"
        );

        loadAdminFlights();
        loadAdminEventFlights();

    } else {

        panel?.classList.add(
            "hidden"
        );

        eventPanel?.classList.add(
            "hidden"
        );
    }
}


// ============================================================
// ATC24
// ============================================================

async function loadFlights() {

    const {
        data,
        error
    } = await supabaseClient
        .from("flights")
        .select("*")
        .order(
            "scheduled_departure",
            {
                ascending: true
            }
        );


    if (error) {

        console.error(
            "Flight loading error:",
            error
        );

        const board =
            document.getElementById(
                "flightBoard"
            );

        if (board) {

            board.innerHTML = `
                <p>
                    Could not load flights:
                    ${escapeHTML(
                        error.message
                    )}
                </p>
            `;
        }

        return;
    }


    renderFlights(
        data || []
    );
}


function renderFlights(flights) {

    const board =
        document.getElementById(
            "flightBoard"
        );

    const count =
        document.getElementById(
            "flightCount"
        );


    if (!board) {
        return;
    }


    board.innerHTML = "";


    if (count) {

        count.textContent =
            `${flights.length} flights`;
    }


    if (!flights.length) {

        board.innerHTML = `
            <p>
                No flights available.
            </p>
        `;

        return;
    }


    flights.forEach(
        flight => {

            const card =
                document.createElement(
                    "div"
                );

            card.className =
                "flight";


            const mine =
                currentUser &&
                flight.claimed_by ===
                currentUser.id;


            let actions = "";


            if (
                flight.status ===
                "available"
            ) {

                actions =
                    currentUser

                        ? `
                            <button
                                class="primary"
                                onclick="claimFlight('${flight.id}')"
                            >
                                CLAIM FLIGHT
                            </button>
                        `

                        : `
                            <button
                                class="light"
                                onclick="loginWithDiscord()"
                            >
                                🔒 LOGIN WITH DISCORD TO CLAIM
                            </button>
                        `;


            } else if (
                flight.status ===
                "claimed"
            ) {

                actions =
                    mine

                        ? `
                            <button
                                class="primary"
                                onclick="startFlight('${flight.id}')"
                            >
                                START FLIGHT
                            </button>
                        `

                        : `
                            <span>
                                Pilot has claimed this flight.
                            </span>
                        `;


            } else if (
                flight.status ===
                "in_progress" &&
                mine
            ) {

                actions = `

                    <button
                        class="light"
                        onclick="recordEvent('${flight.id}','pushback')"
                    >
                        PUSHBACK
                    </button>

                    <button
                        class="light"
                        onclick="recordEvent('${flight.id}','takeoff')"
                    >
                        TAKEOFF
                    </button>

                    <button
                        class="light"
                        onclick="recordEvent('${flight.id}','landing')"
                    >
                        LANDING
                    </button>

                    <button
                        class="secondary"
                        onclick="completeFlight('${flight.id}')"
                    >
                        END FLIGHT
                    </button>

                `;


            } else if (
                flight.status ===
                "in_progress"
            ) {

                actions = `
                    <span>
                        Pilot is currently operating
                        this flight.
                    </span>
                `;


            } else if (
                flight.status ===
                "completed"
            ) {

                actions = `
                    <strong>
                        ✓ Flight completed
                    </strong>
                `;
            }


            card.innerHTML = `

                <div class="flight-header">

                    <div class="flight-number">
                        ${escapeHTML(
                            flight.flight_number
                        )}
                    </div>

                    <div class="status ${
                        statusClass(
                            flight.status
                        )
                    }">
                        ${statusText(
                            flight.status
                        )}
                    </div>

                </div>


                <div class="route">

                    <span>
                        ${escapeHTML(
                            flight.departure_airport
                        )}
                    </span>

                    <span>→</span>

                    <span>
                        ${escapeHTML(
                            flight.arrival_airport
                        )}
                    </span>

                </div>


                <div class="info-grid">

                    <div class="info">

                        <strong>
                            Departure
                        </strong>

                        ${formatDate(
                            flight.scheduled_departure
                        )}

                    </div>


                    <div class="info">

                        <strong>
                            Aircraft
                        </strong>

                        ${escapeHTML(
                            flight.aircraft_model
                        )}

                    </div>


                    <div class="info">

                        <strong>
                            Operator
                        </strong>

                        ${escapeHTML(
                            flight.operator_airline
                        )}

                    </div>


                    <div class="info">

                        <strong>
                            Livery
                        </strong>

                        ${escapeHTML(
                            flight.livery_airline
                        )}

                    </div>

                </div>


                ${
                    flight.additional_info

                        ? `
                            <div class="additional">
                                ${escapeHTML(
                                    flight.additional_info
                                )}
                            </div>
                        `

                        : ""
                }


                ${
                    mine

                        ? `
                            <div class="event-times">

                                ${
                                    flight.started_at
                                        ? `
                                            ▶️ Started:
                                            ${formatDate(
                                                flight.started_at
                                            )}
                                            <br>
                                        `
                                        : ""
                                }

                                ${
                                    flight.pushback_at
                                        ? `
                                            ↪ Pushback:
                                            ${formatDate(
                                                flight.pushback_at
                                            )}
                                            <br>
                                        `
                                        : ""
                                }

                                ${
                                    flight.takeoff_at
                                        ? `
                                            🛫 Takeoff:
                                            ${formatDate(
                                                flight.takeoff_at
                                            )}
                                            <br>
                                        `
                                        : ""
                                }

                                ${
                                    flight.landing_at
                                        ? `
                                            🛬 Landing:
                                            ${formatDate(
                                                flight.landing_at
                                            )}
                                            <br>
                                        `
                                        : ""
                                }

                                ${
                                    flight.completed_at
                                        ? `
                                            ✓ Completed:
                                            ${formatDate(
                                                flight.completed_at
                                            )}
                                        `
                                        : ""
                                }

                            </div>
                        `

                        : ""
                }


                <div class="actions">
                    ${actions}
                </div>

            `;

            board.appendChild(card);
        }
    );
}


async function claimFlight(id) {

    if (!currentUser) {

        return showMessage(
            "You must log in with Discord first."
        );
    }


    const {
        error
    } = await supabaseClient
        .from("flights")
        .update({
            status: "claimed",
            claimed_by: currentUser.id,
            claimed_at: new Date().toISOString()
        })
        .eq("id", id)
        .eq("status", "available");


    if (error) {

        return showMessage(
            error.message
        );
    }


    await loadFlights();
}


async function startFlight(id) {

    if (!currentUser) {
        return;
    }


    const {
        error
    } = await supabaseClient
        .from("flights")
        .update({
            status: "in_progress",
            started_at:
                new Date().toISOString()
        })
        .eq(
            "id",
            id
        )
        .eq(
            "claimed_by",
            currentUser.id
        );


    if (error) {

        return showMessage(
            error.message
        );
    }


    await loadFlights();
}


async function recordEvent(
    id,
    event
) {

    if (!currentUser) {
        return;
    }


    const field = {
        pushback: "pushback_at",
        takeoff: "takeoff_at",
        landing: "landing_at"
    }[event];


    if (!field) {
        return;
    }


    const {
        error
    } = await supabaseClient
        .from("flights")
        .update({
            [field]:
                new Date().toISOString()
        })
        .eq(
            "id",
            id
        )
        .eq(
            "claimed_by",
            currentUser.id
        );


    if (error) {

        return showMessage(
            error.message
        );
    }


    await loadFlights();
}


async function completeFlight(id) {

    if (!currentUser) {

        return showMessage(
            "You must be logged in."
        );
    }


    const {
        data,
        error
    } = await supabaseClient
        .from("flights")
        .update({
            status: "completed",
            completed_at:
                new Date().toISOString()
        })
        .eq(
            "id",
            id
        )
        .eq(
            "claimed_by",
            currentUser.id
        )
        .select();


    if (error) {

        return showMessage(
            "Could not end flight: " +
            error.message
        );
    }


    if (!data?.length) {

        return showMessage(
            "Flight could not be completed. " +
            "No matching flight was found."
        );
    }


    showMessage(
        "Flight completed successfully."
    );


    await loadFlights();
}


// ============================================================
// ATC24 ADMIN
// ============================================================

async function createFlight() {

    if (!isAdmin()) {

        return showMessage(
            "Admin access required."
        );
    }


    const scheduled =
        document.getElementById(
            "scheduled"
        )?.value;


    if (!scheduled) {

        return showMessage(
            "Please select a scheduled departure."
        );
    }


    const flight = {

        flight_number:
            document.getElementById(
                "flightNumber"
            )?.value.trim(),

        departure_airport:
            document.getElementById(
                "departure"
            )?.value.trim(),

        arrival_airport:
            document.getElementById(
                "arrival"
            )?.value.trim(),

        scheduled_departure:
            new Date(
                scheduled
            ).toISOString(),

        aircraft_model:
            document.getElementById(
                "aircraft"
            )?.value.trim(),

        operator_airline:
            document.getElementById(
                "operator"
            )?.value.trim(),

        livery_airline:
            document.getElementById(
                "livery"
            )?.value.trim(),

        recurrence:
            document.getElementById(
                "recurrence"
            )?.value ||
            "once",

        additional_info:
            document.getElementById(
                "additionalInfo"
            )?.value.trim() ||
            null,

        status:
            "available"
    };


    if (
        !flight.flight_number ||
        !flight.departure_airport ||
        !flight.arrival_airport ||
        !flight.aircraft_model
    ) {

        return showMessage(
            "Please fill in all required ATC24 fields."
        );
    }


    const {
        error
    } = await supabaseClient
        .from("flights")
        .insert(
            flight
        );


    if (error) {

        return showMessage(
            "Could not create flight: " +
            error.message
        );
    }


    showMessage(
        "ATC24 flight created successfully."
    );


    [
        "flightNumber",
        "departure",
        "arrival",
        "scheduled",
        "aircraft",
        "operator",
        "livery",
        "additionalInfo"
    ].forEach(
        id => {

            const element =
                document.getElementById(id);

            if (element) {
                element.value = "";
            }
        }
    );


    await loadFlights();
    await loadAdminFlights();
}


async function loadAdminFlights() {

    if (!isAdmin()) {
        return;
    }


    const {
        data,
        error
    } = await supabaseClient
        .from("flights")
        .select("*")
        .order(
            "scheduled_departure",
            {
                ascending: false
            }
        );


    const container =
        document.getElementById(
            "adminFlights"
        );


    if (!container) {
        return;
    }


    if (error) {

        container.innerHTML = `
            <p>
                Could not load ATC24 flights.
            </p>
        `;

        return;
    }


    container.innerHTML =
        data?.length
            ? ""
            : `
                <p>
                    No flights created yet.
                </p>
            `;


    (data || []).forEach(
        flight => {

            const div =
                document.createElement(
                    "div"
                );

            div.className =
                "admin-flight";


            div.innerHTML = `

                <div>

                    <strong>
                        ${escapeHTML(
                            flight.flight_number
                        )}
                    </strong>

                    <br>

                    ${escapeHTML(
                        flight.departure_airport
                    )}
                    →
                    ${escapeHTML(
                        flight.arrival_airport
                    )}

                    <br>

                    <small>

                        ${formatDate(
                            flight.scheduled_departure
                        )}

                        ·

                        ${escapeHTML(
                            flight.status
                        )}

                    </small>

                </div>


                <button
                    class="danger"
                    onclick="deleteFlight('${flight.id}')"
                >
                    DELETE
                </button>

            `;


            container.appendChild(
                div
            );
        }
    );
}


async function deleteFlight(id) {

    if (!isAdmin()) {

        return showMessage(
            "Admin access required."
        );
    }


    if (
        !confirm(
            "Delete this flight?"
        )
    ) {

        return;
    }


    const {
        error
    } = await supabaseClient
        .from("flights")
        .delete()
        .eq(
            "id",
            id
        );


    if (error) {

        return showMessage(
            "Could not delete flight: " +
            error.message
        );
    }


    await loadFlights();
    await loadAdminFlights();
}


// ============================================================
// EVENT FLIGHTS
// ============================================================

async function getUserEventBooking(
    eventId
) {

    if (!currentUser) {
        return null;
    }


    const {
        data,
        error
    } = await supabaseClient
        .from("event_bookings")
        .select("*")
        .eq(
            "event_id",
            eventId
        )
        .eq(
            "user_id",
            currentUser.id
        )
        .maybeSingle();


    if (error) {

        console.error(
            "Booking lookup error:",
            error
        );
    }


    return data || null;
}


// IMPORTANT:
// Uses the secure RPC so RLS does not hide
// other passengers from capacity counts.
async function getEventBookingCounts(
    eventId
) {

    const {
        data,
        error
    } = await supabaseClient
        .rpc(
            "get_event_booking_counts",
            {
                p_event_id: eventId
            }
        );


    if (error) {

        console.error(
            "Booking count RPC error:",
            error
        );

        return {
            economy: 0,
            business: 0,
            first: 0
        };
    }


    const row =
        Array.isArray(data)
            ? data[0]
            : data;


    return {

        economy:
            Number(
                row?.economy_count || 0
            ),

        business:
            Number(
                row?.business_count || 0
            ),

        first:
            Number(
                row?.first_count || 0
            )
    };
}


async function loadEventFlights() {

    const {
        data,
        error
    } = await supabaseClient
        .from("events")
        .select("*")
        .order(
            "departure_time",
            {
                ascending: true
            }
        );


    const board =
        document.getElementById(
            "eventFlightBoard"
        );


    if (!board) {
        return;
    }


    if (error) {

        console.error(
            "Event flight loading error:",
            error
        );

        board.innerHTML = `
            <p>
                Could not load event flights:
                ${escapeHTML(
                    error.message
                )}
            </p>
        `;

        return;
    }


    await renderEventFlights(
        data || []
    );
}


async function renderEventFlights(
    events
) {

    const board =
        document.getElementById(
            "eventFlightBoard"
        );

    const count =
        document.getElementById(
            "eventFlightCount"
        );


    if (!board) {
        return;
    }


    board.innerHTML = "";


    if (count) {

        count.textContent =
            `${events.length} event flights`;
    }


    if (!events.length) {

        board.innerHTML = `
            <p>
                No event flights scheduled.
            </p>
        `;

        return;
    }


    for (
        const event of events
    ) {

        const counts =
            await getEventBookingCounts(
                event.id
            );


        const booking =
            await getUserEventBooking(
                event.id
            );


        const points =
            Number(
                event.points ??
                getDistancePoints(
                    event.distance_type ||
                    "short"
                )
            );


        const distance =
            event.distance_type ||
            "short";


        const card =
            document.createElement(
                "div"
            );


        card.className =
            "flight event-flight";


        let bookingHTML = "";


        // ----------------------------------------------------
        // CANCELLED
        // ----------------------------------------------------

        if (
            event.status ===
            "cancelled"
        ) {

            bookingHTML = `
                <strong>
                    ❌ This event flight
                    has been cancelled.
                </strong>
            `;


        // ----------------------------------------------------
        // COMPLETED BOOKING
        // ----------------------------------------------------

        } else if (
            event.status === "completed" &&
            booking?.completed
        ) {

            bookingHTML = `
                <strong>
                    ✓ Completed —
                    ${formatNumber(event.miles)}
                    Miles /
                    ${points}
                    Point(s) awarded.
                </strong>
            `;


        // ----------------------------------------------------
        // USER HAS BOOKING
        // ----------------------------------------------------

        } else if (
            booking
        ) {

            const canComplete =
                event.status === "completed" &&
                booking.checked_in &&
                booking.boarded &&
                !booking.completed;


            bookingHTML = `

                <div class="additional">

                    <strong>
                        🎫 Your booking
                    </strong>

                    <br>

                    Class:
                    ${escapeHTML(
                        className(
                            booking.travel_class
                        )
                    )}

                    <br>

                    ${
                        booking.checked_in
                            ? "✓ Checked in"
                            : "• Not checked in"
                    }

                    <br>

                    ${
                        booking.boarded
                            ? "✓ Boarded"
                            : "• Not boarded"
                    }

                    <br>

                    ${
                        booking.completed
                            ? "✓ Completed"
                            : "• Flight not completed"
                    }

                </div>


                <div class="actions">

                    ${
                        !booking.checked_in &&
                        event.status !== "completed"

                            ? `
                                <button
                                    class="primary"
                                    onclick="checkInEventFlight('${booking.id}')"
                                >
                                    CHECK IN
                                </button>
                            `

                            : ""
                    }


                    ${
                        booking.checked_in &&
                        !booking.boarded &&
                        event.status !== "completed"

                            ? `
                                <button
                                    class="light"
                                    onclick="boardEventFlight('${booking.id}')"
                                >
                                    BOARD
                                </button>
                            `

                            : ""
                    }


                    ${
                        canComplete

                            ? `
                                <button
                                    class="primary"
                                    onclick="completeEventBooking('${booking.id}')"
                                >
                                    COMPLETE EVENT FLIGHT
                                </button>
                            `

                            : ""
                    }


                    ${
                        event.status === "completed" &&
                        !booking.completed

                            ? `
                                <span class="muted">
                                    Complete requires
                                    check-in and boarding.
                                </span>
                            `

                            : ""
                    }

                </div>
            `;


        // ----------------------------------------------------
        // NOT LOGGED IN
        // ----------------------------------------------------

        } else if (
            !currentUser
        ) {

            bookingHTML = `
                <button
                    class="light"
                    onclick="loginWithDiscord()"
                >
                    🔒 LOGIN WITH DISCORD TO BOOK
                </button>
            `;


        // ----------------------------------------------------
        // EVENT ALREADY COMPLETED
        // ----------------------------------------------------

        } else if (
            event.status === "completed"
        ) {

            bookingHTML = `
                <span>
                    This event flight is completed.
                </span>
            `;


        // ----------------------------------------------------
        // BOOKING BUTTONS
        // ----------------------------------------------------

        } else {

            bookingHTML = `

                <div class="actions">

                    ${
                        Number(
                            event.economy_capacity || 0
                        ) > counts.economy

                            ? `
                                <button
                                    class="primary"
                                    onclick="bookEventFlight('${event.id}','economy')"
                                >
                                    BOOK ECONOMY
                                </button>
                            `

                            : `
                                <span>
                                    Economy full
                                </span>
                            `
                    }


                    ${
                        canBookClass(
                            "business",
                            currentProfile?.miles_and_more_status
                        )

                            ?

                            (
                                Number(
                                    event.business_capacity || 0
                                ) > counts.business

                                    ? `
                                        <button
                                            class="light"
                                            onclick="bookEventFlight('${event.id}','business')"
                                        >
                                            BOOK BUSINESS
                                        </button>
                                    `

                                    : `
                                        <span>
                                            Business full
                                        </span>
                                    `
                            )

                            : `
                                <span>
                                    🔒 Business —
                                    Frequent Traveller required
                                </span>
                            `
                    }


                    ${
                        canBookClass(
                            "first",
                            currentProfile?.miles_and_more_status
                        )

                            ?

                            (
                                Number(
                                    event.first_capacity || 0
                                ) > counts.first

                                    ? `
                                        <button
                                            class="secondary"
                                            onclick="bookEventFlight('${event.id}','first')"
                                        >
                                            BOOK FIRST
                                        </button>
                                    `

                                    : `
                                        <span>
                                            First full
                                        </span>
                                    `
                            )

                            : `
                                <span>
                                    🔒 First —
                                    Senator required
                                </span>
                            `
                    }

                </div>

            `;
        }


        card.innerHTML = `

            <div class="flight-header">

                <div class="flight-number">

                    ${escapeHTML(
                        event.flight_number
                    )}

                </div>


                <div class="status ${
                    eventStatusClass(
                        event.status
                    )
                }">

                    ${eventStatusText(
                        event.status
                    )}

                </div>

            </div>


            <div class="route">

                <span>
                    ${escapeHTML(
                        event.departure
                    )}
                </span>

                <span>
                    →
                </span>

                <span>
                    ${escapeHTML(
                        event.arrival
                    )}
                </span>

            </div>


            <div class="info-grid">

                <div class="info">

                    <strong>
                        Departure
                    </strong>

                    ${formatDate(
                        event.departure_time
                    )}

                </div>


                <div class="info">

                    <strong>
                        Aircraft
                    </strong>

                    ${escapeHTML(
                        event.aircraft_model
                    )}

                </div>


                <div class="info">

                    <strong>
                        Distance
                    </strong>

                    ${escapeHTML(
                        getDistanceName(
                            distance
                        )
                    )}

                </div>


                <div class="info">

                    <strong>
                        Miles & More
                    </strong>

                    ${points}
                    Point(s)
                    ·
                    ${formatNumber(
                        event.miles
                    )}
                    Miles

                </div>

            </div>


            <div class="capacity">

                <div class="capacity-row">

                    <span class="class-name economy">
                        Economy
                    </span>

                    <span>
                        ${counts.economy}/
                        ${Number(
                            event.economy_capacity || 0
                        )}
                    </span>

                </div>


                <div class="capacity-row">

                    <span class="class-name business">
                        Business
                    </span>

                    <span>
                        ${counts.business}/
                        ${Number(
                            event.business_capacity || 0
                        )}
                    </span>

                </div>


                <div class="capacity-row">

                    <span class="class-name first">
                        First
                    </span>

                    <span>
                        ${counts.first}/
                        ${Number(
                            event.first_capacity || 0
                        )}
                    </span>

                </div>

            </div>


            ${
                event.pilot_id

                    ? `
                        <div class="additional">

                            <strong>
                                👨‍✈️ Event Pilot
                            </strong>

                            <br>

                            Assigned pilot

                        </div>
                    `

                    : ""
            }


            <div class="actions">

                ${bookingHTML}

            </div>

        `;


        board.appendChild(
            card
        );
    }
}


// ============================================================
// BOOK EVENT FLIGHT
// ============================================================

async function bookEventFlight(
    eventId,
    travelClass
) {

    if (!currentUser) {

        return showMessage(
            "You must log in with Discord first."
        );
    }


    if (
        !canBookClass(
            travelClass,
            currentProfile?.miles_and_more_status
        )
    ) {

        return showMessage(
            `${className(
                travelClass
            )} requires ${
                getClassRequirement(
                    travelClass
                )
            } status.`
        );
    }


    const existing =
        await getUserEventBooking(
            eventId
        );


    if (existing) {

        return showMessage(
            "You are already booked on this event flight."
        );
    }


    const {
        data: event,
        error: eventError
    } = await supabaseClient
        .from("events")
        .select("*")
        .eq(
            "id",
            eventId
        )
        .single();


    if (eventError) {

        return showMessage(
            "Could not load event flight: " +
            eventError.message
        );
    }


    if (
        [
            "cancelled",
            "completed"
        ].includes(
            event.status
        )
    ) {

        return showMessage(
            "This event flight is no longer bookable."
        );
    }


    const counts =
        await getEventBookingCounts(
            eventId
        );


    const capacity =
        Number(
            event[
                `${travelClass}_capacity`
            ] || 0
        );


    if (
        counts[travelClass] >=
        capacity
    ) {

        return showMessage(
            `${className(
                travelClass
            )} is fully booked.`
        );
    }


    const {
        error
    } = await supabaseClient
        .from("event_bookings")
        .insert({

            event_id:
                eventId,

            user_id:
                currentUser.id,

            travel_class:
                travelClass,

            checked_in:
                false,

            boarded:
                false,

            completed:
                false
        });


    if (error) {

        return showMessage(
            "Could not book flight: " +
            error.message
        );
    }


    showMessage(
        `Successfully booked in ${
            className(
                travelClass
            )
        }. No Miles or Points have been awarded yet.`
    );


    await loadEventFlights();
}


// ============================================================
// CHECK-IN
// ============================================================

async function checkInEventFlight(
    bookingId
) {

    if (!currentUser) {

        return showMessage(
            "You must be logged in."
        );
    }


    const eventId =
        await getBookingEventId(
            bookingId
        );


    if (!eventId) {

        return showMessage(
            "Could not find the event for this booking."
        );
    }


    const now =
        new Date().toISOString();


    const {
        error
    } = await supabaseClient
        .from("event_bookings")
        .update({
            checked_in: true
        })
        .eq(
            "id",
            bookingId
        )
        .eq(
            "user_id",
            currentUser.id
        );


    if (error) {

        return showMessage(
            "Could not check in: " +
            error.message
        );
    }


    const {
        error: participantError
    } = await supabaseClient
        .from("flight_participants")
        .upsert(
            {
                event_id:
                    eventId,

                user_id:
                    currentUser.id,

                check_in_at:
                    now
            },
            {
                onConflict:
                    "event_id,user_id"
            }
        );


    if (participantError) {

        console.error(
            "Participant check-in error:",
            participantError
        );

        return showMessage(
            "Check-in saved, but participant tracking failed: " +
            participantError.message
        );
    }


    await loadEventFlights();
}


// ============================================================
// GET EVENT ID FROM BOOKING
// ============================================================

async function getBookingEventId(
    bookingId
) {

    if (!currentUser) {
        return null;
    }


    const {
        data,
        error
    } = await supabaseClient
        .from("event_bookings")
        .select("event_id")
        .eq(
            "id",
            bookingId
        )
        .eq(
            "user_id",
            currentUser.id
        )
        .maybeSingle();


    if (error) {

        console.error(
            "Booking event lookup error:",
            error
        );
    }


    return data?.event_id || null;
}


// ============================================================
// BOARDING
// ============================================================

async function boardEventFlight(
    bookingId
) {

    if (!currentUser) {

        return showMessage(
            "You must be logged in."
        );
    }


    const eventId =
        await getBookingEventId(
            bookingId
        );


    if (!eventId) {

        return showMessage(
            "Could not find the event for this booking."
        );
    }


    const now =
        new Date().toISOString();


    const {
        error
    } = await supabaseClient
        .from("event_bookings")
        .update({
            boarded: true
        })
        .eq(
            "id",
            bookingId
        )
        .eq(
            "user_id",
            currentUser.id
        );


    if (error) {

        return showMessage(
            "Could not board: " +
            error.message
        );
    }


    const {
        error: participantError
    } = await supabaseClient
        .from("flight_participants")
        .upsert(
            {
                event_id:
                    eventId,

                user_id:
                    currentUser.id,

                boarding_at:
                    now
            },
            {
                onConflict:
                    "event_id,user_id"
            }
        );


    if (participantError) {

        console.error(
            "Participant boarding error:",
            participantError
        );

        return showMessage(
            "Boarding saved, but participant tracking failed: " +
            participantError.message
        );
    }


    await loadEventFlights();
}


// ============================================================
// COMPLETE EVENT FLIGHT
// ============================================================

async function completeEventBooking(
    bookingId
) {

    if (!currentUser) {

        return showMessage(
            "You must be logged in."
        );
    }


    const {
        data,
        error
    } = await supabaseClient
        .rpc(
            "complete_event_flight",
            {
                p_booking_id:
                    bookingId
            }
        );


    if (error) {

        console.error(
            "Completion RPC error:",
            error
        );

        return showMessage(
            "Could not complete event flight: " +
            error.message
        );
    }


    const result =
        Array.isArray(data)
            ? data[0]
            : data;


    showMessage(
        `Event flight completed! ` +
        `+${formatNumber(
            result?.miles_awarded || 0
        )} Miles / ` +
        `+${result?.points_awarded || 0} Point(s). ` +
        `New status: ${
            getStatusName(
                result?.new_status ||
                "member"
            )
        }.`
    );


    await loadCurrentProfile();

    updateMilesUI();

    await loadEventFlights();
}


// ============================================================
// EVENT ADMIN
// ============================================================

async function createEventFlight() {

    if (!isAdmin()) {

        return showMessage(
            "Admin access required."
        );
    }


    const flightNumber =
        document.getElementById(
            "eventFlightNumber"
        )?.value.trim();


    const departure =
        document.getElementById(
            "eventDeparture"
        )?.value.trim();


    const arrival =
        document.getElementById(
            "eventArrival"
        )?.value.trim();


    const departureTime =
        document.getElementById(
            "eventDepartureTime"
        )?.value;


    const aircraft =
        document.getElementById(
            "eventAircraft"
        )?.value.trim();


    const pilotDiscordId =
        document.getElementById(
            "eventPilot"
        )?.value.trim();


    const distanceType =
        document.getElementById(
            "eventDistance"
        )?.value ||
        "short";


    const miles =
        Number(
            document.getElementById(
                "eventMiles"
            )?.value ||
            0
        );


    const economy =
        Number(
            document.getElementById(
                "economyCapacity"
            )?.value ||
            0
        );


    const business =
        Number(
            document.getElementById(
                "businessCapacity"
            )?.value ||
            0
        );


    const first =
        Number(
            document.getElementById(
                "firstCapacity"
            )?.value ||
            0
        );


    const status =
        document.getElementById(
            "eventStatus"
        )?.value ||
        "scheduled";


    if (
        !flightNumber ||
        !departure ||
        !arrival ||
        !departureTime ||
        !aircraft
    ) {

        return showMessage(
            "Please fill in all required Event Flight fields."
        );
    }


    if (
        !Object.hasOwn(
            EVENT_DISTANCE_POINTS,
            distanceType
        )
    ) {

        return showMessage(
            "Please select a valid distance category."
        );
    }


    if (
        !Number.isInteger(miles) ||
        miles < 0
    ) {

        return showMessage(
            "Miles must be a whole number of 0 or more."
        );
    }


    let pilotId = null;


    if (pilotDiscordId) {

        const {
            data: pilot,
            error: pilotError
        } = await supabaseClient
            .from("profiles")
            .select("id")
            .eq(
                "discord_id",
                pilotDiscordId
            )
            .maybeSingle();


        if (pilotError) {

            return showMessage(
                "Could not find pilot: " +
                pilotError.message
            );
        }


        if (!pilot) {

            return showMessage(
                "No profile found for that Pilot Discord ID. " +
                "The pilot must log in to the website first."
            );
        }


        pilotId =
            pilot.id;
    }


    const event = {

        flight_number:
            flightNumber,

        departure:
            departure,

        arrival:
            arrival,

        departure_time:
            new Date(
                departureTime
            ).toISOString(),

        aircraft_model:
            aircraft,

        status:
            status,

        pilot_id:
            pilotId,

        economy_capacity:
            Math.max(
                0,
                Math.floor(
                    economy
                )
            ),

        business_capacity:
            Math.max(
                0,
                Math.floor(
                    business
                )
            ),

        first_capacity:
            Math.max(
                0,
                Math.floor(
                    first
                )
            ),

        distance_type:
            distanceType,

        points:
            getDistancePoints(
                distanceType
            ),

        miles:
            miles
    };


    const {
        error
    } = await supabaseClient
        .from("events")
        .insert(
            event
        );


    if (error) {

        return showMessage(
            "Could not create event flight: " +
            error.message
        );
    }


    showMessage(
        `Event flight created successfully — ` +
        `${event.points} Point(s) / ` +
        `${formatNumber(miles)} Miles.`
    );


    [
        "eventFlightNumber",
        "eventDeparture",
        "eventArrival",
        "eventDepartureTime",
        "eventAircraft",
        "eventPilot",
        "eventMiles"
    ].forEach(
        id => {

            const element =
                document.getElementById(
                    id
                );

            if (element) {
                element.value = "";
            }
        }
    );


    await loadEventFlights();
    await loadAdminEventFlights();
}


// ============================================================
// ADMIN EVENT LIST
// ============================================================

async function loadAdminEventFlights() {

    if (!isAdmin()) {
        return;
    }


    const container =
        document.getElementById(
            "adminEventFlights"
        );


    if (!container) {
        return;
    }


    const {
        data,
        error
    } = await supabaseClient
        .from("events")
        .select("*")
        .order(
            "departure_time",
            {
                ascending: false
            }
        );


    if (error) {

        container.innerHTML = `
            <p>
                Could not load event flights:
                ${escapeHTML(
                    error.message
                )}
            </p>
        `;

        return;
    }


    container.innerHTML =
        data?.length
            ? ""
            : `
                <p>
                    No event flights created yet.
                </p>
            `;


    (data || []).forEach(
        event => {

            const div =
                document.createElement(
                    "div"
                );


            div.className =
                "admin-flight";


            div.innerHTML = `

                <div>

                    <strong>
                        ${escapeHTML(
                            event.flight_number
                        )}
                    </strong>

                    <br>

                    ${escapeHTML(
                        event.departure
                    )}
                    →
                    ${escapeHTML(
                        event.arrival
                    )}

                    <br>

                    <small>

                        ${formatDate(
                            event.departure_time
                        )}

                        ·

                        ${escapeHTML(
                            getDistanceName(
                                event.distance_type ||
                                "short"
                            )
                        )}

                        ·

                        ${Number(
                            event.points || 0
                        )}
                        Point(s)

                        ·

                        ${formatNumber(
                            event.miles
                        )}
                        Miles

                        ·

                        ${escapeHTML(
                            eventStatusText(
                                event.status
                            )
                        )}

                    </small>

                </div>


                <button
                    class="danger"
                    onclick="deleteEventFlight('${event.id}')"
                >
                    DELETE
                </button>

            `;


            container.appendChild(
                div
            );
        }
    );
}


// ============================================================
// DELETE EVENT
// ============================================================

async function deleteEventFlight(
    id
) {

    if (!isAdmin()) {

        return showMessage(
            "Admin access required."
        );
    }


    if (
        !confirm(
            "Delete this event flight? " +
            "Existing bookings will also be deleted."
        )
    ) {

        return;
    }


    const {
        error
    } = await supabaseClient
        .from("events")
        .delete()
        .eq(
            "id",
            id
        );


    if (error) {

        return showMessage(
            "Could not delete event flight: " +
            error.message
        );
    }


    showMessage(
        "Event flight deleted successfully."
    );


    await loadEventFlights();
    await loadAdminEventFlights();
}


// ============================================================
// BUTTONS
// ============================================================

function setupButtons() {

    document
        .getElementById(
            "loginButton"
        )
        ?.addEventListener(
            "click",
            loginWithDiscord
        );


    document
        .getElementById(
            "logoutButton"
        )
        ?.addEventListener(
            "click",
            logout
        );
}


// ============================================================
// AUTH STATE
// ============================================================

supabaseClient.auth.onAuthStateChange(
    async (
        _event,
        session
    ) => {

        currentUser =
            session?.user || null;


        if (currentUser) {

            await loadCurrentProfile();

        } else {

            currentProfile = null;
        }


        updateLoginUI();

        await loadFlights();

        await loadEventFlights();
    }
);


// ============================================================
// START
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        console.log(
            "Austrian Airlines Flight Operations V1.1 loaded."
        );


        setupButtons();

        await loadUser();

        await loadFlights();

        await loadEventFlights();
    }
);
