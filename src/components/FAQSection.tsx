import { Reveal, RevealGroup, stepDelay } from "@/components/Reveal";

const FAQS = [
  ["Preciso saber programar?", "Não. O processo foi desenhado justamente para quem não programa: você aprende a estruturar, instruir a IA, revisar e publicar."],
  ["Preciso ter um produto pronto?", "Ajuda, mas não é obrigatório. Você pode entrar com uma oferta, um serviço ou uma ideia em validação e sair com a arquitetura definida."],
  ["Preciso já saber usar o Lovable?", "Não. A implementação é demonstrada no Lovable passo a passo, com foco no que você realmente precisa para transformar o Prompt Mestre em uma landing funcional."],
  ["Os créditos gratuitos do Lovable são suficientes?", "O Land-IA foi estruturado para reduzir drasticamente o retrabalho: primeiro você define estratégia, estrutura, copy e direção visual; depois concentra essas decisões no Prompt Mestre. O objetivo é chegar o mais longe possível com a geração inicial e reservar os créditos restantes para ajustes realmente necessários. A quantidade exata pode variar conforme a complexidade do projeto."],
  ["Preciso pagar o Lovable todo mês?", "A proposta do método é evitar depender de uma assinatura para começar. Você aprende a aproveitar os créditos gratuitos com um Prompt Mestre completo e depois leva o projeto para GitHub, publica pela Vercel e aponta seu próprio domínio."],
  ["Vou aprender a colocar a página no meu domínio?", "Sim. Há uma aula dedicada ao caminho Lovable → GitHub → Vercel → DNS → domínio próprio."],
  ["Preciso pagar hospedagem?", "O caminho ensinado usa ChatGPT, Lovable, GitHub e Vercel em suas opções gratuitas para começar. Você só precisa do seu domínio para publicar com endereço próprio."],
  ["O treinamento é longo?", "Não. Foi construído para ser direto ao ponto: vídeo-aulas práticas em gravação de tela, mais materiais complementares em PDF e e-book."],
  ["Recebo os bônus?", "Sim. Biblioteca Land-IA e Landing Invisível acompanham a oferta atual."],
  ["Por quanto tempo terei acesso?", "O acesso é entregue pela Hotmart conforme a condição configurada no produto no momento da compra, exibida na própria página de checkout."],
];

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.26em] text-[var(--graphite)]/60">
      <span className="h-px w-6 bg-[var(--lime)]" />
      {children}
    </span>
  );
}

export default function FAQSection() {
  return (
    <section className="landia-cv-faq bg-[var(--ivory)] py-20 text-[var(--graphite)] md:py-28">
      <div className="mx-auto max-w-3xl px-6 md:px-10">
        <Reveal className="text-center">
          <Eyebrow>Perguntas frequentes</Eyebrow>
          <h2 className="mt-5 font-display text-[1.8rem] font-bold uppercase leading-tight tracking-tight md:text-[2.4rem]">
            Ainda em dúvida?
          </h2>
        </Reveal>

        <RevealGroup className="mt-10 space-y-3">
          {FAQS.map(([q, a], i) => (
            <details
              key={q}
              data-reveal=""
              style={stepDelay(i)}
              className="group rounded-xl border border-[var(--graphite)]/10 bg-white px-5 py-4"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-[15px] font-semibold">
                {q}
                <span className="text-[var(--action)] transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 text-[15px] leading-relaxed text-[var(--graphite)]/75">{a}</p>
            </details>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
