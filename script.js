// 三麻 段位ルール
const rank_rules_3ma = {
    4: [105, 0, -90, 800, 1600],
    5: [105, 0, -105, 1000, 2000],
    6: [105, 0, -120, 1200, 2400],
    7: [135, 0, -135, 1400, 2800],
    8: [135, 0, -150, 1600, 3200],
    9: [135, 0, -165, 1800, 3600],
    10:[135, 0, -180, 2000, 4000],
};

// 四麻 段位ルール（翔太指定）
const rank_rules_4ma = {
    4: [75, 30, 0, -90, 1600],
    5: [75, 30, 0, -105, 2000],
    6: [75, 30, 0, -120, 2400],
    7: [90, 45, 0, -135, 2800],
    8: [90, 45, 0, -150, 3200],
    9: [90, 45, 0, -165, 3600],
    10:[90, 45, 0, -180, 4000],
};

// タブ切替
function switchTab(mode) {
    document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));

    document.querySelector(`.tab-button[onclick="switchTab('${mode}')"]`).classList.add('active');
    document.getElementById(`tab-${mode}`).classList.add('active');
}

// シミュレーション本体
function simulate_once(mode, initial_rank, initial_pt,
                       p_tokujou, p_houou,
                       upper_rank, upper_pt, max_games) {

    let rank = initial_rank;
    let pt = initial_pt;

    const rules_table = (mode === "3ma") ? rank_rules_3ma : rank_rules_4ma;

    for (let games = 1; games <= max_games; games++) {

        let p1_local, p2_local, p3_local, p4_local;

        if (rank <= 6) {
            [p1_local, p2_local, p3_local, p4_local] = p_tokujou;
        } else {
            [p1_local, p2_local, p3_local, p4_local] = p_houou;
        }

        const r = Math.random();
        const rules = rules_table[rank];

        if (mode === "4ma") {
            if (r < p1_local) pt += rules[0];
            else if (r < p1_local + p2_local) pt += rules[1];
            else if (r < p1_local + p2_local + p3_local) pt += rules[2];
            else pt += rules[3];  // 4着
        } else {
            if (r < p1_local) pt += rules[0];
            else if (r < p1_local + p2_local) pt += rules[1];
            else pt += rules[2];
        }

        if (pt >= rules[4] && rank < 10) {
            rank++;
            pt = rules_table[rank][3];
        }

        if (pt < 0) {
            if (rank > 4) {
                rank--;
                pt = rules_table[rank][3];
            } else {
                rank = 4;
                pt = 0;
            }
        }

        if (rank === upper_rank && pt >= upper_pt) {
            return games;
        }
    }

    return null;
}

// 実行
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
            Number(document.getElementById("p3_tokujou_3").value),
            0
        ];
        p_houou = [
            Number(document.getElementById("p1_houou_3").value),
            Number(document.getElementById("p2_houou_3").value),
            Number(document.getElementById("p3_houou_3").value),
            0
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

