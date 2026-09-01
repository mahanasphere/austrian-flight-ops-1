const SUPABASE_URL =
    "https://qdtpwggllgnyzazmshyf.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_zgfXsfelbYVAGcvKk1wRhA_ok9n8jjl";

const supabaseClient =
    supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );


/* ============================= */
/* CONFIG */
/* ============================= */

const ADMIN_DISCORD_ID =
    "1214124494340493312";


/* ============================= */
/* MILES & MORE CONFIG */
/* ============================= */

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


/*
 * Event Flight distance:
 *
 * Short-haul  = 1 Point
 * Medium-haul = 2 Points
 * Long-haul   = 3 Points
 */

const EVENT_DISTANCE_POINTS = {

    short: 1,
    medium: 2,
    long: 3

};


/* ============================= */
/* GLOBAL STATE */
/* ============================= */

let currentUser = null;

let currentProfile = null;


/* ============================= */
/* HELPERS */
/* ============================= */

function showMessage(text) {

    const message =
        document.getElementById("message");

    if (!message) return;

    message.textContent = text;

    message.classList.remove("hidden");
}


function hideMessage() {

    const message =
        document.getElementById("message");

    if (!message) return;

    message.classList.add("hidden");
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

    return Number(value || 0)
        .toLocaleString();
}


/* ============================= */
/* DISCORD ID */
/* ============================= */

function getDiscordId(user) {

    if (!user) {
        return null;
    }

    const discordIdentity =
        user.identities?.find(
            identity =>
                identity.provider === "discord"
        );

    if (
        discordIdentity &&
        discordIdentity.identity_data
    ) {

        return String(
            discordIdentity.identity_data.provider_id ||
            discordIdentity.identity_data.sub ||
            ""
        );
    }

    return String(
        user.user_metadata?.provider_id ||
        user.user_metadata?.sub ||
        ""
    );
}


/* ============================= */
/* ADMIN CHECK */
/* ============================= */

function isAdmin() {

    const discordId =
        getDiscordId(currentUser);

    return (
        currentUser &&
        discordId === ADMIN_DISCORD_ID
    );
}


/* ============================= */
/* DISCORD LOGIN */
/* ============================= */

async function loginWithDiscord() {

    hideMessage();

    console.log(
        "Discord login started."
    );

    const {
        data,
        error
    } =
        await supabaseClient.auth
            .signInWithOAuth({

                provider: "discord",

                options: {

                    redirectTo:
                        window.location.origin +
                        window.location.pathname

                }

            });

    console.log(
        "OAuth response:",
        data,
        error
    );

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


/* ============================= */
/* LOGOUT */
/* ============================= */

async function logout() {

    const {
        error
    } =
        await supabaseClient.auth
            .signOut();

    if (error) {

        console.error(
            "Logout error:",
            error
        );

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


/* ============================= */
/* LOAD USER */
/* ============================= */

async function loadUser() {

    const {
        data: {
            session
        }
    } =
        await supabaseClient.auth
            .getSession();

    currentUser =
        session?.user || null;

    console.log(
        "Current user:",
        currentUser
    );

    console.log(
        "Discord ID:",
        getDiscordId(currentUser)
    );

    console.log(
        "Admin:",
        isAdmin()
    );

    if (currentUser) {
        await loadCurrentProfile();
    } else {
        currentProfile = null;
    }

    updateLoginUI();
}


/* ============================= */
/* LOAD PROFILE */
/* ============================= */

async function loadCurrentProfile() {

    if (!currentUser) {
        currentProfile = null;
        return;
    }

    const {
        data,
        error
    } =
        await supabaseClient
            .from("profiles")
            .select("*")
            .eq(
                "id",
                currentUser.id
            )
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

    console.log(
        "Current profile:",
        currentProfile
    );
}


/* ============================= */
/* LOGIN UI */
/* ============================= */

function updateLoginUI() {

    const loginButton =
        document.getElementById(
            "loginButton"
        );

    const logoutButton =
        document.getElementById(
            "logoutButton"
        );

    const userName =
        document.getElementById(
            "userName"
        );

    if (
        !loginButton ||
        !logoutButton
    ) {
        return;
    }

    if (!currentUser) {

        loginButton.classList.remove(
            "hidden"
        );

        logoutButton.classList.add(
            "hidden"
        );

        if (userName) {
            userName.textContent = "";
        }

    } else {

        loginButton.classList.add(
            "hidden"
        );

        logoutButton.classList.remove(
            "hidden"
        );

        const metadata =
            currentUser.user_metadata ||
            {};

        if (userName) {

            userName.textContent =
                metadata.full_name ||
                metadata.name ||
                metadata.preferred_username ||
                "Pilot";

        }
    }

    updateAdminUI();
}


/* ============================= */
/* ADMIN UI */
/* ============================= */

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

        console.log(
            "Admin mode enabled."
        );

        if (panel) {

            panel.classList.remove(
                "hidden"
            );

        }

        if (eventPanel) {

            eventPanel.classList.remove(
                "hidden"
            );

            ensureEventAdminFields();

        }

        loadAdminFlights();
        loadAdminEventFlights();

    } else {

        console.log(
            "Admin mode disabled."
        );

        if (panel) {

            panel.classList.add(
                "hidden"
            );

        }

        if (eventPanel) {

            eventPanel.classList.add(
                "hidden"
            );

        }
    }
}


/* ============================= */
/* FLIGHTS — ATC24 */
/* ============================= */

async function loadFlights() {

    const {
        data,
        error
    } =
        await supabaseClient
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

        showMessage(
            "Could not load flights: " +
            error.message
        );

        return;
    }

    renderFlights(
        data || []
    );
}


/* ============================= */
/* ATC24 STATUS CLASS */
/* ============================= */

function statusClass(status) {

    if (
        status === "claimed"
    ) {
        return "claimed";
    }

    if (
        status === "in_progress"
    ) {
        return "progress";
    }

    if (
        status === "completed"
    ) {
        return "completed";
    }

    return "available";
}


/* ============================= */
/* ATC24 STATUS TEXT */
/* ============================= */

function statusText(status) {

    if (
        status === "claimed"
    ) {
        return "CLAIMED";
    }

    if (
        status === "in_progress"
    ) {
        return "IN PROGRESS";
    }

    if (
        status === "completed"
    ) {
        return "COMPLETED";
    }

    return "AVAILABLE";
}


/* ============================= */
/* ATC24 FLIGHT BOARD */
/* ============================= */

function renderFlights(flights) {

    const board =
        document.getElementById(
            "flightBoard"
        );

    const flightCount =
        document.getElementById(
            "flightCount"
        );

    if (!board) return;

    board.innerHTML = "";

    if (flightCount) {

        flightCount.textContent =
            `${flights.length} flights`;

    }

    if (!flights.length) {

        board.innerHTML = `
            <p>No flights available.</p>
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


            /* AVAILABLE */

            if (
                flight.status ===
                "available"
            ) {

                if (currentUser) {

                    actions = `
                        <button
                            class="primary"
                            onclick="claimFlight('${flight.id}')">

                            CLAIM FLIGHT

                        </button>
                    `;

                } else {

                    actions = `
                        <button
                            class="light"
                            onclick="loginWithDiscord()">

                            🔒 LOGIN WITH DISCORD TO CLAIM

                        </button>
                    `;
                }
            }


            /* CLAIMED */

            else if (
                flight.status ===
                "claimed"
            ) {

                if (mine) {

                    actions = `
                        <button
                            class="primary"
                            onclick="startFlight('${flight.id}')">

                            START FLIGHT

                        </button>
                    `;

                } else {

                    actions = `
                        <span>
                            Pilot has claimed this flight.
                        </span>
                    `;
                }
            }


            /* IN PROGRESS */

            else if (
                flight.status ===
                "in_progress"
            ) {

                if (mine) {

                    actions = `

                        <button
                            class="light"
                            onclick="recordEvent('${flight.id}', 'pushback')">

                            PUSHBACK

                        </button>

                        <button
                            class="light"
                            onclick="recordEvent('${flight.id}', 'takeoff')">

                            TAKEOFF

                        </button>

                        <button
                            class="light"
                            onclick="recordEvent('${flight.id}', 'landing')">

                            LANDING

                        </button>

                        <button
                            class="secondary"
                            onclick="completeFlight('${flight.id}')">

                            END FLIGHT

                        </button>

                    `;
                }
            }


            /* COMPLETED */

            else if (
                flight.status ===
                "completed"
            ) {

                actions =
                    "<strong>✓ Flight completed</strong>";
            }


            card.innerHTML = `

                <div class="flight-header">

                    <div class="flight-number">

                        ${escapeHTML(
                            flight.flight_number
                        )}

                    </div>

                    <div
                        class="status ${statusClass(
                            flight.status
                        )}">

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

                    <span>
                        →
                    </span>

                    <span>
                        ${escapeHTML(
                            flight.arrival_airport
                        )}
                    </span>

                </div>


                <div class="info-grid">

                    <div class="info">

                        <strong>
                            Scheduled
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
                    ?
                    `
                        <div class="additional">

                            <strong>
                                Additional Information
                            </strong>

                            <br>

                            ${escapeHTML(
                                flight.additional_info
                            )}

                        </div>
                    `
                    :
                    ""
                }


                ${
                    flight.started_at ||
                    flight.pushback_at ||
                    flight.takeoff_at ||
                    flight.landing_at ||
                    flight.completed_at
                    ?
                    `
                        <div class="event-times">

                            ${
                                flight.started_at
                                ?
                                `
                                    ▶️ Started:
                                    ${formatDate(
                                        flight.started_at
                                    )}
                                    <br>
                                `
                                :
                                ""
                            }

                            ${
                                flight.pushback_at
                                ?
                                `
                                    ↪ Pushback:
                                    ${formatDate(
                                        flight.pushback_at
                                    )}
                                    <br>
                                `
                                :
                                ""
                            }

                            ${
                                flight.takeoff_at
                                ?
                                `
                                    🛫 Takeoff:
                                    ${formatDate(
                                        flight.takeoff_at
                                    )}
                                    <br>
                                `
                                :
                                ""
                            }

                            ${
                                flight.landing_at
                                ?
                                `
                                    🛬 Landing:
                                    ${formatDate(
                                        flight.landing_at
                                    )}
                                    <br>
                                `
                                :
                                ""
                            }

                            ${
                                flight.completed_at
                                ?
                                `
                                    ✓ Completed:
                                    ${formatDate(
                                        flight.completed_at
                                    )}
                                `
                                :
                                ""
                            }

                        </div>
                    `
                    :
                    ""
                }


                <div class="actions">

                    ${actions}

                </div>

            `;

            board.appendChild(
                card
            );
        }
    );
}


/* ============================= */
/* CLAIM ATC24 FLIGHT */
/* ============================= */

async function claimFlight(id) {

    if (!currentUser) {

        showMessage(
            "You must log in with Discord first."
        );

        return;
    }

    const {
        error
    } =
        await supabaseClient
            .from("flights")
            .update({

                status:
                    "claimed",

                claimed_by:
                    currentUser.id,

                claimed_at:
                    new Date().toISOString()

            })
            .eq(
                "id",
                id
            )
            .eq(
                "status",
                "available"
            );

    if (error) {

        showMessage(
            error.message
        );

        return;
    }

    await loadFlights();
}


/* ============================= */
/* START ATC24 FLIGHT */
/* ============================= */

async function startFlight(id) {

    if (!currentUser) return;

    const {
        error
    } =
        await supabaseClient
            .from("flights")
            .update({

                status:
                    "in_progress",

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

        showMessage(
            error.message
        );

        return;
    }

    await loadFlights();
}


/* ============================= */
/* ATC24 EVENTS */
/* ============================= */

async function recordEvent(
    id,
    event
) {

    if (!currentUser) return;

    const eventFields = {

        pushback:
            "pushback_at",

        takeoff:
            "takeoff_at",

        landing:
            "landing_at"

    };

    const field =
        eventFields[event];

    if (!field) return;

    const update = {};

    update[field] =
        new Date().toISOString();

    const {
        error
    } =
        await supabaseClient
            .from("flights")
            .update(update)
            .eq(
                "id",
                id
            )
            .eq(
                "claimed_by",
                currentUser.id
            );

    if (error) {

        showMessage(
            error.message
        );

        return;
    }

    await loadFlights();
}


/* ============================= */
/* ADMIN — CREATE ATC24 FLIGHT */
/* ============================= */

async function createFlight() {

    if (!isAdmin()) {

        showMessage(
            "Admin access required."
        );

        return;
    }

    const scheduledElement =
        document.getElementById(
            "scheduled"
        );

    if (!scheduledElement) {

        showMessage(
            "Scheduled departure field not found."
        );

        return;
    }

    const scheduledValue =
        scheduledElement.value;

    if (!scheduledValue) {

        showMessage(
            "Please select a scheduled departure."
        );

        return;
    }

    const additionalInfoElement =
        document.getElementById(
            "additionalInfo"
        );

    const additionalInfo =
        additionalInfoElement
            ? additionalInfoElement.value.trim()
            : "";

    const flight = {

        flight_number:
            document.getElementById(
                "flightNumber"
            ).value.trim(),

        departure_airport:
            document.getElementById(
                "departure"
            ).value.trim(),

        arrival_airport:
            document.getElementById(
                "arrival"
            ).value.trim(),

        scheduled_departure:
            new Date(
                scheduledValue
            ).toISOString(),

        aircraft_model:
            document.getElementById(
                "aircraft"
            ).value.trim(),

        operator_airline:
            document.getElementById(
                "operator"
            ).value.trim(),

        livery_airline:
            document.getElementById(
                "livery"
            ).value.trim(),

        recurrence:
            document.getElementById(
                "recurrence"
            ).value,

        additional_info:
            additionalInfo || null,

        status:
            "available"

    };

    const {
        error
    } =
        await supabaseClient
            .from("flights")
            .insert(flight);

    if (error) {

        console.error(
            "Create flight error:",
            error
        );

        showMessage(
            "Could not create flight: " +
            error.message
        );

        return;
    }

    showMessage(
        "Flight created successfully."
    );

    const form =
        document.getElementById(
            "flightForm"
        );

    if (form) {
        form.reset();
    }

    await loadFlights();
    await loadAdminFlights();
}


/* ============================= */
/* ADMIN — ATC24 FLIGHT LIST */
/* ============================= */

async function loadAdminFlights() {

    if (!isAdmin()) return;

    const {
        data,
        error
    } =
        await supabaseClient
            .from("flights")
            .select("*")
            .order(
                "scheduled_departure",
                {
                    ascending: false
                }
            );

    if (error) {

        console.error(
            "Admin flight loading error:",
            error
        );

        return;
    }

    const container =
        document.getElementById(
            "adminFlights"
        );

    if (!container) return;

    container.innerHTML = "";

    if (!data || !data.length) {

        container.innerHTML = `
            <p>No flights created yet.</p>
        `;

        return;
    }

    data.forEach(
        flight => {

            const div =
                document.createElement(
                    "div"
                );

            div.className =
                "admin-flight";

            div.innerHTML = `

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

                </small>

                <br>

                <small>

                    Status:
                    ${escapeHTML(
                        statusText(
                            flight.status
                        )
                    )}

                </small>

                ${
                    flight.additional_info
                    ?
                    `
                        <br>

                        <small>

                            Info:
                            ${escapeHTML(
                                flight.additional_info
                            )}

                        </small>
                    `
                    :
                    ""
                }

                <br>

                <button
                    class="danger"
                    onclick="deleteFlight('${flight.id}')">

                    DELETE

                </button>

            `;

            container.appendChild(
                div
            );
        }
    );
}


/* ============================= */
/* ADMIN — DELETE ATC24 FLIGHT */
/* ============================= */

async function deleteFlight(id) {

    if (!isAdmin()) {

        showMessage(
            "Admin access required."
        );

        return;
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
    } =
        await supabaseClient
            .from("flights")
            .delete()
            .eq(
                "id",
                id
            );

    if (error) {

        console.error(
            "Delete flight error:",
            error
        );

        showMessage(
            "Could not delete flight: " +
            error.message
        );

        return;
    }

    showMessage(
        "Flight deleted successfully."
    );

    await loadFlights();
    await loadAdminFlights();
}


/* ============================= */
/* END ATC24 FLIGHT */
/* ============================= */

async function completeFlight(id) {

    if (!currentUser) {

        showMessage(
            "You must be logged in."
        );

        return;
    }

    console.log(
        "Ending flight:",
        id
    );

    const {
        data,
        error
    } =
        await supabaseClient
            .from("flights")
            .update({

                status:
                    "completed",

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

    console.log(
        "Complete flight result:",
        data,
        error
    );

    if (error) {

        showMessage(
            "Could not end flight: " +
            error.message
        );

        return;
    }

    if (
        !data ||
        data.length === 0
    ) {

        showMessage(
            "Flight could not be completed. No matching flight was found."
        );

        return;
    }

    showMessage(
        "Flight completed successfully."
    );

    await loadFlights();
}


/* ========================================================= */
/* ========================================================= */
/* EVENT FLIGHTS — V1.1 */
/* ========================================================= */
/* ========================================================= */


/* ============================= */
/* DISTANCE HELPERS */
/* ============================= */

function getDistancePoints(distanceType) {

    return (
        EVENT_DISTANCE_POINTS[
            distanceType
        ] || 0
    );
}


function getDistanceName(distanceType) {

    if (
        distanceType === "short"
    ) {
        return "Short-haul";
    }

    if (
        distanceType === "medium"
    ) {
        return "Medium-haul";
    }

    if (
        distanceType === "long"
    ) {
        return "Long-haul";
    }

    return "Unknown";
}


/* ============================= */
/* STATUS HELPERS */
/* ============================= */

function eventStatusText(status) {

    if (
        status === "boarding"
    ) {
        return "BOARDING";
    }

    if (
        status === "departed"
    ) {
        return "DEPARTED";
    }

    if (
        status === "completed"
    ) {
        return "COMPLETED";
    }

    if (
        status === "cancelled"
    ) {
        return "CANCELLED";
    }

    return "SCHEDULED";
}


function eventStatusClass(status) {

    if (
        status === "boarding"
    ) {
        return "progress";
    }

    if (
        status === "departed"
    ) {
        return "claimed";
    }

    if (
        status === "completed"
    ) {
        return "completed";
    }

    if (
        status === "cancelled"
    ) {
        return "danger";
    }

    return "available";
}


/* ============================= */
/* STATUS REQUIREMENTS */
/* ============================= */

function canBookClass(
    travelClass,
    status
) {

    if (!currentUser) {
        return false;
    }

    const normalized =
        String(
            status ||
            "member"
        ).toLowerCase();

    if (
        travelClass ===
        "economy"
    ) {

        return true;
    }

    if (
        travelClass ===
        "business"
    ) {

        return [
            "frequent_traveller",
            "senator",
            "hon_circle_member"
        ].includes(
            normalized
        );
    }

    if (
        travelClass ===
        "first"
    ) {

        return [
            "senator",
            "hon_circle_member"
        ].includes(
            normalized
        );
    }

    return false;
}


function getClassRequirement(
    travelClass
) {

    if (
        travelClass ===
        "business"
    ) {
        return "Frequent Traveller";
    }

    if (
        travelClass ===
        "first"
    ) {
        return "Senator";
    }

    return "Member";
}


/* ============================= */
/* CLASS NAME */
/* ============================= */

function className(
    travelClass
) {

    if (
        travelClass ===
        "business"
    ) {
        return "Business";
    }

    if (
        travelClass ===
        "first"
    ) {
        return "First";
    }

    return "Economy";
}


/* ============================= */
/* EVENT FLIGHTS LOAD */
/* ============================= */

async function loadEventFlights() {

    const {
        data,
        error
    } =
        await supabaseClient
            .from("events")
            .select("*")
            .order(
                "departure_time",
                {
                    ascending: true
                }
            );

    if (error) {

        console.error(
            "Event flight loading error:",
            error
        );

        const board =
            document.getElementById(
                "eventFlightBoard"
            );

        if (board) {

            board.innerHTML = `
                <p>
                    Could not load event flights.
                </p>
            `;
        }

        return;
    }

    await renderEventFlights(
        data || []
    );
}


/* ============================= */
/* LOAD USER BOOKINGS */
/* ============================= */

async function getUserEventBooking(
    eventId
) {

    if (!currentUser) {
        return null;
    }

    const {
        data,
        error
    } =
        await supabaseClient
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

        return null;
    }

    return data || null;
}


/* ============================= */
/* LOAD EVENT BOOKING COUNTS */
/* ============================= */

async function getEventBookingCounts(
    eventId
) {

    const {
        data,
        error
    } =
        await supabaseClient
            .from("event_bookings")
            .select(
                "travel_class"
            )
            .eq(
                "event_id",
                eventId
            );

    if (error) {

        console.error(
            "Booking count error:",
            error
        );

        return {
            economy: 0,
            business: 0,
            first: 0
        };
    }

    const counts = {

        economy: 0,
        business: 0,
        first: 0

    };

    (data || []).forEach(
        booking => {

            if (
                counts[
                    booking.travel_class
                ] !== undefined
            ) {

                counts[
                    booking.travel_class
                ]++;

            }
        }
    );

    return counts;
}


/* ============================= */
/* EVENT FLIGHT BOARD */
/* ============================= */

async function renderEventFlights(
    events
) {

    const board =
        document.getElementById(
            "eventFlightBoard"
        );

    const countElement =
        document.getElementById(
            "eventFlightCount"
        );

    if (!board) return;

    board.innerHTML = "";

    if (countElement) {

        countElement.textContent =
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

        const distanceType =
            event.distance_type ||
            "short";

        const points =
            Number(
                event.points ??
                getDistancePoints(
                    distanceType
                )
            );

        const card =
            document.createElement(
                "div"
            );

        card.className =
            "flight event-flight";


        let bookingHTML = "";


        if (
            event.status ===
            "cancelled"
        ) {

            bookingHTML = `
                <strong>
                    ❌ This event flight has been cancelled.
                </strong>
            `;

        } else if (
            event.status ===
            "completed"
        ) {

            bookingHTML = `
                <strong>
                    ✓ Event flight completed
                </strong>
            `;

        } else if (
            booking
        ) {

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

                </div>

            `;

        } else if (!currentUser) {

            bookingHTML = `

                <button
                    class="light"
                    onclick="loginWithDiscord()">

                    🔒 LOGIN WITH DISCORD TO BOOK

                </button>

            `;

        } else {

            bookingHTML = `

                <div class="actions">

                    ${event.economy_capacity > counts.economy
                    ?
                    `
                        <button
                            class="primary"
                            onclick="bookEventFlight('${event.id}', 'economy')">

                            BOOK ECONOMY

                        </button>
                    `
                    :
                    `
                        <span>
                            Economy full
                        </span>
                    `}


                    ${
                        canBookClass(
                            "business",
                            currentProfile?.miles_and_more_status
                        )
                        ?
                        (
                            event.business_capacity >
                            counts.business
                            ?
                            `
                                <button
                                    class="light"
                                    onclick="bookEventFlight('${event.id}', 'business')">

                                    BOOK BUSINESS

                                </button>
                            `
                            :
                            `
                                <span>
                                    Business full
                                </span>
                            `
                        )
                        :
                        `
                            <span>
                                🔒 Business —
                                ${getClassRequirement("business")} required
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
                            event.first_capacity >
                            counts.first
                            ?
                            `
                                <button
                                    class="secondary"
                                    onclick="bookEventFlight('${event.id}', 'first')">

                                    BOOK FIRST

                                </button>
                            `
                            :
                            `
                                <span>
                                    First full
                                </span>
                            `
                        )
                        :
                        `
                            <span>
                                🔒 First —
                                ${getClassRequirement("first")} required
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

                <div
                    class="status ${eventStatusClass(
                        event.status
                    )}">

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
                        Route
                    </strong>

                    ${escapeHTML(
                        getDistanceName(
                            distanceType
                        )
                    )}

                </div>


                <div class="info">

                    <strong>
                        Miles & More
                    </strong>

                    ${points} Points
                    ·
                    ${formatNumber(
                        event.miles
                    )} Miles

                </div>

            </div>


            <div class="additional">

                <strong>
                    🎫 Capacity
                </strong>

                <br>

                Economy:
                ${counts.economy}/${Number(
                    event.economy_capacity || 0
                )}

                <br>

                Business:
                ${counts.business}/${Number(
                    event.business_capacity || 0
                )}

                <br>

                First:
                ${counts.first}/${Number(
                    event.first_capacity || 0
                )}

            </div>


            ${
                event.pilot_id
                ?
                `
                    <div class="additional">

                        <strong>
                            👨‍✈️ Event Pilot
                        </strong>

                        <br>

                        Assigned pilot

                    </div>
                `
                :
                ""
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


/* ============================= */
/* BOOK EVENT FLIGHT */
/* ============================= */

async function bookEventFlight(
    eventId,
    travelClass
) {

    if (!currentUser) {

        showMessage(
            "You must log in with Discord first."
        );

        return;
    }


    if (
        ![
            "economy",
            "business",
            "first"
        ].includes(
            travelClass
        )
    ) {

        return;
    }


    if (
        !canBookClass(
            travelClass,
            currentProfile?.miles_and_more_status
        )
    ) {

        showMessage(
            `${className(
                travelClass
            )} requires ${getClassRequirement(
                travelClass
            )} status.`
        );

        return;
    }


    const existing =
        await getUserEventBooking(
            eventId
        );

    if (existing) {

        showMessage(
            "You are already booked on this event flight."
        );

        return;
    }


    const {
        data: event,
        error: eventError
    } =
        await supabaseClient
            .from("events")
            .select("*")
            .eq(
                "id",
                eventId
            )
            .single();


    if (eventError) {

        showMessage(
            "Could not load event flight: " +
            eventError.message
        );

        return;
    }


    if (
        event.status ===
        "cancelled"
    ) {

        showMessage(
            "This event flight has been cancelled."
        );

        return;
    }


    if (
        event.status ===
        "completed"
    ) {

        showMessage(
            "This event flight has already been completed."
        );

        return;
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

        showMessage(
            `${className(
                travelClass
            )} is fully booked.`
        );

        return;
    }


    const {
        error
    } =
        await supabaseClient
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

        console.error(
            "Event booking error:",
            error
        );

        showMessage(
            "Could not book flight: " +
            error.message
        );

        return;
    }


    showMessage(
        `Successfully booked in ${className(
            travelClass
        )}.`
    );


    await loadEventFlights();
}


/* ========================================================= */
/* EVENT ADMIN */
/* ========================================================= */


/* ============================= */
/* CREATE MISSING ADMIN FIELDS */
/* ============================= */

function ensureEventAdminFields() {

    const panel =
        document.getElementById(
            "eventAdminPanel"
        );

    if (!panel) return;


    /*
     * Your current HTML did not yet contain
     * the distance and miles fields.
     *
     * We create them automatically so you
     * don't have to change index.html just
     * for these two fields.
     */

    if (
        !document.getElementById(
            "eventDistance"
        )
    ) {

        const wrapper =
            document.createElement(
                "div"
            );

        wrapper.innerHTML = `

            <label for="eventDistance">
                Route Distance
            </label>

            <select
                id="eventDistance">

                <option value="short">
                    Short-haul — 1 Point
                </option>

                <option value="medium">
                    Medium-haul — 2 Points
                </option>

                <option value="long">
                    Long-haul — 3 Points
                </option>

            </select>

        `;

        const button =
            panel.querySelector(
                "button"
            );

        if (button) {

            panel.insertBefore(
                wrapper,
                button
            );

        } else {

            panel.appendChild(
                wrapper
            );

        }
    }


    if (
        !document.getElementById(
            "eventMiles"
        )
    ) {

        const wrapper =
            document.createElement(
                "div"
            );

        wrapper.innerHTML = `

            <label for="eventMiles">
                Miles
            </label>

            <input
                type="number"
                id="eventMiles"
                min="0"
                step="1"
                placeholder="e.g. 750">

        `;

        const button =
            panel.querySelector(
                "button"
            );

        if (button) {

            panel.insertBefore(
                wrapper,
                button
            );

        } else {

            panel.appendChild(
                wrapper
            );

        }
    }
}


/* ============================= */
/* CREATE EVENT FLIGHT */
/* ============================= */

async function createEventFlight() {

    if (!isAdmin()) {

        showMessage(
            "Admin access required."
        );

        return;
    }


    ensureEventAdminFields();


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


    const pilotValue =
        document.getElementById(
            "eventPilot"
        )?.value.trim();


    const economyCapacity =
        Number(
            document.getElementById(
                "economyCapacity"
            )?.value || 0
        );


    const businessCapacity =
        Number(
            document.getElementById(
                "businessCapacity"
            )?.value || 0
        );


    const firstCapacity =
        Number(
            document.getElementById(
                "firstCapacity"
            )?.value || 0
        );


    const status =
        document.getElementById(
            "eventStatus"
        )?.value ||
        "scheduled";


    const distanceType =
        document.getElementById(
            "eventDistance"
        )?.value ||
        "short";


    const miles =
        Number(
            document.getElementById(
                "eventMiles"
            )?.value || 0
        );


    if (!flightNumber) {

        showMessage(
            "Please enter a flight number."
        );

        return;
    }


    if (!departure) {

        showMessage(
            "Please enter a departure airport."
        );

        return;
    }


    if (!arrival) {

        showMessage(
            "Please enter an arrival airport."
        );

        return;
    }


    if (!departureTime) {

        showMessage(
            "Please select a departure time."
        );

        return;
    }


    if (!aircraft) {

        showMessage(
            "Please enter an aircraft."
        );

        return;
    }


    if (
        ![
            "short",
            "medium",
            "long"
        ].includes(
            distanceType
        )
    ) {

        showMessage(
            "Please select a valid route distance."
        );

        return;
    }


    if (
        !Number.isFinite(
            miles
        ) ||
        miles < 0
    ) {

        showMessage(
            "Please enter valid Miles."
        );

        return;
    }


    const points =
        getDistancePoints(
            distanceType
        );


    /*
     * pilot_id is a UUID in the events table.
     *
     * If the field is empty, no pilot is assigned.
     *
     * If something is entered, it must be
     * a valid UUID.
     */

    let pilotId =
        null;


    if (pilotValue) {

        const uuidRegex =
            /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

        if (
            !uuidRegex.test(
                pilotValue
            )
        ) {

            showMessage(
                "Pilot ID must be a valid Supabase User UUID."
            );

            return;
        }

        pilotId =
            pilotValue;
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
                economyCapacity
            ),

        business_capacity:
            Math.max(
                0,
                businessCapacity
            ),

        first_capacity:
            Math.max(
                0,
                firstCapacity
            ),

        distance_type:
            distanceType,

        points:
            points,

        miles:
            miles

    };


    console.log(
        "Creating Event Flight:",
        event
    );


    const {
        error
    } =
        await supabaseClient
            .from("events")
            .insert(event);


    if (error) {

        console.error(
            "Create event flight error:",
            error
        );

        showMessage(
            "Could not create event flight: " +
            error.message
        );

        return;
    }


    showMessage(
        `Event flight created successfully — ${points} Points / ${formatNumber(
            miles
        )} Miles.`
    );


    const form =
        document.getElementById(
            "eventFlightForm"
        );

    if (form) {

        form.reset();

    } else {

        [
            "eventFlightNumber",
            "eventDeparture",
            "eventArrival",
            "eventDepartureTime",
            "eventAircraft",
            "eventPilot",
            "economyCapacity",
            "businessCapacity",
            "firstCapacity",
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

    }


    await loadEventFlights();
    await loadAdminEventFlights();
}


/* ============================= */
/* ADMIN EVENT LIST */
/* ============================= */

async function loadAdminEventFlights() {

    if (!isAdmin()) return;


    const container =
        document.getElementById(
            "adminEventFlights"
        );

    if (!container) return;


    const {
        data,
        error
    } =
        await supabaseClient
            .from("events")
            .select("*")
            .order(
                "departure_time",
                {
                    ascending: false
                }
            );


    if (error) {

        console.error(
            "Admin event loading error:",
            error
        );

        container.innerHTML = `
            <p>
                Could not load event flights.
            </p>
        `;

        return;
    }


    container.innerHTML = "";


    if (
        !data ||
        !data.length
    ) {

        container.innerHTML = `
            <p>
                No event flights created yet.
            </p>
        `;

        return;
    }


    data.forEach(
        event => {

            const div =
                document.createElement(
                    "div"
                );

            div.className =
                "admin-flight";


            const distanceType =
                event.distance_type ||
                "short";


            const points =
                Number(
                    event.points ??
                    getDistancePoints(
                        distanceType
                    )
                );


            div.innerHTML = `

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

                </small>

                <br>

                <small>

                    ${escapeHTML(
                        getDistanceName(
                            distanceType
                        )
                    )}

                    ·

                    ${points}
                    Points

                    ·

                    ${formatNumber(
                        event.miles
                    )}
                    Miles

                </small>

                <br>

                <small>

                    Status:
                    ${escapeHTML(
                        eventStatusText(
                            event.status
                        )
                    )}

                </small>

                <br>

                <button
                    class="danger"
                    onclick="deleteEventFlight('${event.id}')">

                    DELETE

                </button>

            `;


            container.appendChild(
                div
            );
        }
    );
}


/* ============================= */
/* DELETE EVENT FLIGHT */
/* ============================= */

async function deleteEventFlight(
    id
) {

    if (!isAdmin()) {

        showMessage(
            "Admin access required."
        );

        return;
    }


    if (
        !confirm(
            "Delete this event flight?"
        )
    ) {

        return;
    }


    const {
        error
    } =
        await supabaseClient
            .from("events")
            .delete()
            .eq(
                "id",
                id
            );


    if (error) {

        console.error(
            "Delete event flight error:",
            error
        );

        showMessage(
            "Could not delete event flight: " +
            error.message
        );

        return;
    }


    showMessage(
        "Event flight deleted successfully."
    );


    await loadEventFlights();
    await loadAdminEventFlights();
}


/* ========================================================= */
/* EVENT PARTICIPATION — PREPARATION FOR V1.1 */
/* ========================================================= */


/*
 * These functions are the foundation for the
 * later complete event-flight experience.
 *
 * Booking does NOT award Miles or Points.
 *
 * Rewards are only awarded once the passenger
 * has completed the entire event flight.
 */


/* ============================= */
/* CHECK IN */
/* ============================= */

async function checkInEventFlight(
    bookingId
) {

    if (!currentUser) {

        showMessage(
            "You must be logged in."
        );

        return;
    }


    const {
        error
    } =
        await supabaseClient
            .from("event_bookings")
            .update({

                checked_in:
                    true

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

        showMessage(
            "Could not check in: " +
            error.message
        );

        return;
    }


    await loadEventFlights();
}


/* ============================= */
/* BOARD EVENT FLIGHT */
/* ============================= */

async function boardEventFlight(
    bookingId
) {

    if (!currentUser) {

        showMessage(
            "You must be logged in."
        );

        return;
    }


    const {
        error
    } =
        await supabaseClient
            .from("event_bookings")
            .update({

                boarded:
                    true

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

        showMessage(
            "Could not board: " +
            error.message
        );

        return;
    }


    await loadEventFlights();
}


/* ============================= */
/* COMPLETE EVENT BOOKING */
/* ============================= */

async function completeEventBooking(
    bookingId
) {

    if (!currentUser) {

        showMessage(
            "You must be logged in."
        );

        return;
    }


    /*
     * Completing the booking alone does NOT
     * award Miles or Points yet.
     *
     * The final V1.1 operational flow will
     * verify the complete event flight first.
     */

    const {
        error
    } =
        await supabaseClient
            .from("event_bookings")
            .update({

                completed:
                    true

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

        showMessage(
            "Could not complete booking: " +
            error.message
        );

        return;
    }


    showMessage(
        "Event flight marked as completed."
    );


    await loadEventFlights();
}


/* ========================================================= */
/* BUTTONS */
/* ========================================================= */

function setupButtons() {

    const loginButton =
        document.getElementById(
            "loginButton"
        );

    const logoutButton =
        document.getElementById(
            "logoutButton"
        );


    if (loginButton) {

        loginButton.addEventListener(
            "click",
            loginWithDiscord
        );

    }


    if (logoutButton) {

        logoutButton.addEventListener(
            "click",
            logout
        );

    }
}


/* ========================================================= */
/* AUTH STATE */
/* ========================================================= */

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


/* ========================================================= */
/* START APPLICATION */
/* ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        console.log(
            "Austrian Airlines Flight Operations loaded."
        );


        setupButtons();


        await loadUser();


        await loadFlights();


        await loadEventFlights();

    }
);
