//------------------------------------------------------
// 3麻：着順pt
//------------------------------------------------------
const pt_3ma = {
    4: [105, 0, -90],
    5: [105, 0, -105],
    6: [105, 0, -120],
    7: [135, 0, -135],
    8: [135, 0, -150],
    9: [135, 0, -165],
    10:[135, 0, -180],
};

// 3麻：初期pt
const init_3ma = {
    4: 800, 5: 1000, 6: 1200,
    7: 1400, 8: 1600, 9: 1800, 10: 2000
};

// 3麻：上限pt
const cap_3ma = {
    4: 1600, 5: 2000, 6: 2400,
    7: 2800, 8: 3200, 9: 3600, 10: 4000
};


//------------------------------------------------------
// 4麻：着順pt
//------------------------------------------------------
const pt_4ma = {
    4: [75, 30, 0, -90],
    5: [75, 30, 0, -105],
    6: [75, 30, 0, -120],
    7: [90, 45, 0, -135],
    8: [90, 45, 0, -150],
    9: [90, 45, 0, -165],
    10:[90, 45, 0, -180],
};

// 4麻：初期pt
const init_4ma = {
    4: 800, 5: 1000, 6: 1200,
    7: 1400, 8: 1600, 9: 1800, 10: 2000
};

// 4麻：上限pt
const cap_4ma = {
    4: 1600, 5: 2000, 6: 2400,
    7: 2800, 8: 3200, 9: 3600, 10: 4000
};


//------------------------------------------------------
// タブ切替
//------------------------------------------------------
function switchTab(mode) {
    document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));

    document.querySelector(`.tab-button[onclick="switchTab('${mode}')"]`).classList.add('active');
    document.getElementById(`tab-${mode}`).classList.add('active');
}


//------------------------------------------------------
// 1試行分のシミュレーション
//------------------------------------------------------
function simulate_once(mode, initial_rank, initial_pt,
                       p_tokujou, p_houou,
                       upper_rank, upper_pt, max_games) {

    let rank = initial_rank;
    let pt = initial_pt;

    const pt_table   = (mode === "3ma") ? pt_3ma  : pt_4ma;
    const init_table = (mode === "3ma") ? init_3ma : init_4ma;
    const cap_table  = (mode === "3ma") ? cap_3ma  : cap_4ma;

    for (let games = 1; games <= max_games; games++) {

        let p_local = (rank <= 6) ? p_tokujou : p_houou;
        let r = Math.random();

        // 着順判定
        let add;
        if (mode === "3ma") {
            if (r < p_local[0]) add = pt_table[rank][0];
            else if (r < p_local[0] + p_local[1]) add = pt_table[rank][1];
            else add = pt_table[rank][2];
        } else {
            if (r < p_local[0]) add = pt_table[rank][0];
            else if (r < p_local[0] + p_local[1]) add = pt_table[rank][1];
            else if (r < p_local[0] + p_local[1] + p_local[2]) add = pt_table[rank][2];
            else add = pt_table[rank][3];
        }

        pt += add;

        // 昇段
        if (pt >= cap_table[rank] && rank < 10) {
            rank++;
            pt = init_table[rank];
        }

        // 降段
        if (pt < 0) {
            if (rank > 4) {
                rank--;
                pt = init_table[rank];
            } else {
                rank = 4;
                pt = 0;
            }
        }

        // 目標到達
        if (rank === upper_rank && pt >= upper_pt) {
            return games;
        }
    }

    return null;
}


//------------------------------------------------------
// 実行（出力部分も前と同じ形式）
//------------------------------------------------------
function runSim() {
    const mode = document.querySelector('.tab-button.active').textContent === "三麻" ? "3ma" : "4ma";

    const initial_rank = Number(document.getElementById("initial_rank").value);
    const initial_pt = Number(document.getElementById("initial_pt").value);

    const upper_rank = Number(document.getElementById("upper_rank").value);
    const upper_pt = Number(document.getElementById("upper_pt").value);

    const trials = Number(document.getElementById("trials").value);
    const max_games = Number(document.getElementById("max_games").value);

    let p_tokujou, p_houou;

    if (mode === "3ma") {
        p_tokujou = [
            Number(document.getElementById("p1_tokujou_3").value),
            Number(document.getElementById("p2_tokujou_3").value),
            Number(document.getElementById("p3_tokujou_3").value)
        ];
        p_houou = [
            Number(document.getElementById("p1_houou_3").value),
            Number(document.getElementById("p2_houou_3").value),
            Number(document.getElementById("p3_houou_3").value)
        ];
    } else {
        p_tokujou = [
            Number(document.getElementById("p1_tokujou_4").value),
            Number(document.getElementById("p2_tokujou_4").value),
            Number(document.getElementById("p3_tokujou_4").value),
            Number(document.getElementById("p4_tokujou_4").value)
        ];
        p_houou = [
            Number(document.getElementById("p1_houou_4").value),
            Number(document.getElementById("p2_houou_4").value),
            Number(document.getElementById("p3_houou_4").value),
            Number(document.getElementById("p4_houou_4").value)
        ];
    }

    let results = [];

    for (let i = 0; i < trials; i++) {
        const g = simulate_once(mode, initial_rank, initial_pt,
                                p_tokujou, p_houou,
                                upper_rank, upper_pt, max_games);
        if (g !== null) results.push(g);
    }

    const success = results.length;
    const success_rate = (success / trials * 100).toFixed(2);

    let avg = 0, med = 0;
    if (results.length > 0) {
        avg = (results.reduce((a,b)=>a+b,0) / results.length).toFixed(2);
        results.sort((a,b)=>a-b);
        med = results[Math.floor(results.length / 2)];
    }

    document.getElementById("result").textContent =
        `種別: ${mode === "3ma" ? "三麻" : "四麻"}
試行数: ${trials}
到達試行数: ${success}
到達率: ${success_rate} %
平均半荘数: ${avg}
中央値: ${med}`;
}

