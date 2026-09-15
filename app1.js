const SUPABASE_URL="https://qdtpwggllgnyzazmshyf.supabase.co";
const SUPABASE_KEY="sb_publishable_zgfXsfelbYVAGcvKk1wRhA_ok9n8jjl";

const supabaseClient=supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY,
    {
        auth:{
            persistSession:true,
            autoRefreshToken:true,
            detectSessionInUrl:true
        }
    }
);

const ADMIN_DISCORD_ID="1214124494340493312";

const STATUSES={
    member:{
        name:"Member",
        points:0
    },
    frequent_traveller:{
        name:"Frequent Traveller",
        points:30
    },
    senator:{
        name:"Senator",
        points:60
    },
    hon_circle_member:{
        name:"HON Circle Member",
        points:120
    }
};

const DISTANCE_POINTS={
    short:1,
    medium:2,
    long:3
};

let currentUser=null;
let currentProfile=null;
let authBusy=false;

const $=id=>document.getElementById(id);

const esc=v=>String(v??"")
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");

const num=v=>Number(v||0).toLocaleString("en-US");

function msg(text,type="info"){
    const e=$("message");

    if(!e)return;

    e.textContent=text;
    e.className=`message ${type}`;
    e.classList.remove("hidden");

    clearTimeout(msg.t);

    msg.t=setTimeout(()=>{
        e.classList.add("hidden");
    },6000);
}

function date(v){
    if(!v)return"—";

    const d=new Date(v);

    if(Number.isNaN(d.getTime()))return"—";

    return new Intl.DateTimeFormat(
        "en-GB",
        {
            timeZone:"Europe/Vienna",
            dateStyle:"medium",
            timeStyle:"short"
        }
    ).format(d);
}

function discordId(u=currentUser){
    const i=u?.identities?.find(
        x=>x.provider==="discord"
    );

    return String(
        i?.identity_data?.provider_id||
        i?.identity_data?.sub||
        u?.user_metadata?.provider_id||
        u?.user_metadata?.sub||
        ""
    );
}

function admin(){
    return discordId()===ADMIN_DISCORD_ID;
}

function statusName(s){
    return STATUSES[s]?.name||"Member";
}

function statusPoints(s){
    return STATUSES[s]?.points||0;
}

function canClass(c){
    const p=statusPoints(
        currentProfile?.miles_and_more_status
    );

    return(
        c==="economy"||
        c==="business"&&p>=30||
        c==="first"&&p>=60
    );
}

function distanceName(d){
    return({
        short:"Short-haul",
        medium:"Medium-haul",
        long:"Long-haul"
    })[d]||"Short-haul";
}

function className(c){
    return({
        economy:"Economy",
        business:"Business",
        first:"First"
    })[c]||"Economy";
}

function eventStatusClass(s){
    if(s==="boarding")return"progress";
    if(s==="departed")return"claimed";
    if(s==="completed")return"completed";
    if(s==="cancelled")return"cancelled";
    return"available";
}

function eventStatusText(s){
    return({
        scheduled:"SCHEDULED",
        boarding:"BOARDING",
        departed:"DEPARTED",
        completed:"COMPLETED",
        cancelled:"CANCELLED"
    })[s]||"SCHEDULED";
}

function flightStatusClass(s){
    if(s==="claimed")return"claimed";
    if(s==="in_progress")return"progress";
    if(s==="completed")return"completed";
    return"available";
}

function flightStatusText(s){
    if(s==="claimed")return"CLAIMED";
    if(s==="in_progress")return"IN PROGRESS";
    if(s==="completed")return"COMPLETED";
    return"AVAILABLE";
}


/* =========================
   DISCORD LOGIN
   ========================= */

async function loginWithDiscord(){

    if(authBusy)return;

    authBusy=true;

    try{

        const redirectTo=
            window.location.origin+
            window.location.pathname;

        const{error}=
            await supabaseClient.auth.signInWithOAuth({
                provider:"discord",
                options:{
                    redirectTo,
                    scopes:"identify"
                }
            });

        if(error){
            console.error(error);
            msg(
                `Discord login failed: ${error.message}`,
                "error"
            );
        }

    }catch(e){

        console.error(e);

        msg(
            `Discord login failed: ${e.message}`,
            "error"
        );

    }finally{

        authBusy=false;

    }
}

async function finishOAuth(){

    const p=new URLSearchParams(
        window.location.search
    );

    const code=p.get("code");

    if(!code)return;

    const{error}=
        await supabaseClient.auth.exchangeCodeForSession(
            code
        );

    if(error){

        console.error(
            "OAuth code exchange failed:",
            error
        );

        msg(
            `Discord login failed: ${error.message}`,
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


/* =========================
   PROFILE
   ========================= */

async function ensureProfile(){

    if(!currentUser)return;

    const{error}=await supabaseClient.rpc(
        "ensure_my_profile"
    );

    if(error){
        console.warn(
            "Profile setup:",
            error.message
        );
    }

    const{
        data,
        error:profileError
    }=
        await supabaseClient
            .from("profiles")
            .select("*")
            .eq("id",currentUser.id)
            .maybeSingle();

    if(profileError){
        console.error(profileError);
    }

    currentProfile=data||null;
}

async function loadUser(){

    try{

        await finishOAuth();

    }catch(e){

        console.error(e);

        msg(
            e.message,
            "error"
        );
    }

    const{
        data,
        error
    }=
        await supabaseClient.auth.getSession();

    if(error){

        msg(
            `Session error: ${error.message}`,
            "error"
        );

        return;
    }

    currentUser=
        data.session?.user||
        null;

    if(currentUser){

        await ensureProfile();

    }else{

        currentProfile=null;

    }

    updateUI();
}

async function logout(){

    const{error}=
        await supabaseClient.auth.signOut();

    if(error){

        msg(
            error.message,
            "error"
        );

        return;
    }

    currentUser=null;
    currentProfile=null;

    updateUI();

    await refresh();
}

function updateUI(){

    const login=$("loginButton");
    const logout=$("logoutButton");
    const pill=$("userPill");
    const name=$("userName");

    login?.classList.toggle(
        "hidden",
        !!currentUser
    );

    logout?.classList.toggle(
        "hidden",
        !currentUser
    );

    pill?.classList.toggle(
        "hidden",
        !currentUser
    );

    if(name){

        const m=
            currentUser?.user_metadata||
            {};

        name.textContent=
            m.global_name||
            m.full_name||
            m.name||
            m.preferred_username||
            "Pilot";
    }

    updateMiles();
    updateAdminUI();
}


/* =========================
   MILES & MORE
   ========================= */

function updateMiles(){

    const b=$("milesMorePanel");

    if(!b)return;

    if(!currentUser||!currentProfile){

        b.innerHTML=`
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

    const pts=
        Number(currentProfile.points||0);

    const miles=
        Number(currentProfile.miles||0);

    const status=
        currentProfile.miles_and_more_status||
        "member";

    const next=
        Object.entries(STATUSES).find(
            ([,v])=>v.points>pts
        );

    b.innerHTML=`
        <div class="miles-grid">

            <div class="miles-stat accent-stat">
                <span class="stat-label">
                    Miles
                </span>

                <strong>
                    ${num(miles)}
                </strong>

                <small>
                    Lifetime Miles
                </small>
            </div>

            <div class="miles-stat">
                <span class="stat-label">
                    Points
                </span>

                <strong>
                    ${num(pts)}
                </strong>

                <small>
                    Miles &amp; More Points
                </small>
            </div>

            <div class="miles-stat">
                <span class="stat-label">
                    Status
                </span>

                <strong>
                    ${esc(statusName(status))}
                </strong>

                <small>
                    ${
                        next
                        ? `${next[1].points-pts} point(s) to ${esc(next[1].name)}`
                        : "Highest status reached"
                    }
                </small>
            </div>

        </div>
    `;
}


/* =========================
   ATC24
   ========================= */

function viennaDay(){

    return new Intl.DateTimeFormat(
        "en-US",
        {
            timeZone:"Europe/Vienna",
            weekday:"short"
        }
    ).format(new Date());
}

function visibleToday(f){

    const r=f.recurrence||"once";

    if(
        r==="once"||
        r==="daily"
    ){
        return true;
    }

    const d=viennaDay();

    if(r==="weekdays"){

        return[
            "Mon",
            "Tue",
            "Wed",
            "Thu",
            "Fri"
        ].includes(d);
    }

    if(r==="weekends"){

        return[
            "Sat",
            "Sun"
        ].includes(d);
    }

    return true;
}

async function loadFlights(){

    const b=$("flightBoard");

    if(!b)return;

    const{
        data,
        error
    }=
        await supabaseClient
            .from("flights")
            .select("*")
            .order(
                "scheduled_departure",
                {
                    ascending:true
                }
            );

    if(error){

        b.innerHTML=`
            <div class="error-state">
                Could not load flights:
                ${esc(error.message)}
            </div>
        `;

        return;
    }

    renderFlights(
        (data||[]).filter(visibleToday)
    );
}

function renderFlights(fs){

    const b=$("flightBoard");
    const c=$("flightCount");

    if(!b)return;

    b.innerHTML="";

    if(c){

        c.textContent=
            `${fs.length} ${
                fs.length===1
                ?"flight"
                :"flights"
            }`;
    }

    if(!fs.length){

        b.innerHTML=`
            <div class="empty-state">

                <span class="empty-icon">
                    ✈️
                </span>

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

    for(const f of fs){

        const mine=
            currentUser&&
            f.claimed_by===currentUser.id;

        let actions="";

        if(f.status==="available"){

            actions=
                currentUser

                ?`
                    <button
                        class="btn btn-primary"
                        onclick="claimFlight('${f.id}')"
                    >
                        CLAIM FLIGHT
                    </button>
                `

                :`
                    <button
                        class="btn btn-secondary"
                        onclick="loginWithDiscord()"
                    >
                        LOGIN WITH DISCORD TO CLAIM
                    </button>
                `;

        }else if(f.status==="claimed"){

            actions=
                mine

                ?`
                    <button
                        class="btn btn-primary"
                        onclick="startFlight('${f.id}')"
                    >
                        START FLIGHT
                    </button>
                `

                :`
                    <span class="action-note">
                        Pilot has claimed this flight.
                    </span>
                `;

        }else if(
            f.status==="in_progress"&&
            mine
        ){

            actions=`

                <button
                    class="btn btn-secondary"
                    onclick="recordEvent('${f.id}','pushback')"
                >
                    PUSHBACK
                </button>

                <button
                    class="btn btn-secondary"
                    onclick="recordEvent('${f.id}','takeoff')"
                >
                    TAKEOFF
                </button>

                <button
                    class="btn btn-secondary"
                    onclick="recordEvent('${f.id}','landing')"
                >
                    LANDING
                </button>

                <button
                    class="btn btn-dark"
                    onclick="completeFlight('${f.id}')"
                >
                    END FLIGHT
                </button>

            `;

        }else if(
            f.status==="in_progress"
        ){

            actions=`
                <span class="action-note">
                    Pilot is currently operating this flight.
                </span>
            `;

        }else if(
            f.status==="completed"
        ){

            actions=`
                <span class="action-note success-text">
                    ✓ Flight completed
                </span>
            `;
        }

        const card=
            document.createElement("article");

        card.className=
            "flight-card";

        card.innerHTML=`

            <div class="card-topline">

                <div>

                    <span class="eyebrow">
                        ATC24
                    </span>

                    <h3>
                        ${esc(f.flight_number)}
                    </h3>

                </div>

                <span
                    class="status ${flightStatusClass(f.status)}"
                >
                    ${flightStatusText(f.status)}
                </span>

            </div>

            <div class="route-line">

                <span>
                    ${esc(f.departure_airport)}
                </span>

                <span class="route-arrow">
                    →
                </span>

                <span>
                    ${esc(f.arrival_airport)}
                </span>

            </div>

            <div class="info-grid">

                <div class="info-box">
                    <span>
                        Departure
                    </span>

                    <strong>
                        ${date(f.scheduled_departure)}
                    </strong>
                </div>

                <div class="info-box">
                    <span>
                        Aircraft
                    </span>

                    <strong>
                        ${esc(f.aircraft_model)}
                    </strong>
                </div>

                <div class="info-box">
                    <span>
                        Operator
                    </span>

                    <strong>
                        ${esc(f.operator_airline)}
                    </strong>
                </div>

                <div class="info-box">
                    <span>
                        Livery
                    </span>

                    <strong>
                        ${esc(f.livery_airline)}
                    </strong>
                </div>

            </div>

            ${
                f.recurrence&&
                f.recurrence!=="once"

                ?`
                    <div class="tag-row">
                        <span class="tag">
                            ${esc(f.recurrence)}
                        </span>
                    </div>
                `

                :""
            }

            ${
                f.additional_info

                ?`
                    <div class="additional">
                        ${esc(f.additional_info)}
                    </div>
                `

                :""
            }

            ${
                mine

                ?`
                    <div class="timeline-box">

                        ${
                            f.started_at
                            ?`▶ Started: ${date(f.started_at)}<br>`
                            :""
                        }

                        ${
                            f.pushback_at
                            ?`↪ Pushback: ${date(f.pushback_at)}<br>`
                            :""
                        }

                        ${
                            f.takeoff_at
                            ?`🛫 Takeoff: ${date(f.takeoff_at)}<br>`
                            :""
                        }

                        ${
                            f.landing_at
                            ?`🛬 Landing: ${date(f.landing_at)}<br>`
                            :""
                        }

                        ${
                            f.completed_at
                            ?`✓ Completed: ${date(f.completed_at)}`
                            :""
                        }

                    </div>
                `

                :""
            }

            <div class="actions">
                ${actions}
            </div>

        `;

        b.appendChild(card);
    }
}

async function claimFlight(id){

    if(!currentUser){

        return loginWithDiscord();
    }

    const{
        error
    }=
        await supabaseClient
            .from("flights")
            .update({
                status:"claimed",
                claimed_by:currentUser.id,
                claimed_at:new Date().toISOString()
            })
            .eq("id",id)
            .eq("status","available");

    if(error){
        msg(
            error.message,
            "error"
        );
    }

    await loadFlights();
}

async function startFlight(id){

    if(!currentUser)return;

    const{
        error
    }=
        await supabaseClient
            .from("flights")
            .update({
                status:"in_progress",
                started_at:new Date().toISOString()
            })
            .eq("id",id)
            .eq("claimed_by",currentUser.id);

    if(error){
        msg(
            error.message,
            "error"
        );
    }

    await loadFlights();
}

async function recordEvent(id,event){

    if(!currentUser)return;

    const field={
        pushback:"pushback_at",
        takeoff:"takeoff_at",
        landing:"landing_at"
    }[event];

    if(!field)return;

    const{
        error
    }=
        await supabaseClient
            .from("flights")
            .update({
                [field]:new Date().toISOString()
            })
            .eq("id",id)
            .eq("claimed_by",currentUser.id);

    if(error){
        msg(
            error.message,
            "error"
        );
    }

    await loadFlights();
}

async function completeFlight(id){

    if(!currentUser)return;

    const{
        data,
        error
    }=
        await supabaseClient
            .from("flights")
            .update({
                status:"completed",
                completed_at:new Date().toISOString()
            })
            .eq("id",id)
            .eq("claimed_by",currentUser.id)
            .select();

    if(error){

        msg(
            `Could not end flight: ${error.message}`,
            "error"
        );

    }else if(!data?.length){

        msg(
            "Flight could not be completed.",
            "error"
        );

    }else{

        msg(
            "Flight completed successfully.",
            "success"
        );
    }

    await loadFlights();
}


/* =========================
   ATC24 ADMIN
   ========================= */

async function createFlight(){

    if(!admin()){

        msg(
            "Admin access required.",
            "error"
        );

        return;
    }

    const ids=[
        "flightNumber",
        "departure",
        "arrival",
        "scheduled",
        "aircraft",
        "operator",
        "livery"
    ];

    const v=
        Object.fromEntries(
            ids.map(id=>[
                id,
                $(id)?.value.trim()
            ])
        );

    if(
        Object.values(v).some(
            x=>!x
        )
    ){

        msg(
            "Please fill in all required ATC24 fields.",
            "error"
        );

        return;
    }

    const{
        error
    }=
        await supabaseClient
            .from("flights")
            .insert({
                flight_number:v.flightNumber,
                departure_airport:v.departure,
                arrival_airport:v.arrival,
                scheduled_departure:
                    new Date(v.scheduled).toISOString(),
                aircraft_model:v.aircraft,
                operator_airline:v.operator,
                livery_airline:v.livery,
                recurrence:
                    $("recurrence").value||"once",
                additional_info:
                    $("additionalInfo").value.trim()||
                    null,
                status:"available"
            });

    if(error){

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

    [
        ...ids,
        "additionalInfo"
    ].forEach(id=>{
        $(id).value="";
    });

    await loadFlights();
    await loadAdminFlights();
}

async function loadAdminFlights(){

    if(!admin())return;

    const b=$("adminFlights");

    if(!b)return;

    const{
        data,
        error
    }=
        await supabaseClient
            .from("flights")
            .select("*")
            .order(
                "scheduled_departure",
                {
                    ascending:false
                }
            );

    if(error){

        b.innerHTML=`
            <div class="error-state">
                Could not load ATC24 flights:
                ${esc(error.message)}
            </div>
        `;

        return;
    }

    b.innerHTML=
        data?.length
        ?""
        :`
            <div class="empty-state compact">
                <span class="empty-icon">
                    📭
                </span>

                <div>
                    <strong>
                        No ATC24 flights created yet.
                    </strong>
                </div>
            </div>
        `;

    for(const f of data||[]){

        const d=
            document.createElement("div");

        d.className="admin-row";

        d.innerHTML=`

            <div>

                <strong>
                    ${esc(f.flight_number)}
                </strong>

                <span>
                    ${esc(f.departure_airport)}
                    →
                    ${esc(f.arrival_airport)}
                </span>

                <small>
                    ${date(f.scheduled_departure)}
                    ·
                    ${esc(f.recurrence||"once")}
                    ·
                    ${esc(f.status)}
                </small>

            </div>

            <button
                class="btn btn-danger"
                onclick="deleteFlight('${f.id}')"
            >
                DELETE
            </button>

        `;

        b.appendChild(d);
    }
}

async function deleteFlight(id){

    if(!admin()){

        msg(
            "Admin access required.",
            "error"
        );

        return;
    }

    if(
        !confirm(
            "Delete this flight?"
        )
    ){
        return;
    }

    const{
        error
    }=
        await supabaseClient
            .from("flights")
            .delete()
            .eq("id",id);

    if(error){

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


/* =========================
   EVENT FLIGHTS
   ========================= */

async function booking(eventId){

    if(!currentUser)return null;

    const{
        data
    }=
        await supabaseClient
            .from("event_bookings")
            .select("*")
            .eq("event_id",eventId)
            .eq("user_id",currentUser.id)
            .maybeSingle();

    return data||null;
}

async function counts(eventId){

    const{
        data,
        error
    }=
        await supabaseClient.rpc(
            "get_event_booking_counts",
            {
                p_event_id:String(eventId)
            }
        );

    if(error){

        console.error(error);

        return{
            economy:0,
            business:0,
            first:0
        };
    }

    const r=
        Array.isArray(data)
        ?data[0]
        :data;

    return{
        economy:Number(r?.economy||0),
        business:Number(r?.business||0),
        first:Number(r?.first_class||0)
    };
}

async function loadEvents(){

    const b=$("eventFlightBoard");

    if(!b)return;

    const{
        data,
        error
    }=
        await supabaseClient
            .from("events")
            .select("*")
            .order(
                "departure_time",
                {
                    ascending:true
                }
            );

    if(error){

        b.innerHTML=`
            <div class="error-state">
                Could not load event flights:
                ${esc(error.message)}
            </div>
        `;

        return;
    }

    await renderEvents(
        data||[]
    );
}

async function renderEvents(events){

    const b=$("eventFlightBoard");
    const c=$("eventFlightCount");

    if(!b)return;

    b.innerHTML="";

    if(c){

        c.textContent=
            `${events.length} ${
                events.length===1
                ?"event"
                :"events"
            }`;
    }

    if(!events.length){

        b.innerHTML=`
            <div class="empty-state">

                <span class="empty-icon">
                    🌍
                </span>

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

    for(const e of events){

        const bk=
            await booking(e.id);

        const co=
            await counts(e.id);

        const d=
            e.distance_type||
            "short";

        const pts=
            Number(
                e.points||
                DISTANCE_POINTS[d]
            );

        let a="";

        if(e.status==="cancelled"){

            a=`
                <span class="action-note error-text">
                    ❌ This event flight has been cancelled.
                </span>
            `;

        }else if(bk?.completed){

            a=`
                <span class="action-note success-text">
                    ✓ Completed —
                    ${num(e.miles)} Miles /
                    ${pts} Point(s) awarded.
                </span>
            `;

        }else if(bk){

            const done=
                e.status==="completed"&&
                bk.checked_in&&
                bk.boarded&&
                !bk.completed;

            a=`

                <div class="booking-status">

                    <strong>
                        🎫 Your booking ·
                        ${esc(
                            className(
                                bk.travel_class
                            )
                        )}
                    </strong>

                    <span>
                        ${
                            bk.checked_in
                            ?"✓ Checked in"
                            :"• Not checked in"
                        }
                    </span>

                    <span>
                        ${
                            bk.boarded
                            ?"✓ Boarded"
                            :"• Not boarded"
                        }
                    </span>

                </div>

                <div class="actions">

                    ${
                        !bk.checked_in&&
                        e.status!=="completed"

                        ?`
                            <button
                                class="btn btn-primary"
                                onclick="checkInEventFlight('${bk.id}')"
                            >
                                CHECK IN
                            </button>
                        `

                        :""
                    }

                    ${
                        bk.checked_in&&
                        !bk.boarded&&
                        e.status!=="completed"

                        ?`
                            <button
                                class="btn btn-secondary"
                                onclick="boardEventFlight('${bk.id}')"
                            >
                                BOARD
                            </button>
                        `

                        :""
                    }

                    ${
                        done

                        ?`
                            <button
                                class="btn btn-primary"
                                onclick="completeEventBooking('${bk.id}')"
                            >
                                COMPLETE EVENT FLIGHT
                            </button>
                        `

                        :""
                    }

                </div>

            `;

        }else if(!currentUser){

            a=`
                <button
                    class="btn btn-secondary"
                    onclick="loginWithDiscord()"
                >
                    LOGIN WITH DISCORD TO BOOK
                </button>
            `;

        }else if(e.status==="completed"){

            a=`
                <span class="action-note">
                    This event flight is completed.
                </span>
            `;

        }else{

            const eco=
                Number(e.economy_capacity||0)>
                co.economy;

            const bus=
                Number(e.business_capacity||0)>
                co.business;

            const first=
                Number(e.first_capacity||0)>
                co.first;

            a=`

                <div class="actions">

                    ${
                        eco

                        ?`
                            <button
                                class="btn btn-primary"
                                onclick="bookEventFlight('${e.id}','economy')"
                            >
                                BOOK ECONOMY
                            </button>
                        `

                        :`
                            <span class="action-note">
                                Economy full
                            </span>
                        `
                    }

                    ${
                        canClass("business")

                        ?(
                            bus

                            ?`
                                <button
                                    class="btn btn-secondary"
                                    onclick="bookEventFlight('${e.id}','business')"
                                >
                                    BOOK BUSINESS
                                </button>
                            `

                            :`
                                <span class="action-note">
                                    Business full
                                </span>
                            `
                        )

                        :`
                            <span class="action-note">
                                🔒 Business —
                                Frequent Traveller required
                            </span>
                        `
                    }

                    ${
                        canClass("first")

                        ?(
                            first

                            ?`
                                <button
                                    class="btn btn-dark"
                                    onclick="bookEventFlight('${e.id}','first')"
                                >
                                    BOOK FIRST
                                </button>
                            `

                            :`
                                <span class="action-note">
                                    First full
                                </span>
                            `
                        )

                        :`
                            <span class="action-note">
                                🔒 First —
                                Senator required
                            </span>
                        `
                    }

                </div>

            `;
        }

        const card=
            document.createElement("article");

        card.className=
            "flight-card";

        card.innerHTML=`

            <div class="card-topline">

                <div>

                    <span class="eyebrow">
                        EVENT FLIGHT
                    </span>

                    <h3>
                        ${esc(e.flight_number)}
                    </h3>

                </div>

                <span
                    class="status ${eventStatusClass(e.status)}"
                >
                    ${eventStatusText(e.status)}
                </span>

            </div>

            <div class="route-line">

                <span>
                    ${esc(e.departure)}
                </span>

                <span class="route-arrow">
                    →
                </span>

                <span>
                    ${esc(e.arrival)}
                </span>

            </div>

            <div class="info-grid">

                <div class="info-box">

                    <span>
                        Departure
                    </span>

                    <strong>
                        ${date(e.departure_time)}
                    </strong>

                </div>

                <div class="info-box">

                    <span>
                        Aircraft
                    </span>

                    <strong>
                        ${esc(e.aircraft_model)}
                    </strong>

                </div>

                <div class="info-box">

                    <span>
                        Distance
                    </span>

                    <strong>
                        ${esc(distanceName(d))}
                    </strong>

                </div>

                <div class="info-box">

                    <span>
                        Miles &amp; More
                    </span>

                    <strong>
                        ${pts} Point(s)
                        ·
                        ${num(e.miles)} Miles
                    </strong>

                </div>

            </div>

            <div class="capacity-grid">

                <div>
                    <span>
                        Economy
                    </span>

                    <strong>
                        ${co.economy}/
                        ${Number(e.economy_capacity||0)}
                    </strong>
                </div>

                <div>
                    <span>
                        Business
                    </span>

                    <strong>
                        ${co.business}/
                        ${Number(e.business_capacity||0)}
                    </strong>
                </div>

                <div>
                    <span>
                        First
                    </span>

                    <strong>
                        ${co.first}/
                        ${Number(e.first_capacity||0)}
                    </strong>
                </div>

            </div>

            <div class="actions booking-actions">
                ${a}
            </div>

        `;

        b.appendChild(card);
    }
}

async function bookEventFlight(id,c){

    if(!currentUser){

        return loginWithDiscord();
    }

    if(!canClass(c)){

        return msg(
            `${className(c)} requires ${
                c==="business"
                ?"Frequent Traveller"
                :"Senator"
            } status.`,
            "error"
        );
    }

    const{
        data,
        error
    }=
        await supabaseClient.rpc(
            "book_event_flight",
            {
                p_event_id:String(id),
                p_travel_class:c
            }
        );

    if(error){

        msg(
            `Could not book flight: ${error.message}`,
            "error"
        );

        return;
    }

    const r=
        Array.isArray(data)
        ?data[0]
        :data;

    msg(
        `Booked ${className(c)} successfully. No Miles or Points have been awarded yet. Seats remaining: ${
            r?.remaining_seats??"—"
        }.`,
        "success"
    );

    await loadEvents();
}

async function checkInEventFlight(id){

    const{
        error
    }=
        await supabaseClient.rpc(
            "check_in_event_flight",
            {
                p_booking_id:id
            }
        );

    if(error){

        msg(
            `Could not check in: ${error.message}`,
            "error"
        );

        return;
    }

    msg(
        "Check-in completed.",
        "success"
    );

    await loadEvents();
}

async function boardEventFlight(id){

    const{
        error
    }=
        await supabaseClient.rpc(
            "board_event_flight",
            {
                p_booking_id:id
            }
        );

    if(error){

        msg(
            `Could not board: ${error.message}`,
            "error"
        );

        return;
    }

    msg(
        "Boarding completed.",
        "success"
    );

    await loadEvents();
}

async function completeEventBooking(id){

    const{
        data,
        error
    }=
        await supabaseClient.rpc(
            "complete_event_flight",
            {
                p_booking_id:id
            }
        );

    if(error){

        msg(
            `Could not complete event flight: ${error.message}`,
            "error"
        );

        return;
    }

    const r=
        Array.isArray(data)
        ?data[0]
        :data;

    await ensureProfile();

    updateMiles();

    await loadEvents();

    msg(
        `Event flight completed! +${
            num(r?.miles_awarded||0)
        } Miles / +${
            r?.points_awarded||0
        } Point(s). New status: ${
            statusName(
                r?.new_status
            )
        }.`,
        "success"
    );
}


/* =========================
   EVENT ADMIN
   ========================= */

async function createEventFlight(){

    if(!admin()){

        return msg(
            "Admin access required.",
            "error"
        );
    }

    const g=id=>
        $(id)?.value.trim();

    const flightNumber=
        g("eventFlightNumber");

    const departure=
        g("eventDeparture");

    const arrival=
        g("eventArrival");

    const time=
        $("eventDepartureTime")?.value;

    const aircraft=
        g("eventAircraft");

    const pilot=
        g("eventPilot");

    const distance=
        $("eventDistance")?.value||
        "short";

    const miles=
        Number(
            $("eventMiles")?.value||0
        );

    const eco=
        Number(
            $("economyCapacity")?.value||0
        );

    const bus=
        Number(
            $("businessCapacity")?.value||0
        );

    const first=
        Number(
            $("firstCapacity")?.value||0
        );

    const status=
        $("eventStatus")?.value||
        "scheduled";

    if(
        !flightNumber||
        !departure||
        !arrival||
        !time||
        !aircraft
    ){

        return msg(
            "Please fill in all required Event Flight fields.",
            "error"
        );
    }

    if(
        !Object.hasOwn(
            DISTANCE_POINTS,
            distance
        )
    ){

        return msg(
            "Invalid distance category.",
            "error"
        );
    }

    if(
        ![
            miles,
            eco,
            bus,
            first
        ].every(
            Number.isInteger
        )||
        [
            miles,
            eco,
            bus,
            first
        ].some(
            v=>v<0
        )
    ){

        return msg(
            "Invalid Miles or capacity values.",
            "error"
        );
    }

    const{
        error
    }=
        await supabaseClient.rpc(
            "create_event_flight_admin",
            {
                p_flight_number:
                    flightNumber,

                p_departure:
                    departure,

                p_arrival:
                    arrival,

                p_departure_time:
                    new Date(time).toISOString(),

                p_aircraft_model:
                    aircraft,

                p_pilot_discord_id:
                    pilot||null,

                p_distance_type:
                    distance,

                p_miles:
                    miles,

                p_economy_capacity:
                    eco,

                p_business_capacity:
                    bus,

                p_first_capacity:
                    first,

                p_status:
                    status
            }
        );

    if(error){

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
        } Point(s) / ${
            num(miles)
        } Miles.`,
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
    ].forEach(id=>{
        $(id).value="";
    });

    await loadEvents();
    await loadAdminEvents();
}

async function loadAdminEvents(){

    if(!admin())return;

    const b=$("adminEventFlights");

    if(!b)return;

    const{
        data,
        error
    }=
        await supabaseClient
            .from("events")
            .select("*")
            .order(
                "departure_time",
                {
                    ascending:false
                }
            );

    if(error){

        b.innerHTML=`
            <div class="error-state">
                Could not load event flights:
                ${esc(error.message)}
            </div>
        `;

        return;
    }

    b.innerHTML=
        data?.length
        ?""
        :`
            <div class="empty-state compact">

                <span class="empty-icon">
                    📭
                </span>

                <div>
                    <strong>
                        No Event Flights created yet.
                    </strong>
                </div>

            </div>
        `;

    for(const e of data||[]){

        const d=
            document.createElement("div");

        d.className=
            "admin-row";

        d.innerHTML=`

            <div>

                <strong>
                    ${esc(e.flight_number)}
                </strong>

                <span>
                    ${esc(e.departure)}
                    →
                    ${esc(e.arrival)}
                </span>

                <small>
                    ${date(e.departure_time)}
                    ·
                    ${esc(
                        distanceName(
                            e.distance_type
                        )
                    )}
                    ·
                    ${e.points}
                    Point(s)
                    ·
                    ${num(e.miles)}
                    Miles
                </small>

            </div>

            <div class="admin-actions">

                <select
                    class="admin-status-select"
                    onchange="updateEventStatus('${e.id}',this.value)"
                >

                    ${
                        [
                            "scheduled",
                            "boarding",
                            "departed",
                            "completed",
                            "cancelled"
                        ]
                        .map(s=>`
                            <option
                                value="${s}"
                                ${
                                    e.status===s
                                    ?"selected"
                                    :""
                                }
                            >
                                ${eventStatusText(s)}
                            </option>
                        `)
                        .join("")
                    }

                </select>

                <button
                    class="btn btn-danger"
                    onclick="deleteEventFlight('${e.id}')"
                >
                    DELETE
                </button>

            </div>

        `;

        b.appendChild(d);
    }
}

async function updateEventStatus(
    id,
    status
){

    if(!admin())return;

    const{
        error
    }=
        await supabaseClient.rpc(
            "update_event_status_admin",
            {
                p_event_id:String(id),
                p_status:status
            }
        );

    if(error){

        return msg(
            `Could not update event status: ${error.message}`,
            "error"
        );
    }

    msg(
        "Event status updated.",
        "success"
    );

    await loadEvents();
    await loadAdminEvents();
}

async function deleteEventFlight(id){

    if(!admin()){

        return msg(
            "Admin access required.",
            "error"
        );
    }

    if(
        !confirm(
            "Delete this event flight? Existing bookings and participant records will also be deleted."
        )
    ){
        return;
    }

    const{
        error
    }=
        await supabaseClient.rpc(
            "delete_event_flight_admin",
            {
                p_event_id:String(id)
            }
        );

    if(error){

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


/* =========================
   ADMIN / REFRESH
   ========================= */

function updateAdminUI(){

    const a=admin();

    $("adminPanel")
        ?.classList.toggle(
            "hidden",
            !a
        );

    $("eventAdminPanel")
        ?.classList.toggle(
            "hidden",
            !a
        );

    if(a){

        loadAdminFlights();
        loadAdminEvents();
    }
}

async function refresh(){

    await Promise.all([
        loadFlights(),
        loadEvents()
    ]);

    if(admin()){

        await Promise.all([
            loadAdminFlights(),
            loadAdminEvents()
        ]);
    }
}


/* =========================
   AUTH STATE
   ========================= */

supabaseClient.auth.onAuthStateChange(
    (_event,session)=>{

        setTimeout(
            async()=>{

                currentUser=
                    session?.user||
                    null;

                if(currentUser){

                    await ensureProfile();

                }else{

                    currentProfile=null;
                }

                updateUI();

                await refresh();

            },
            0
        );
    }
);


/* =========================
   START
   ========================= */

document.addEventListener(
    "DOMContentLoaded",
    async()=>{

        $("loginButton")
            ?.addEventListener(
                "click",
                loginWithDiscord
            );

        $("logoutButton")
            ?.addEventListener(
                "click",
                logout
            );

        await loadUser();

        await refresh();

    }
);
