import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from "remotion";
import React from "react";

// 実際のアプリで使用しているテーマカラー（Cyberpunk Neon風）
const THEME = {
  bg: "#0a0a0b",
  editor: "#0f0f1a",
  sidebar: "#0d0d14",
  titleBar: "#080810",
  activityBar: "#0a0a10",
  statusBar: "#0f0f1a",
  primary: "#a78bfa",
  secondary: "#22c55e",
  accent: "#22c55e",
  text: "#e4e4e7",
  muted: "#71717a",
  border: "#27272a",
  keyword: "#ff6b9d",
  function: "#a78bfa",
  string: "#00ffd5",
  variable: "#fbbf24",
  comment: "#6b7280",
  number: "#60a5fa",
};

// ========================================
// ベストプラクティス: イージング関数群
// ========================================
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4);
const easeOutBack = (t: number) => {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};
const easeInOutCubic = (t: number) => 
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

// ========================================
// ベストプラクティス: 背景アニメーション
// ========================================
const AnimatedBackground: React.FC = () => {
  const frame = useCurrentFrame();
  
  // 浮遊するオーブ
  const orbs = [
    { x: 15, y: 20, size: 400, color: THEME.primary, speed: 0.02, phase: 0 },
    { x: 75, y: 70, size: 300, color: THEME.secondary, speed: 0.015, phase: 2 },
    { x: 50, y: 85, size: 350, color: "#ff6b9d", speed: 0.025, phase: 4 },
  ];

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      {orbs.map((orb, i) => {
        const offsetX = Math.sin(frame * orb.speed + orb.phase) * 50;
        const offsetY = Math.cos(frame * orb.speed + orb.phase) * 30;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${orb.x}%`,
              top: `${orb.y}%`,
              width: orb.size,
              height: orb.size,
              borderRadius: "50%",
              background: `radial-gradient(circle, ${orb.color}15 0%, transparent 70%)`,
              transform: `translate(-50%, -50%) translate(${offsetX}px, ${offsetY}px)`,
              filter: "blur(60px)",
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

// ========================================
// ベストプラクティス: シーントランジション
// ========================================
const SceneTransition: React.FC<{
  children: React.ReactNode;
  durationInFrames: number;
  fadeIn?: number;
  fadeOut?: number;
}> = ({ children, durationInFrames, fadeIn = 10, fadeOut = 10 }) => {
  const frame = useCurrentFrame();
  
  const opacity = interpolate(
    frame,
    [0, fadeIn, durationInFrames - fadeOut, durationInFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const scale = interpolate(
    frame,
    [0, fadeIn, durationInFrames - fadeOut, durationInFrames],
    [0.95, 1, 1, 1.02],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill style={{ opacity, transform: `scale(${scale})` }}>
      {children}
    </AbsoluteFill>
  );
};

// ========================================
// 実際のロゴSVG
// ========================================
const Logo: React.FC<{ size?: number }> = ({ size = 80 }) => (
  <svg width={size} height={size} viewBox="0 0 1080 1080">
    <path
      fill="#46aaa5"
      d="M605.6,74.4c-4.4-.3-8.6,2.1-10.5,6.2l-34.5,75.8-29-9.7c-174,0-419.8,96.7-419.8,419.8s13.7,167.2,42,223.1c25.2,49.7,61.5,92.4,107.7,126.7,76.5,56.8,179.5,89.4,282.6,89.4s158.5-25.7,211.4-72.5c55.6-49.1,84.9-118,84.9-199.3s-24.7-142.1-72.6-180.1c-37.2-29.5-89-34.5-140.9-34.5-92.2,0-161.7,68.1-161.7,158.4s24.6,81.2,45.2,97.7c26,20.8,55.9,28.2,73.6,28.2,65.5,0,103.1-32.4,103.1-88.8s-27.5-58.3-39.4-61.7c-22.7-6.6-49.2,2.1-60.3,19.8-2.3,3.6-2.1,8.3.3,11.8,2.5,3.5,6.8,5.2,11,4.3,4.3-.9,18.3-2.3,25.2,3.2,1.2,1,4.8,3.9,4.8,13.1,0,13.3-3.6,25.6-29.4,25.6s-14.4-2.2-24.8-9.1c-12.5-8.4-18.9-20.7-18.9-36.4,0-42.9,27.7-67.5,76.1-67.5s89.4,38.5,89.4,105.6-21.7,70.9-40,86.3c-24.8,21-57.9,32.6-93.3,32.6s-81.6-15.3-112.6-40.9c-25.3-21-55.5-58.7-55.5-119.5s21.3-115.9,61.6-151.9c33.7-30.1,79.9-47.4,126.7-47.5,4.5.1,95.6,2.8,173.3,2.8s104.4-14.5,138.6-42c31.8-25.5,49.3-60.3,49.3-97.9,0-71.7-104.6-251.6-363.4-271.1h0Z"
    />
    <path
      fill="#fff"
      d="M764.1,207c41.6,0,78.9,34.6,78.9,76.2s-33.8,60.6-75.3,63.2c-65.9,4.2-82.4-30.7-82.4-72.3s37.3-67.1,78.9-67.1Z"
    />
    <path
      fill="#333"
      d="M737.6,229.5c16.6,0,30.1,8.9,30.1,25.5s-13.5,30.1-30.1,30.1-30.1-13.5-30.1-30.1,13.5-25.5,30.1-25.5Z"
    />
  </svg>
);

// ========================================
// ロゴシーン（ベストプラクティス適用）
// ========================================
const LogoScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ロゴのバウンス登場（スタガードアニメーション）
  const logoProgress = interpolate(frame, [5, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const logoScale = easeOutBack(logoProgress);
  const logoRotate = interpolate(easeOutCubic(logoProgress), [0, 1], [-20, 0]);

  // テキストのスライドイン（遅延）
  const titleProgress = interpolate(frame, [20, 45], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const titleY = interpolate(easeOutBack(titleProgress), [0, 1], [80, 0]);

  // サブテキストのフェードイン（さらに遅延）
  const subProgress = interpolate(frame, [35, 55], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const subY = interpolate(easeOutCubic(subProgress), [0, 1], [40, 0]);

  // パルスエフェクト（呼吸するような動き）
  const pulse = 1 + Math.sin(frame * 0.12) * 0.025;
  
  // ロゴのグロー効果
  const glowIntensity = 20 + Math.sin(frame * 0.1) * 10;

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 32,
        }}
      >
        {/* ロゴ with グロー */}
        <div
          style={{
            transform: `scale(${logoScale * pulse}) rotate(${logoRotate}deg)`,
            opacity: logoProgress,
            filter: `drop-shadow(0 0 ${glowIntensity}px ${THEME.primary}50)`,
          }}
        >
          <Logo size={180} />
        </div>
        
        {/* タイトル */}
        <h1
          style={{
            fontSize: 100,
            fontWeight: 800,
            color: THEME.text,
            margin: 0,
            letterSpacing: -3,
            fontFamily: "system-ui, -apple-system, sans-serif",
            transform: `translateY(${titleY}px)`,
            opacity: titleProgress,
            textShadow: `0 0 40px ${THEME.primary}30`,
          }}
        >
          Themeleon
        </h1>
        
        {/* サブタイトル */}
        <p
          style={{
            fontSize: 36,
            color: THEME.muted,
            margin: 0,
            fontFamily: "system-ui, -apple-system, sans-serif",
            transform: `translateY(${subY}px)`,
            opacity: subProgress,
            letterSpacing: 2,
          }}
        >
          AI Theme Creator for VS Code
        </p>
      </div>
    </AbsoluteFill>
  );
};

// プロンプト入力シーン
const PromptScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const text = "サイバーパンクな夜景をイメージした、ネオンが光るダークテーマ";

  // ボックスのスライドイン
  const boxProgress = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const boxScale = easeOutBack(boxProgress);
  const boxY = interpolate(boxProgress, [0, 1], [80, 0]);

  // タイピングアニメーション（少し速く）
  const visibleChars = Math.floor(frame * 1.2);
  const displayText = text.slice(0, visibleChars);

  const cursorOpacity = Math.sin(frame * 0.3) > 0 ? 1 : 0;

  // グロー効果
  const glowIntensity = 40 + Math.sin(frame * 0.2) * 20;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: THEME.bg,
        justifyContent: "center",
        alignItems: "center",
        padding: 100,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 1200,
          transform: `scale(${boxScale}) translateY(${boxY}px)`,
          opacity: boxProgress,
        }}
      >
        <p
          style={{
            fontSize: 28,
            color: THEME.muted,
            marginBottom: 24,
            transform: `translateX(${interpolate(boxProgress, [0, 1], [-30, 0])}px)`,
          }}
        >
          どんなテーマを作りますか？
        </p>
        <div
          style={{
            background: THEME.editor,
            borderRadius: 20,
            padding: 40,
            border: `2px solid ${THEME.primary}60`,
            boxShadow: `0 0 ${glowIntensity}px ${THEME.primary}40`,
            transition: "box-shadow 0.3s",
          }}
        >
          <p
            style={{
              fontSize: 36,
              color: THEME.text,
              margin: 0,
              fontFamily: "'SF Mono', monospace",
              minHeight: 54,
            }}
          >
            {displayText}
            <span
              style={{
                opacity: cursorOpacity,
                color: THEME.primary,
                fontWeight: 100,
              }}
            >
              |
            </span>
          </p>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// 生成中シーン（ハッカー風）
const GeneratingScene: React.FC = () => {
  const frame = useCurrentFrame();

  const lines = [
    "Initializing AI model...",
    "Analyzing color preferences...",
    "Generating syntax highlighting...",
    "Applying cyberpunk aesthetics...",
    "Optimizing contrast ratios...",
    "Finalizing theme configuration...",
  ];

  // ボックス登場アニメーション
  const boxProgress = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });
  const boxScale = easeOutBack(boxProgress);

  // 行の表示（より速く）
  const visibleLines = Math.floor(frame / 10);

  // プログレスバー
  const progress = interpolate(frame, [0, 90], [0, 100], { extrapolateRight: "clamp" });

  // グロー効果
  const glowPulse = 30 + Math.sin(frame * 0.3) * 15;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: THEME.bg,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          background: THEME.editor,
          borderRadius: 20,
          padding: 48,
          width: 850,
          border: `1px solid ${THEME.primary}40`,
          boxShadow: `0 0 ${glowPulse}px ${THEME.primary}30`,
          transform: `scale(${boxScale})`,
          opacity: boxProgress,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: 24,
          }}
        >
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              border: `3px solid ${THEME.primary}`,
              borderTopColor: "transparent",
              transform: `rotate(${frame * 15}deg)`,
            }}
          />
          <span style={{ color: THEME.primary, fontSize: 26, fontWeight: 600 }}>
            Generating Theme...
          </span>
        </div>

        {/* プログレスバー */}
        <div
          style={{
            height: 6,
            background: "#1a1a2e",
            borderRadius: 3,
            marginBottom: 24,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${progress}%`,
              background: `linear-gradient(90deg, ${THEME.primary}, ${THEME.secondary})`,
              borderRadius: 3,
              boxShadow: `0 0 10px ${THEME.primary}`,
            }}
          />
        </div>

        <div style={{ fontFamily: "'SF Mono', monospace" }}>
          {lines.slice(0, visibleLines + 1).map((line, i) => {
            const lineProgress = interpolate(
              frame - i * 10,
              [0, 8],
              [0, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            );
            return (
              <p
                key={i}
                style={{
                  color: i === visibleLines ? THEME.secondary : THEME.muted,
                  fontSize: 17,
                  margin: "10px 0",
                  opacity: lineProgress,
                  transform: `translateX(${interpolate(lineProgress, [0, 1], [20, 0])}px)`,
                }}
              >
                <span style={{ color: THEME.primary }}>{">"}</span> {line}
                {i === visibleLines && <span style={{ opacity: Math.sin(frame * 0.4) > 0 ? 1 : 0 }}>_</span>}
              </p>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// テーマ完成シーン - 実際のPreviewPanelを忠実に再現
const ThemeRevealScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // メインのスケールアニメーション（バウンス効果）
  const scaleProgress = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const scale = easeOutBack(scaleProgress);

  // 回転からのスライドイン
  const rotateY = interpolate(frame, [0, 25], [15, 0], { extrapolateRight: "clamp" });

  const opacity = interpolate(frame, [0, 10], [0, 1], {
    extrapolateRight: "clamp",
  });

  // シャドウのパルス効果
  const shadowSize = 25 + Math.sin(frame * 0.15) * 10;

  // サイバーパンク風のテーマカラー
  const themeColors = {
    editorBg: "#0a0a14",
    editorFg: "#e4e4e7",
    sidebarBg: "#08080e",
    activityBarBg: "#0a0a10",
    titleBarBg: "#06060a",
    statusBarBg: "#a78bfa",
    tabActiveBg: "#0a0a14",
    tabInactiveBg: "#06060a",
    lineHighlight: "#1a1a28",
    selection: "#a78bfa30",
    lineNumber: "#4a4a6a",
    lineNumberActive: "#e4e4e7",
  };

  return (
    <AbsoluteFill
      style={{
        backgroundColor: THEME.bg,
        justifyContent: "center",
        alignItems: "center",
        padding: 40,
      }}
    >
      <div
        style={{
          transform: `scale(${scale}) perspective(1000px) rotateY(${rotateY}deg)`,
          opacity,
          width: 1400,
          height: 800,
          display: "flex",
          flexDirection: "column",
          borderRadius: 16,
          overflow: "hidden",
          boxShadow: `0 ${shadowSize}px ${shadowSize * 3}px rgba(0,0,0,0.5), 0 0 ${shadowSize}px ${THEME.primary}20`,
          border: `1px solid ${THEME.primary}30`,
        }}
      >
        {/* タイトルバー */}
        <div
          style={{
            height: 32,
            background: themeColors.titleBarBg,
            display: "flex",
            alignItems: "center",
            padding: "0 12px",
            gap: 8,
          }}
        >
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#ff5f57" }} />
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#febc2e" }} />
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#28c840" }} />
          <span style={{ marginLeft: 16, color: "#71717a", fontSize: 13 }}>Themeleon — Cyberpunk Neon</span>
        </div>

        <div style={{ display: "flex", flex: 1 }}>
          {/* アクティビティバー */}
          <div
            style={{
              width: 48,
              background: themeColors.activityBarBg,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "12px 0",
              gap: 16,
            }}
          >
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 4,
                  background: i === 1 ? "#a78bfa" : "#3a3a5a",
                  opacity: i === 1 ? 1 : 0.5,
                }}
              />
            ))}
          </div>

          {/* サイドバー */}
          <div
            style={{
              width: 220,
              background: themeColors.sidebarBg,
              borderRight: "1px solid #1a1a28",
              padding: 8,
              fontSize: 13,
              color: "#a1a1aa",
            }}
          >
            <div style={{ padding: "4px 8px", fontSize: 11, color: "#71717a", textTransform: "uppercase" }}>
              Explorer
            </div>
            <div style={{ padding: "4px 8px", background: "#a78bfa20", borderRadius: 4, color: "#e4e4e7" }}>
              📁 src
            </div>
            <div style={{ padding: "4px 8px 4px 24px" }}>📄 App.tsx</div>
            <div style={{ padding: "4px 8px 4px 24px", color: "#00ffd5" }}>📄 theme.ts</div>
            <div style={{ padding: "4px 8px 4px 24px" }}>📄 index.css</div>
          </div>

          {/* メインエディタ */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            {/* タブバー */}
            <div
              style={{
                height: 36,
                background: themeColors.tabInactiveBg,
                display: "flex",
                alignItems: "center",
                borderBottom: "1px solid #1a1a28",
              }}
            >
              <div
                style={{
                  padding: "8px 16px",
                  background: themeColors.tabActiveBg,
                  color: "#e4e4e7",
                  fontSize: 13,
                  borderBottom: "2px solid #a78bfa",
                }}
              >
                theme.ts
              </div>
              <div style={{ padding: "8px 16px", color: "#71717a", fontSize: 13 }}>App.tsx</div>
            </div>

            {/* コードエリア */}
            <div
              style={{
                flex: 1,
                background: themeColors.editorBg,
                display: "flex",
                fontFamily: "'SF Mono', 'Fira Code', monospace",
                fontSize: 15,
                lineHeight: 1.6,
              }}
            >
              {/* 行番号 */}
              <div
                style={{
                  padding: "8px 12px",
                  textAlign: "right",
                  color: themeColors.lineNumber,
                  background: themeColors.editorBg,
                  userSelect: "none",
                }}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((n) => (
                  <div key={n} style={{ color: n === 5 ? themeColors.lineNumberActive : undefined }}>
                    {n}
                  </div>
                ))}
              </div>

              {/* コード */}
              <div style={{ flex: 1, padding: "8px 16px", color: themeColors.editorFg, position: "relative" }}>
                {/* 行ハイライト */}
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    top: `calc(8px + ${4 * 1.6}em)`,
                    height: "1.6em",
                    background: themeColors.lineHighlight,
                  }}
                />
                <pre style={{ margin: 0, position: "relative" }}>
                  <span style={{ color: "#6b7280" }}>{"// Generated by Themeleon AI\n"}</span>
                  <span style={{ color: "#ff6b9d" }}>export const</span>
                  <span style={{ color: "#e4e4e7" }}> </span>
                  <span style={{ color: "#fbbf24" }}>theme</span>
                  <span style={{ color: "#e4e4e7" }}> = {"{\n  "}</span>
                  <span style={{ color: "#00ffd5" }}>name</span>
                  <span style={{ color: "#e4e4e7" }}>: </span>
                  <span style={{ color: "#a5f3fc" }}>"Cyberpunk Neon"</span>
                  <span style={{ color: "#e4e4e7" }}>{",\n  "}</span>
                  <span style={{ color: "#00ffd5" }}>type</span>
                  <span style={{ color: "#e4e4e7" }}>: </span>
                  <span style={{ color: "#a5f3fc" }}>"dark"</span>
                  <span style={{ color: "#e4e4e7" }}>{",\n  "}</span>
                  <span style={{ color: "#00ffd5" }}>colors</span>
                  <span style={{ color: "#e4e4e7" }}>: {"{\n    "}</span>
                  <span style={{ color: "#a5f3fc" }}>"editor.background"</span>
                  <span style={{ color: "#e4e4e7" }}>: </span>
                  <span style={{ color: "#a5f3fc" }}>"#0a0a14"</span>
                  <span style={{ color: "#e4e4e7" }}>{",\n    "}</span>
                  <span style={{ color: "#a5f3fc" }}>"editor.foreground"</span>
                  <span style={{ color: "#e4e4e7" }}>: </span>
                  <span style={{ color: "#a5f3fc" }}>"#e4e4e7"</span>
                  <span style={{ color: "#e4e4e7" }}>{",\n    "}</span>
                  <span style={{ color: "#6b7280" }}>{"// ... 50+ more properties"}</span>
                  <span style={{ color: "#e4e4e7" }}>{"\n  },\n  "}</span>
                  <span style={{ color: "#00ffd5" }}>tokenColors</span>
                  <span style={{ color: "#e4e4e7" }}>: [</span>
                  <span style={{ color: "#6b7280" }}>{"/* syntax highlighting */"}</span>
                  <span style={{ color: "#e4e4e7" }}>{"]"}</span>
                  <span style={{ color: "#e4e4e7" }}>{"\n}"}</span>
                </pre>
              </div>
            </div>

            {/* ステータスバー */}
            <div
              style={{
                height: 24,
                background: themeColors.statusBarBg,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0 12px",
                fontSize: 12,
                color: "#fff",
              }}
            >
              <span>main</span>
              <span>TypeScript · UTF-8</span>
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ========================================
// CTAシーン（ベストプラクティス適用）
// ========================================
const CTAScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // スタガードアニメーション（要素が順番に登場）
  const titleProgress = interpolate(frame, [5, 25], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const titleScale = easeOutBack(titleProgress);
  const titleY = interpolate(easeOutCubic(titleProgress), [0, 1], [-60, 0]);

  const subProgress = interpolate(frame, [15, 35], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const subY = interpolate(easeOutCubic(subProgress), [0, 1], [40, 0]);

  const buttonProgress = interpolate(frame, [25, 50], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const buttonScale = easeOutBack(buttonProgress);

  // グロー効果（呼吸するような動き）
  const glow = 50 + Math.sin(frame * 0.12) * 30;
  const buttonPulse = 1 + Math.sin(frame * 0.15) * 0.04;

  // グラデーションのアニメーション
  const gradientAngle = 135 + Math.sin(frame * 0.05) * 15;

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div style={{ textAlign: "center" }}>
        {/* メインタイトル */}
        <h2
          style={{
            fontSize: 80,
            fontWeight: 800,
            color: THEME.text,
            transform: `scale(${titleScale}) translateY(${titleY}px)`,
            opacity: titleProgress,
            margin: 0,
            marginBottom: 28,
            textShadow: `0 0 60px ${THEME.primary}40`,
            fontFamily: "system-ui, -apple-system, sans-serif",
          }}
        >
          テキストで説明するだけ
        </h2>
        
        {/* サブタイトル */}
        <p
          style={{
            fontSize: 44,
            color: THEME.muted,
            margin: 0,
            marginBottom: 64,
            transform: `translateY(${subY}px)`,
            opacity: subProgress,
            fontFamily: "system-ui, -apple-system, sans-serif",
          }}
        >
          AIがあなただけのVS Codeテーマを生成
        </p>
        
        {/* CTAボタン */}
        <div
          style={{
            display: "inline-block",
            background: `linear-gradient(${gradientAngle}deg, ${THEME.primary}, ${THEME.secondary})`,
            padding: "28px 72px",
            borderRadius: 24,
            fontSize: 44,
            fontWeight: 700,
            color: "#fff",
            boxShadow: `0 0 ${glow}px ${THEME.primary}70, 0 12px 40px rgba(0,0,0,0.5)`,
            transform: `scale(${buttonScale * buttonPulse})`,
            opacity: buttonProgress,
            letterSpacing: 1,
          }}
        >
          theme-leon.com
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ========================================
// メインコンポジション（ベストプラクティス適用）
// ========================================
export const ThemeleonPromo: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: THEME.bg }}>
      {/* 背景アニメーション（常に表示） */}
      <AnimatedBackground />
      
      {/* ロゴ (0-90フレーム = 0-3秒) */}
      <Sequence from={0} durationInFrames={90}>
        <SceneTransition durationInFrames={90} fadeIn={12} fadeOut={12}>
          <LogoScene />
        </SceneTransition>
      </Sequence>

      {/* プロンプト入力 (90-180フレーム = 3-6秒) */}
      <Sequence from={90} durationInFrames={90}>
        <SceneTransition durationInFrames={90} fadeIn={12} fadeOut={12}>
          <PromptScene />
        </SceneTransition>
      </Sequence>

      {/* 生成中 (180-270フレーム = 6-9秒) */}
      <Sequence from={180} durationInFrames={90}>
        <SceneTransition durationInFrames={90} fadeIn={12} fadeOut={12}>
          <GeneratingScene />
        </SceneTransition>
      </Sequence>

      {/* テーマ完成 (270-360フレーム = 9-12秒) */}
      <Sequence from={270} durationInFrames={90}>
        <SceneTransition durationInFrames={90} fadeIn={12} fadeOut={12}>
          <ThemeRevealScene />
        </SceneTransition>
      </Sequence>

      {/* CTA (360-450フレーム = 12-15秒) */}
      <Sequence from={360} durationInFrames={90}>
        <SceneTransition durationInFrames={90} fadeIn={12} fadeOut={0}>
          <CTAScene />
        </SceneTransition>
      </Sequence>
    </AbsoluteFill>
  );
};
