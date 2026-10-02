// 段位ルール（天鳳三麻）
const rank_rules = {
    4: [105, 0, -90, 800, 1600],
    5: [105, 0, -105, 1000, 2000],
    6: [105, 0, -120, 1200, 2400],
    7: [135, 0, -135, 1400, 2800],
    8: [135, 0, -150, 1600, 3200],
    9: [135, 0, -165, 1800, 3600],
    10:[135, 0, -180, 2000, 4000],
};

function simulate_once(initial_rank, initial_pt,
                       p1_tokujou, p2_tokujou, p3_tokujou,
                       p1_sanpou, p2_sanpou, p3_sanpou,
                       upper_rank, upper_pt, max_games) {

    let rank = initial_rank;
    let pt = initial_pt;

    for (let games = 1; games <= max_games; games++) {

        // 卓レベルによる着順分布切り替え
        let p1_local, p2_local, p3_local;
        if (rank <= 6) {
            p1_local = p1_tokujou;
            p2_local = p2_tokujou;
            p3_local = p3_tokujou;
        } else {
            p1_local = p1_sanpou;
            p2_local = p2_sanpou;
            p3_local = p3_sanpou;
        }

        const r = Math.random();
        const rules = rank_rules[rank];

        if (r < p1_local) pt += rules[0];
        else if (r < p1_local + p2_local) pt += rules[1];
        else pt += rules[2];

        // 昇段（天鳳式）
        if (pt >= rules[4] && rank < 10) {
            rank++;
            pt = rank_rules[rank][3];
        }

        // 降段（天鳳式）
        if (pt < 0) {
            if (rank > 4) {
                rank--;
                pt = rank_rules[rank][3];
            } else {
                rank = 4;
                pt = 0;
            }
        }

        // 上限到達
        if (rank === upper_rank && pt >= upper_pt) {
            return games;
        }
    }

    return null;
}

function runSim() {
    const initial_rank = Number(document.getElementById("initial_rank").value);
    const initial_pt = Number(document.getElementById("initial_pt").value);

    const p1_tokujou = Number(document.getElementById("p1_tokujou").value);
    const p2_tokujou = Number(document.getElementById("p2_tokujou").value);
    const p3_tokujou = Number(document.getElementById("p3_tokujou").value);

    const p1_sanpou = Number(document.getElementById("p1_sanpou").value);
    const p2_sanpou = Number(document.getElementById("p2_sanpou").value);
    const p3_sanpou = Number(document.getElementById("p3_sanpou").value);

    const upper_rank = Number(document.getElementById("upper_rank").value);
    const upper_pt = Number(document.getElementById("upper_pt").value);

    const trials = Number(document.getElementById("trials").value);
    const max_games = Number(document.getElementById("max_games").value);

    let results = [];

    for (let i = 0; i < trials; i++) {
        const g = simulate_once(initial_rank, initial_pt,
                                p1_tokujou, p2_tokujou, p3_tokujou,
                                p1_sanpou, p2_sanpou, p3_sanpou,
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
        `試行数: ${trials}
目標段位pt到達試行数: ${success}
到達率: ${success_rate} %
到達までの半荘数 平均: ${avg}
到達までの半荘数 中央値: ${med}`;
}
