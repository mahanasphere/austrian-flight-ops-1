
/* =========================================================
   AUSTRIAN AIRLINES FLIGHT OPERATIONS – ACADEMY V1.3.0
   Application submission, tracking and admin reviews
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

    let busy = false;
    let applications = [];
    let reviewApplications = [];
    let lastUser = null;
    let refreshVersion = 0;

    const translate = (key, values = {}) => {
        if (typeof window.AFO_t === "function") {
            return window.AFO_t(key, values);
        }

        return key;
    };

    const translated = (key, values = {}) =>
        escapeHtml(translate(key, values));

    /* =========================================
       DATE FORMAT
    ========================================= */

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

    /* =========================================
       NOTIFICATIONS
    ========================================= */

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

    /* =========================================
       ADMIN UI CHECK
       Server-side authorization remains
       authoritative.
    ========================================= */

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

    /* =========================================
       TRANSLATED LABELS
    ========================================= */

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

    /* =========================================
       FORM AVAILABILITY
    ========================================= */

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

    /* =========================================
       MY APPLICATIONS
    ========================================= */

    function renderMyApplications(user = lastUser) {
        const board = el("academyMyApplications");

        if (!board) return;

        if (!user) {
            board.innerHTML = `
                <div class="empty-state compact">
                    ${translated("academy.loginToView")}
                </div>
            `;

            return;
        }

        if (!applications.length) {
            board.innerHTML = `
                <div class="empty-state compact">
                    ${translated("academy.noApplications")}
                </div>
            `;

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

            const statusStyle =
                state === "approved"
                    ? "completed"
                    : state === "rejected"
                        ? "cancelled"
                        : "claimed";

            const review = item.review_note
                ? `
                    <div class="admin-note">
                        <strong>
                            ${translated("academy.reviewNote")}
                        </strong>

                        <p>${escapeHtml(item.review_note)}</p>
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

                        <span class="status ${statusStyle}">
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

    /* =========================================
       ADMIN APPLICATIONS
    ========================================= */

    function renderAdminApplications() {
        const board = el("academyAdminApplications");

        if (!board) return;

        const filter =
            el("academyAdminStatusFilter")?.value || "all";

        const rows = reviewApplications.filter(item =>
            filter === "all" ||
            item.status === filter
        );

        if (!rows.length) {
            board.innerHTML = `
                <div class="empty-state compact">
                    ${translated("admin.noApplications")}
                </div>
            `;

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

            const id = escapeHtml(item.application_id);

            const person =
                item.discord_username ||
                item.discord_id ||
                "Discord user";

            const statusStyle =
                state === "approved"
                    ? "completed"
                    : state === "rejected"
                        ? "cancelled"
                        : "claimed";

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

            const reviewControls =
                state === "pending"
                    ? `
                        <div class="field" style="margin-top:12px">
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
                <article
                    class="flight-card"
                    style="margin-bottom:15px"
                >

                    <div class="card-topline">
                        <div>
                            <span class="eyebrow">
                                ${translated("admin.applicant")}:
                                ${escapeHtml(person)}
                            </span>

                            <h3>
                                ${escapeHtml(
                                    displayCategory(item.application_type)
                                )}
                            </h3>
                        </div>

                        <span class="status ${statusStyle}">
                            ${escapeHtml(displayStatus(state))}
                        </span>
                    </div>

                    <p class="muted">
                        ${translated("academy.submittedAt")}:
                        ${escapeHtml(formatDate(item.created_at))}
                    </p>

                    <div
                        class="additional"
                        style="white-space:pre-wrap"
                    >${escapeHtml(item.motivation)}</div>

                    ${
                        item.experience
                            ? `
                                <div
                                    class="additional"
                                    style="white-space:pre-wrap"
                                >${escapeHtml(item.experience)}</div>
                            `
                            : ""
                    }

                    ${feedback}
                    ${reviewControls}

                </article>
            `;
        }).join("");
    }

    /* =========================================
       LOAD OWN APPLICATIONS
    ========================================= */

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

        if (version !== refreshVersion) {
            return;
        }

        if (error) {
            console.error(
                "Academy applications:",
                error
            );

            const board = el("academyMyApplications");

            if (board) {
                board.textContent =
                    translate("academy.submitFailed");
            }

            return;
        }

        applications = data || [];
        renderMyApplications(user);
    }

    /* =========================================
       LOAD ADMIN APPLICATIONS
    ========================================= */

    async function loadAdminApplications(user, version) {
        if (!adminIdentity(user)) {
            reviewApplications = [];
            return;
        }

        const { data, error } = await supabaseClient.rpc(
            "list_academy_applications_admin"
        );

        if (version !== refreshVersion) {
            return;
        }

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

    /* =========================================
       REFRESH ACADEMY
    ========================================= */

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
    }

    /* =========================================
       SUBMIT APPLICATION
    ========================================= */

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

            if (error) {
                throw error;
            }

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

    /* =========================================
       APPROVE / REJECT APPLICATION
    ========================================= */

    async function reviewApplication(event) {
        const button = event.target.closest(
            "button[data-review-id][data-decision]"
        );

        if (!button || busy) {
            return;
        }

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

        if (note.length > 1000) {
            return;
        }

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

            if (error) {
                throw error;
            }

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

    /* =========================================
       INITIALIZATION
    ========================================= */

    document.addEventListener(
        "DOMContentLoaded",
        () => {

            const form =
                el("academyApplicationForm");

            form?.addEventListener(
                "submit",
                submitApplication
            );

            el("academyAdminApplications")?.addEventListener(
                "click",
                reviewApplication
            );

            el("academyAdminStatusFilter")?.addEventListener(
                "change",
                renderAdminApplications
            );

            document.addEventListener(
                "afo-language-change",
                () => {

                    updateSubmitState(lastUser);
                    renderMyApplications();

                    if (adminIdentity(lastUser)) {
                        renderAdminApplications();
                    }
                }
            );

            // Refresh after login/logout.
            // Database requests run outside the auth callback.

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

    // Available for future Academy features.

    window.AFO_ACADEMY = {
        refresh: refreshAcademy
    };

})();
