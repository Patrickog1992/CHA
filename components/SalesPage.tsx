import React, { useState, useEffect, useRef } from 'react';
import { Answers } from '../types';
import { Button } from './ui/Button';
import { Check, Star, ShieldCheck, ChevronDown, ChevronUp } from 'lucide-react';

interface SalesPageProps {
  answers: Answers;
}

export const SalesPage: React.FC<SalesPageProps> = ({ answers }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  // Timer State
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Popup State
  const [popup, setPopup] = useState<{name: string, show: boolean}>({name: "", show: false});
  const recentBuyers = [
    "Ana S. de São Paulo", "Carla M. de Minas", "Juliana F. do Rio", "Beatriz L. do Sul", "Fernanda C. de Goiás", 
    "Patrícia R. da Bahia", "Mariana K. de SP", "Bruna T. do Paraná"
  ];

  useEffect(() => {
    // Initial delay
    const initialTimeout = setTimeout(() => {
       showNextPopup();
    }, 3000);

    const showNextPopup = () => {
        const randomName = recentBuyers[Math.floor(Math.random() * recentBuyers.length)];
        setPopup({ name: randomName, show: true });

        // Hide after 4 seconds
        setTimeout(() => {
            setPopup(prev => ({ ...prev, show: false }));
            // Schedule next popup after random delay 5-10s
            setTimeout(showNextPopup, Math.random() * 5000 + 5000);
        }, 4000);
    };

    return () => clearTimeout(initialTimeout);
  }, []);

  // Auto-scroll testimonials
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    const scrollInterval = setInterval(() => {
      const cardWidth = scrollContainer.firstElementChild?.getBoundingClientRect().width || 0;
      const gap = 16; // gap-4 is 1rem = 16px
      const scrollAmount = cardWidth + gap;
      
      if (scrollContainer.scrollLeft + scrollContainer.clientWidth >= scrollContainer.scrollWidth - 10) {
        // Reset to beginning if at end
        scrollContainer.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        // Scroll next
        scrollContainer.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }, 3000); // 3 seconds

    return () => clearInterval(scrollInterval);
  }, []);
  
  const FAQItem = ({ question, answer }: { question: string, answer: string }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <div className="border-b border-gray-200 py-4">
        <button 
          className="flex justify-between items-center w-full text-left font-bold text-gray-800"
          onClick={() => setIsOpen(!isOpen)}
        >
          {question}
          {isOpen ? <ChevronUp className="text-brand-green" /> : <ChevronDown className="text-gray-400" />}
        </button>
        {isOpen && <p className="mt-2 text-gray-600 text-sm leading-relaxed">{answer}</p>}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-800 pb-12">
      
      {/* Header Banner - Static (Not Fixed) */}
      <div className="w-full bg-red-600 text-white py-3 px-2 shadow-md text-center leading-tight">
          <p className="text-xs md:text-sm font-semibold">
            Você acabou de receber 70% de desconto que expira em : <span className="text-yellow-300 font-bold text-base">{formatTime(timeLeft)}</span>
          </p>
      </div>

      {/* Social Proof Popup - Smaller */}
      <div className={`fixed top-4 right-4 z-50 bg-white p-2 rounded shadow-lg border-l-2 border-green-500 max-w-[180px] transition-all duration-500 transform ${popup.show ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}>
          <div className="flex items-center gap-2">
              <div className="bg-green-100 p-1 rounded-full flex-shrink-0"><Check size={10} className="text-green-600" /></div>
              <div className="leading-none">
                  <p className="text-[10px] font-bold text-gray-800 mb-0.5">{popup.name}</p>
                  <p className="text-[9px] text-gray-500">comprou o Chá Seca Barriga</p>
              </div>
          </div>
      </div>

      {/* Header / Hero */}
      <div className="max-w-md mx-auto px-4 py-8 space-y-6">
        <h1 className="text-2xl md:text-3xl font-black text-center text-brand-darkGreen uppercase leading-tight">
          Aqui está o seu PLANO PESSOAL para alcançar o seu peso ideal.
        </h1>

        {/* Before / After Comparison */}
        <div className="grid grid-cols-2 gap-2">
            <div className="space-y-2">
                <div className="bg-red-600 text-white text-center font-bold py-1 rounded-t-lg text-sm">AGORA</div>
                <img src="https://i.imgur.com/CJxusNE.jpg" alt="Antes" className="w-full h-64 object-cover rounded-b-lg shadow-md grayscale" />
                <div className="space-y-1 mt-2">
                    <div className="flex items-center text-xs text-red-600"><span className="mr-1">❌</span> Metabolismo Lento</div>
                    <div className="flex items-center text-xs text-red-600"><span className="mr-1">❌</span> Retenção de Líquido</div>
                    <div className="flex items-center text-xs text-red-600"><span className="mr-1">❌</span> Baixa Energia</div>
                    <div className="flex items-center text-xs text-red-600"><span className="mr-1">❌</span> Inchaço Abdominal</div>
                </div>
            </div>
            <div className="space-y-2">
                <div className="bg-green-600 text-white text-center font-bold py-1 rounded-t-lg text-sm">DEPOIS DO CHÁ</div>
                <img src="https://i.imgur.com/ZODa9px.jpg" alt="Depois" className="w-full h-64 object-cover rounded-b-lg shadow-md" />
                 <div className="space-y-1 mt-2">
                    <div className="flex items-center text-xs text-green-700 font-bold"><Check size={14} className="mr-1"/> Barriga Chapada</div>
                    <div className="flex items-center text-xs text-green-700 font-bold"><Check size={14} className="mr-1"/> Metabolismo Rápido</div>
                    <div className="flex items-center text-xs text-green-700 font-bold"><Check size={14} className="mr-1"/> Alta Disposição</div>
                    <div className="flex items-center text-xs text-green-700 font-bold"><Check size={14} className="mr-1"/> Autoestima Alta</div>
                </div>
            </div>
        </div>

        <div className="bg-green-50 p-4 rounded-xl border-l-4 border-brand-green">
            <p className="text-sm font-medium">
                <span className="font-bold text-brand-darkGreen">94% das pessoas</span> com perfis semelhantes ao seu percebem resultados em apenas 2 semanas com o CHÁ SECA BARRIGA 21D
            </p>
        </div>

        <p className="text-center text-gray-600 text-sm">Nosso algoritmo inteligente criou um plano personalizado com base nos seus objetivos.</p>
      </div>

      {/* Analysis Section */}
      <div className="bg-gray-50 py-8 px-4">
          <div className="max-w-md mx-auto space-y-6">
            <h2 className="text-2xl font-black text-center text-brand-darkGreen uppercase">SUA ANALISE PERSONALIZADA</h2>
            
            <div className="space-y-4">
                <div className="bg-white p-4 rounded-xl shadow-sm">
                    <h3 className="font-bold text-gray-900 mb-1">Objetivo Principal: {answers.goals[0] || 'Perder Peso'}</h3>
                    <p className="text-sm text-gray-600">Identificamos que seu foco principal exige uma combinação termogênica específica.</p>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm">
                    <h3 className="font-bold text-gray-900 mb-1">Área de Foco: {answers.bodyPart}</h3>
                    <p className="text-sm text-gray-600">Os ingredientes selecionados atuarão diretamente na redução de gordura localizada nesta região.</p>
                </div>
                 <div className="bg-white p-4 rounded-xl shadow-sm">
                    <h3 className="font-bold text-gray-900 mb-1">IMC Atual: {(parseFloat(answers.currentWeight)/(Math.pow(parseFloat(answers.height)/100, 2))).toFixed(1)}</h3>
                    <p className="text-sm text-gray-600">Seu índice indica necessidade de intervenção imediata para reverter o acúmulo de gordura.</p>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm">
                    <h3 className="font-bold text-gray-900 mb-1">Rotina: {answers.routine}</h3>
                    <p className="text-sm text-gray-600">Adaptamos o horário dos chás para se encaixar perfeitamente no seu dia a dia agitado.</p>
                </div>
                 <div className="bg-white p-4 rounded-xl shadow-sm">
                    <h3 className="font-bold text-gray-900 mb-1">Idade: {answers.ageRange}</h3>
                    <p className="text-sm text-gray-600">Consideramos as mudanças hormonais da sua faixa etária para otimizar a queima calórica.</p>
                </div>
            </div>

            <div className="space-y-2 mt-6">
                <div className="flex items-center text-sm"><Check className="text-brand-green mr-2" /> Plano avançado de rotina com chás naturais — apenas alguns minutos por dia</div>
                <div className="flex items-center text-sm"><Check className="text-brand-green mr-2" /> Atuação completa nos principais pilares do emagrecimento saudável</div>
                <div className="flex items-center text-sm"><Check className="text-brand-green mr-2" /> Orientações práticas, passo a passo</div>
                <div className="flex items-center text-sm"><Check className="text-brand-green mr-2" /> Conteúdo desenvolvido com base em estudos de nutrição natural</div>
            </div>
          </div>
      </div>

      {/* What you get */}
      <div className="max-w-md mx-auto px-4 py-8 space-y-6">
        <h2 className="text-2xl font-black text-center text-brand-darkGreen uppercase">O QUE VOCÊ VAI RECEBER?</h2>
        
        <div className="space-y-4">
             <div className="bg-white border border-green-100 p-4 rounded-xl shadow-md">
                 <h3 className="font-bold text-lg text-brand-green flex items-center"><Check className="bg-brand-green text-white rounded-full p-1 mr-2" size={20}/> Chás estratégicos personalizados para o seu corpo</h3>
                 <p className="text-sm text-gray-600 mt-2">Uma combinação inteligente de chás naturais desenvolvida a partir de estudos modernos, pensada para ajudar a acelerar o metabolismo e reduzir o inchaço de forma equilibrada.</p>
             </div>
             <div className="bg-white border border-green-100 p-4 rounded-xl shadow-md">
                 <h3 className="font-bold text-lg text-brand-green flex items-center"><Check className="bg-brand-green text-white rounded-full p-1 mr-2" size={20}/> Metas diárias simples para garantir constância</h3>
                 <p className="text-sm text-gray-600 mt-2">Você saberá exatamente o que fazer todos os dias, sem confusão, sem dietas malucas e sem sofrimento.</p>
             </div>
             <div className="bg-white border border-green-100 p-4 rounded-xl shadow-md">
                 <h3 className="font-bold text-lg text-brand-green flex items-center"><Check className="bg-brand-green text-white rounded-full p-1 mr-2" size={20}/> Controle total da sua evolução</h3>
                 <p className="text-sm text-gray-600 mt-2">Uma planilha prática para acompanhar seus resultados e manter sua motivação sempre alta.</p>
             </div>
        </div>

        <ul className="space-y-2 text-sm font-medium text-gray-700">
            {[
                "Rotina prática de chás naturais com orientação passo a passo",
                "Estratégias para melhorar sua disciplina e organização alimentar",
                "Técnicas simples para reduzir estresse e melhorar o bem-estar",
                "Plano estruturado para manter constância e acompanhar resultados",
                "Ajustes personalizados conforme sua rotina e seus objetivos"
            ].map((item, idx) => (
                <li key={idx} className="flex items-start"><Check className="text-brand-green mr-2 flex-shrink-0" size={18} /> {item}</li>
            ))}
        </ul>
      </div>

      {/* Testimonials Carousel */}
      <div className="bg-brand-light py-8 px-4">
           <div className="max-w-md mx-auto space-y-6">
                <h2 className="text-2xl font-black text-center text-brand-darkGreen">O que dizem os nossos clientes</h2>
                <div 
                  className="flex overflow-x-auto gap-4 pb-4 snap-x no-scrollbar" 
                  ref={scrollContainerRef}
                  style={{ scrollBehavior: 'smooth' }}
                >
                    {[
                        { img: "https://i.imgur.com/ipOh27y.jpg", text: "Me sinto outra mulher. O inchaço sumiu e minhas roupas voltaram a servir!" },
                        { img: "https://i.imgur.com/AJCfcXk.jpg", text: "Fiz o teste e não me arrependo. 5kg a menos em duas semanas!" },
                        { img: "https://i.imgur.com/BTYdqvQ.jpg", text: "Meu marido elogiou minha nova energia. O chá realmente funciona." },
                        { img: "https://i.imgur.com/TAUXKtX.jpg", text: "Simples, natural e eficaz. Melhor investimento que fiz." }
                    ].map((item, idx) => (
                        <div key={idx} className="min-w-[85%] snap-center bg-white p-4 rounded-xl shadow-md flex flex-col">
                            <img src={item.img} className="w-full h-64 object-cover rounded-lg mb-4" alt={`Cliente ${idx+1}`} />
                            <div className="flex text-yellow-400 mb-2">
                                {[1,2,3,4,5].map(i => <Star key={i} fill="currentColor" size={16} />)}
                            </div>
                            <p className="text-sm italic text-gray-600">"{item.text}"</p>
                        </div>
                    ))}
                </div>
           </div>
      </div>

      {/* Value Proposition */}
      <div className="max-w-md mx-auto px-4 py-8 space-y-6 text-center">
        <h2 className="text-2xl font-black text-brand-darkGreen uppercase">E O MELHOR?</h2>
        <p className="text-lg font-bold">Tudo isso custa menos que uma pizza.</p>
        <p className="text-gray-600">Um investimento acessível para você começar uma nova rotina, cuidar do seu corpo e se sentir melhor todos os dias.</p>
        <p className="text-gray-600 font-medium">Invista em você e dê o primeiro passo para a mudança que você merece.</p>
      </div>

      {/* Journey Timeline */}
      <div className="bg-gray-900 text-white py-8 px-4">
        <div className="max-w-md mx-auto space-y-8">
            <h2 className="text-xl font-bold text-center text-brand-green uppercase">🚀 SUA JORNADA COM O CHÁ SECA BARRIGA 21D</h2>
            
            <div className="space-y-6 relative border-l-2 border-brand-green ml-4 pl-6">
                <div className="relative">
                    <div className="absolute -left-[33px] top-0 bg-brand-green w-4 h-4 rounded-full"></div>
                    <h3 className="font-bold text-lg text-brand-green">✅ 7 Dias — Primeira Semana</h3>
                    <p className="text-sm mt-2 text-gray-300">Você começa a entrar na rotina dos chás. Sente mais leveza, menos inchaço e mais consciência nas suas escolhas do dia a dia. Sua organização melhora e sua motivação aumenta.</p>
                </div>
                 <div className="relative">
                    <div className="absolute -left-[33px] top-0 bg-brand-green w-4 h-4 rounded-full"></div>
                    <h3 className="font-bold text-lg text-brand-green">✅ 14 Dias — Segunda Semana</h3>
                    <p className="text-sm mt-2 text-gray-300">Seu corpo começa a responder à nova rotina. As roupas vestem melhor, você se sente mais disposto(a) e mais confiante. Pessoas próximas podem começar a notar a diferença no seu bem-estar.</p>
                </div>
                 <div className="relative">
                    <div className="absolute -left-[33px] top-0 bg-brand-green w-4 h-4 rounded-full"></div>
                    <h3 className="font-bold text-lg text-brand-green">✅ 21 Dias — Terceira Semana</h3>
                    <p className="text-sm mt-2 text-gray-300">A constância faz a diferença. Você percebe mais disciplina, mais energia e mais satisfação com seu progresso. A sensação é de estar no controle da sua rotina e dos seus hábitos.</p>
                </div>
            </div>
        </div>
      </div>

      {/* Bonuses */}
      <div className="max-w-md mx-auto px-4 py-8 space-y-6">
        <div className="text-center">
            <h2 className="text-2xl font-black text-brand-darkGreen uppercase">🎁 GANHE 5 BÔNUS EXCLUSIVOS</h2>
            <div className="inline-block bg-red-100 text-red-600 text-xs font-bold px-3 py-1 rounded-full mt-2 animate-pulse">⏰ Últimas 4 vagas restantes hoje</div>
            <p className="text-sm text-gray-600 mt-2">Ao garantir hoje o Chá Seca Barriga 21D, você recebe gratuitamente os bônus abaixo para potencializar seus resultados e manter constância.</p>
        </div>

        {[
            { title: "BÔNUS 1: Plano de Aceleração Natural – 30 Dias", desc: "Um protocolo complementar para ajudar você a organizar sua rotina, melhorar hábitos e manter o foco no seu objetivo.", val: "R$ 97,00" },
            { title: "BÔNUS 2: Rotina de Foco e Disciplina Diária", desc: "Estratégias simples para melhorar organização, consistência e reduzir a procrastinação no dia a dia.", val: "R$ 67,00" },
            { title: "BÔNUS 3: Método Equilíbrio Alimentar", desc: "Práticas para ajudar a reduzir exageros, melhorar consciência alimentar e controlar impulsos de forma saudável.", val: "R$ 87,00" },
            { title: "BÔNUS 4: Aula Especial – Hábitos que Aceleram Resultados", desc: "Aprenda a identificar comportamentos que podem estar atrasando seus resultados e como ajustá-los de forma prática.", val: "R$ 127,00" },
            { title: "BÔNUS 5: Comunidade Exclusiva Chá Seca Barriga 21D", desc: "Acesso a um grupo fechado para troca de experiências, motivação e acompanhamento da jornada.", val: "R$ 97,00" },
        ].map((bonus, i) => (
            <div key={i} className="bg-white border-2 border-dashed border-brand-green/30 p-4 rounded-xl">
                <h3 className="font-bold text-brand-darkGreen">{bonus.title}</h3>
                <p className="text-xs text-gray-600 mt-1">{bonus.desc}</p>
                <p className="text-sm font-bold text-gray-400 line-through mt-2">Valor: {bonus.val}</p>
            </div>
        ))}

        <div className="bg-brand-light p-4 rounded-xl text-center">
            <p className="font-bold text-gray-500 line-through">💰 Valor total dos bônus: R$ 475,00</p>
            <p className="font-bold text-brand-green text-lg">🎉 Hoje você recebe todos os bônus gratuitamente ao garantir o programa.</p>
        </div>
      </div>

      {/* Offer Section */}
      <div className="py-8 px-4">
         <div className="max-w-md mx-auto bg-white border-2 border-brand-green rounded-2xl shadow-xl overflow-hidden p-6 text-center space-y-4">
             <h2 className="text-3xl font-black uppercase text-brand-darkGreen">🔥 OFERTA ESPECIAL</h2>
             <p className="text-xl line-through text-gray-400 font-bold">De R$ 497,00</p>
             <div className="text-4xl font-black text-brand-green">✅ Por apenas R$ 37,00</div>
             
             <Button fullWidth variant="primary" className="text-xl py-6 animate-pulse shadow-xl uppercase">
                QUERO O CHÁ SECA BARRIGA 21D AGORA!
             </Button>

             <div className="flex items-center justify-center space-x-2 text-xs text-gray-600">
                <ShieldCheck size={16} className="text-brand-green" />
                <span>Pagamento único • Acesso vitalício</span>
             </div>
             
             <p className="text-sm text-gray-500 mt-4">Comece hoje uma nova rotina com chás naturais, mais organização, mais bem-estar e mais constância.</p>
         </div>
      </div>

      {/* Guarantee */}
      <div className="max-w-md mx-auto px-4 py-10 space-y-6 text-center">
         <ShieldCheck size={64} className="mx-auto text-brand-green" />
         <h2 className="text-2xl font-black text-gray-800">🛡️ GARANTIA TOTAL — RISCO ZERO</h2>
         <p className="text-gray-600">Você tem 30 dias completos para testar o Chá Seca Barriga 21D e aplicar a rotina no seu dia a dia.</p>
         <p className="text-gray-600">Se, por qualquer motivo, você não perceber mais organização na sua rotina, sensação de leveza, melhora no bem-estar ou satisfação com sua experiência, basta enviar um e-mail ou mensagem — e devolvemos 100% do seu dinheiro.</p>
         <p className="font-bold text-gray-800">Sem perguntas. Sem burocracia.</p>
      </div>

      {/* Comparison Table */}
      <div className="bg-gray-50 py-8 px-4">
         <div className="max-w-md mx-auto space-y-6">
            <h2 className="text-xl font-bold text-center uppercase text-gray-800">📊 Compare os custos para tentar emagrecer</h2>
            
            <div className="space-y-4">
                {[
                    { t: "💊 Remédios e suplementos (1 mês)", d: "Efeito temporário, possíveis efeitos colaterais e alto custo recorrente.", p: "R$ 1.500" },
                    { t: "👨‍⚕️ Nutricionistas e terapias particulares", d: "Resultados variam, acompanhamento limitado e investimento contínuo.", p: "R$ 800 por consulta" },
                    { t: "🏋️‍♀️ Academia + Personal Trainer", d: "Exige tempo, deslocamento e nem sempre se adapta à rotina.", p: "R$ 1.200 por mês" },
                    { t: "💉 Tratamentos clínicos avançados", d: "Custos elevados, riscos e resultados imprevisíveis.", p: "R$ 20.000" }
                ].map((item, i) => (
                    <div key={i} className="bg-white p-4 rounded-xl border-l-4 border-gray-300">
                        <div className="font-bold text-gray-800">{item.t}</div>
                        <div className="text-xs text-gray-500 my-1">{item.d}</div>
                        <div className="font-bold text-red-500">{item.p}</div>
                    </div>
                ))}

                <div className="bg-brand-light p-6 rounded-xl border-2 border-brand-green transform scale-105 shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-brand-gold text-xs font-bold px-2 py-1 text-gray-900">MELHOR OPÇÃO</div>
                    <div className="font-bold text-xl text-brand-darkGreen">🍵 Chá Seca Barriga 21D</div>
                    <div className="text-sm text-gray-600 my-2">Pagamento único • Sem mensalidades</div>
                    <div className="font-black text-2xl text-brand-green">Apenas R$ 37,00</div>
                </div>
            </div>
         </div>
      </div>

      {/* Final CTA */}
      <div className="max-w-md mx-auto px-4 py-8 space-y-6 text-center">
         <h2 className="text-2xl font-black text-gray-800 uppercase">🚦 Agora você tem 2 escolhas…</h2>
         
         <div className="p-4 bg-red-50 rounded-xl border border-red-100">
            <h3 className="font-bold text-red-600">❌ 1. Continuar na mesma rotina</h3>
            <p className="text-sm text-gray-600">Tentando resolver sozinho(a), repetindo hábitos que dificultam sua evolução.</p>
         </div>
         
         <div className="p-4 bg-green-50 rounded-xl border border-brand-green">
            <h3 className="font-bold text-brand-green">✅ 2. Começar hoje com o Chá Seca Barriga 21D</h3>
            <p className="text-sm text-gray-600">Seguindo uma rotina simples, prática e acessível, focada em organização, bem-estar e constância.</p>
         </div>

         <Button fullWidth variant="primary" className="text-xl py-6 shadow-xl animate-pulse">
            QUERO AGORA !
         </Button>
      </div>

      {/* FAQ */}
      <div className="max-w-md mx-auto px-4 py-12 space-y-6">
          <h2 className="text-2xl font-black text-center text-gray-800">PERGUNTAS FREQUENTES</h2>
          <div className="space-y-2">
            <FAQItem 
                question="Como eu recebo o acesso ao plano?" 
                answer="O acesso é enviado imediatamente para o seu e-mail após a confirmação do pagamento. Você poderá acessar pelo celular, tablet ou computador." 
            />
            <FAQItem 
                question="Preciso comprar ingredientes caros?" 
                answer="Não! O protocolo utiliza ingredientes naturais, baratos e fáceis de encontrar em qualquer mercado ou feira." 
            />
            <FAQItem 
                question="Funciona para todas as idades?" 
                answer="Sim, o método é 100% natural e adaptável para mulheres de 18 a 60+ anos, respeitando as particularidades de cada metabolismo." 
            />
            <FAQItem 
                question="E se eu não gostar?" 
                answer="Você tem 30 dias de garantia incondicional. Se não gostar, devolvemos 100% do seu dinheiro. O risco é todo nosso." 
            />
             <FAQItem 
                question="Quais são as formas de pagamento?" 
                answer="Aceitamos Cartão de Crédito e PIX. O pagamento é único, sem mensalidades." 
            />
          </div>
      </div>

      <footer className="bg-gray-100 py-8 text-center text-xs text-gray-400">
        <p>© 2024 Chá Seca Barriga 21D. Todos os direitos reservados.</p>
        <p className="mt-2">Este site não faz parte do site do Facebook ou Facebook Inc.<br/>Além disso, este site NÃO é endossado pelo Facebook de forma alguma.</p>
      </footer>

    </div>
  );
};