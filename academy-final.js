
/* Austrian Academy – Final Qualifications Module */

(() => {
  "use strict";

  const $ = id => document.getElementById(id);
  const tr = (en, de, fr) => ({
    de, fr
  }[document.documentElement.lang] || en);

  const esc = value => String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

  const names = {
    atc24_pilot: "ATC24 Pilot",
    event_pilot: "Event Flight Pilot",
    atc: "ATC"
  };

  let applications = [];
  let trainings = [];
  let qualifications = [];
  let adminQualifications = [];
  let admin = false;
  let busy = false;
  let generation = 0;

  const option = (value, label) =>
    `<option value="${esc(value)}">${esc(label)}</option>`;

  function message(value, error = false) {
    const box = $("message");
    if (!box) return;
    box.textContent = value;
    box.className = `message ${error ? "error" : "success"}`;
    box.classList.remove("hidden");
  }

  function setup() {
    if ($("academyQualifications")) return;

    const section = document.createElement("section");
    section.id = "academyQualifications";
    section.className = "section";

    $("academy")?.appendChild(section);

    const panel = document.createElement("div");
    panel.id = "academyExamManagement";
    panel.style.cssText =
      "margin-top:28px;padding:22px;border:1px solid " +
      "var(--line);border-radius:18px";

    $("adminTrainings")?.appendChild(panel);
  }

  function renderOwn() {
    const box = $("academyQualifications");
    if (!box) return;

    const active = qualifications.filter(q => q.active);

    box.innerHTML = `
      <h3>${tr(
        "🎓 My Qualifications",
        "🎓 Meine Qualifikationen",
        "🎓 Mes qualifications"
      )}</h3>
      ${
        active.length
          ? active.map(q => `
            <article class="flight-card"
              style="margin:12px 0;padding:18px">
              <strong>${esc(names[q.application_type])}</strong>
              <span class="status completed">
                ${tr("Qualified", "Qualifiziert", "Qualifié")}
              </span>
            </article>
          `).join("")
          : `<p class="muted">${tr(
              "No active qualifications yet.",
              "Noch keine aktiven Qualifikationen.",
              "Aucune qualification active."
            )}</p>`
      }
    `;
  }

  function renderAdmin() {
    const box = $("academyExamManagement");
    if (!box) return;

    box.hidden = !admin;
    if (!admin) return;

    const candidates = applications
      .filter(a => a.status === "approved");

    const completed = trainings
      .filter(t => t.status === "completed");

    const currentCandidate =
      $("examApplication")?.value || "";

    const currentTraining =
      $("examTraining")?.value || "";

    box.innerHTML = `
      <h3>${tr(
        "🎓 Academy Exams & Qualifications",
        "🎓 Academy-Prüfungen & Qualifikationen",
        "🎓 Examens et qualifications"
      )}</h3>

      <p class="muted">${tr(
        "The applicant must have attended a completed training.",
        "Der Bewerber muss an einem abgeschlossenen Training teilgenommen haben.",
        "Le candidat doit avoir suivi une formation terminée."
      )}</p>

      <form id="academyExamForm"
        class="admin-form" style="margin-top:16px">

        <div class="field full">
          <label for="examApplication">${tr(
            "Approved applicant",
            "Angenommener Bewerber",
            "Candidat accepté"
          )}</label>

          <select id="examApplication" required>
            ${option("", tr(
              "Select applicant",
              "Bewerber auswählen",
              "Choisir un candidat"
            ))}
            ${candidates.map(a => option(
              a.application_id,
              `${a.discord_username ||
                 a.discord_id ||
                 a.applicant_id} – ${names[a.application_type]}`
            )).join("")}
          </select>
        </div>

        <div class="field full">
          <label for="examTraining">${tr(
            "Completed training",
            "Abgeschlossenes Training",
            "Formation terminée"
          )}</label>

          <select id="examTraining" required>
            ${option("", tr(
              "Select training",
              "Training auswählen",
              "Choisir la formation"
            ))}
            ${completed.map(t => option(
              t.training_id,
              `${t.title} – ${names[t.application_type]}`
            )).join("")}
          </select>
        </div>

        <div class="field full">
          <label for="examResult">${tr(
            "Exam result",
            "Prüfungsergebnis",
            "Résultat de l'examen"
          )}</label>
          <select id="examResult">
            <option value="pass">${tr(
              "Passed", "Bestanden", "Réussi"
            )}</option>
            <option value="fail">${tr(
              "Failed", "Nicht bestanden", "Échoué"
            )}</option>
          </select>
        </div>

        <div class="field full">
          <label for="examNotes">${tr(
            "Examiner's notes",
            "Anmerkungen des Prüfers",
            "Notes de l'examinateur"
          )}</label>
          <textarea id="examNotes" maxlength="1000"></textarea>
        </div>

        <div class="full">
          <button type="submit" class="btn btn-primary">
            ${tr(
              "SAVE EXAM RESULT",
              "PRÜFUNGSERGEBNIS SPEICHERN",
              "ENREGISTRER LE RÉSULTAT"
            )}
          </button>
        </div>
      </form>

      <h3 style="margin-top:26px">${tr(
        "Awarded Qualifications",
        "Erteilte Qualifikationen",
        "Qualifications accordées"
      )}</h3>

      ${
        adminQualifications.length
          ? adminQualifications.map(q => `
            <article class="flight-card"
              style="margin:12px 0;padding:18px">
              <strong>
                ${esc(q.discord_username || q.user_id)}
              </strong>
              <p>${esc(names[q.application_type])}</p>
              <span class="status ${
                q.active ? "completed" : "cancelled"
              }">
                ${q.active
                  ? tr("Active", "Aktiv", "Active")
                  : tr("Revoked", "Entzogen", "Retirée")}
              </span>
              ${q.active ? `
                <div class="actions" style="margin-top:14px">
                  <button type="button"
                    class="btn btn-danger"
                    data-revoke-user="${esc(q.user_id)}"
                    data-revoke-category="${esc(q.application_type)}">
                    ${tr(
                      "REVOKE QUALIFICATION",
                      "QUALIFIKATION ENTZIEHEN",
                      "RETIRER LA QUALIFICATION"
                    )}
                  </button>
                </div>` : ""}
            </article>
          `).join("")
          : `<p class="muted">${tr(
            "No qualification records.",
            "Keine Qualifikationen vorhanden.",
            "Aucune qualification."
          )}</p>`
      }
    `;

    if (currentCandidate) {
      $("examApplication").value = currentCandidate;
    }
    if (currentTraining) {
      $("examTraining").value = currentTraining;
    }
  }

  async function refresh() {
    const version = ++generation;

    const { data: session } =
      await supabaseClient.auth.getSession();

    const user = session?.session?.user;

    if (!user) {
      applications = [];
      trainings = [];
      qualifications = [];
      adminQualifications = [];
      admin = false;
      if (version === generation) {
        renderOwn();
        renderAdmin();
      }
      return;
    }

    const [own, app, training, qual] =
      await Promise.all([
        supabaseClient.rpc(
          "list_my_academy_qualifications"
        ),
        supabaseClient.rpc(
          "list_academy_applications_admin"
        ),
        supabaseClient.rpc(
          "list_academy_trainings"
        ),
        supabaseClient.rpc(
          "list_academy_qualifications_admin"
        )
      ]);

    if (version !== generation) return;

    if (own.error) console.error(own.error);
    if (training.error) console.error(training.error);

    qualifications = own.data || [];
    trainings = training.data || [];

    admin = !app.error && !qual.error;
    applications = admin ? (app.data || []) : [];
    adminQualifications = admin ? (qual.data || []) : [];

    renderOwn();
    renderAdmin();
  }

  async function submitExam(event) {
    event.preventDefault();

    if (!admin || busy) return;

    const applicationId = $("examApplication")?.value;
    const trainingId = $("examTraining")?.value;
    const passed = $("examResult")?.value === "pass";
    const notes = $("examNotes")?.value || "";

    if (!applicationId || !trainingId) return;

    busy = true;

    try {
      const { data, error } = await supabaseClient.rpc(
        "record_academy_exam_admin",
        {
          p_application_id: applicationId,
          p_training_id: trainingId,
          p_passed: passed,
          p_notes: notes.trim() || null
        }
      );

      if (error) throw error;
      if (!data?.success) throw Error("Exam not saved");

      message(tr(
        "Exam result saved.",
        "Prüfungsergebnis gespeichert.",
        "Résultat enregistré."
      ));

      await refresh();
    } catch (error) {
      message(error.message, true);
    } finally {
      busy = false;
    }
  }

  async function revokeQualification(button) {
    if (!admin || busy) return;

    if (!confirm(tr(
      "Revoke this qualification?",
      "Diese Qualifikation entziehen?",
      "Retirer cette qualification ?"
    ))) return;

    busy = true;

    try {
      const { error } = await supabaseClient.rpc(
        "revoke_academy_qualification_admin",
        {
          p_user_id: button.dataset.revokeUser,
          p_application_type:
            button.dataset.revokeCategory
        }
      );

      if (error) throw error;

      message(tr(
        "Qualification revoked.",
        "Qualifikation entzogen.",
        "Qualification retirée."
      ));

      await refresh();
    } catch (error) {
      message(error.message, true);
    } finally {
      busy = false;
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    setup();

    $("academyExamManagement")?.addEventListener(
      "submit", submitExam
    );

    $("academyExamManagement")?.addEventListener(
      "click", event => {
        const button = event.target.closest(
          "button[data-revoke-user]"
        );
        if (button) {
          revokeQualification(button);
        }
      }
    );

    document.addEventListener(
      "afo-language-change", renderOwn
    );

    supabaseClient.auth.onAuthStateChange(() => {
      setTimeout(() => refresh().catch(console.error), 0);
    });

    document.querySelectorAll(
      '[data-admin-target="adminTrainings"],' +
      '[data-nav="academy"]'
    ).forEach(button => {
      button.addEventListener(
        "click", () => refresh().catch(console.error)
      );
    });

    refresh().catch(console.error);
  });

  window.AFO_FINAL = { refresh };
})();
