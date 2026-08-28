const SUPABASE_URL =
"https://qdtpwggllgnyzazmshyf.supabase.co";

const SUPABASE_KEY =
"sb_publishable_hCSlJblrQmAqIYXfxLECag_JnE4i28e";

const supabaseClient =
supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);


/*
    HIER SPÄTER DEINE DISCORD USER-ID EINTRAGEN.
*/

const ADMIN_DISCORD_ID = "";


let currentUser = null;


/* ============================= */
/* HELPERS */
/* ============================= */

function showMessage(text) {

    const box =
        document.getElementById(
            "message"
        );

    box.textContent = text;

    box.classList.remove(
        "hidden"
    );

}


function hideMessage() {

    document
        .getElementById(
            "message"
        )
        .classList.add(
            "hidden"
        );

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

    if (!value)
        return "-";

    return new Intl.DateTimeFormat(
        undefined,
        {
            dateStyle: "medium",
            timeStyle: "short"
        }
    ).format(
        new Date(value)
    );

}


function delayMinutes(
    scheduled
) {

    const difference =
        Date.now() -
        new Date(
            scheduled
        ).getTime();

    return Math.max(
        0,
        Math.floor(
            difference / 60000
        )
    );

}


function delayText(
    scheduled
) {

    const minutes =
        delayMinutes(
            scheduled
        );

    if (minutes <= 0)
        return "On time";

    const hours =
        Math.floor(
            minutes / 60
        );

    const mins =
        minutes % 60;

    if (hours > 0) {

        return `+${hours}h ${mins}min`;

    }

    return `+${mins} min`;

}


/* ============================= */
/* AUTH */
/* ============================= */

async function loginWithDiscord() {

    hideMessage();

    const {
        error
    } =
        await supabaseClient
            .auth
            .signInWithOAuth({

                provider:
                    "discord",

                options: {

                    redirectTo:
                        window.location.href

                }

            });


    if (error) {

        showMessage(
            error.message
        );

    }

}


async function logout() {

    await supabaseClient
        .auth
        .signOut();

}


async function loadUser() {

    const {
        data: {
            session
        }
    } =
        await supabaseClient
            .auth
            .getSession();


    currentUser =
        session?.user || null;


    updateLoginUI();

}


function updateLoginUI() {

    const login =
        document.getElementById(
            "loginButton"
        );

    const logout =
        document.getElementById(
            "logoutButton"
        );

    const userName =
        document.getElementById(
            "userName"
        );


    if (!currentUser) {

        login.classList.remove(
            "hidden"
        );

        logout.classList.add(
            "hidden"
        );

        userName.textContent =
            "";

    }

    else {

        login.classList.add(
            "hidden"
        );

        logout.classList.remove(
            "hidden"
        );


        const metadata =
            currentUser
                .user_metadata || {};


        userName.textContent =
            metadata.full_name ||
            metadata.name ||
            metadata.preferred_username ||
            "Pilot";

    }


    updateAdminUI();

}


function updateAdminUI() {

    const panel =
        document.getElementById(
            "adminPanel"
        );


    if (
        currentUser &&
        ADMIN_DISCORD_ID &&
        currentUser.id ===
        ADMIN_DISCORD_ID
    ) {

        panel.classList.remove(
            "hidden"
        );

        loadAdminFlights();

    }

    else {

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
                    ascending:
                        true
                }
            );


    if (error) {

        showMessage(
            "Could not load flights: " +
            error.message
        );

        return;

    }


    const now =
        Date.now();


    const visibleFlights =
        (data || []).filter(
            flight => {

                const scheduled =
                    new Date(
                        flight
                            .scheduled_departure
                    ).getTime();


                return (
                    now -
                    scheduled
                    <
                    24 *
                    60 *
                    60 *
                    1000
                );

            }
        );


    renderFlights(
        visibleFlights
    );

}


function statusClass(
    status
) {

    if (
        status ===
        "claimed"
    )
        return "claimed";


    if (
        status ===
        "in_progress"
    )
        return "progress";


    if (
        status ===
        "completed"
    )
        return "completed";


    return "available";

}


function statusText(
    status
) {

    if (
        status ===
        "claimed"
    )
        return "CLAIMED";


    if (
        status ===
        "in_progress"
    )
        return "IN PROGRESS";


    if (
        status ===
        "completed"
    )
        return "COMPLETED";


    return "AVAILABLE";

}


/* ============================= */
/* FLIGHT BOARD */
/* ============================= */

function renderFlights(
    flights
) {

    const board =
        document.getElementById(
            "flightBoard"
        );


    board.innerHTML =
        "";


    document.getElementById(
        "flightCount"
    ).textContent =
        `${flights.length} flights`;


    if (!flights.length) {

        board.innerHTML =
            "<p>No flights available.</p>";

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


            let actions =
                "";


            /*
                AVAILABLE
            */

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

                }

                else {

                    actions = `

                    <button
                        class="light"
                        onclick="loginWithDiscord()">

                        🔒 LOGIN WITH DISCORD TO CLAIM

                    </button>

                    `;

                }

            }


            /*
                CLAIMED
            */

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

                }

                else {

                    actions =
                        "<span>Pilot has claimed this flight.</span>";

                }

            }


            /*
                IN PROGRESS

                Pushback, Takeoff and Landing
                are OPTIONAL.
            */

            else if (
                flight.status ===
                "in_progress"
            ) {

                if (mine) {

                    actions = `

                    <button
                        class="light"
                        onclick="recordEvent('${flight.id}','pushback')">

                        PUSHBACK

                    </button>


                    <button
                        class="light"
                        onclick="recordEvent('${flight.id}','takeoff')">

                        TAKEOFF

                    </button>


                    <button
                        class="light"
                        onclick="recordEvent('${flight.id}','landing')">

                        LANDING

                    </button>


                    <button
                        class="secondary"
                        onclick="completeFlight('${flight.id}')">

                        COMPLETE FLIGHT

                    </button>

                    `;

                }

            }


            /*
                COMPLETED
            */

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


                    <div class="status ${statusClass(
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
                            Delay
                        </strong>

                        <span class="delay">

                            ${delayText(
                                flight.scheduled_departure
                            )}

                        </span>

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


                    <div class="info">

                        <strong>
                            Recurrence
                        </strong>

                        ${escapeHTML(
                            flight.recurrence ||
                            "once"
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
                            `▶️ Started:
                            ${formatDate(
                                flight.started_at
                            )}<br>`
                            :
                            ""
                        }


                        ${
                            flight.pushback_at
                            ?
                            `↪ Pushback:
                            ${formatDate(
                                flight.pushback_at
                            )}<br>`
                            :
                            ""
                        }


                        ${
                            flight.takeoff_at
                            ?
                            `🛫 Takeoff:
                            ${formatDate(
                                flight.takeoff_at
                            )}<br>`
                            :
                            ""
                        }


                        ${
                            flight.landing_at
                            ?
                            `🛬 Landing:
                            ${formatDate(
                                flight.landing_at
                            )}<br>`
                            :
                            ""
                        }


                        ${
                            flight.completed_at
                            ?
                            `🅿️ Completed:
                            ${formatDate(
                                flight.completed_at
                            )}`
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

async function claimFlight(
    id
) {

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
                    new Date()
                        .toISOString()

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
/* START */
/* ============================= */

async function startFlight(
    id
) {

    if (!currentUser)
        return;


    const {
        error
    } =
        await supabaseClient
            .from("flights")
            .update({

                status:
                    "in_progress",

                started_at:
                    new Date()
                        .toISOString()

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

    if (!currentUser)
        return;


    const fields = {

        pushback:
            "pushback_at",

        takeoff:
            "takeoff_at",

        landing:
            "landing_at"

    };


    const field =
        fields[event];


    if (!field)
        return;


    const update = {};


    update[field] =
        new Date()
            .toISOString();


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
/* COMPLETE */
/* ============================= */

async function completeFlight(
    id
) {

    if (!currentUser)
        return;


    const {
        error
    } =
        await supabaseClient
            .from("flights")
            .update({

                status:
                    "completed",

                completed_at:
                    new Date()
                        .toISOString()

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
/* ADMIN */
/* ============================= */

async function createFlight() {

    if (
        !currentUser ||
        !ADMIN_DISCORD_ID ||
        currentUser.id !==
        ADMIN_DISCORD_ID
    ) {

        showMessage(
            "Admin access required."
        );

        return;

    }


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
                document.getElementById(
                    "scheduled"
                ).value
            ).toISOString(),

        aircraft_model:
            document.getElementById(
                "aircraft"
            ).value.trim
