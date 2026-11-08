
/* =========================================================
   AUSTRIAN AIRLINES FLIGHT OPERATIONS – ACADEMY V1.3.0

   Applications, Trainings and Instructors
   Requires: app.js, translations.js, Academy HTML
   ========================================================= */

(() => {
    "use strict";

    const el = id => document.getElementById(id);

    const escapeHtml = value => String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

    const TYPE_KEYS = {
        atc24_pilot: "academy.categoryAtc24",
        event_pilot: "academy.categoryEvent",
        atc: "academy.categoryAtc"
    };

    const STATUS_KEYS = {
        pending: "academy.applicationPending",
        approved: "academy.applicationApproved",
        rejected: "academy.applicationRejected"
    };

    const TRAINING_STATES = [
        "scheduled",
        "completed",
        "cancelled"
    ];

    const PARTICIPANT_STATES = [
        "registered",
        "cancelled",
        "attended",
        "no_show"
    ];

    let busy = false;
    let applications = [];
    let reviewApplications = [];
    let lastUser = null;
    let refreshVersion = 0;

    let trainings = [];
    let instructorRecords = [];
    let assignedTrainings = [];
    let myInstructor = null;

    let participantRows = [];
    let participantContext = null;

    /* =====================================================
       TRANSLATION HELPERS
       ===================================================== */

    function translate(key, values = {}) {
        if (typeof window.AFO_t === "function") {
            return window.AFO_t(key, values);
        }

        return key;
    }

    function translated(key, values = {}) {
        return escapeHtml(translate(key, values));
    }

    function formatDate(value) {
        if (!value) return "—";

        const date = new Date(value);

        if (Number.isNaN(date.getTime())) {
            return "—";
        }

        const locale = {
            de: "de-AT",
            fr: "fr-FR",
            en: "en-GB"
        }[document.documentElement.lang] || "en-GB";

        return new Intl.DateTimeFormat(locale, {
            timeZone: "Europe/Vienna",
            dateStyle: "medium",
            timeStyle: "short"
        }).format(date);
    }

    /* =====================================================
       GLOBAL MESSAGES
       ===================================================== */

    function showMessage(key, type = "info", details = "") {
        const message = el("message");

        if (!message) return;

        message.textContent =
            translate(key) +
            (details ? `: ${details}` : "");

        message.className = `message ${type}`;
        message.classList.remove("hidden");

        clearTimeout(showMessage.timeout);

        showMessage.timeout = setTimeout(() => {
            message.classList.add("hidden");
        }, 6500);
    }

    /* =====================================================
       IDENTITIES
       Database functions independently verify permissions.
       ===================================================== */

    function adminIdentity(user) {
        if (!user) return false;

        const discord = user.identities?.find(
            identity => identity.provider === "discord"
        );

        const id = String(
            discord?.identity_data?.provider_id ||
            discord?.identity_data?.sub ||
            user.user_metadata?.provider_id ||
            ""
        );

        return id === "1214124494340493312";
    }

    function displayStatus(status) {
        return translate(
            STATUS_KEYS[status] ||
            STATUS_KEYS.pending
        );
    }

    function displayCategory(type) {
        return translate(
            TYPE_KEYS[type] ||
            TYPE_KEYS.atc24_pilot
        );
    }

    function trainingId(value) {
        const id = String(value ?? "");

        return /^\d+$/.test(id) ? id : null;
    }

    function trainingLabel(type) {
        return translated(
            TYPE_KEYS[type] ||
            "academy.categoryAtc24"
        );
    }

    function trainingState(status) {
        return TRAINING_STATES.includes(status)
            ? status
            : "scheduled";
    }

    function trainingStatusLabel(status) {
        return translated(
            `training.${trainingState(status)}`
        );
    }

    function emptyState(key) {
        return `
            <div class="empty-state compact">
                ${translated(key)}
            </div>
        `;
    }

    function isFuture(item) {
        const start = new Date(
            item.starts_at
        ).getTime();

        return Number.isFinite(start) &&
            start > Date.now();
    }

    function trainingBadge(status) {
        const variants = {
            scheduled: "available",
            completed: "completed",
            cancelled: "cancelled"
        };

        return `
            <span class="status ${variants[status] || "available"}">
                ${trainingStatusLabel(status)}
            </span>
        `;
    }

    /* =====================================================
       APPLICATION FORM STATE
       ===================================================== */

    function updateSubmitState(user) {
        lastUser = user || null;

        const button = el("academySubmitButton");
        const note = el("academyLoginNote");
        const help = el("academySubmitHelp");

        if (button) {
            button.disabled = busy || !lastUser;

            button.textContent = translate(
                busy
                    ? "academy.submitting"
                    : "academy.submit"
            );
        }

        note?.classList.toggle(
            "hidden",
            !!lastUser
        );

        help?.classList.add("hidden");
    }

    function updateTrainingControls() {
        const permitted = adminIdentity(lastUser);

        [
            "academyCreateTrainingButton",
            "academySaveInstructorButton"
        ].forEach(id => {
            const button = el(id);

            if (button) {
                button.disabled = busy || !permitted;
            }
        });

        [
            "academyTrainingForm",
            "academyInstructorForm"
        ].forEach(id => {
            el(id)
                ?.querySelector(".form-help")
                ?.classList.add("hidden");
        });
    }

    /* =====================================================
       MY APPLICATIONS
       ===================================================== */

    function renderMyApplications(user = lastUser) {
        const board = el("academyMyApplications");

        if (!board) return;

        if (!user) {
            board.innerHTML = emptyState(
                "academy.loginToView"
            );

            return;
        }

        if (!applications.length) {
            board.innerHTML = emptyState(
                "academy.noApplications"
            );

            return;
        }

        board.innerHTML = applications.map(item => {
            const state = [
                "pending",
                "approved",
                "rejected"
            ].includes(item.status)
                ? item.status
                : "pending";

            const variant = {
                pending: "claimed",
                approved: "completed",
                rejected: "cancelled"
            }[state];

            const review = item.review_note
                ? `
                    <div class="admin-note">
                        <strong>
                            ${translated("academy.reviewNote")}
                        </strong>

                        <p>
                            ${escapeHtml(item.review_note)}
                        </p>
                    </div>
                `
                : "";

            const reviewed = item.reviewed_at
                ? `
                    <p class="muted">
                        ${translated("academy.reviewedAt")}:
                        ${escapeHtml(formatDate(item.reviewed_at))}
                    </p>
                `
                : "";

            return `
                <article
                    class="flight-card"
                    style="margin-bottom:14px"
                >
                    <div class="card-topline">
                        <h3>
                            ${escapeHtml(
                                displayCategory(item.application_type)
                            )}
                        </h3>

                        <span class="status ${variant}">
                            ${escapeHtml(displayStatus(state))}
                        </span>
                    </div>

                    <p class="muted">
                        ${translated("academy.submittedAt")}:
                        ${escapeHtml(formatDate(item.created_at))}
                    </p>

                    ${reviewed}
                    ${review}
                </article>
            `;
        }).join("");
    }

    /* =====================================================
       ADMIN APPLICATIONS
       ===================================================== */

    function renderAdminApplications() {
        const board = el("academyAdminApplications");

        if (!board) return;

        const filter =
            el("academyAdminStatusFilter")?.value ||
            "all";

        const rows = reviewApplications.filter(
            item =>
                filter === "all" ||
                item.status === filter
        );

        if (!rows.length) {
            board.innerHTML = emptyState(
                "admin.noApplications"
            );

            return;
        }

        board.innerHTML = rows.map(item => {
            const state = [
                "pending",
                "approved",
                "rejected"
            ].includes(item.status)
                ? item.status
                : "pending";

            const id = escapeHtml(
                item.application_id
            );

            const person =
                item.discord_username ||
                item.discord_id ||
                "Discord user";

            const variant = {
                pending: "claimed",
                approved: "completed",
                rejected: "cancelled"
            }[state];

            const feedback = item.review_note
                ? `
                    <div class="admin-note">
                        <strong>
                            ${translated("academy.reviewNote")}
                        </strong>

                        <p>
                            ${escapeHtml(item.review_note)}
                        </p>
                    </div>
                `
                : "";

            const controls = state === "pending"
                ? `
                    <div class="field"
                        style="margin-top:12px">

                        <label for="review-note-${id}">
                            ${translated("admin.reviewNote")}
                        </label>

                        <textarea
                            id="review-note-${id}"
                            class="settings-select"
                            maxlength="1000"
                            rows="3"
                        ></textarea>
                    </div>

                    <div class="actions">
                        <button
                            type="button"
                            class="btn btn-primary"
                            data-review-id="${id}"
                            data-decision="approved"
                        >
                            ${translated("admin.approve")}
                        </button>

                        <button
                            type="button"
                            class="btn btn-danger"
                            data-review-id="${id}"
                            data-decision="rejected"
                        >
                            ${translated("admin.reject")}
                        </button>
                    </div>
                `
                : "";

            return `
                <article class="flight-card"
                    style="margin-bottom:15px">

                    <div class="card-topline">
                        <div>
                            <span class="eyebrow">
                                ${translated("admin.applicant")}:
                                ${escapeHtml(person)}
                            </span>

                            <h3>
                                ${escapeHtml(
                                    displayCategory(
                                        item.application_type
                                    )
                                )}
                            </h3>
                        </div>

                        <span class="status ${variant}">
                            ${escapeHtml(displayStatus(state))}
                        </span>
                    </div>

                    <p class="muted">
                        ${translated("academy.submittedAt")}:
                        ${escapeHtml(formatDate(item.created_at))}
                    </p>

                    <div class="additional"
                        style="white-space:pre-wrap"
                    >${escapeHtml(item.motivation)}</div>

                    ${
                        item.experience
                            ? `
                                <div class="additional"
                                    style="white-space:pre-wrap"
                                >${escapeHtml(item.experience)}</div>
                            `
                            : ""
                    }

                    ${feedback}
                    ${controls}
                </article>
            `;
        }).join("");
    }

    /* =====================================================
       LOAD APPLICATIONS
       ===================================================== */

    async function loadMyApplications(user, version) {
        if (!user) {
            applications = [];
            renderMyApplications(null);
            return;
        }

        const { data, error } = await supabaseClient
            .from("academy_applications")
            .select(
                "id,application_type,motivation,experience," +
                "status,review_note,created_at,reviewed_at"
            )
            .eq("user_id", user.id)
            .order("created_at", {
                ascending: false
            });

        if (version !== refreshVersion) return;

        if (error) {
            console.error(
                "Academy applications:",
                error
            );

            if (el("academyMyApplications")) {
                el("academyMyApplications").textContent =
                    translate("academy.submitFailed");
            }

            return;
        }

        applications = data || [];
        renderMyApplications(user);
    }

    async function loadAdminApplications(user, version) {
        if (!adminIdentity(user)) {
            reviewApplications = [];
            return;
        }

        const { data, error } =
            await supabaseClient.rpc(
                "list_academy_applications_admin"
            );

        if (version !== refreshVersion) return;

        if (error) {
            console.error(
                "Academy admin applications:",
                error
            );

            const board = el("academyAdminApplications");

            if (board) {
                board.textContent =
                    translate("admin.reviewFailed");
            }

            return;
        }

        reviewApplications =
            Array.isArray(data) ? data : [];

        renderAdminApplications();
    }

    /* =====================================================
       APPLICATION ACTIONS
       ===================================================== */

    async function submitApplication(event) {
        event.preventDefault();

        if (busy) return;

        const user = lastUser;

        if (!user) {
            showMessage(
                "academy.loginRequired",
                "error"
            );

            return;
        }

        const category =
            el("academyApplicationType")?.value || "";

        const motivation =
            el("academyMotivation")?.value.trim() || "";

        const experience =
            el("academyExperience")?.value.trim() || "";

        if (
            !Object.hasOwn(TYPE_KEYS, category) ||
            motivation.length < 10 ||
            motivation.length > 2000 ||
            experience.length > 1000
        ) {
            el("academyApplicationForm")?.reportValidity();
            return;
        }

        busy = true;
        updateSubmitState(user);

        try {
            const { data, error } =
                await supabaseClient.rpc(
                    "submit_academy_application",
                    {
                        p_application_type: category,
                        p_motivation: motivation,
                        p_experience: experience || null
                    }
                );

            if (error) throw error;

            if (!data?.success) {
                throw new Error(
                    "Application was not accepted."
                );
            }

            el("academyApplicationForm")?.reset();

            showMessage(
                "academy.submitted",
                "success"
            );

            await refreshAcademy();

        } catch (error) {
            console.error(
                "Academy submission:",
                error
            );

            showMessage(
                "academy.submitFailed",
                "error",
                error.message
            );

        } finally {
            busy = false;
            updateSubmitState(lastUser);
        }
    }

    async function reviewApplication(event) {
        const button = event.target.closest(
            "button[data-review-id][data-decision]"
        );

        if (!button || busy) return;

        const id = button.dataset.reviewId;
        const decision = button.dataset.decision;

        if (
            !/^\d+$/.test(id) ||
            !["approved", "rejected"].includes(decision)
        ) {
            return;
        }

        const note =
            el(`review-note-${id}`)?.value.trim() || "";

        if (note.length > 1000) return;

        busy = true;
        button.disabled = true;

        try {
            const { data, error } =
                await supabaseClient.rpc(
                    "review_academy_application_admin",
                    {
                        p_application_id: id,
                        p_decision: decision,
                        p_review_note: note || null
                    }
                );

            if (error) throw error;

            if (!data?.success) {
                throw new Error(
                    "Review was not accepted."
                );
            }

            showMessage(
                "admin.reviewSuccess",
                "success"
            );

            await refreshAcademy();

        } catch (error) {
            console.error(
                "Academy review:",
                error
            );

            showMessage(
                "admin.reviewFailed",
                "error",
                error.message
            );

        } finally {
            busy = false;
            button.disabled = false;
        }
    }

    /* =====================================================
       TRAINING SCHEDULE
       ===================================================== */

    function renderTrainingSchedule() {
        const board = el("academyTrainingBoard");

        if (!board) return;

        const approved = new Set(
            applications
                .filter(a => a.status === "approved")
                .map(a => a.application_type)
        );

        const visible = trainings.filter(item =>
            (
                item.status === "scheduled" &&
                isFuture(item)
            ) ||
            (
                lastUser &&
                item.my_registration_status &&
                item.my_registration_status !== "cancelled"
            )
        );

        if (!visible.length) {
            board.innerHTML = emptyState(
                "training.noSessions"
            );

            return;
        }

        board.innerHTML = visible.map(item => {
            const id = trainingId(
                item.training_id
            );

            if (!id) return "";

            const count = Number(
                item.booked_count
            ) || 0;

            const capacity = Number(
                item.capacity
            ) || 0;

            const mine = PARTICIPANT_STATES.includes(
                item.my_registration_status
            )
                ? item.my_registration_status
                : null;

            const available =
                item.status === "scheduled" &&
                isFuture(item);

            let controls = "";

            if (mine === "registered") {
                controls = `
                    <span class="status available">
                        ${translated("training.alreadyRegistered")}
                    </span>
                `;

                if (available) {
                    controls += `
                        <button
                            type="button"
                            class="btn btn-secondary"
                            data-training-action="cancel-registration"
                            data-training-id="${id}"
                        >
                            ${translated("training.cancelRegistration")}
                        </button>
                    `;
                }

            } else if (
                mine === "attended" ||
                mine === "no_show"
            ) {
                controls = `
                    <span class="status ${
                        mine === "attended"
                            ? "completed"
                            : "cancelled"
                    }">
                        ${translated(
                            mine === "attended"
                                ? "training.attended"
                                : "training.noShow"
                        )}
                    </span>
                `;

            } else if (available) {
                if (!lastUser) {
                    controls = `
                        <span class="action-note">
                            ${translated("training.loginRequired")}
                        </span>
                    `;

                } else if (!approved.has(item.application_type)) {
                    controls = `
                        <span class="action-note">
                            ${translated("training.requiresApproval")}
                        </span>
                    `;

                } else if (count >= capacity) {
                    controls = `
                        <span class="action-note">
                            ${translated("training.full")}
                        </span>
                    `;

                } else {
                    controls = `
                        <button
                            type="button"
                            class="btn btn-primary"
                            data-training-action="register"
                            data-training-id="${id}"
                            ${busy ? "disabled" : ""}
                        >
                            ${translated("training.register")}
                        </button>
                    `;
                }
            }

            return `
                <article class="flight-card">

                    <div class="card-topline">
                        <div>
                            <span class="eyebrow">
                                ${trainingLabel(item.application_type)}
                            </span>

                            <h3>
                                ${escapeHtml(item.title)}
                            </h3>
                        </div>

                        ${trainingBadge(item.status)}
                    </div>

                    ${
                        item.description
                            ? `
                                <p style="white-space:pre-wrap">
                                    ${escapeHtml(item.description)}
                                </p>
                            `
                            : ""
                    }

                    <div class="info-grid">

                        <div class="info-box">
                            <span>
                                ${translated("training.startsAt")}
                            </span>

                            <strong>
                                ${escapeHtml(formatDate(item.starts_at))}
                            </strong>
                        </div>

                        <div class="info-box">
                            <span>
                                ${translated("training.duration")}
                            </span>

                            <strong>
                                ${translated("training.minutes", {
                                    count: Number(item.duration_minutes) || 0
                                })}
                            </strong>
                        </div>

                        <div class="info-box">
                            <span>
                                ${translated("training.places")}
                            </span>

                            <strong>
                                ${translated("training.bookedCount", {
                                    booked: count,
                                    capacity
                                })}
                            </strong>
                        </div>

                        <div class="info-box">
                            <span>
                                ${translated("training.instructor")}
                            </span>

                            <strong>
                                ${
                                    item.instructor_name
                                        ? escapeHtml(item.instructor_name)
                                        : translated("training.noInstructor")
                                }
                            </strong>
                        </div>

                    </div>

                    <div class="actions">
                        ${controls}
                    </div>

                </article>
            `;
        }).join("");
    }

    /* =====================================================
       ADMIN TRAINING LIST
       ===================================================== */

    function renderAdminTrainings() {
        const board = el("academyAdminTrainingList");

        if (!board) return;

        if (!adminIdentity(lastUser)) {
            board.textContent = "";
            return;
        }

        if (!trainings.length) {
            board.innerHTML = emptyState(
                "training.noSessions"
            );

            return;
        }

        board.innerHTML = [...trainings]
            .sort(
                (a, b) =>
                    new Date(b.starts_at) -
                    new Date(a.starts_at)
            )
            .map(item => {
                const id = trainingId(
                    item.training_id
                );

                if (!id) return "";

                const future = isFuture(item);
                const scheduled =
                    item.status === "scheduled";

                return `
                    <article
                        class="flight-card"
                        style="margin-bottom:14px"
                    >
                        <div class="card-topline">
                            <div>
                                <span class="eyebrow">
                                    ${trainingLabel(item.application_type)}
                                </span>

                                <h3>
                                    ${escapeHtml(item.title)}
                                </h3>
                            </div>

                            ${trainingBadge(item.status)}
                        </div>

                        <p class="muted">
                            ${escapeHtml(formatDate(item.starts_at))}
                            ·
                            ${translated("training.bookedCount", {
                                booked: Number(item.booked_count) || 0,
                                capacity: Number(item.capacity) || 0
                            })}
                        </p>

                        <p class="muted">
                            ${translated("training.instructor")}:
                            ${
                                item.instructor_name
                                    ? escapeHtml(item.instructor_name)
                                    : translated("training.noInstructor")
                            }
                        </p>

                        ${
                            scheduled && future
                                ? `
                                    <div class="field"
                                        style="margin-top:12px">

                                        <label for="assign-${id}">
                                            ${translated("training.instructorDiscordLabel")}
                                        </label>

                                        <input
                                            id="assign-${id}"
                                            class="settings-select"
                                            type="text"
                                            inputmode="numeric"
                                            placeholder="${translated("training.instructorDiscordPlaceholder")}"
                                        >
                                    </div>

                                    <div class="actions">
                                        <button
                                            type="button"
                                            class="btn btn-secondary"
                                            data-training-action="assign"
                                            data-training-id="${id}"
                                        >
                                            ${translated("training.assignInstructor")}
                                        </button>
                                    </div>
                                `
                                : ""
                        }

                        <div class="actions">

                            <button
                                type="button"
                                class="btn btn-secondary"
                                data-training-action="participants"
                                data-target="admin"
                                data-training-id="${id}"
                            >
                                ${translated("training.viewParticipants")}
                            </button>

                            ${
                                scheduled
                                    ? `
                                        <button
                                            type="button"
                                            class="btn btn-danger"
                                            data-training-action="cancel-training"
                                            data-training-id="${id}"
                                        >
                                            ${translated("training.cancelTraining")}
                                        </button>
                                    `
                                    : ""
                            }

                            ${
                                scheduled && !future
                                    ? `
                                        <button
                                            type="button"
                                            class="btn btn-primary"
                                            data-training-action="complete-training"
                                            data-training-id="${id}"
                                        >
                                            ${translated("training.completeTraining")}
                                        </button>
                                    `
                                    : ""
                            }

                        </div>
                    </article>
                `;
            }).join("");
    }

    /* =====================================================
       ADMIN INSTRUCTOR LIST
       ===================================================== */

    function renderAdminInstructors() {
        const board = el("academyAdminInstructorList");

        if (!board) return;

        if (!adminIdentity(lastUser)) {
            board.textContent = "";
            return;
        }

        if (!instructorRecords.length) {
            board.innerHTML = emptyState(
                "training.noInstructors"
            );

            return;
        }

        board.innerHTML = instructorRecords.map(item => {
            const discordId = String(
                item.discord_id || ""
            );

            const allowedId =
                /^\d{10,25}$/.test(discordId);

            const specialties = (
                item.specialties || []
            ).map(trainingLabel).join(" · ");

            return `
                <div class="admin-row">

                    <div>
                        <strong>
                            ${escapeHtml(
                                item.discord_username ||
                                discordId ||
                                "Discord"
                            )}
                        </strong>

                        <small>
                            ${escapeHtml(discordId)}
                        </small>

                        <span>
                            ${specialties}
                        </span>

                        <span>
                            ${translated(
                                item.active
                                    ? "training.active"
                                    : "training.inactive"
                            )}
                        </span>
                    </div>

                    ${
                        allowedId
                            ? `
                                <button
                                    type="button"
                                    class="btn btn-secondary"
                                    data-edit-instructor="${escapeHtml(discordId)}"
                                    aria-label="${translated("training.saveInstructor")}"
                                >
                                    ✎
                                </button>
                            `
                            : ""
                    }
                </div>
            `;
        }).join("");
    }

    /* =====================================================
       INSTRUCTOR DASHBOARD
       ===================================================== */

    function renderAssignedTrainings() {
        const panel = el("academyInstructorPanel");
        const board = el("academyInstructorTrainingList");

        if (!panel || !board) return;

        const active =
            !!(lastUser && myInstructor?.active);

        panel.classList.toggle(
            "hidden",
            !active
        );

        if (!active) {
            board.textContent = "";

            if (el("academyInstructorParticipants")) {
                el("academyInstructorParticipants").textContent = "";
            }

            return;
        }

        if (!assignedTrainings.length) {
            board.innerHTML = emptyState(
                "training.noAssigned"
            );

            return;
        }

        board.innerHTML = assignedTrainings.map(item => {
            const id = trainingId(
                item.training_id
            );

            if (!id) return "";

            return `
                <div class="admin-row">

                    <div>
                        <strong>
                            ${escapeHtml(item.title)}
                        </strong>

                        <span>
                            ${trainingLabel(item.application_type)}
                            ·
                            ${escapeHtml(formatDate(item.starts_at))}
                        </span>

                        <small>
                            ${translated("training.bookedCount", {
                                booked: Number(item.booked_count) || 0,
                                capacity: Number(item.capacity) || 0
                            })}
                        </small>
                    </div>

                    <button
                        type="button"
                        class="btn btn-secondary"
                        data-training-action="participants"
                        data-target="instructor"
                        data-training-id="${id}"
                    >
                        ${translated("training.viewParticipants")}
                    </button>

                </div>
            `;
        }).join("");
    }

    /* =====================================================
       PARTICIPANTS
       ===================================================== */

    function renderParticipants() {
        const context = participantContext;

        if (!context) return;

        const board = el(
            context.target === "instructor"
                ? "academyInstructorParticipants"
                : "academyAdminTrainingParticipants"
        );

        if (!board) return;

        const training = trainings.find(
            item =>
                String(item.training_id) === context.id
        );

        const assigned = assignedTrainings.find(
            item =>
                String(item.training_id) === context.id
        );

        const startsAt =
            training?.starts_at ||
            assigned?.starts_at;

        const canMark =
            startsAt &&
            new Date(startsAt).getTime() <= Date.now() &&
            training?.status !== "cancelled" &&
            assigned?.training_status !== "cancelled";

        if (!participantRows.length) {
            board.innerHTML = emptyState(
                "training.noParticipants"
            );

            return;
        }

        board.innerHTML = `
            <h3>
                ${translated("training.participantsTitle")}
            </h3>
        ` + participantRows.map(item => {
            const id = trainingId(
                item.registration_id
            );

            if (!id) return "";

            const status =
                PARTICIPANT_STATES.includes(
                    item.registration_status
                )
                    ? item.registration_status
                    : "registered";

            const key = {
                registered: "training.registered",
                cancelled: "training.registrationCancelled",
                attended: "training.attended",
                no_show: "training.noShow"
            }[status];

            return `
                <div class="admin-row">

                    <div>
                        <strong>
                            ${escapeHtml(
                                item.discord_username ||
                                item.discord_id ||
                                "Discord"
                            )}
                        </strong>

                        <small>
                            ${escapeHtml(item.discord_id || "")}
                        </small>

                        <span>
                            ${translated(key)}
                            ·
                            ${escapeHtml(formatDate(item.registered_at))}
                        </span>
                    </div>

                    ${
                        canMark && status !== "cancelled"
                            ? `
                                <div class="admin-actions">

                                    <button
                                        type="button"
                                        class="btn btn-secondary"
                                        data-training-action="attendance"
                                        data-training-id="${context.id}"
                                        data-registration-id="${id}"
                                        data-attendance="attended"
                                    >
                                        ${translated("training.markAttended")}
                                    </button>

                                    <button
                                        type="button"
                                        class="btn btn-secondary"
                                        data-training-action="attendance"
                                        data-training-id="${context.id}"
                                        data-registration-id="${id}"
                                        data-attendance="no_show"
                                    >
                                        ${translated("training.markNoShow")}
                                    </button>

                                </div>
                            `
                            : ""
                    }

                </div>
            `;
        }).join("");
    }

    /* =====================================================
       LOAD TRAINING DATA
       ===================================================== */

    async function loadTrainingData(user, version) {
        const isAdmin = adminIdentity(user);

        const [
            list,
            ownRole,
            assigned,
            instructorList
        ] = await Promise.all([

            supabaseClient.rpc(
                "list_academy_trainings"
            ),

            user
                ? supabaseClient
                    .from("academy_instructors")
                    .select("user_id,specialties,active")
                    .eq("user_id", user.id)
                    .maybeSingle()
                : Promise.resolve({
                    data: null,
                    error: null
                }),

            user
                ? supabaseClient.rpc(
                    "list_my_assigned_academy_trainings"
                )
                : Promise.resolve({
                    data: [],
                    error: null
                }),

            isAdmin
                ? supabaseClient.rpc(
                    "list_academy_instructors_admin"
                )
                : Promise.resolve({
                    data: [],
                    error: null
                })

        ]);

        if (version !== refreshVersion) return;

        if (list.error) {
            console.error(
                "Training schedule:",
                list.error
            );

            trainings = [];

            if (el("academyTrainingBoard")) {
                el("academyTrainingBoard").textContent =
                    translate("training.loadFailed");
            }

            renderAdminTrainings();

        } else {
            trainings =
                Array.isArray(list.data)
                    ? list.data
                    : [];

            renderTrainingSchedule();
            renderAdminTrainings();
        }

        if (ownRole.error) {
            console.error(
                "Instructor role:",
                ownRole.error
            );
        }

        myInstructor = ownRole.data || null;

        if (assigned.error) {
            console.error(
                "Assigned trainings:",
                assigned.error
            );
        }

        assignedTrainings =
            Array.isArray(assigned.data)
                ? assigned.data
                : [];

        renderAssignedTrainings();

        if (instructorList.error) {
            console.error(
                "Instructor list:",
                instructorList.error
            );
        }

        instructorRecords =
            Array.isArray(instructorList.data)
                ? instructorList.data
                : [];

        renderAdminInstructors();
        updateTrainingControls();

        if (participantContext && user) {
            await loadParticipants(
                participantContext.id,
                participantContext.target
            );

        } else if (!user) {
            participantContext = null;
            participantRows = [];

            [
                "academyAdminTrainingParticipants",
                "academyInstructorParticipants"
            ].forEach(id => {
                if (el(id)) {
                    el(id).textContent = "";
                }
            });
        }
    }

    /* =====================================================
       LOAD PARTICIPANTS (AUTHORIZED RPC)
       ===================================================== */

    async function loadParticipants(id, target) {
        const request = { id, target };

        participantContext = request;

        const board = el(
            target === "instructor"
                ? "academyInstructorParticipants"
                : "academyAdminTrainingParticipants"
        );

        if (board) {
            board.textContent =
                translate("training.loading");
        }

        const { data, error } =
            await supabaseClient.rpc(
                "list_academy_training_participants",
                {
                    p_training_id: id
                }
            );

        if (participantContext !== request) {
            return;
        }

        if (error) {
            console.error(
                "Training participants:",
                error
            );

            if (board) {
                board.textContent =
                    translate("training.attendanceFailed") +
                    ": " +
                    error.message;
            }

            return;
        }

        participantRows =
            Array.isArray(data) ? data : [];

        renderParticipants();
    }

    /* =====================================================
       TRAINING MUTATIONS
       ===================================================== */

    async function mutateAcademy(
        successKey,
        failureKey,
        operation
    ) {
        if (busy) return false;

        busy = true;
        updateSubmitState(lastUser);
        updateTrainingControls();

        try {
            const { data, error } = await operation();

            if (error) throw error;

            if (data?.success === false) {
                throw new Error(
                    "Operation rejected."
                );
            }

            showMessage(
                successKey,
                "success"
            );

            await refreshAcademy();

            return true;

        } catch (error) {
            console.error(
                "Academy action:",
                error
            );

            showMessage(
                failureKey,
                "error",
                error.message
            );

            return false;

        } finally {
            busy = false;
            updateSubmitState(lastUser);
            updateTrainingControls();
        }
    }

    /* =====================================================
       CREATE TRAINING
       ===================================================== */

    async function createTraining(event) {
        event.preventDefault();

        if (!adminIdentity(lastUser) || busy) {
            return;
        }

        const form = el("academyTrainingForm");

        if (!form?.reportValidity()) {
            return;
        }

        const title =
            el("academyTrainingTitle").value.trim();

        const category =
            el("academyTrainingCategory").value;

        const startsAt = new Date(
            el("academyTrainingStart").value
        );

        const duration = Number(
            el("academyTrainingDuration").value
        );

        const capacity = Number(
            el("academyTrainingCapacity").value
        );

        const description =
            el("academyTrainingDescription").value.trim();

        const instructor =
            el("academyTrainingInstructor").value.trim();

        if (
            title.length < 5 ||
            title.length > 120 ||
            !Object.hasOwn(TYPE_KEYS, category) ||
            !Number.isFinite(startsAt.getTime()) ||
            startsAt.getTime() <= Date.now() + 300000 ||
            !Number.isInteger(duration) ||
            duration < 15 ||
            duration > 360 ||
            !Number.isInteger(capacity) ||
            capacity < 1 ||
            capacity > 100 ||
            description.length > 2000 ||
            (instructor && !/^\d{10,25}$/.test(instructor))
        ) {
            showMessage(
                "training.trainingCreateFailed",
                "error"
            );

            return;
        }

        const success = await mutateAcademy(
            "training.trainingCreated",
            "training.trainingCreateFailed",
            () => supabaseClient.rpc(
                "create_academy_training_admin",
                {
                    p_title: title,
                    p_application_type: category,
                    p_starts_at: startsAt.toISOString(),
                    p_duration_minutes: duration,
                    p_capacity: capacity,
                    p_description: description || null,
                    p_instructor_discord_id:
                        instructor || null
                }
            )
        );

        if (success) {
            form.reset();
        }
    }

    /* =====================================================
       SAVE INSTRUCTOR
       ===================================================== */

    async function saveInstructor(event) {
        event.preventDefault();

        if (!adminIdentity(lastUser) || busy) {
            return;
        }

        const form = el("academyInstructorForm");

        if (!form?.reportValidity()) {
            return;
        }

        const discord =
            el("academyInstructorDiscord").value.trim();

        const specialties = [
            ["academyInstructorAtc24", "atc24_pilot"],
            ["academyInstructorEvent", "event_pilot"],
            ["academyInstructorAtc", "atc"]
        ]
            .filter(([id]) => el(id).checked)
            .map(([, category]) => category);

        if (
            !/^\d{10,25}$/.test(discord) ||
            !specialties.length
        ) {
            showMessage(
                "training.instructorSaveFailed",
                "error"
            );

            return;
        }

        await mutateAcademy(
            "training.instructorSaved",
            "training.instructorSaveFailed",
            () => supabaseClient.rpc(
                "set_academy_instructor_admin",
                {
                    p_discord_id: discord,
                    p_specialties: specialties,
                    p_active:
                        el("academyInstructorActive").checked
                }
            )
        );
    }

    /* =====================================================
       BUTTON ACTIONS
       ===================================================== */

    async function handleTrainingClick(event) {
        const edit = event.target.closest(
            "button[data-edit-instructor]"
        );

        if (edit) {
            if (!adminIdentity(lastUser)) return;

            const instructor =
                instructorRecords.find(
                    item =>
                        item.discord_id ===
                        edit.dataset.editInstructor
                );

            if (!instructor) return;

            el("academyInstructorDiscord").value =
                instructor.discord_id;

            el("academyInstructorAtc24").checked =
                instructor.specialties?.includes(
                    "atc24_pilot"
                ) || false;

            el("academyInstructorEvent").checked =
                instructor.specialties?.includes(
                    "event_pilot"
                ) || false;

            el("academyInstructorAtc").checked =
                instructor.specialties?.includes(
                    "atc"
                ) || false;

            el("academyInstructorActive").checked =
                !!instructor.active;

            el("academyInstructorForm").scrollIntoView({
                behavior: "smooth",
                block: "center"
            });

            return;
        }

        const button = event.target.closest(
            "button[data-training-action][data-training-id]"
        );

        if (!button || busy) return;

        const id = trainingId(
            button.dataset.trainingId
        );

        if (!id) return;

        const action =
            button.dataset.trainingAction;

        /* View participants */

        if (action === "participants") {
            const target =
                button.dataset.target === "instructor"
                    ? "instructor"
                    : "admin";

            await loadParticipants(id, target);
            return;
        }

        /* Register for training */

        if (action === "register") {
            await mutateAcademy(
                "training.registerSuccess",
                "training.registerFailed",
                () => supabaseClient.rpc(
                    "register_academy_training",
                    {
                        p_training_id: id
                    }
                )
            );

            return;
        }

        /* Cancel registration */

        if (action === "cancel-registration") {
            if (!confirm(
                translate("training.confirmCancel")
            )) {
                return;
            }

            await mutateAcademy(
                "training.cancelSuccess",
                "training.cancelFailed",
                () => supabaseClient.rpc(
                    "cancel_academy_training_registration",
                    {
                        p_training_id: id
                    }
                )
            );

            return;
        }

        /* Assign instructor */

        if (
            action === "assign" &&
            adminIdentity(lastUser)
        ) {
            const discord =
                el(`assign-${id}`)?.value.trim() || "";

            if (
                discord &&
                !/^\d{10,25}$/.test(discord)
            ) {
                showMessage(
                    "training.assignmentFailed",
                    "error"
                );

                return;
            }

            await mutateAcademy(
                "training.assignmentSuccess",
                "training.assignmentFailed",
                () => supabaseClient.rpc(
                    "assign_academy_training_instructor_admin",
                    {
                        p_training_id: id,
                        p_instructor_discord_id:
                            discord || null
                    }
                )
            );

            return;
        }

        /* Cancel a training */

        if (
            action === "cancel-training" &&
            adminIdentity(lastUser)
        ) {
            if (!confirm(
                translate("training.confirmCancelTraining")
            )) {
                return;
            }

            await mutateAcademy(
                "training.statusUpdated",
                "training.statusUpdateFailed",
                () => supabaseClient.rpc(
                    "set_academy_training_status_admin",
                    {
                        p_training_id: id,
                        p_status: "cancelled"
                    }
                )
            );

            return;
        }

        /* Complete a training */

        if (
            action === "complete-training" &&
            adminIdentity(lastUser)
        ) {
            await mutateAcademy(
                "training.statusUpdated",
                "training.statusUpdateFailed",
                () => supabaseClient.rpc(
                    "set_academy_training_status_admin",
                    {
                        p_training_id: id,
                        p_status: "completed"
                    }
                )
            );

            return;
        }

        /* Record attendance */

        if (action === "attendance") {
            const registrationId = trainingId(
                button.dataset.registrationId
            );

            const status =
                button.dataset.attendance;

            if (
                !registrationId ||
                !["attended", "no_show"].includes(status)
            ) {
                return;
            }

            await mutateAcademy(
                "training.attendanceSaved",
                "training.attendanceFailed",
                () => supabaseClient.rpc(
                    "mark_academy_training_attendance",
                    {
                        p_training_id: id,
                        p_registration_id: registrationId,
                        p_attendance: status
                    }
                )
            );
        }
    }

    /* =====================================================
       REFRESH ALL ACADEMY DATA
       ===================================================== */

    async function refreshAcademy() {
        const version = ++refreshVersion;

        const { data, error } =
            await supabaseClient.auth.getSession();

        if (version !== refreshVersion) {
            return;
        }

        if (error) {
            console.error(
                "Academy session:",
                error
            );

            updateSubmitState(null);
            return;
        }

        const user =
            data.session?.user || null;

        updateSubmitState(user);

        await Promise.all([
            loadMyApplications(user, version),
            loadAdminApplications(user, version)
        ]);

        if (version === refreshVersion) {
            await loadTrainingData(user, version);
        }
    }

    /* =====================================================
       INITIALIZATION
       ===================================================== */

    document.addEventListener(
        "DOMContentLoaded",
        () => {

            el("academyApplicationForm")
                ?.addEventListener(
                    "submit",
                    submitApplication
                );

            el("academyAdminApplications")
                ?.addEventListener(
                    "click",
                    reviewApplication
                );

            el("academyAdminStatusFilter")
                ?.addEventListener(
                    "change",
                    renderAdminApplications
                );

            el("academyTrainingForm")
                ?.addEventListener(
                    "submit",
                    createTraining
                );

            el("academyInstructorForm")
                ?.addEventListener(
                    "submit",
                    saveInstructor
                );

            [
                "academyTrainingBoard",
                "academyAdminTrainingList",
                "academyAdminTrainingParticipants",
                "academyInstructorTrainingList",
                "academyInstructorParticipants",
                "academyAdminInstructorList"
            ].forEach(id => {
                el(id)?.addEventListener(
                    "click",
                    handleTrainingClick
                );
            });

            /* Language changes */

            document.addEventListener(
                "afo-language-change",
                () => {
                    updateSubmitState(lastUser);

                    renderMyApplications();

                    if (adminIdentity(lastUser)) {
                        renderAdminApplications();
                    }

                    renderTrainingSchedule();
                    renderAdminTrainings();
                    renderAdminInstructors();
                    renderAssignedTrainings();
                    renderParticipants();
                    updateTrainingControls();
                }
            );

            /* Authentication changes */

            supabaseClient.auth.onAuthStateChange(
                () => {
                    setTimeout(() => {
                        refreshAcademy().catch(
                            console.error
                        );
                    }, 0);
                }
            );

            refreshAcademy().catch(
                console.error
            );
        }
    );

    window.AFO_ACADEMY = {
        refresh: refreshAcademy
    };

})();
