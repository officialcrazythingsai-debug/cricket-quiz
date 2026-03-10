import { useState, useEffect, useRef } from "react";

const questions = [
  {
    q: "Which two countries co-hosted the ICC Men's T20 World Cup 2026?",
    options: ["India & Pakistan", "India & Sri Lanka", "Australia & India", "Sri Lanka & Bangladesh"],
    answer: 1,
    fact: "The 2026 T20 World Cup was co-hosted by India and Sri Lanka, running from February 7 to March 8, 2026.",
  },
  {
    q: "Who won the T20 World Cup 2026 title?",
    options: ["Australia", "New Zealand", "England", "India"],
    answer: 3,
    fact: "India beat New Zealand by 96 runs in the final at Narendra Modi Stadium, Ahmedabad, on March 8, 2026.",
  },
  {
    q: "Who was named Player of the Tournament at the T20 World Cup 2026?",
    options: ["Jasprit Bumrah", "Sanju Samson", "Abhishek Sharma", "Varun Chakravarthy"],
    answer: 1,
    fact: "Sanju Samson scored 321 runs in just 5 matches, including three consecutive fifties in the knockout stages.",
  },
  {
    q: "What was India's winning score in the T20 World Cup 2026 final against New Zealand?",
    options: ["210/4", "230/6", "255/5", "245/3"],
    answer: 2,
    fact: "India posted 255/5 — the highest total ever in a T20 World Cup final — powered by Samson (89), Kishan (54), and Abhishek (52).",
  },
  {
    q: "Who took 4 wickets for just 15 runs in the T20 World Cup 2026 final?",
    options: ["Arshdeep Singh", "Axar Patel", "Hardik Pandya", "Jasprit Bumrah"],
    answer: 3,
    fact: "Bumrah's 4/15 is the best bowling figures ever recorded in a T20 World Cup final. He finished the tournament as joint-highest wicket-taker with 14 wickets.",
  },
  {
    q: "Which historic record did India set by winning the T20 World Cup 2026?",
    options: [
      "First team to score 250+ in a final",
      "First team to win back-to-back T20 World Cups",
      "First Asian team to win a T20 World Cup",
      "First team to win unbeaten throughout",
    ],
    answer: 1,
    fact: "India became the first team ever to defend the T20 World Cup title, and the first to win it on home soil. They also became the only three-time champions.",
  },
  {
    q: "Who scored the fastest half-century in any T20 World Cup 2026 knockout match?",
    options: ["Sanju Samson", "Finn Allen", "Jacob Bethell", "Abhishek Sharma"],
    answer: 3,
    fact: "Abhishek Sharma reached his fifty in just 18 balls against New Zealand in the final — the fastest by any batter in a T20 World Cup knockout game.",
  },
  {
    q: "Which team replaced Bangladesh in the T20 World Cup 2026 after they withdrew citing security concerns?",
    options: ["Ireland", "Nepal", "Scotland", "Canada"],
    answer: 2,
    fact: "Bangladesh refused to travel to India. The ICC replaced them with Scotland, the next highest-ranked T20I team that had not qualified.",
  },
  {
    q: "Who was India's captain in the T20 World Cup 2026?",
    options: ["Rohit Sharma", "Virat Kohli", "Hardik Pandya", "Suryakumar Yadav"],
    answer: 3,
    fact: "Suryakumar Yadav captained India to their 2026 T20 World Cup victory. Bumrah called him a 'national treasure' during celebrations.",
  },
  {
    q: "How many sixes did Sanju Samson hit across the T20 World Cup 2026 — the most by any batter?",
    options: ["18", "20", "24", "27"],
    answer: 2,
    fact: "Samson smashed 24 sixes in the tournament — four more than Finn Allen's tally of 20, which was the second highest.",
  },
];

const TOTAL_TIME = 20;

export default function App() {
  const [screen, setScreen] = useState("start"); // start | quiz | result
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [showFact, setShowFact] = useState(false);
  const [animate, setAnimate] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (screen === "quiz" && selected === null) {
      timerRef.current = setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) {
            clearInterval(timerRef.current);
            handleAnswer(null);
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [screen, current, selected]);

  const startQuiz = () => {
    setScreen("quiz");
    setCurrent(0);
    setScore(0);
    setAnswers([]);
    setSelected(null);
    setTimeLeft(TOTAL_TIME);
    setShowFact(false);
    setAnimate(true);
    setTimeout(() => setAnimate(false), 500);
  };

  const handleAnswer = (idx) => {
    if (selected !== null) return;
    clearInterval(timerRef.current);
    setSelected(idx);
    const correct = idx === questions[current].answer;
    if (correct) setScore((s) => s + 1);
    setAnswers((a) => [...a, { selected: idx, correct }]);
    setShowFact(true);
  };

  const nextQuestion = () => {
    if (current + 1 >= questions.length) {
      setScreen("result");
      return;
    }
    setAnimate(true);
    setTimeout(() => {
      setCurrent((c) => c + 1);
      setSelected(null);
      setTimeLeft(TOTAL_TIME);
      setShowFact(false);
      setAnimate(false);
    }, 300);
  };

  const getRating = () => {
    if (score === 10) return { label: "World Class! 🏆", sub: "You belong in the Hall of Fame." };
    if (score >= 7) return { label: "All-Rounder! 🌟", sub: "Solid knowledge across the board." };
    if (score >= 4) return { label: "Club Cricketer 🏏", sub: "Room to grow — keep watching!" };
    return { label: "Cricket Newbie 🌱", sub: "Great start! The pitch awaits." };
  };

  const timerPct = (timeLeft / TOTAL_TIME) * 100;
  const timerColor = timeLeft > 10 ? "#4ade80" : timeLeft > 5 ? "#facc15" : "#f87171";

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0a1628 0%, #0d2137 40%, #0a1a2e 100%)",
      fontFamily: "'Georgia', 'Times New Roman', serif",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Background texture */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none",
        backgroundImage: `radial-gradient(circle at 20% 20%, rgba(34,197,94,0.06) 0%, transparent 50%),
          radial-gradient(circle at 80% 80%, rgba(234,179,8,0.06) 0%, transparent 50%)`,
      }} />

      {/* Decorative stumps */}
      {[10, 30, 70, 90].map((left, i) => (
        <div key={i} style={{
          position: "fixed", bottom: 0, left: `${left}%`,
          display: "flex", gap: "4px", opacity: 0.07, pointerEvents: "none",
        }}>
          {[0, 1, 2].map(j => (
            <div key={j} style={{ width: "4px", height: "60px", background: "#e5c97e", borderRadius: "2px" }} />
          ))}
        </div>
      ))}

      <div style={{ width: "100%", maxWidth: "680px", position: "relative", zIndex: 1 }}>

        {/* START SCREEN */}
        {screen === "start" && (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "72px", marginBottom: "8px" }}>🏏</div>
            <div style={{
              fontSize: "11px", letterSpacing: "6px", color: "#86efac",
              textTransform: "uppercase", marginBottom: "16px", fontFamily: "monospace",
            }}>ICC Men's</div>
            <h1 style={{
              fontSize: "clamp(28px, 6vw, 58px)", color: "#e5c97e",
              margin: "0 0 8px", fontWeight: "bold", lineHeight: 1.1,
              textShadow: "0 0 60px rgba(229,201,126,0.3)",
            }}>T20 World Cup 2026 Quiz</h1>
            <p style={{ color: "#94a3b8", fontSize: "16px", margin: "0 0 40px", lineHeight: 1.6 }}>
              10 questions · 20 seconds each<br />
              How well do you know the just-concluded tournament? 🏆
            </p>
            <div style={{
              display: "flex", gap: "16px", justifyContent: "center",
              flexWrap: "wrap", marginBottom: "40px",
            }}>
              {["10 Questions", "Timed", "Fun Facts"].map((tag) => (
                <span key={tag} style={{
                  background: "rgba(229,201,126,0.1)", border: "1px solid rgba(229,201,126,0.3)",
                  color: "#e5c97e", padding: "6px 16px", borderRadius: "20px",
                  fontSize: "13px", letterSpacing: "1px",
                }}>✦ {tag}</span>
              ))}
            </div>
            <button onClick={startQuiz} style={{
              background: "linear-gradient(135deg, #e5c97e, #d4a843)",
              color: "#0a1628", border: "none", padding: "16px 48px",
              fontSize: "18px", fontWeight: "bold", borderRadius: "50px",
              cursor: "pointer", letterSpacing: "1px",
              boxShadow: "0 8px 32px rgba(229,201,126,0.4)",
              transition: "transform 0.2s, box-shadow 0.2s",
            }}
              onMouseEnter={e => { e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = "0 12px 40px rgba(229,201,126,0.5)"; }}
              onMouseLeave={e => { e.target.style.transform = "translateY(0)"; e.target.style.boxShadow = "0 8px 32px rgba(229,201,126,0.4)"; }}
            >
              Start Quiz
            </button>
          </div>
        )}

        {/* QUIZ SCREEN */}
        {screen === "quiz" && (
          <div style={{ opacity: animate ? 0 : 1, transition: "opacity 0.3s" }}>
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <div style={{ color: "#94a3b8", fontSize: "14px", fontFamily: "monospace" }}>
                <span style={{ color: "#e5c97e", fontWeight: "bold" }}>{current + 1}</span>
                <span> / {questions.length}</span>
              </div>
              <div style={{
                background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "20px", padding: "6px 16px",
                color: "#86efac", fontSize: "14px", fontFamily: "monospace",
              }}>
                Score: <strong style={{ color: "#e5c97e" }}>{score}</strong>
              </div>
              <div style={{
                color: timerColor, fontSize: "20px", fontWeight: "bold",
                fontFamily: "monospace", minWidth: "48px", textAlign: "right",
                transition: "color 0.3s",
              }}>
                ⏱ {timeLeft}s
              </div>
            </div>

            {/* Timer bar */}
            <div style={{
              height: "4px", background: "rgba(255,255,255,0.1)",
              borderRadius: "4px", marginBottom: "28px", overflow: "hidden",
            }}>
              <div style={{
                height: "100%", width: `${timerPct}%`,
                background: timerColor, borderRadius: "4px",
                transition: "width 1s linear, background 0.3s",
                boxShadow: `0 0 8px ${timerColor}`,
              }} />
            </div>

            {/* Progress dots */}
            <div style={{ display: "flex", gap: "6px", justifyContent: "center", marginBottom: "28px" }}>
              {questions.map((_, i) => (
                <div key={i} style={{
                  width: i === current ? "24px" : "8px", height: "8px",
                  borderRadius: "4px", transition: "all 0.3s",
                  background: i < current
                    ? (answers[i]?.correct ? "#4ade80" : "#f87171")
                    : i === current ? "#e5c97e" : "rgba(255,255,255,0.15)",
                }} />
              ))}
            </div>

            {/* Question card */}
            <div style={{
              background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "20px", padding: "32px", marginBottom: "20px",
              backdropFilter: "blur(10px)",
            }}>
              <p style={{
                color: "#f1f5f9", fontSize: "clamp(16px, 2.5vw, 20px)",
                lineHeight: 1.6, margin: 0, textAlign: "center",
              }}>
                {questions[current].q}
              </p>
            </div>

            {/* Options */}
            <div style={{ display: "grid", gap: "12px", marginBottom: "20px" }}>
              {questions[current].options.map((opt, i) => {
                const isCorrect = i === questions[current].answer;
                const isSelected = i === selected;
                let bg = "rgba(255,255,255,0.04)";
                let border = "1px solid rgba(255,255,255,0.1)";
                let color = "#cbd5e1";
                if (selected !== null) {
                  if (isCorrect) { bg = "rgba(74,222,128,0.15)"; border = "1px solid #4ade80"; color = "#4ade80"; }
                  else if (isSelected) { bg = "rgba(248,113,113,0.15)"; border = "1px solid #f87171"; color = "#f87171"; }
                }
                return (
                  <button key={i} onClick={() => handleAnswer(i)} disabled={selected !== null} style={{
                    background: bg, border, borderRadius: "12px",
                    padding: "14px 20px", color, fontSize: "15px",
                    textAlign: "left", cursor: selected !== null ? "default" : "pointer",
                    transition: "all 0.3s", display: "flex", alignItems: "center", gap: "12px",
                    width: "100%",
                  }}
                    onMouseEnter={e => { if (selected === null) e.currentTarget.style.background = "rgba(255,255,255,0.09)"; }}
                    onMouseLeave={e => { if (selected === null) e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
                  >
                    <span style={{
                      width: "28px", height: "28px", borderRadius: "50%",
                      background: selected !== null && isCorrect ? "#4ade80" : selected !== null && isSelected ? "#f87171" : "rgba(255,255,255,0.1)",
                      color: selected !== null && (isCorrect || isSelected) ? "#0a1628" : "#94a3b8",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "12px", fontWeight: "bold", flexShrink: 0, transition: "all 0.3s",
                    }}>
                      {selected !== null && isCorrect ? "✓" : selected !== null && isSelected ? "✗" : ["A", "B", "C", "D"][i]}
                    </span>
                    {opt}
                  </button>
                );
              })}
            </div>

            {/* Fun fact */}
            {showFact && (
              <div style={{
                background: "rgba(229,201,126,0.08)", border: "1px solid rgba(229,201,126,0.25)",
                borderRadius: "12px", padding: "16px 20px", marginBottom: "20px",
                animation: "fadeIn 0.4s ease",
              }}>
                <p style={{ color: "#e5c97e", fontSize: "13px", margin: 0, lineHeight: 1.6 }}>
                  💡 <strong>Fun Fact:</strong> {questions[current].fact}
                </p>
              </div>
            )}

            {/* Next button */}
            {selected !== null && (
              <button onClick={nextQuestion} style={{
                width: "100%", background: "linear-gradient(135deg, #e5c97e, #d4a843)",
                color: "#0a1628", border: "none", padding: "14px",
                fontSize: "16px", fontWeight: "bold", borderRadius: "12px",
                cursor: "pointer", letterSpacing: "0.5px",
                animation: "fadeIn 0.4s ease",
              }}>
                {current + 1 >= questions.length ? "See Results 🏆" : "Next Question →"}
              </button>
            )}
          </div>
        )}

        {/* RESULT SCREEN */}
        {screen === "result" && (() => {
          const { label, sub } = getRating();
          const pct = Math.round((score / questions.length) * 100);
          return (
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "64px", marginBottom: "16px" }}>
                {score === 10 ? "🏆" : score >= 7 ? "🌟" : score >= 4 ? "🏏" : "🌱"}
              </div>
              <h2 style={{ color: "#e5c97e", fontSize: "clamp(28px, 5vw, 42px)", margin: "0 0 8px" }}>{label}</h2>
              <p style={{ color: "#94a3b8", margin: "0 0 32px" }}>{sub}</p>

              <div style={{
                background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "20px", padding: "32px", marginBottom: "24px",
              }}>
                <div style={{ fontSize: "clamp(48px, 10vw, 80px)", fontWeight: "bold", color: "#e5c97e", lineHeight: 1 }}>
                  {score}<span style={{ fontSize: "0.5em", color: "#64748b" }}>/{questions.length}</span>
                </div>
                <div style={{ color: "#86efac", fontSize: "18px", marginTop: "8px" }}>{pct}% Correct</div>

                {/* Score bar */}
                <div style={{ height: "8px", background: "rgba(255,255,255,0.1)", borderRadius: "4px", margin: "20px 0 8px", overflow: "hidden" }}>
                  <div style={{
                    height: "100%", width: `${pct}%`,
                    background: "linear-gradient(90deg, #4ade80, #e5c97e)",
                    borderRadius: "4px", transition: "width 1s ease",
                  }} />
                </div>
              </div>

              {/* Answer review */}
              <div style={{ textAlign: "left", marginBottom: "24px" }}>
                <p style={{ color: "#64748b", fontSize: "12px", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "12px", fontFamily: "monospace" }}>Your Answers</p>
                <div style={{ display: "grid", gap: "8px" }}>
                  {questions.map((q, i) => (
                    <div key={i} style={{
                      display: "flex", alignItems: "center", gap: "12px",
                      background: "rgba(255,255,255,0.03)", borderRadius: "10px", padding: "10px 14px",
                      border: `1px solid ${answers[i]?.correct ? "rgba(74,222,128,0.2)" : "rgba(248,113,113,0.2)"}`,
                    }}>
                      <span style={{ fontSize: "16px" }}>{answers[i]?.correct ? "✅" : "❌"}</span>
                      <span style={{ color: "#94a3b8", fontSize: "13px", flex: 1 }}>{q.q.slice(0, 50)}...</span>
                    </div>
                  ))}
                </div>
              </div>

              <button onClick={startQuiz} style={{
                background: "linear-gradient(135deg, #e5c97e, #d4a843)",
                color: "#0a1628", border: "none", padding: "16px 48px",
                fontSize: "18px", fontWeight: "bold", borderRadius: "50px",
                cursor: "pointer", letterSpacing: "1px",
                boxShadow: "0 8px 32px rgba(229,201,126,0.4)",
              }}>
                Play Again 🏏
              </button>
            </div>
          );
        })()}
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        * { box-sizing: border-box; }
      `}</style>
    </div>
  );
}
