const SUPABASE_URL =
    "https://qdtpwggllgnyzazmshyf.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_hCSlJblrQmAqIYXfxLECag_JnE4i28e";

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
/* GLOBAL STATE */
/* ============================= */

let currentUser = null;


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

    return new Intl.DateTimeFormat(
        undefined,
        {
            dateStyle: "medium",
            timeStyle: "short"
        }
    ).format(new Date(value));
}


/* ============================= */
/* DISCORD ID */
/* ============================= */

function getDiscordId(user) {

    if (!user) return null;


    /*
     * Supabase stores OAuth identities
     * separately from the Supabase UID.
     */

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


    /*
     * Fallbacks for Discord metadata.
     */

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
                        window.location.href

                }

            });


    console.log(
        "OAuth response:",
        data,
        error
    );


    if (error) {

        console.error(error);

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

        showMessage(
            error.message
        );

        return;
    }


    currentUser = null;

    updateLoginUI();

    await loadFlights();
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


    updateLoginUI();
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


    if (!panel) return;


    if (isAdmin()) {

        console.log(
            "Admin mode enabled."
        );


        panel.classList.remove(
            "hidden"
        );


        loadAdminFlights();

    } else {

        console.log(
            "Admin mode disabled."
        );


        panel.classList.add(
            "hidden"
        );

    }
}


/* ============================= */
/* FLIGHTS */
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
/* STATUS */
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
/* FLIGHT BOARD */
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

                    actions =
                        "<span>Pilot has claimed this flight.</span>";

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
/* CLAIM */
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
/* START FLIGHT */
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
/* OPTIONAL EVENTS */
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
/* END FLIGHT */
/* ============================= */

async function completeFlight(id) {

    if (!currentUser) return;


    const {
        error
    } =
        await supabaseClient
            .from("flights")
            .update({

                status:
                    "completed",
            card.innerHTML = `

                <div class="flight-header">

                    <div class="flight-number">
                        ${escapeHTML(flight.flight_number)}
                    </div>

                    <div class="status ${statusClass(flight.status)}">
                        ${statusText(flight.status)}
                    </div>

                </div>

                <div class="route">

                    <span>
                        ${escapeHTML(flight.departure_airport)}
                    </span>

                    <span>→</span>

                    <span>
                        ${escapeHTML(flight.arrival_airport)}
                    </span>

                </div>

                <div class="info-grid">

                    <div class="info">
                        <strong>Scheduled</strong>
                        ${formatDate(flight.scheduled_departure)}
                    </div>

                    <div class="info">
                        <strong>Aircraft</strong>
                        ${escapeHTML(flight.aircraft_model)}
                    </div>

                    <div class="info">
                        <strong>Operator</strong>
                        ${escapeHTML(flight.operator_airline)}
                    </div>

                    <div class="info">
                        <strong>Livery</strong>
                        ${escapeHTML(flight.livery_airline)}
                    </div>

                </div>

                ${
                    flight.additional_info
                    ? `
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


/* ============================= */
/* CLAIM FLIGHT */
/* ============================= */

async function claimFlight(id) {

    if (!currentUser) {

        showMessage(
            "You must log in with Discord first."
        );

        return;
    }

    const { error } =
        await supabaseClient
            .from("flights")
            .update({
                status: "claimed",
                claimed_by: currentUser.id,
                claimed_at: new Date().toISOString()
            })
            .eq("id", id)
            .eq("status", "available");

    if (error) {

        showMessage(error.message);

        return;
    }

    await loadFlights();
}


/* ============================= */
/* START FLIGHT */
/* ============================= */

async function startFlight(id) {

    if (!currentUser) return;

    const { error } =
        await supabaseClient
            .from("flights")
            .update({
                status: "in_progress",
                started_at: new Date().toISOString()
            })
            .eq("id", id)
            .eq("claimed_by", currentUser.id);

    if (error) {

        showMessage(error.message);

        return;
    }

    await loadFlights();
}


/* ============================= */
/* OPTIONAL FLIGHT EVENTS */
/* ============================= */

async function recordEvent(id, event) {

    if (!currentUser) return;

    const eventFields = {

        pushback: "pushback_at",
        takeoff: "takeoff_at",
        landing: "landing_at"

    };

    const field = eventFields[event];

    if (!field) return;

    const update = {};

    update[field] =
        new Date().toISOString();

    const { error } =
        await supabaseClient
            .from("flights")
            .update(update)
            .eq("id", id)
            .eq("claimed_by", currentUser.id);

    if (error) {

        showMessage(error.message);

        return;
    }

    await loadFlights();
}


/* ============================= */
/* END FLIGHT */
/* ============================= */

async function completeFlight(id) {

    if (!currentUser) return;

    const { error } =
        await supabaseClient
            .from("flights")
            .update({
                status: "completed",
                completed_at: new Date().toISOString()
            })
            .eq("id", id)
            .eq("claimed_by", currentUser.id);

    if (error) {

        showMessage(error.message);

        return;
    }

    await loadFlights();
}


/* ============================= */
/* ADMIN — CREATE FLIGHT */
/* ============================= */

async function createFlight() {

    if (!isAdmin()) {

        showMessage(
            "Admin access required."
        );

        return;
    }

    const scheduledValue =
        document.getElementById("scheduled").value;

    if (!scheduledValue) {

        showMessage(
            "Please select a scheduled departure."
        );

        return;
    }

    const flight = {

        flight_number:
            document.getElementById("flightNumber").value.trim(),

        departure_airport:
            document.getElementById("departure").value.trim(),

        arrival_airport:
            document.getElementById("arrival").value.trim(),

        scheduled_departure:
            new Date(scheduledValue).toISOString(),

        aircraft_model:
            document.getElementById("aircraft").value.trim(),

        operator_airline:
            document.getElementById("operator").value.trim(),

        livery_airline:
            document.getElementById("livery").value.trim(),

        recurrence:
            document.getElementById("recurrence").value,

        additional_info:
            document.getElementById(""additionalInfo").value.trim() || null,

status: "available"

};

const { error } =
    await supabaseClient
        .from("flights")
        .insert(flight);

if (error) {

    showMessage(
        "Could not create flight: " +
        error.message
    );

    return;
}

showMessage(
    "Flight created successfully."
);

await loadFlights();

await loadAdminFlights();
}


/* ADMIN — FLIGHT LIST */

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

        console.error(error);

        return;
    }

    const container =
        document.getElementById(
            "adminFlights"
        );

    if (!container) return;

    container.innerHTML = "";

    (data || []).forEach(
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

                <button
                    class="danger"
                    onclick="deleteFlight('${flight.id}')">

                    DELETE

                </button>
            `;

            container.appendChild(div);

        }
    );
}


/* ADMIN — DELETE FLIGHT */

async function deleteFlight(id) {

    if (!isAdmin()) return;

    if (
        !confirm(
            "Delete this flight?"
        )
    ) return;

    const { error } =
        await supabaseClient
            .from("flights")
            .delete()
            .eq("id", id);

    if (error) {

        showMessage(
            error.message
        );

        return;
    }

    await loadFlights();

    await loadAdminFlights();
}


/* BUTTONS */

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


/* AUTH */

supabaseClient.auth.onAuthStateChange(
    async (
        _event,
        session
    ) => {

        currentUser =
            session?.user || null;

        updateLoginUI();

        await loadFlights();

    }
);


/* START */

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        console.log(
            "Austrian Airlines Flight Operations loaded."
        );

        setupButtons();

        await loadUser();

        await loadFlights();

    }
);
      
