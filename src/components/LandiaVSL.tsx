import { useEffect, useRef, useState } from "react";

const VSL_URL =
  "https://olkvsakych68inv8.public.blob.vercel-storage.com/VSL%20LAND-IA.mp4";

const VSL_EVENT_ENDPOINT = "https://metamove-capi.hebrithan.workers.dev";

const CHECKOUT_URL =
  "https://pay.hotmart.com/Y107168906J?checkoutMode=10&bid=1786752624031";

const VSL_TIME_STORAGE_KEY = "landia-vsl-current-time";
const VSL_RETURN_STORAGE_KEY = "landia-vsl-return-from-checkout";
const VSL_PLAY_TRACKED_KEY = "landia-vsl-play-tracked";

// A barra visual dispara no início e cruza 50% exatamente em 10s.
// A frenagem dura 6s no total, começando 5,5s antes dos 50% (4,5s)
// e terminando apenas 0,5s depois dos 50% (10,5s). Isso mantém a
// desaceleração longa e natural, sem freada brusca na metade.
// Depois disso segue em velocidade baixa e calculada para atingir 100%
// somente quando o vídeo realmente terminar.
const HALF_PROGRESS_TIME = 10;
const BRAKE_BEFORE_HALF = 5.5;
const BRAKE_AFTER_HALF = 0.5;
const BRAKE_START = HALF_PROGRESS_TIME - BRAKE_BEFORE_HALF;
const BRAKE_END = HALF_PROGRESS_TIME + BRAKE_AFTER_HALF;
const BRAKE_DURATION = BRAKE_BEFORE_HALF + BRAKE_AFTER_HALF;

type VslEventName =
  | "VSL_Play"
  | "VSL_25"
  | "VSL_50"
  | "VSL_75"
  | "VSL_Complete";

function getCookie(name: string) {
  return document.cookie
    .split("; ")
    .find((cookie) => cookie.startsWith(`${name}=`))
    ?.split("=")[1];
}

function sendVslEvent(eventName: VslEventName, progress: number) {
  try {
    const eventId = crypto.randomUUID();
    const fbp = getCookie("_fbp");
    const fbc = getCookie("_fbc");
    const customData = {
      content_name: "Land-IA VSL",
      content_type: "video",
      progress,
    };

    void fetch(VSL_EVENT_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      keepalive: true,
      body: JSON.stringify({
        event_name: eventName,
        event_time: Math.floor(Date.now() / 1000),
        event_id: eventId,
        event_source_url: window.location.href,
        user_agent: navigator.userAgent,
        fbp,
        fbc,
        custom_data: customData,
      }),
    }).catch((error) => {
      console.error(`Erro ao enviar ${eventName} via CAPI:`, error);
    });

    if (typeof window.fbq === "function") {
      window.fbq("trackCustom", eventName, customData, { eventID: eventId });
    }
  } catch (error) {
    console.error(`Erro ao rastrear ${eventName}:`, error);
  }
}

function sendCheckoutEvent() {
  try {
    const eventId = crypto.randomUUID();
    const fbp = getCookie("_fbp");
    const fbc = getCookie("_fbc");

    void fetch(VSL_EVENT_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      keepalive: true,
      body: JSON.stringify({
        event_name: "InitiateCheckout",
        event_time: Math.floor(Date.now() / 1000),
        event_id: eventId,
        event_source_url: window.location.href,
        user_agent: navigator.userAgent,
        fbp,
        fbc,
      }),
    }).catch((error) => {
      console.error("Erro ao enviar InitiateCheckout via CAPI:", error);
    });

    if (typeof window.fbq === "function") {
      window.fbq("track", "InitiateCheckout", {}, { eventID: eventId });
    }
  } catch (error) {
    console.error("Erro ao rastrear InitiateCheckout:", error);
  }
}

function getDisplayProgress(currentTime: number, duration: number) {
  if (!Number.isFinite(duration) || duration <= 0) return 0;

  const time = Math.min(Math.max(currentTime, 0), duration);

  // Proteção para vídeos muito curtos. A VSL real é muito maior que 10,5s.
  if (duration <= BRAKE_END + 0.1) {
    return (time / duration) * 100;
  }

  /*
   * A velocidade da barra é interpolada com smoothstep durante toda a
   * frenagem. Em vez de mudar a largura em etapas, integramos a velocidade,
   * mantendo o movimento contínuo e natural quadro a quadro.
   *
   * Resolvemos dinamicamente duas velocidades (rápida e lenta) para garantir:
   *   progress(10s) = 50%
   *   progress(duration) = 100%
   *
   * A frenagem começa em 2,5s e termina em 5,5s, portanto somente 0,5s dela
   * acontece depois de a barra cruzar os 50%.
   */
  const xHalf = (HALF_PROGRESS_TIME - BRAKE_START) / BRAKE_DURATION;
  const integralHalf = xHalf ** 3 - 0.5 * xHalf ** 4;

  // Coeficientes lineares da posição em 50% e no fim do vídeo.
  const halfFastCoefficient =
    HALF_PROGRESS_TIME - BRAKE_DURATION * integralHalf;
  const halfSlowCoefficient = BRAKE_DURATION * integralHalf;

  const endFastCoefficient = BRAKE_START + BRAKE_DURATION / 2;
  const endSlowCoefficient =
    duration - BRAKE_END + BRAKE_DURATION / 2;

  const determinant =
    halfFastCoefficient * endSlowCoefficient -
    halfSlowCoefficient * endFastCoefficient;

  const fastSpeed =
    (50 * endSlowCoefficient - 100 * halfSlowCoefficient) / determinant;
  const slowSpeed =
    (100 * halfFastCoefficient - 50 * endFastCoefficient) / determinant;

  if (time <= BRAKE_START) {
    return Math.min(100, fastSpeed * time);
  }

  const progressAtBrakeStart = fastSpeed * BRAKE_START;

  if (time < BRAKE_END) {
    const x = (time - BRAKE_START) / BRAKE_DURATION;

    // Integral do smoothstep (3x² - 2x³): x³ - 0,5x⁴.
    const integratedSmoothstep = x ** 3 - 0.5 * x ** 4;
    const transitionDistance =
      BRAKE_DURATION *
      (fastSpeed * x +
        (slowSpeed - fastSpeed) * integratedSmoothstep);

    return Math.min(100, progressAtBrakeStart + transitionDistance);
  }

  // Em x=1, a integral do smoothstep vale 0,5.
  const progressAtBrakeEnd =
    progressAtBrakeStart +
    BRAKE_DURATION * (fastSpeed + (slowSpeed - fastSpeed) * 0.5);

  return Math.min(
    100,
    progressAtBrakeEnd + slowSpeed * (time - BRAKE_END)
  );
}

export default function LandiaVSL() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const maxWatchedRef = useRef(0);
  const playTrackedRef = useRef(false);
  const sentMilestonesRef = useRef(new Set<number>());
  const progressBarRef = useRef<HTMLDivElement | null>(null);
  const pendingResumeTimeRef = useRef<number | null>(null);
  const shouldResumePlaybackRef = useRef(false);

  const [started, setStarted] = useState(false);
  const [paused, setPaused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ended, setEnded] = useState(false);
  const [showOfferCta, setShowOfferCta] = useState(false);

  // Persiste o ponto exato da VSL nesta aba. Isso permite voltar do checkout
  // e retomar do mesmo ponto sem reiniciar o vídeo.
  useEffect(() => {
    try {
      const saved = Number(window.sessionStorage.getItem(VSL_TIME_STORAGE_KEY));
      const returningFromCheckout =
        window.sessionStorage.getItem(VSL_RETURN_STORAGE_KEY) === "1";
      const playAlreadyTracked =
        window.sessionStorage.getItem(VSL_PLAY_TRACKED_KEY) === "1";

      if (playAlreadyTracked) {
        playTrackedRef.current = true;
      }

      if (Number.isFinite(saved) && saved > 0) {
        pendingResumeTimeRef.current = saved;
        maxWatchedRef.current = saved;
        setStarted(true);
        setLoading(true);
        setShowOfferCta(saved >= 225);

        for (const milestone of [25, 50, 75]) {
          // Os marcos já ultrapassados são marcados localmente para não
          // duplicar eventos quando a pessoa volta do checkout.
          const durationEstimate = 317.7;
          if ((saved / durationEstimate) * 100 >= milestone) {
            sentMilestonesRef.current.add(milestone);
          }
        }

        shouldResumePlaybackRef.current = returningFromCheckout;
      }
    } catch (error) {
      console.error("Não foi possível restaurar o progresso da VSL:", error);
    }
  }, []);

  // Se a página voltou do bfcache, o componente pode não ser remontado.
  // Neste caso, pageshow garante que a posição salva seja reaplicada.
  useEffect(() => {
    const handlePageShow = () => {
      try {
        if (window.sessionStorage.getItem(VSL_RETURN_STORAGE_KEY) !== "1") return;

        const saved = Number(window.sessionStorage.getItem(VSL_TIME_STORAGE_KEY));
        const video = videoRef.current;
        if (!video || !Number.isFinite(saved) || saved <= 0) return;

        pendingResumeTimeRef.current = saved;
        maxWatchedRef.current = Math.max(maxWatchedRef.current, saved);
        setStarted(true);
        setShowOfferCta(saved >= 225);
        shouldResumePlaybackRef.current = true;

        if (!video.src) {
          setLoading(true);
          video.src = VSL_URL;
          video.load();
          return;
        }

        video.currentTime = saved;
        void video.play().catch(() => {
          setPaused(true);
        });

        window.sessionStorage.removeItem(VSL_RETURN_STORAGE_KEY);
      } catch (error) {
        console.error("Não foi possível retomar a VSL ao voltar:", error);
      }
    };

    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
  }, []);

  // Se houver um ponto salvo e a página tiver sido remontada, inicializa a
  // mesma URL. O navegador/Vercel Blob continuam usando o cache HTTP normal;
  // não fazemos preload do arquivo inteiro para não prejudicar a landing.
  useEffect(() => {
    if (!started || pendingResumeTimeRef.current == null) return;

    const video = videoRef.current;
    if (!video || video.src) return;

    video.src = VSL_URL;
    video.load();
  }, [started]);

  function saveCurrentPosition(returningFromCheckout = false) {
    try {
      const video = videoRef.current;
      const currentTime = video?.currentTime ?? maxWatchedRef.current;

      if (Number.isFinite(currentTime) && currentTime > 0) {
        window.sessionStorage.setItem(
          VSL_TIME_STORAGE_KEY,
          String(currentTime)
        );
      }

      if (returningFromCheckout) {
        window.sessionStorage.setItem(VSL_RETURN_STORAGE_KEY, "1");
      }
    } catch (error) {
      console.error("Não foi possível salvar o progresso da VSL:", error);
    }
  }

  async function togglePlayback() {
    const video = videoRef.current;
    if (!video || ended) return;

    if (!started) {
      setStarted(true);
      setLoading(true);

      video.src = VSL_URL;
      video.load();

      try {
        await video.play();
      } catch (error) {
        setLoading(false);
        console.error("Não foi possível iniciar a VSL:", error);
      }
      return;
    }

    try {
      if (video.paused) {
        await video.play();
      } else {
        video.pause();
      }
    } catch (error) {
      console.error("Não foi possível alterar a reprodução da VSL:", error);
    }
  }

  function handleTimeUpdate() {
    const video = videoRef.current;
    if (!video || !Number.isFinite(video.duration) || video.duration <= 0) return;

    if (video.currentTime > maxWatchedRef.current) {
      maxWatchedRef.current = video.currentTime;
    }

    // Atualiza o ponto salvo enquanto a pessoa assiste. sessionStorage é local
    // à aba e não cria nenhuma requisição de rede.
    try {
      window.sessionStorage.setItem(
        VSL_TIME_STORAGE_KEY,
        String(video.currentTime)
      );
    } catch {
      // O vídeo continua normalmente mesmo se storage estiver indisponível.
    }

    const percentage = Math.min(100, (video.currentTime / video.duration) * 100);

    // 3min45s de reprodução real. Como usamos currentTime, pausas feitas
    // pelo usuário não contam para liberar o CTA.
    if (video.currentTime >= 225 && !showOfferCta) {
      setShowOfferCta(true);
    }

    for (const milestone of [25, 50, 75]) {
      if (percentage >= milestone && !sentMilestonesRef.current.has(milestone)) {
        sentMilestonesRef.current.add(milestone);
        sendVslEvent(`VSL_${milestone}` as VslEventName, milestone);
      }
    }
  }

  function handleSeeking() {
    const video = videoRef.current;
    if (!video) return;

    if (video.currentTime < maxWatchedRef.current - 0.35) {
      video.currentTime = maxWatchedRef.current;
    }
  }

  // Atualiza somente a largura da barra a cada frame de animação.
  // Não depende do evento timeupdate do <video>, que ocorre em intervalos
  // maiores e era justamente o que dava a sensação de movimento "sequenciado".
  useEffect(() => {
    if (!started || ended) return;

    let animationFrame = 0;

    const updateProgressBar = () => {
      const video = videoRef.current;
      const bar = progressBarRef.current;

      if (
        video &&
        bar &&
        Number.isFinite(video.duration) &&
        video.duration > 0
      ) {
        const visualProgress = getDisplayProgress(
          video.currentTime,
          video.duration
        );
        bar.style.width = `${Math.min(Math.max(visualProgress, 0), 100)}%`;
      }

      animationFrame = window.requestAnimationFrame(updateProgressBar);
    };

    animationFrame = window.requestAnimationFrame(updateProgressBar);

    return () => window.cancelAnimationFrame(animationFrame);
  }, [started, ended]);

  return (
    <section
      aria-label="Apresentação em vídeo do Land-IA"
      className="relative overflow-hidden bg-[var(--carbon)] pb-16 md:pb-24"
    >
      <style>{`
        @keyframes landia-vsl-poster-motion {
          0% { transform: scale(1.045) translate3d(-0.45%, 0%, 0); }
          45% { transform: scale(1.085) translate3d(0.55%, -0.35%, 0); }
          100% { transform: scale(1.055) translate3d(-0.15%, 0.45%, 0); }
        }

        @keyframes landia-vsl-progress-glow {
          0% { transform: translateX(-130%); }
          100% { transform: translateX(420%); }
        }

        @keyframes landia-vsl-play-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(199, 255, 61, 0.16), 0 16px 40px rgba(0,0,0,.38); }
          50% { box-shadow: 0 0 0 11px rgba(199, 255, 61, 0), 0 16px 40px rgba(0,0,0,.38); }
        }

        @media (prefers-reduced-motion: reduce) {
          .landia-vsl-poster-motion,
          .landia-vsl-play-pulse,
          .landia-vsl-progress-glow {
            animation: none !important;
          }
        }
      `}</style>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 md:px-10">
        <div
          className="relative mx-auto w-full max-w-5xl cursor-pointer overflow-hidden rounded-xl border border-white/10 bg-black shadow-[0_28px_90px_rgba(0,0,0,0.42)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--lime)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--carbon)]"
          style={{ aspectRatio: "2178 / 1080" }}
          role="button"
          tabIndex={0}
          aria-label={
            !started
              ? "Clique para assistir"
              : paused
                ? "Continuar vídeo"
                : "Pausar vídeo"
          }
          onClick={() => void togglePlayback()}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              void togglePlayback();
            }
          }}
        >
          {!started && (
            <div className="absolute inset-0">
              <img
                src="/vsl-poster.webp"
                alt=""
                loading="lazy"
                decoding="async"
                draggable={false}
                className="landia-vsl-poster-motion absolute inset-0 h-full w-full object-cover blur-[1px] brightness-[0.68]"
                style={{
                  animation:
                    "landia-vsl-poster-motion 9s ease-in-out infinite alternate",
                }}
              />

              <div
                className="pointer-events-none absolute inset-0 bg-black/30"
                style={{
                  backdropFilter: "blur(12px) saturate(0.72)",
                  WebkitBackdropFilter: "blur(12px) saturate(0.72)",
                }}
              />
              <div className="pointer-events-none absolute inset-0 bg-white/[0.035]" />
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(199,255,61,0.08),transparent_42%)]" />

              <div className="absolute inset-0 flex items-center justify-center px-4">
                <div
                  className="landia-vsl-play-pulse rounded-full border border-[var(--lime)]/35 bg-black/60 px-6 py-4 text-center font-display text-sm font-bold uppercase tracking-[0.08em] text-white backdrop-blur-md sm:px-8 sm:text-base md:text-lg"
                  style={{ animation: "landia-vsl-play-pulse 2.4s ease-in-out infinite" }}
                >
                  ▶ CLIQUE PARA ASSISTIR
                </div>
              </div>
            </div>
          )}

          <video
            ref={videoRef}
            preload="none"
            playsInline
            controls={false}
            disablePictureInPicture
            controlsList="nodownload noplaybackrate noremoteplayback"
            className={`pointer-events-none absolute inset-0 h-full w-full bg-black object-contain transition-opacity duration-300 ${
              started ? "opacity-100" : "opacity-0"
            }`}
            onTimeUpdate={handleTimeUpdate}
            onSeeking={handleSeeking}
            onPlaying={() => {
              setLoading(false);
              setPaused(false);
              if (!playTrackedRef.current) {
                playTrackedRef.current = true;
                try {
                  window.sessionStorage.setItem(VSL_PLAY_TRACKED_KEY, "1");
                } catch {
                  // Sem impacto na reprodução.
                }
                sendVslEvent("VSL_Play", 0);
              }
            }}
            onPause={() => {
              if (started && !ended) setPaused(true);
            }}
            onWaiting={() => setLoading(true)}
            onCanPlay={() => setLoading(false)}
            onLoadedMetadata={() => {
              const video = videoRef.current;
              const saved = pendingResumeTimeRef.current;
              if (!video || saved == null) return;

              const restoredTime = Math.min(
                saved,
                Math.max(0, video.duration - 0.1)
              );
              video.currentTime = restoredTime;
              maxWatchedRef.current = Math.max(
                maxWatchedRef.current,
                restoredTime
              );
              pendingResumeTimeRef.current = null;
              setLoading(false);

              if (shouldResumePlaybackRef.current) {
                shouldResumePlaybackRef.current = false;
                void video.play().catch(() => {
                  // Alguns navegadores bloqueiam autoplay com áudio após voltar.
                  // Nesse caso o vídeo permanece exatamente no ponto salvo e
                  // um toque continua a reprodução dali.
                  setPaused(true);
                });
              } else {
                setPaused(true);
              }

              try {
                window.sessionStorage.removeItem(VSL_RETURN_STORAGE_KEY);
              } catch {
                // Sem impacto na reprodução.
              }
            }}
            onEnded={() => {
              if (!sentMilestonesRef.current.has(100)) {
                sentMilestonesRef.current.add(100);
                sendVslEvent("VSL_Complete", 100);
              }
              if (progressBarRef.current) {
                progressBarRef.current.style.width = "100%";
              }
              setEnded(true);
              setPaused(false);
            }}
            onContextMenu={(event) => event.preventDefault()}
          />

          {started && loading && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/20">
              <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/25 border-t-[var(--lime)]" />
            </div>
          )}

          {started && paused && !loading && !ended && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/20">
              <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/15 bg-black/55 text-2xl text-white backdrop-blur-md">
                ▶
              </div>
            </div>
          )}

          {started && (
            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-[10px] overflow-hidden border-t border-white/20 bg-white/15 md:h-[12px]">
              <div
                ref={progressBarRef}
                className="relative h-full overflow-hidden bg-[var(--lime)]"
                style={{
                  width: "0%",
                  boxShadow: "0 0 14px rgba(199,255,61,0.85)",
                  willChange: "width",
                }}
              >
                <div
                  className="landia-vsl-progress-glow absolute inset-y-0 w-20 bg-gradient-to-r from-transparent via-white/75 to-transparent"
                  style={{ animation: "landia-vsl-progress-glow 1.8s linear infinite" }}
                />
              </div>
            </div>
          )}
        </div>

        {showOfferCta && (
          <div className="mt-6 flex justify-center px-2">
            <a
              href={CHECKOUT_URL}
              onClick={() => {
                // Congela exatamente o ponto do clique antes de sair para o
                // Hotmart e salva esse instante na sessão da aba.
                videoRef.current?.pause();
                saveCurrentPosition(true);
                sendCheckoutEvent();
              }}
              className="inline-flex w-full max-w-md items-center justify-center gap-2 rounded-full bg-[var(--action)] px-9 py-4 text-center text-base font-semibold uppercase tracking-[0.02em] text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[var(--action-hover)]"
              style={{ boxShadow: "var(--shadow-action)" }}
            >
              <span>QUERO CRIAR MINHA LANDING</span>
              <span aria-hidden="true" className="text-lg leading-none">→</span>
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
