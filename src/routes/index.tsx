import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useRef, useState } from "react";
import LandiaVSL from "@/components/LandiaVSL";

import {
  ArrowRight,
  ArrowUp,
  ArrowDown,
  Check,
  X,
  Lock,
  Layout,
  Terminal,
  Wand2,
  ListChecks,
  Globe,
  BookOpen,
  Gauge,
  Sparkles,
} from "lucide-react";
import { Reveal, RevealGroup, stepDelay, useRevealRef } from "@/components/Reveal";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

export const Route = createFileRoute("/")({
  component: Landing,
  head: () => ({
    meta: [
      {
        title: "Land-IA | Landing Pages com IA — Zero Programação",
      },

      {
        name: "description",
        content:
          "Crie uma landing profissional com ChatGPT + Lovable, publique no seu próprio domínio e deixe tudo pronto para vender — sem precisar saber programar.",
      },

      {
        name: "theme-color",
        content: "#0B0D10",
      },

      {
        property: "og:title",
        content: "Land-IA | Landing Pages com IA",
      },

      {
        property: "og:description",
        content:
          "Da estratégia ao seu próprio domínio: estruture a página no ChatGPT, construa com Lovable e publique sem precisar saber programar.",
      },

      {
        property: "og:type",
        content: "website",
      },

      {
        property: "og:url",
        content: "https://www.metamove.online/",
      },

      {
        property: "og:site_name",
        content: "Land-IA",
      },

      {
        property: "og:locale",
        content: "pt_BR",
      },

      {
        property: "og:image",
        content: "https://www.metamove.online/og-landia.webp",
      },

      {
        property: "og:image:secure_url",
        content: "https://www.metamove.online/og-landia.webp",
      },

      {
        property: "og:image:type",
        content: "image/webp",
      },

      {
        property: "og:image:width",
        content: "1200",
      },

      {
        property: "og:image:height",
        content: "630",
      },

      {
        property: "og:image:alt",
        content: "Land-IA — Landing Pages com IA",
      },

      {
        name: "twitter:card",
        content: "summary_large_image",
      },

      {
        name: "twitter:title",
        content: "Land-IA | Landing Pages com IA",
      },

      {
        name: "twitter:description",
        content:
          "Da estratégia ao seu próprio domínio: estruture a página no ChatGPT, construa com Lovable e publique sem precisar saber programar.",
      },

      {
        name: "twitter:image",
        content: "https://www.metamove.online/og-landia.webp",
      },

      {
        name: "twitter:image:alt",
        content: "Land-IA — Landing Pages com IA",
      },
    ],
    links: [
      { rel: "canonical", href: "https://www.metamove.online/" },
    ],
  }),
});


async function sendFacebookEvent(eventName: string) {
  try {
    const eventId = crypto.randomUUID();

    const fbp = document.cookie
      .split("; ")
      .find((c) => c.startsWith("_fbp="))
      ?.split("=")[1];

    const fbc = document.cookie
      .split("; ")
      .find((c) => c.startsWith("_fbc="))
      ?.split("=")[1];

    await fetch("https://metamove-capi.hebrithan.workers.dev", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        event_name: eventName,
        event_time: Math.floor(Date.now() / 1000),
        event_id: eventId,
        event_source_url: window.location.href,
        user_agent: navigator.userAgent,
        fbp,
        fbc,
      }),
    });

    if (typeof window.fbq === "function") {
      window.fbq("track", eventName, {}, { eventID: eventId });
    }
  } catch (error) {
    console.error("Erro ao enviar evento:", error);
  }
}

/* ---------- primitives ---------- */
function CTAButton({
  children,
  size = "lg",
  className = "",
  href = "https://pay.hotmart.com/Y107168906J?checkoutMode=10&bid=1786752624031",
}: {
  children: React.ReactNode;
  size?: "md" | "lg";
  className?: string;
  href?: string;
}) {
  const sizes = size === "lg" ? "h-15 px-9 py-4 text-base" : "h-11 px-6 text-sm";
  const isExternal = href.startsWith("http");
  const isCheckout = href.includes("hotmart.com");
  return (
    <a
      href={href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      onClick={(e) => {
        if (isCheckout) {
          sendFacebookEvent("InitiateCheckout");
          return;
        }
        // Âncoras internas: rola sem navegação de rota (evita remount da página)
        if (href.startsWith("#")) {
          const target = document.getElementById(href.slice(1));
          if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }
      }}
      className={`group inline-flex items-center justify-center gap-2 rounded-full bg-[var(--action)] text-center font-semibold uppercase tracking-[0.02em] text-white transition-all duration-300 hover:bg-[var(--action-hover)] hover:-translate-y-0.5 ${sizes} ${className}`}
      style={{ boxShadow: "var(--shadow-action)" }}
    >
      <span>{children}</span>
      <ArrowRight className="h-4 w-4 shrink-0 transition-transform duration-300 group-hover:translate-x-0.5" />
    </a>
  );
}

function CtaBlock({
  label = "QUERO CRIAR MINHA LANDING",
  tone = "light",
  className = "",
  href,
  note = "Acesso imediato • Treinamento direto ao ponto • R$ 47",
}: {
  label?: string;
  tone?: "light" | "dark";
  className?: string;
  href?: string;
  note?: string;
}) {
  return (
    <div className={`flex flex-col items-center gap-3 ${className}`}>
      <CTAButton href={href} className="w-full max-w-md sm:w-auto">
        {label}
      </CTAButton>

      <p
        className={`text-[13px] ${tone === "dark" ? "text-white/55" : "text-[var(--steel)]"}`}
      >
        {note}
      </p>
    </div>
  );
}

function Eyebrow({ children, tone = "dark" }: { children: React.ReactNode; tone?: "dark" | "light" }) {
  return (
    <span
      className={`inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.26em] ${
        tone === "dark" ? "text-[var(--steel)]" : "text-[var(--graphite)]/60"
      }`}
    >
      <span className="h-px w-6 bg-[var(--lime)]" />
      {children}
    </span>
  );
}

/** Destaque verde-elétrico para palavras-chave. */
function Mark({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-semibold text-[var(--lime)] [box-decoration-break:clone] [-webkit-box-decoration-break:clone]">
      {children}
    </span>
  );
}

/** Destaque para seções claras. */
function MarkDark({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-[4px] bg-[var(--carbon)] px-1.5 py-0.5 font-semibold text-[var(--lime)] [box-decoration-break:clone] [-webkit-box-decoration-break:clone]">
      {children}
    </span>
  );
}

const FAQSection = lazy(() => import("@/components/FAQSection"));

/**
 * Carrega o FAQ somente quando o visitante se aproxima do fim da oferta.
 * Isso tira o conteúdo/JS do FAQ do caminho inicial sem mudar a experiência
 * visual: com 1800px de margem, o chunk começa a baixar bem antes de aparecer.
 */
function DeferredFAQ() {
  const triggerRef = useRef<HTMLDivElement | null>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    if (shouldLoad) return;

    const trigger = triggerRef.current;
    if (!trigger || typeof IntersectionObserver === "undefined") {
      setShouldLoad(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: "1800px 0px" }
    );

    observer.observe(trigger);
    return () => observer.disconnect();
  }, [shouldLoad]);

  return (
    <div ref={triggerRef}>
      {shouldLoad ? (
        <Suspense fallback={null}>
          <FAQSection />
        </Suspense>
      ) : null}
    </div>
  );
}

/* ================================================== */
/*                  LANDING                            */
/* ================================================== */
let pageViewSent = false;
let timeOnPageSent = false;

function Landing() {
  useEffect(() => {
    if (!pageViewSent) {
      pageViewSent = true;
      sendFacebookEvent("PageView");
    }

    const timer = window.setTimeout(() => {
      if (timeOnPageSent) return;
      timeOnPageSent = true;
      sendFacebookEvent("TimeOnPage");
    }, 30000);

    return () => window.clearTimeout(timer);
  }, []);

  return (
    <main className="min-h-screen bg-[var(--carbon)] text-white antialiased">
      <OfferStrip />
      <Hero />
      <LandiaVSL />
      <BeliefBreak />
      <CreditsStrategy />
      <PrettyPageError />
      <Mechanism />
      <IdeaToDomain />
      <ProductSection />
      <Bonuses />
      <ValueStack />
      <CostCompare />
      <ForWhom />
      <Objections />
      <EmotionalBlock />
      <Offer />
      <DeferredFAQ />
      <FinalCTA />
      <Footer />
    </main>
  );
}

/* ---------- FAIXA SUPERIOR ---------- */
function OfferStrip() {
  return (
    <div className="relative z-40 bg-[var(--action)] text-white">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-center gap-x-3 gap-y-0.5 px-4 py-2.5 text-center sm:flex-row md:px-10">
        <p className="font-display text-[13px] font-bold uppercase leading-tight tracking-[0.06em] sm:text-sm">
          LAND-IA • Landing pages com IA por R$ 47
        </p>
        <span className="text-[12px] font-medium text-white/80">
          Acesso imediato • pagamento único
        </span>
      </div>
    </div>
  );
}

/* ---------- HERO ---------- */
const HERO_BLOCKS = ["PROMESSA", "PROVA", "MECANISMO", "OFERTA", "CTA"];

function BrowserMock() {
  return (
    <div
      className="relative mx-auto w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-[var(--graphite)]"
      style={{ boxShadow: "0 40px 80px -40px rgba(0,0,0,0.9)" }}
    >
      <div className="flex items-center gap-2 border-b border-white/8 bg-[var(--lead)] px-3 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        <div className="ml-2 flex h-6 flex-1 items-center gap-2 rounded-md bg-[var(--carbon)] px-2.5 text-[11px] text-[var(--steel)]">
          <Lock className="h-3 w-3 text-[var(--lime)]" />
          <span className="truncate">seudominio.com.br</span>
        </div>
      </div>

      <div className="space-y-2.5 p-4">
        {HERO_BLOCKS.map((b, i) => (
          <div
            key={b}
            data-enter=""
            style={stepDelay(i + 2)}
            className={`flex items-center justify-between rounded-lg border px-3 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] ${
              b === "CTA"
                ? "border-[var(--action)]/50 bg-[var(--action)]/12 text-[var(--action)]"
                : "border-white/8 bg-[var(--lead)] text-[var(--steel)]"
            }`}
          >
            <span>{b}</span>
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                b === "CTA" ? "bg-[var(--action)]" : "bg-[var(--lime)]"
              }`}
            />
          </div>
        ))}
        <div className="flex items-center gap-2 pt-1 text-[11px] text-[var(--steel)]">
          <span className="font-mono">construindo</span>
          <span className="caret-blink inline-block h-3.5 w-[7px] bg-[var(--lime)]" />
        </div>
      </div>
    </div>
  );
}

function Hero() {
  const ref = useRevealRef<HTMLDivElement>();
  return (
    <section className="relative isolate overflow-hidden bg-[var(--carbon)] pt-14 pb-16 text-white md:pt-20 md:pb-24">
      <div className="absolute inset-0 -z-10 grid-lines opacity-20" />
      <div className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-[var(--lime)]/8 blur-3xl" />

      <div
        ref={ref}
        className="mx-auto grid max-w-6xl items-center gap-12 px-6 md:grid-cols-[1.05fr_0.95fr] md:px-10"
      >
        <div className="text-center md:text-left">
          <div data-enter="">
            <span className="inline-flex items-center gap-2 rounded-full border border-[var(--lime)]/25 bg-[var(--lime)]/8 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--lime)]">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--lime)]" />
              LAND-IA • Landing pages com IA
            </span>
          </div>

          {/* Headline sem animação de entrada: pinta imediatamente (LCP).
              Mobile usa quebras controladas em 2 linhas por ideia para manter ritmo visual;
              a partir de sm volta às 3 linhas originais do desktop. */}
          <h1 className="mx-auto mt-7 max-w-[22rem] font-display text-[2.2rem] font-bold uppercase leading-[0.9] tracking-[-0.035em] sm:mx-0 sm:max-w-none sm:text-[2.85rem] sm:leading-[0.98] md:text-[3.35rem] lg:text-[3.7rem]">
            <span className="block text-[var(--ivory)]">
              <span className="block sm:inline">UMA LANDING</span>{" "}
              <span className="block sm:inline">VENCEDORA.</span>
            </span>

            <span className="mt-3 block text-[var(--lime)] sm:mt-2">
              <span className="block sm:inline">UM PROMPT</span>{" "}
              <span className="block sm:inline">MESTRE.</span>
            </span>

            <span className="mt-3 block text-[var(--ivory)] sm:mt-2">
              <span className="block sm:inline">ZERO</span>{" "}
              <span className="block sm:inline">PROGRAMAÇÃO.</span>
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-balance text-[17px] leading-relaxed text-white/75 md:mx-0 md:text-[19px]">
            Aprenda a transformar sua oferta em uma landing profissional usando ChatGPT + Lovable e
            publique tudo no seu próprio domínio — <strong className="font-semibold text-white">sem precisar saber programar</strong>.
          </p>

          <p className="mx-auto mt-3 flex max-w-xl items-center justify-center gap-2 text-[13px] font-medium text-white/60 md:mx-0 md:justify-start">
            <Check className="h-4 w-4 shrink-0 text-[var(--lime)]" strokeWidth={3} />
            Feito para aproveitar ao máximo as versões gratuitas das ferramentas.
          </p>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-x-2 gap-y-2 md:justify-start">
            {["ChatGPT", "Lovable", "GitHub", "Vercel", "Seu domínio"].map((t, i, arr) => (
              <span key={t} className="flex items-center gap-2">
                <span className="rounded-full border border-white/10 bg-[var(--lead)] px-3.5 py-1.5 text-[12px] font-medium text-[var(--steel)]">
                  {t}
                </span>
                {i < arr.length - 1 && <ArrowRight className="h-3 w-3 text-white/25" />}
              </span>
            ))}
          </div>

          <div className="mt-9 flex flex-col items-center gap-3 md:items-start">
            <CTAButton href="#oferta" className="w-full max-w-md sm:w-auto">
              Quero criar minha landing
            </CTAButton>
            <p className="text-[13px] text-[var(--steel)]">
              Acesso imediato • Treinamento direto ao ponto •{" "}
              <span className="font-semibold text-white">R$ 47</span>
            </p>
          </div>
        </div>

        <div data-enter="" style={stepDelay(1)}>
          <BrowserMock />
          <p className="mt-5 text-center text-[12px] uppercase tracking-[0.24em] text-[var(--steel)]">
            Arquitetura antes da IA
          </p>
        </div>
      </div>
    </section>
  );
}

/* ---------- QUEBRA DE CRENÇA ---------- */
function BeliefBreak() {
  return (
    <section className="border-y border-white/8 bg-[var(--graphite)] py-16 md:py-24">
      <div className="mx-auto max-w-4xl px-6 text-center md:px-10">
        <Reveal>
          <h2 className="font-display text-[1.7rem] font-bold uppercase leading-[1.1] tracking-tight text-white sm:text-4xl md:text-[2.9rem]">
            Pedir para a IA criar uma landing é fácil.
            <span className="mt-3 block text-[var(--lime)]">O difícil é saber o que pedir.</span>
          </h2>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="mx-auto mt-8 max-w-2xl text-[16px] leading-relaxed text-white/70 md:text-[18px]">
            Quando você entrega toda a estratégia para a ferramenta, recebe uma página baseada no que
            a IA <em>acha</em> que deveria funcionar. O Land-IA muda a ordem.
          </p>
        </Reveal>

        <Reveal delay={0.16}>
          <p className="mt-8 inline-block rounded-xl border border-[var(--lime)]/25 bg-[var(--lime)]/8 px-6 py-4 font-display text-[1.05rem] font-semibold text-white md:text-[1.25rem]">
            Você define a <Mark>arquitetura</Mark>. A IA <Mark>executa</Mark>.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- MENOS CRÉDITOS DESPERDIÇADOS ---------- */
const COMMON_CREDIT_FLOW = [
  "Prompt",
  "Corrigir copy",
  "Corrigir design",
  "Corrigir mobile",
  "Corrigir CTA",
  "Tentar de novo",
];

const MASTER_PROMPT_INPUTS = [
  "Oferta",
  "Persona",
  "Mecanismo",
  "Copy",
  "Estrutura",
  "Direção visual",
];

function CreditsStrategy() {
  return (
    <section className="relative isolate overflow-hidden bg-[var(--carbon)] py-20 text-white md:py-28">
      <div className="absolute inset-0 -z-10 grid-lines opacity-10" />
      <div className="pointer-events-none absolute left-1/2 top-1/3 -z-10 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-[var(--lime)]/5 blur-3xl" />

      <div className="mx-auto max-w-5xl px-6 md:px-10">
        <Reveal className="text-center">
          <Eyebrow>Eficiência desde o primeiro prompt</Eyebrow>
          <h2 className="mt-5 font-display text-[1.8rem] font-bold uppercase leading-[1.08] tracking-tight text-white md:text-[2.8rem]">
            Mais estratégia.
            <span className="mt-2 block text-[var(--lime)]">Menos créditos desperdiçados.</span>
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-[16px] leading-relaxed text-white/70 md:text-[18px]">
            O jeito mais caro de usar IA é começar a construir antes de saber exatamente o que você quer construir.
          </p>
        </Reveal>

        <RevealGroup className="mt-12 grid gap-6 md:grid-cols-2">
          <div
            data-reveal=""
            className="rounded-2xl border border-white/8 bg-[var(--graphite)] p-6 md:p-7"
          >
            <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--steel)]">
              Jeito comum
            </span>
            <div className="mt-6 space-y-2">
              {COMMON_CREDIT_FLOW.map((item, i) => (
                <div key={item}>
                  <div className="rounded-lg border border-white/8 bg-[var(--lead)] px-4 py-3 font-display text-[12px] font-semibold uppercase tracking-[0.12em] text-white/70">
                    {item}
                  </div>
                  {i < COMMON_CREDIT_FLOW.length - 1 && (
                    <div className="flex justify-center py-1">
                      <ArrowDown className="h-4 w-4 text-[var(--action)]/70" />
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-xl border border-[var(--action)]/30 bg-[var(--action)]/10 px-4 py-3 text-center font-display text-[13px] font-bold uppercase tracking-[0.14em] text-[var(--action)]">
              Mais retrabalho. Mais créditos.
            </div>
          </div>

          <div
            data-reveal=""
            style={stepDelay(1)}
            className="rounded-2xl border border-[var(--lime)]/25 bg-[var(--graphite)] p-6 md:p-7"
          >
            <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--lime)]">
              Método Land-IA
            </span>

            <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {MASTER_PROMPT_INPUTS.map((item) => (
                <div
                  key={item}
                  className="rounded-lg border border-white/8 bg-[var(--lead)] px-3 py-3 text-center font-display text-[11px] font-semibold uppercase tracking-[0.1em] text-white/75"
                >
                  {item}
                </div>
              ))}
            </div>

            <div className="flex justify-center py-3">
              <ArrowDown className="h-5 w-5 text-[var(--lime)]" />
            </div>

            <div className="rounded-xl border border-[var(--lime)]/35 bg-[var(--lime)]/10 px-5 py-5 text-center">
              <span className="block text-[10px] font-semibold uppercase tracking-[0.22em] text-white/50">
                Tudo converge para
              </span>
              <span className="mt-2 block font-display text-[1.35rem] font-bold uppercase tracking-tight text-[var(--lime)]">
                Prompt Mestre
              </span>
            </div>

            <div className="flex justify-center py-3">
              <ArrowDown className="h-5 w-5 text-[var(--lime)]" />
            </div>

            <div className="grid grid-cols-3 items-center gap-2 text-center font-display text-[11px] font-semibold uppercase tracking-[0.1em]">
              <span className="rounded-lg bg-[var(--lead)] px-2 py-3 text-white/75">Lovable</span>
              <ArrowRight className="mx-auto h-4 w-4 text-[var(--lime)]" />
              <span className="rounded-lg bg-[var(--lead)] px-2 py-3 text-white">Landing</span>
            </div>

            <p className="mt-5 text-center text-[13px] leading-relaxed text-white/55">
              Ajustes pontuais ficam para depois — sem mandar a IA reconstruir o que já ficou bom.
            </p>
          </div>
        </RevealGroup>

        <Reveal delay={0.1} className="mt-12 text-center">
          <p className="mx-auto max-w-2xl text-[16px] leading-relaxed text-white/70">
            No Land-IA, você não abre o Lovable para descobrir o que quer. Você abre o Lovable depois que já decidiu o que ele deve construir.
          </p>
          <h3 className="mt-8 font-display text-[1.45rem] font-bold uppercase leading-[1.08] tracking-tight text-white md:text-[2rem]">
            O objetivo não é ter mais créditos.
            <span className="mt-2 block text-[var(--lime)]">É precisar de menos.</span>
          </h3>
        </Reveal>

        <Reveal delay={0.14} className="mt-12 rounded-2xl border border-white/10 bg-[var(--graphite)] p-6 md:p-8">
          <div className="grid gap-7 md:grid-cols-[0.9fr_1.1fr] md:items-center">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--lime)]">
                Pensado para começar sem mensalidades
              </span>
              <h3 className="mt-3 font-display text-[1.3rem] font-bold uppercase leading-tight text-white md:text-[1.6rem]">
                Você investe primeiro em direção. Sem pagar 1 real com IA.
              </h3>
              <p className="mt-4 text-[14px] leading-relaxed text-white/65">
                A proposta é aproveitar as opções gratuitas do ChatGPT, Lovable, GitHub e Vercel para construir e publicar sua landing, usando seu próprio domínio.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 md:justify-end">
              {["ChatGPT", "Lovable", "GitHub", "Vercel", "Seu domínio"].map((tool, i, arr) => (
                <span key={tool} className="flex items-center gap-2">
                  <span className="rounded-full border border-white/10 bg-[var(--lead)] px-3 py-2 text-[11px] font-semibold text-white/70">
                    {tool}
                  </span>
                  {i < arr.length - 1 && <ArrowRight className="h-3.5 w-3.5 text-[var(--steel)]" />}
                </span>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- O ERRO DA LANDING BONITA ---------- */
function PrettyPageError() {
  return (
    <section className="bg-[var(--ivory)] py-20 text-[var(--graphite)] md:py-28">
      <div className="mx-auto max-w-5xl px-6 md:px-10">
        <Reveal className="text-center">
          <Eyebrow tone="light">O erro mais comum</Eyebrow>
          <h2 className="mt-5 text-balance font-display text-[1.8rem] font-bold uppercase leading-[1.1] tracking-tight md:text-[2.6rem]">
            A landing bonita que não leva a lugar nenhum
          </h2>
        </Reveal>

        <RevealGroup className="mt-12 grid gap-5 md:grid-cols-2">
          <div
            data-reveal=""
            className="rounded-2xl border border-[var(--graphite)]/10 bg-white p-7"
          >
            <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--steel)]">
              IA sem estratégia
            </span>
            <p className="mt-4 rounded-lg bg-[var(--ivory)] px-4 py-3 font-mono text-[13px] text-[var(--graphite)]/80">
              “Faça uma landing page moderna para o meu produto.”
            </p>
            <ul className="mt-6 space-y-3">
              {[
                "Bonita — e genérica",
                "Seções aleatórias, sem ordem lógica",
                "Copy superficial",
                "CTA sem contexto",
                "Retrabalho infinito",
              ].map((t) => (
                <li key={t} className="flex items-start gap-3 text-[15px]">
                  <X className="mt-0.5 h-4 w-4 shrink-0 text-[var(--action)]" strokeWidth={3} />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>

          <div
            data-reveal=""
            style={stepDelay(1)}
            className="rounded-2xl border border-[var(--carbon)] bg-[var(--carbon)] p-7 text-white"
          >
            <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--lime)]">
              Land-IA
            </span>
            <p className="mt-4 text-[15px] leading-relaxed text-white/70">
              Primeiro você define: oferta, persona, promessa, mecanismo, objeções, prova e decisão. Tudo no GPT com os Prompts certos.
              <span className="mt-2 block font-semibold text-white">E ele te devolve um único prompt extenso, completo e detalhado para você usar no Lovable e ter um resultado quase final já de cara.</span>
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em]">
              {["Estratégia", "Prompt", "Construção"].map((s, i) => (
                <span key={s} className="flex items-center gap-2">
                  <span className="rounded-md bg-[var(--lead)] px-3 py-2 text-[var(--lime)]">{s}</span>
                  {i < 2 && <ArrowRight className="h-3.5 w-3.5 text-[var(--steel)]" />}
                </span>
              ))}
            </div>
          </div>
        </RevealGroup>

        <Reveal delay={0.1}>
          <p className="mx-auto mt-12 max-w-2xl text-center font-display text-[1.1rem] font-semibold leading-snug md:text-[1.35rem]">
            A IA não substitui a estratégia. Ela{" "}
            <MarkDark>multiplica a velocidade de execução</MarkDark>.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- MECANISMO ÚNICO ---------- */
const CHAIN = ["PROMESSA", "MECANISMO", "PROVA", "OFERTA", "SEGURANÇA", "DECISÃO"];

function Mechanism() {
  const reverse = [...CHAIN].reverse();
  return (
    <section className="relative isolate overflow-hidden bg-[var(--carbon)] py-20 md:py-28">
      <div className="absolute inset-0 -z-10 grid-lines opacity-15" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[560px] w-[860px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--lime)]/6 blur-3xl" />

      <div className="mx-auto max-w-5xl px-6 md:px-10">
        <Reveal className="text-center">
          <Eyebrow>Mecanismo único</Eyebrow>
          <h2 className="mt-5 text-balance font-display text-[1.9rem] font-bold uppercase leading-[1.06] tracking-tight text-white md:text-[3rem]">
            Engenharia Reversa da <span className="text-[var(--lime)]">Conversão</span>™
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-[16px] leading-relaxed text-white/70 md:text-[18px]">
            Em vez de começar pela primeira dobra da página, começamos pela{" "}
            <Mark>última decisão do visitante</Mark>.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          <Reveal className="rounded-2xl border border-[var(--lime)]/20 bg-[var(--graphite)] p-6 md:p-8">
            <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--lime)]">
              Como pensamos
            </div>
            <div className="mt-6 space-y-2">
              {reverse.map((s, i) => (
                <div key={s}>
                  <div className="flex items-center gap-3 rounded-lg border border-white/8 bg-[var(--lead)] px-4 py-3">
                    <span className="font-mono text-[11px] text-[var(--steel)]">
                      {String(reverse.length - i).padStart(2, "0")}
                    </span>
                    <span className="font-display text-[13px] font-semibold uppercase tracking-[0.14em] text-white">
                      {s}
                    </span>
                  </div>
                  {i < reverse.length - 1 && (
                    <div className="flex justify-center py-1">
                      <ArrowUp className="h-4 w-4 text-[var(--lime)]" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.1} className="rounded-2xl border border-white/10 bg-[var(--graphite)] p-6 md:p-8">
            <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--steel)]">
              Como o visitante percorre
            </div>
            <div className="mt-6 space-y-2">
              {CHAIN.map((s, i) => (
                <div key={s}>
                  <div
                    className={`flex items-center gap-3 rounded-lg border px-4 py-3 ${
                      s === "DECISÃO"
                        ? "border-[var(--action)]/50 bg-[var(--action)]/12"
                        : "border-white/8 bg-[var(--lead)]"
                    }`}
                  >
                    <span className="font-mono text-[11px] text-[var(--steel)]">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={`font-display text-[13px] font-semibold uppercase tracking-[0.14em] ${
                        s === "DECISÃO" ? "text-[var(--action)]" : "text-white"
                      }`}
                    >
                      {s}
                    </span>
                  </div>
                  {i < CHAIN.length - 1 && (
                    <div className="flex justify-center py-1">
                      <ArrowDown className="h-4 w-4 text-[var(--steel)]" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.12} className="mt-14 text-center">
          <h3 className="font-display text-[1.5rem] font-bold uppercase leading-tight tracking-tight text-white md:text-[2.1rem]">
            Primeiro a arquitetura.
            <span className="block text-[var(--lime)]">Depois a IA.</span>
          </h3>
          <p className="mx-auto mt-6 max-w-2xl text-[16px] leading-relaxed text-white/70">
            Você pergunta o que o visitante precisa entender ou acreditar imediatamente antes de agir.
            Depois pergunta o que precisa acontecer antes disso. E antes. Até chegar na primeira linha
            da página.
          </p>
          <p className="mx-auto mt-5 max-w-2xl font-display text-[1.05rem] font-semibold text-white md:text-[1.2rem]">
            “Comece pela decisão. Construa o caminho de volta. Deixe a IA executar.”
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- DA IDEIA AO DOMÍNIO ---------- */
const STAGES = [
  {
    icon: Layout,
    title: "Estruturar",
    text: "Transformar produto, serviço ou oferta em uma arquitetura clara de landing.",
  },
  {
    icon: Terminal,
    title: "Promptar",
    text: "Transformar essa arquitetura em instruções que a IA realmente entende.",
  },
  {
    icon: Wand2,
    title: "Construir",
    text: "Executar no Lovable e ver a página nascer bloco a bloco.",
  },
  {
    icon: ListChecks,
    title: "Refinar",
    text: "Corrigir pontos específicos sem destruir o que já ficou bom.",
  },
  {
    icon: Globe,
    title: "Publicar",
    text: "GitHub → Vercel → domínio próprio.",
  },
];

function IdeaToDomain() {
  return (
    <section className="bg-[var(--ivory)] py-20 text-[var(--graphite)] md:py-28">
      <div className="mx-auto max-w-5xl px-6 md:px-10">
        <Reveal className="text-center">
          <Eyebrow tone="light">O caminho</Eyebrow>
          <h2 className="mt-5 font-display text-[1.9rem] font-bold uppercase leading-[1.08] tracking-tight md:text-[2.8rem]">
            Da ideia ao <MarkDark>domínio</MarkDark>.
          </h2>
        </Reveal>

        <RevealGroup className="mt-12 space-y-4">
          {STAGES.map((s, i) => (
            <div
              key={s.title}
              data-reveal=""
              style={stepDelay(i)}
              className="flex items-start gap-4 rounded-2xl border border-[var(--graphite)]/10 bg-white p-5 md:gap-6 md:p-7"
            >
              <div className="flex shrink-0 flex-col items-center gap-2">
                <span className="font-display text-[1.5rem] font-bold leading-none text-[var(--graphite)]/25 md:text-[2rem]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <s.icon className="h-5 w-5 text-[var(--action)]" />
              </div>
              <div>
                <h3 className="font-display text-[1.05rem] font-bold uppercase tracking-[0.06em] md:text-[1.2rem]">
                  {s.title}
                </h3>
                <p className="mt-1.5 text-[15px] leading-relaxed text-[var(--graphite)]/75">
                  {s.text}
                </p>
              </div>
            </div>
          ))}
        </RevealGroup>

        <Reveal delay={0.1}>
          <p className="mx-auto mt-12 max-w-2xl text-center font-display text-[1.15rem] font-semibold leading-snug md:text-[1.4rem]">
            Você não termina com teoria. Termina sabendo{" "}
            <MarkDark>repetir o processo</MarkDark>.
          </p>
        </Reveal>

        <CtaBlock href="#oferta" className="mt-10" label="Quero aprender o processo" />
      </div>
    </section>
  );
}

/* ---------- PRODUTO ---------- */
const LESSONS = [
  ["Antes de abrir a IA", "Por que páginas bonitas não são necessariamente páginas estrategicamente construídas."],
  ["Engenharia Reversa da Conversão", "Construa a jornada começando pela decisão final."],
  ["O Prompt Mestre", "Transforme a arquitetura em uma instrução completa."],
  ["Construindo com IA", "Transforme o Prompt Mestre em uma landing real no Lovable e aprenda a fazer ajustes pontuais sem reconstruir o que já ficou bom."],
  ["De bonita para pronta", "Auditoria, ajustes e correções cirúrgicas."],
  ["Checkout e últimos ajustes", "Links, CTA, mobile e revisão final."],
  ["Seu próprio domínio", "Lovable → GitHub → Vercel → DNS → domínio."],
];

function ProductSection() {
  return (
    <section className="bg-[var(--carbon)] py-20 md:py-28">
      <div className="mx-auto max-w-5xl px-6 md:px-10">
        <Reveal className="text-center">
          <Eyebrow>O produto</Eyebrow>
          <h2 className="mt-5 font-display text-[1.9rem] font-bold uppercase leading-[1.08] tracking-tight text-white md:text-[2.8rem]">
            LAND-IA <span className="text-[var(--lime)]">Implementação guiada</span>
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-[16px] leading-relaxed text-white/70">
            Vídeo-aulas rápidas, práticas e sem enrolação. Gravação de tela, execução real, do
            planejamento à publicação.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-8 md:grid-cols-[0.9fr_1.1fr] md:items-start">
          <Reveal>
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-[var(--graphite)]">
              <div className="flex items-center gap-2 border-b border-white/8 bg-[var(--lead)] px-3 py-2.5 text-[11px] text-[var(--steel)]">
                <Sparkles className="h-3.5 w-3.5 text-[var(--lime)]" />
                Área de implementação
              </div>
              <div className="space-y-3 p-4">
                <div className="aspect-video rounded-lg border border-white/8 bg-[var(--carbon)] p-4">
                  <div className="h-2 w-1/3 rounded bg-[var(--lime)]/70" />
                  <div className="mt-3 h-2 w-3/4 rounded bg-white/10" />
                  <div className="mt-2 h-2 w-2/3 rounded bg-white/10" />
                  <div className="mt-6 h-7 w-32 rounded-full bg-[var(--action)]/80" />
                </div>
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 rounded-lg border border-white/8 bg-[var(--lead)] px-3 py-2.5"
                  >
                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[var(--lime)]/15 font-mono text-[10px] text-[var(--lime)]">
                      ▶
                    </span>
                    <span className="h-2 flex-1 rounded bg-white/10" />
                  </div>
                ))}
              </div>
            </div>
            <p className="mt-4 text-center text-[12px] uppercase tracking-[0.22em] text-[var(--steel)]">
              Abra. Assista. Execute.
            </p>
          </Reveal>

          <RevealGroup className="space-y-3">
            {LESSONS.map(([title, text], i) => (
              <div
                key={title}
                data-reveal=""
                style={stepDelay(i)}
                className="flex gap-4 rounded-xl border border-white/8 bg-[var(--graphite)] p-4 md:p-5"
              >
                <span className="font-mono text-[12px] text-[var(--lime)]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="font-display text-[15px] font-semibold text-white">{title}</h3>
                  <p className="mt-1 text-[14px] leading-relaxed text-white/60">{text}</p>
                </div>
              </div>
            ))}
          </RevealGroup>
        </div>

        <Reveal delay={0.1}>
          <p className="mx-auto mt-12 max-w-2xl text-center font-display text-[1.05rem] font-semibold uppercase leading-snug tracking-[0.04em] text-white md:text-[1.25rem]">
            Sem aula de 40 minutos explicando o que é uma landing.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- BÔNUS ---------- */
function Bonuses() {
  return (
    <section className="bg-[var(--ivory)] py-20 text-[var(--graphite)] md:py-28">
      <div className="mx-auto max-w-5xl px-6 md:px-10">
        <Reveal className="text-center">
          <Eyebrow tone="light">Bônus inclusos</Eyebrow>
          <h2 className="mt-5 font-display text-[1.8rem] font-bold uppercase leading-[1.08] tracking-tight md:text-[2.6rem]">
            Dois materiais que resolvem o que vem depois
          </h2>
        </Reveal>

        <RevealGroup className="mt-12 grid gap-6 md:grid-cols-2">
          {/* Bônus 1 */}
          <div
            data-reveal=""
            className="rounded-2xl border border-[var(--graphite)]/10 bg-white p-7"
          >
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-[var(--carbon)]">
                <BookOpen className="h-5 w-5 text-[var(--lime)]" />
              </span>
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--steel)]">
                  Bônus 01 • PDF
                </span>
                <h3 className="font-display text-[1.15rem] font-bold uppercase">Biblioteca Land-IA</h3>
              </div>
            </div>

            <p className="mt-5 font-display text-[1.05rem] font-semibold">
              Não comece cada página do zero.
            </p>
            <p className="mt-3 text-[15px] leading-relaxed text-[var(--graphite)]/75">
              Biblioteca operacional com prompts para persona, oferta, mecanismo, hero, provas,
              objeções, FAQ, CTA, auditoria, mobile, CRO, Lovable, correção cirúrgica e
              testes A/B.
            </p>

            <div className="mt-6 rounded-xl border border-[var(--action)]/30 bg-[var(--action)]/8 p-4">
              <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--action)]">
                Prompt Mestre Land-IA
              </span>
              <p className="mt-2 text-[14px] font-semibold text-[var(--graphite)]">
                Um briefing inteiro em um único sistema.
              </p>
              <p className="mt-2 text-[14px] leading-relaxed text-[var(--graphite)]/80">
                Oferta, persona, promessa, mecanismo, arquitetura, copy, design, mobile, CTA e restrições
                técnicas entram antes da construção — para reduzir retrabalho depois.
              </p>
              <div className="mt-4 border-t border-[var(--action)]/20 pt-4">
                <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--action)]">
                  + Prompts cirúrgicos
                </span>
                <p className="mt-1.5 text-[13px] leading-relaxed text-[var(--graphite)]/75">
                  Quando algo precisar de ajuste, altere só o necessário e preserve o que já funciona.
                </p>
              </div>
            </div>
          </div>

          {/* Bônus 2 */}
          <div
            data-reveal=""
            style={stepDelay(1)}
            className="rounded-2xl border border-[var(--carbon)] bg-[var(--carbon)] p-7 text-white"
          >
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-[var(--lead)]">
                <Gauge className="h-5 w-5 text-[var(--lime)]" />
              </span>
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--steel)]">
                  Bônus 02 • E-book
                </span>
                <h3 className="font-display text-[1.15rem] font-bold uppercase">Landing Invisível</h3>
              </div>
            </div>

            <p className="mt-5 font-display text-[1.02rem] font-semibold leading-snug">
              A parte da landing que o cliente não vê — mas o navegador, o pixel e o Google veem.
            </p>
            <p className="mt-3 text-[15px] leading-relaxed text-white/70">
              Performance, WebP/AVIF, LCP, CLS, lazy loading, tracking, Pixel, CAPI, event_id,
              deduplicação, metadata, domínio, debugging, Vercel, segurança e troubleshooting.
            </p>

            <div className="mt-6 rounded-xl border border-[var(--lime)]/25 bg-[var(--lime)]/8 p-4 text-[14px] leading-relaxed text-white/80">
              Criar a página é uma parte do trabalho. Mantê-la rápida, rastreável e tecnicamente
              saudável é outra.{" "}
              <span className="font-semibold text-[var(--lime)]">
                Este bônus transforma construção em operação, sem nenhum custo.
              </span>
            </div>
          </div>
        </RevealGroup>
      </div>
    </section>
  );
}

/* ---------- VALUE STACK ---------- */
const STACK = [
  {
    name: "LAND-IA",
    desc: "Treinamento prático. Da estratégia à landing publicada.",
    ref: "R$ 147",
  },
  {
    name: "Biblioteca Land-IA",
    desc: "Prompts, templates e estruturas prontas para reutilizar.",
    ref: "R$ 97",
  },
  {
    name: "Landing Invisível",
    desc: "Performance, tracking e infraestrutura.",
    ref: "R$ 97",
  },
];

function ValueStack() {
  return (
    <section className="bg-[var(--carbon)] py-20 md:py-28">
      <div className="mx-auto max-w-5xl px-6 md:px-10">
        <Reveal className="text-center">
          <Eyebrow>Composição da oferta</Eyebrow>
          <h2 className="mt-5 text-balance font-display text-[1.8rem] font-bold uppercase leading-[1.08] tracking-tight text-white md:text-[2.6rem]">
            Você não está comprando “um curso de Lovable”.
          </h2>
          <p className="mt-5 text-[17px] text-white/70">Você está levando o processo inteiro.</p>
        </Reveal>

        <RevealGroup className="mt-12 grid gap-5 md:grid-cols-3">
          {STACK.map((s, i) => (
            <div
              key={s.name}
              data-reveal=""
              style={stepDelay(i)}
              className="flex flex-col rounded-2xl border border-white/8 bg-[var(--graphite)] p-6"
            >
              <h3 className="font-display text-[1.05rem] font-bold uppercase tracking-[0.04em] text-white">
                {s.name}
              </h3>
              <p className="mt-3 flex-1 text-[15px] leading-relaxed text-white/65">{s.desc}</p>
              <div className="mt-6 border-t border-white/8 pt-4">
                <span className="text-[11px] uppercase tracking-[0.18em] text-[var(--steel)]">
                  Valor de referência
                </span>
                <p className="font-display text-[1.3rem] font-semibold text-white">{s.ref}</p>
              </div>
            </div>
          ))}
        </RevealGroup>

        <Reveal delay={0.1} className="mt-12 text-center">
          <p className="text-[15px] text-[var(--steel)]">
            Valor do pacote:{" "}
            <span className="text-lg text-white/70 line-through">R$ 341</span>
          </p>
          <p className="mt-3 font-display text-[2.2rem] font-bold uppercase tracking-tight text-white md:text-[3rem]">
            Hoje: <span className="text-[var(--action)]">R$ 47</span>
          </p>
          <CtaBlock
            href="#oferta"
            className="mt-8"
            label="Quero o Land-IA por R$ 47"
            tone="dark"
            note="Acesso imediato aos materiais após a compra."
          />
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- COMPARAÇÃO DE CUSTO ---------- */
const WAYS = [
  {
    title: "Fazer tudo sozinho",
    items: ["Pesquisar", "Testar", "Errar", "Refazer", "Descobrir infraestrutura"],
    result: "Tempo alto.",
  },
  {
    title: "Contratar",
    items: ["Designer", "Copywriter", "Desenvolvedor", "Manutenção"],
    result: "Custo maior e dependência de terceiros.",
  },
  {
    title: "Land-IA",
    items: ["Processo repetível", "IA como executora", "Publicação no seu domínio"],
    result: "Autonomia.",
    highlight: true,
  },
];

function CostCompare() {
  return (
    <section className="bg-[var(--ivory)] py-20 text-[var(--graphite)] md:py-28">
      <div className="mx-auto max-w-5xl px-6 md:px-10">
        <Reveal className="text-center">
          <Eyebrow tone="light">Comparação lógica</Eyebrow>
          <h2 className="mt-5 font-display text-[1.8rem] font-bold uppercase leading-[1.08] tracking-tight md:text-[2.5rem]">
            Existem três formas de ter uma landing.
          </h2>
        </Reveal>

        <RevealGroup className="mt-12 grid gap-5 md:grid-cols-3">
          {WAYS.map((w, i) => (
            <div
              key={w.title}
              data-reveal=""
              style={stepDelay(i)}
              className={`flex flex-col rounded-2xl p-6 ${
                w.highlight
                  ? "border border-[var(--carbon)] bg-[var(--carbon)] text-white"
                  : "border border-[var(--graphite)]/10 bg-white"
              }`}
            >
              <span
                className={`font-mono text-[12px] ${
                  w.highlight ? "text-[var(--lime)]" : "text-[var(--steel)]"
                }`}
              >
                0{i + 1}
              </span>
              <h3 className="mt-2 font-display text-[1.1rem] font-bold uppercase tracking-[0.04em]">
                {w.title}
              </h3>
              <ul className="mt-4 flex-1 space-y-2 text-[15px]">
                {w.items.map((it) => (
                  <li
                    key={it}
                    className={w.highlight ? "text-white/70" : "text-[var(--graphite)]/70"}
                  >
                    • {it}
                  </li>
                ))}
              </ul>
              <p
                className={`mt-6 border-t pt-4 font-display text-[15px] font-semibold uppercase tracking-[0.06em] ${
                  w.highlight
                    ? "border-white/10 text-[var(--lime)]"
                    : "border-[var(--graphite)]/10 text-[var(--graphite)]"
                }`}
              >
                {w.result}
              </p>
            </div>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}

/* ---------- PARA QUEM É ---------- */
const FOR_YES = [
  "Vende infoprodutos",
  "É afiliado",
  "Presta serviços",
  "Gerencia tráfego",
  "Possui um negócio",
  "Precisa validar ofertas",
  "Quer criar páginas sem programar",
  "Está cansado de depender de terceiros",
  "Já pediu uma landing para a IA e recebeu algo genérico",
  "Quer aprender um processo que possa repetir",
];

const FOR_NO = [
  "Procura promessa de dinheiro fácil",
  "Quer uma página que magicamente venda uma oferta ruim",
  "Não pretende executar nada",
  "Acredita que IA substitui estratégia",
];

function ForWhom() {
  return (
    <section className="bg-[var(--carbon)] py-20 md:py-28">
      <div className="mx-auto max-w-5xl px-6 md:px-10">
        <div className="grid gap-6 md:grid-cols-2">
          <Reveal className="rounded-2xl border border-[var(--lime)]/20 bg-[var(--graphite)] p-7">
            <h3 className="font-display text-[1.1rem] font-bold uppercase tracking-[0.05em] text-white">
              O Land-IA foi feito para quem…
            </h3>
            <ul className="mt-6 space-y-3">
              {FOR_YES.map((t) => (
                <li key={t} className="flex items-start gap-3 text-[15px] text-white/75">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--lime)]" strokeWidth={3} />
                  {t}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.1} className="rounded-2xl border border-white/8 bg-[var(--graphite)] p-7">
            <h3 className="font-display text-[1.1rem] font-bold uppercase tracking-[0.05em] text-white">
              Não é para você se…
            </h3>
            <ul className="mt-6 space-y-3">
              {FOR_NO.map((t) => (
                <li key={t} className="flex items-start gap-3 text-[15px] text-white/60">
                  <X className="mt-0.5 h-4 w-4 shrink-0 text-[var(--action)]" strokeWidth={3} />
                  {t}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ---------- OBJEÇÕES ---------- */
const OBJECTIONS = [
  [
    "“Eu não sei programar.”",
    "Esse é justamente um dos motivos do método existir. Você aprende o processo usando ferramentas que transformam instruções em execução.",
  ],
  ["“Eu nunca usei Lovable.”", "O treinamento acompanha a implementação na prática, do zero."],
  [
    "“Preciso pagar o Lovable para sempre?”",
    "A proposta do método é justamente reduzir essa dependência. Você estrutura tudo no ChatGPT, concentra as decisões no Prompt Mestre para aproveitar melhor os créditos gratuitos do Lovable e depois aprende a levar o projeto para GitHub, Vercel e seu próprio domínio.",
  ],
  [
    "“Preciso ser designer?”",
    "Não. O treinamento ensina estrutura, hierarquia e direção visual suficiente para orientar a IA.",
  ],
  [
    "“A IA faz tudo?”",
    "Não — e essa é uma das grandes ideias do Land-IA. Você pensa a estratégia. Ela acelera a execução.",
  ],
];

function Objections() {
  return (
    <section className="bg-[var(--ivory)] py-20 text-[var(--graphite)] md:py-28">
      <div className="mx-auto max-w-4xl px-6 md:px-10">
        <Reveal className="text-center">
          <Eyebrow tone="light">Objeções honestas</Eyebrow>
          <h2 className="mt-5 font-display text-[1.8rem] font-bold uppercase leading-[1.08] tracking-tight md:text-[2.4rem]">
            O que costuma travar a decisão
          </h2>
        </Reveal>

        <RevealGroup className="mt-12 grid gap-4 md:grid-cols-2">
          {OBJECTIONS.map(([q, a], i) => (
            <div
              key={q}
              data-reveal=""
              style={stepDelay(i)}
              className="rounded-2xl border border-[var(--graphite)]/10 bg-white p-6"
            >
              <h3 className="font-display text-[15px] font-bold uppercase tracking-[0.04em]">{q}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-[var(--graphite)]/75">{a}</p>
            </div>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}

/* ---------- BLOCO EMOCIONAL ---------- */
function EmotionalBlock() {
  return (
    <section className="relative isolate overflow-hidden bg-[var(--carbon)] py-20 md:py-28">
      <div className="absolute inset-0 -z-10 grid-lines opacity-10" />
      <div className="mx-auto max-w-3xl px-6 text-center md:px-10">
        <Reveal>
          <h2 className="font-display text-[1.7rem] font-bold uppercase leading-[1.1] tracking-tight text-white md:text-[2.6rem]">
            Talvez você não precise de outra ferramenta.
            <span className="mt-3 block text-[var(--lime)]">
              Talvez precise aprender a dar direção às que já existem.
            </span>
          </h2>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="mx-auto mt-8 max-w-2xl text-[16px] leading-relaxed text-white/70">
            ChatGPT, Lovable, GitHub e Vercel já conseguem executar uma quantidade absurda de
            trabalho. A diferença está em saber o que construir, em qual ordem, como instruir, como
            revisar e como publicar.
          </p>
        </Reveal>

        <Reveal delay={0.16}>
          <p className="mt-8 font-display text-[1.15rem] font-semibold text-white md:text-[1.4rem]">
            É isso que você aprende no <span className="text-[var(--lime)]">LAND-IA</span>.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* ================================================== */
/*  OFERTA                                            */
/* ================================================== */
function Offer() {
  const offerRef = useRef<HTMLElement | null>(null);
  const hasTrackedViewContent = useRef(false);
  const includes = [
    "Treinamento prático completo — da estratégia à publicação",
    "Engenharia Reversa da Conversão™",
    "Publicação em domínio próprio (GitHub → Vercel → DNS)",
    "Bônus: Biblioteca Land-IA (prompts e estruturas)",
    "Bônus: Landing Invisível (performance, tracking e infraestrutura)",
  ];

  useEffect(() => {
    const section = offerRef.current;

    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (
          entry.isIntersecting &&
          !hasTrackedViewContent.current &&
          typeof window !== "undefined" &&
          typeof window.fbq === "function"
        ) {
          hasTrackedViewContent.current = true;
          sendFacebookEvent("ViewContent");
        }
      },
      {
        threshold: 0.5,
      }
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={offerRef}
      id="oferta"
      className="relative isolate overflow-hidden bg-[var(--graphite)] py-20 text-white md:py-28"
    >
      <div className="absolute inset-0 grid-lines opacity-10" />
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-[560px] w-[860px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--action)]/10 blur-3xl" />

      <div className="relative mx-auto max-w-3xl px-6 md:px-10">
        <Reveal className="text-center">
          <Eyebrow>Sua decisão</Eyebrow>
          <h2 className="mt-6 text-balance font-display text-[1.9rem] font-bold uppercase leading-[1.1] tracking-tight md:text-[2.7rem]">
            LAND-IA <span className="text-[var(--lime)]">| Landing pages com IA</span>
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-[16px] leading-relaxed text-white/65">
            Pagamento único. Acesso imediato após a confirmação.
          </p>
        </Reveal>

        <Reveal className="mt-12">
          <div
            className="relative overflow-hidden rounded-[32px] border border-white/12 bg-white/[0.04] p-1"
            style={{ boxShadow: "0 40px 90px -40px rgba(0,0,0,0.9)" }}
          >
            <div className="rounded-[28px] bg-[var(--ivory)] text-[var(--graphite)]">
              <div className="flex items-center justify-center gap-2 rounded-t-[28px] bg-[var(--carbon)] px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-white">
                <Sparkles className="h-3.5 w-3.5 text-[var(--lime)]" />
                Implementação guiada + 2 bônus
              </div>

              <div className="grid gap-10 p-8 md:grid-cols-[1fr_1fr] md:gap-12 md:p-12">
                <div className="text-center md:text-left">
                  <div className="flex flex-col items-center gap-1 md:items-start">
                    <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--steel)]">
                      Composição de referência: R$ 341
                    </span>
                    <span className="text-lg text-[var(--steel)] line-through">De R$ 97</span>
                  </div>

                  <div className="mt-4 flex flex-wrap items-baseline justify-center gap-x-2 gap-y-1 md:justify-start">
                    <span className="whitespace-nowrap font-display text-5xl font-bold tracking-tight text-[var(--action)] sm:text-6xl">
                      R$&nbsp;47
                    </span>
                    <span className="text-[var(--steel)]">à vista</span>
                  </div>

                  <p className="mt-3 text-[15px] text-[var(--graphite)]/70">
                    Pagamento único · acesso imediato após a confirmação
                  </p>
                  <p className="mt-2 text-[12px] font-semibold uppercase tracking-[0.08em] text-[var(--graphite)]/55">
                    Ferramentas gratuitas para começar • Sem programação • Seu próprio domínio
                  </p>

                  <div className="mt-8">
                    <CTAButton className="w-full md:w-auto">Começar agora</CTAButton>
                    <div className="mt-5 flex items-center justify-center gap-2 text-[13px] text-[var(--steel)] md:justify-start">
                      <Lock className="h-3.5 w-3.5" />
                      Pagamento seguro processado pela Hotmart
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl bg-white p-6 md:p-7">
                  <div className="text-[12px] font-semibold uppercase tracking-[0.22em] text-[var(--steel)]">
                    Tudo o que está incluso
                  </div>
                  <ul className="mt-5 space-y-3.5">
                    {includes.map((i) => (
                      <li
                        key={i}
                        className="flex items-start gap-3 text-[15px] text-[var(--graphite)]"
                      >
                        <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[var(--action)] text-white">
                          <Check className="h-3 w-3" strokeWidth={3.2} />
                        </span>
                        <span className="leading-snug">{i}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- CTA FINAL ---------- */
function FinalCTA() {
  return (
    <section className="landia-cv-final relative isolate overflow-hidden bg-[var(--carbon)] py-20 text-center md:py-28">
      <div className="absolute inset-0 -z-10 grid-lines opacity-10" />
      <div className="mx-auto max-w-3xl px-6 md:px-10">
        <Reveal>
          <h2 className="text-balance font-display text-[1.8rem] font-bold uppercase leading-[1.1] tracking-tight text-white md:text-[2.6rem]">
            Não peça uma página. <span className="text-[var(--lime)]">Projete uma decisão.</span>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-[16px] leading-relaxed text-white/70">
            A IA já constrói. Agora é sobre dirigir a construção — da oferta ao domínio.
          </p>
        </Reveal>

        <CtaBlock
          className="mt-10"
          tone="dark"
          label="Começar agora por R$ 47"
          note="Pagamento único • acesso imediato"
        />
      </div>
    </section>
  );
}

/* ---------- FOOTER ---------- */
function Footer() {
  return (
    <footer className="landia-cv-footer border-t border-white/8 bg-[var(--carbon)] py-12">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 text-center md:flex-row md:justify-between md:px-10 md:text-left">
        <div>
          <span className="font-display text-[15px] font-bold uppercase tracking-[0.08em] text-white">
            LAND-IA
          </span>
          <p className="mt-1 text-[13px] text-[var(--steel)]">
            Landing pages com Inteligência Artificial.
          </p>
        </div>
        <div className="max-w-md text-[12px] leading-relaxed text-[var(--steel)] md:text-right">
          <p>© {new Date().getFullYear()} LAND-IA. Todos os direitos reservados.</p>
          <p className="mt-2">
            Este produto é um treinamento educacional. Resultados dependem de aplicação, contexto e
            execução individual.
          </p>
        </div>
      </div>
    </footer>
  );
}
