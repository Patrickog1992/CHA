import React, { useState, useRef } from 'react';
import { Answers } from '../types';
import { Button } from './ui/Button';
import { ArrowRight, Check, Star, AlertTriangle, ChevronRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface QuizProps {
  answers: Answers;
  setAnswers: React.Dispatch<React.SetStateAction<Answers>>;
  onComplete: () => void;
}

export const Quiz: React.FC<QuizProps> = ({ answers, setAnswers, onComplete }) => {
  const [step, setStep] = useState(0);
  const topRef = useRef<HTMLDivElement>(null);

  const scrollToTop = () => {
    topRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const nextStep = () => {
    setStep(prev => prev + 1);
    scrollToTop();
  };

  const updateAnswer = (key: keyof Answers, value: any) => {
    setAnswers(prev => ({ ...prev, [key]: value }));
  };

  const handleSingleSelect = (key: keyof Answers, value: string) => {
    updateAnswer(key, value);
    nextStep();
  };

  const handleMultiSelect = (key: keyof Answers, value: string) => {
    const current = (answers[key] as string[]) || [];
    const updated = current.includes(value)
      ? current.filter(item => item !== value)
      : [...current, value];
    updateAnswer(key, updated);
  };

  const calculateBMI = () => {
    const w = parseFloat(answers.currentWeight.replace(',', '.'));
    const h = parseFloat(answers.height.replace(',', '.')) / 100; // assuming cm
    if (!w || !h) return 0;
    return (w / (h * h)).toFixed(1);
  };

  const getBMIStatus = (bmi: number) => {
    if (bmi < 18.5) return "Abaixo do peso";
    if (bmi < 24.9) return "Saudável";
    if (bmi < 29.9) return "Sobrepeso";
    return "Obesidade";
  };

  const renderStep = () => {
    switch (step) {
      case 0: // Landing
        return (
          <div className="text-center space-y-6">
            <h1 className="text-2xl md:text-3xl font-extrabold text-brand-darkGreen uppercase leading-tight">
              EMAGREÇA EM ATÉ 21 DIAS COM O CHÁ SECA BARRIGA 21D SIMPLES, NATURAL E SEM SOFRIMENTO
            </h1>
            <img 
              src="https://i.imgur.com/e4WB1VN.jpeg" 
              alt="Chá Seca Barriga" 
              className="w-full rounded-2xl shadow-lg"
              fetchPriority="high"
            />
            <div className="bg-red-50 border border-brand-red p-4 rounded-xl text-brand-red font-semibold text-sm">
              Atenção: essa receita está disponível por tempo limitado. Ao sair desta página, você pode perder o acesso ao Chá Seca Barriga 21D.
            </div>
            <Button fullWidth onClick={nextStep} className="animate-pulse">
              FAÇA O TESTE GRATUITO
            </Button>
          </div>
        );

      case 1: // Objectives
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-center">Qual é o objetivo com seu corpo?<br/><span className="text-base font-normal text-gray-600">Escolha seus maiores interesses abaixo:</span></h2>
            <div className="space-y-3">
              {[
                "Perder peso",
                "Queimar gordura no fígado",
                "Eliminar a retenção de líquidos",
                "Acelerar o metabolismo",
                "Aumento na expectativa de vida",
                "Emagrecer na menopausa",
                "Acabar com desejo de comer besteira",
                "Redução nos níveis de colesterol"
              ].map(opt => (
                <div key={opt} 
                  onClick={() => handleMultiSelect('goals', opt)}
                  className={`p-4 rounded-xl border-2 cursor-pointer flex items-center justify-between transition-all ${answers.goals.includes(opt) ? 'border-brand-green bg-green-50' : 'border-gray-200 hover:border-brand-green'}`}
                >
                  <span className="font-medium">{opt}</span>
                  {answers.goals.includes(opt) && <Check className="text-brand-green" />}
                </div>
              ))}
            </div>
            <Button fullWidth onClick={nextStep} disabled={answers.goals.length === 0}>Continuar</Button>
          </div>
        );

      case 2: // Weight Goal Range 1
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-center">Quantos quilos você<br/>deseja perder?</h2>
            <p className="text-center text-gray-600 text-sm">O protocolo Rotina dos chás bariátricos ajuda a eliminar gordura de forma acelerada.</p>
            <div className="space-y-3">
              {["Até 5kg", "De 6 a 10 kg", "De 11 a 15 kg", "De 16 a 20 kg", "Mais de 20 kg"].map(opt => (
                <Button key={opt} variant="outline" fullWidth onClick={() => handleSingleSelect('weightGoalRange', opt)} className="justify-start text-left h-auto py-3">
                  {opt}
                </Button>
              ))}
            </div>
          </div>
        );

      case 3: // Sex
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-center">Qual seu Sexo?<br/><span className="text-base font-normal text-gray-600">Selecione abaixo</span></h2>
            <div className="grid grid-cols-2 gap-4">
              {["Masculino", "Feminino"].map(opt => (
                <div key={opt} onClick={() => handleSingleSelect('gender', opt)} className="aspect-square flex flex-col items-center justify-center border-2 border-gray-200 rounded-2xl hover:border-brand-green hover:bg-green-50 cursor-pointer">
                  <span className="text-lg font-semibold">{opt}</span>
                </div>
              ))}
            </div>
            <div className="text-xs text-gray-500 text-center bg-gray-100 p-3 rounded-lg">
              As informações são para fazer ajustes em seu plano exclusivo e personalizado. O sexo biológico é um fator que afeta a sua TMB (taxa metabólica), que determina quantas calorias você queima por dia.
            </div>
          </div>
        );

      case 4: // Body Part
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-center">Em qual área do seu corpo<br/>você gostaria de reduzir<br/>mais gordura?</h2>
            <div className="space-y-3">
              {["Região dos Culotes", "Região das Coxas", "Região do Abdômen (barriga)", "Região dos Glúteos", "Região dos Braços"].map(opt => (
                <Button key={opt} variant="outline" fullWidth onClick={() => handleSingleSelect('bodyPart', opt)} className="justify-start text-left h-auto py-3">
                  {opt}
                </Button>
              ))}
            </div>
          </div>
        );

      case 5: // Age
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-center">Vamos criar um Plano Personalizado de Emagrecimento com Chás Bariátricos, focado nas suas necessidades.</h2>
            <p className="text-center text-gray-600">Selecione sua idade abaixo:</p>
            <div className="grid grid-cols-2 gap-4">
              {["18 a 26", "27 a 38", "39 a 50", "46+"].map(opt => (
                <Button key={opt} variant="outline" onClick={() => handleSingleSelect('ageRange', opt)} className="h-16">
                  {opt}
                </Button>
              ))}
            </div>
          </div>
        );

      // Removed Step 6 (Weight Goal 2)

      case 6: // Jessica Testimonial
        return (
          <div className="space-y-6 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-center text-brand-darkGreen">Veja o Resultado dos CHÁ SECA BARRIGA 21D na vida da Jéssica</h2>
            <p className="text-gray-700">Com dificuldades para emagrecer e muita ansiedade, Jéssica incluiu os chás bariátricos em sua rotina noturna. Em apenas três semanas, perdeu 9 kg, melhorando sua autoestima e vida.</p>
            <img src="https://i.imgur.com/BTYdqvQ.jpg" alt="Jessica Antes e Depois" className="w-full rounded-xl" />
            
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
              <div className="flex text-yellow-400 mb-2">
                {[1,2,3,4,5].map(i => <Star key={i} fill="currentColor" size={20} />)}
              </div>
              <p className="text-sm italic text-gray-600">"Eu já tinha tentado de tudo, mas nada funcionava. O Chá Seca Barriga mudou minha vida! Em menos de um mês eu recuperei roupas que não serviam há anos. Recomendo demais!"</p>
              <p className="text-xs font-bold mt-2 text-gray-900">- Jéssica S.</p>
            </div>

            <Button fullWidth onClick={nextStep}>Continuar</Button>
          </div>
        );

      case 7: // Name
        return (
          <div className="space-y-6">
             <h2 className="text-xl font-bold text-center">Primeiro nos diga seu nome</h2>
             <input 
              type="text" 
              placeholder="Digite o seu nome aqui"
              className="w-full p-4 border-2 border-gray-300 rounded-xl focus:border-brand-green focus:outline-none text-lg"
              value={answers.name}
              onChange={(e) => updateAnswer('name', e.target.value)}
             />
             <Button fullWidth onClick={nextStep} disabled={!answers.name}>Enviar</Button>
          </div>
        );

      case 8: // Body Type
        return (
           <div className="space-y-6">
            <h2 className="text-xl font-bold text-center">Qual é o seu tipo de corpo atual?</h2>
            <p className="text-center text-gray-600">Vamos personalizar os Chás que funcionem para seu tipo de corpo.</p>
            <div className="space-y-3">
              {["Regular", "Flácido", "Sobrepeso"].map(opt => (
                <Button key={opt} variant="outline" fullWidth onClick={() => handleSingleSelect('bodyType', opt)}>
                  {opt}
                </Button>
              ))}
            </div>
          </div>
        );

      case 9: // Impact
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-center">{answers.name || 'Amiga'}, como o seu peso afeta sua vida?</h2>
            <div className="space-y-3">
              {[
                { emoji: "🤦", text: "Tenho vergonha de tirar fotos" },
                { emoji: "😞", text: "Meu parceiro está preocupado com minha saúde" },
                { emoji: "😢", text: "Sinto-me julgado por amigos e colegas" },
                { emoji: "💔", text: "Evito encontros românticos por não me sentir atraente" },
                { emoji: "👋", text: "Nenhuma das opções" }
              ].map(opt => (
                <Button key={opt.text} variant="outline" fullWidth onClick={() => handleSingleSelect('lifeImpact', opt.text)} className="justify-start text-left h-auto py-3">
                  <span className="mr-3 text-2xl">{opt.emoji}</span> {opt.text}
                </Button>
              ))}
            </div>
          </div>
        );

      case 10: // Satisfaction
        return (
           <div className="space-y-6">
            <h2 className="text-xl font-bold text-center">Você se sente satisfeita com a sua aparência física atual?</h2>
            <div className="space-y-3">
              {[
                { emoji: "😢", text: "Não, porque me sinto acima do peso e isso afeta minha autoestima" },
                { emoji: "😞", text: "Sim, mas sei que posso melhorar minha saúde" },
                { emoji: "😪", text: "Não, gostaria de perder peso para melhorar meu bem-estar" },
                { emoji: "🤦", text: "Não, minha aparência física não corresponde aos meus objetivos de saúde" }
              ].map(opt => (
                <Button key={opt.text} variant="outline" fullWidth onClick={() => handleSingleSelect('satisfaction', opt.text)} className="justify-start text-left h-auto py-3">
                   <span className="mr-3 text-2xl min-w-[30px]">{opt.emoji}</span> <span className="text-sm">{opt.text}</span>
                </Button>
              ))}
            </div>
          </div>
        );

      case 11: // Difficulties
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-center">Você enfrenta alguma dificuldade no dia a dia devido ao peso?</h2>
            <p className="text-center text-gray-600">Selecione abaixo</p>
             <div className="space-y-3">
              {[
                { emoji: "🤦", text: "Subir as escadas" },
                { emoji: "🪑", text: "Se sentar" },
                { emoji: "🦵", text: "Agachar" },
                { emoji: "🛏️", text: "Deitar na cama" },
                { emoji: "😶", text: "Outros" },
                { emoji: "✅", text: "Não tenho dificuldades" }
              ].map(opt => (
                <Button key={opt.text} variant="outline" fullWidth onClick={() => handleSingleSelect('difficulty', opt.text)} className="justify-start text-left h-auto py-3">
                   <span className="mr-3 text-2xl">{opt.emoji}</span> {opt.text}
                </Button>
              ))}
            </div>
            <Button fullWidth onClick={nextStep} disabled={!answers.difficulty}>Continuar</Button>
          </div>
        );

      case 12: // Social Proof
         return (
          <div className="space-y-6 text-center">
            <h2 className="text-xl font-bold text-brand-darkGreen">Suas respostas são parecidas com as delas...</h2>
            <p>Isso significa que você também pode se beneficiar da nossa CHÁ SECA BARRIGA 21D , assim como milhares de mulheres que já transformaram suas vidas.</p>
            <img src="https://i.imgur.com/4Aomibz.jpeg" alt="Depoimentos" className="w-full rounded-2xl shadow-lg" />
            <Button fullWidth onClick={nextStep}>EU TAMBÉM QUERO</Button>
          </div>
         );

      case 13: // Impediments
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-center">O que te impede de emagrecer?</h2>
             <div className="space-y-3">
              {[
                { emoji: "⏰", title: "Falta de tempo", desc: "Rotina agitada." },
                { emoji: "😬", title: "Autocontrole", desc: "Dificuldade em resistir a tentações alimentares." },
                { emoji: "💸", title: "Financeiro", desc: "Achar opções saudáveis mais caras do que alimentos processados." },
              ].map(opt => (
                <div key={opt.title} onClick={() => handleSingleSelect('obstacle', opt.title)} className="p-4 border-2 border-gray-200 rounded-xl hover:border-brand-green hover:bg-green-50 cursor-pointer flex items-center">
                   <span className="text-3xl mr-4">{opt.emoji}</span>
                   <div>
                     <div className="font-bold text-lg">{opt.title}</div>
                     <div className="text-sm text-gray-600 leading-tight">{opt.desc}</div>
                   </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 14: // Sleep Solution
        return (
           <div className="space-y-6 text-center">
             <h2 className="text-xl font-bold text-brand-darkGreen">Te entendemos!</h2>
             <p className="text-lg">CHÁ SECA BARRIGA 21D age enquanto você dorme, queimando gordura de forma acelerada!</p>
             <img src="https://i.imgur.com/BV4smNJ.jpeg" alt="Sono Reparador" className="w-full rounded-2xl shadow-lg" />
             <Button fullWidth onClick={nextStep}>Continuar</Button>
           </div>
        );

      case 15: // Benefits
        return (
           <div className="space-y-6">
            <h2 className="text-xl font-bold text-center">{answers.name}, quais desses benefícios gostaria de ter?</h2>
            <p className="text-center text-gray-600">Vamos personalizar a sua fórmula para maximizar seus resultados.</p>
            <div className="space-y-3">
              {[
                "Sono mais profundo",
                "Menos dores e inflamações",
                "Mais energia e disposição ao longo do dia",
                "Redução do estresse e ansiedade",
                "Aumento da autoestima e confiança",
                "Proteção contra doenças metabólicas",
                "Emagrecer sem esforço e sem efeito sanfona"
              ].map(opt => (
                <div key={opt} 
                  onClick={() => handleMultiSelect('benefits', opt)}
                  className={`p-4 rounded-xl border-2 cursor-pointer flex items-center justify-between transition-all ${answers.benefits.includes(opt) ? 'border-brand-green bg-green-50' : 'border-gray-200 hover:border-brand-green'}`}
                >
                  <span className="font-medium text-sm">{opt}</span>
                  {answers.benefits.includes(opt) && <Check className="text-brand-green flex-shrink-0 ml-2" />}
                </div>
              ))}
            </div>
            <Button fullWidth onClick={nextStep} disabled={answers.benefits.length === 0}>Continuar</Button>
          </div>
        );

      case 16: // Carousel Stories (Fixed single story)
        return (
           <div className="space-y-6">
             <h2 className="text-xl font-bold text-center text-brand-darkGreen">Histórias Reais de Transformação!</h2>
             
             <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 text-center">
                <img src="https://i.imgur.com/ipOh27y.jpg" className="w-full rounded-xl mb-4 shadow-sm" alt="Transformação Real" />
                
                <div className="flex justify-center text-yellow-400 mb-4">
                   {[1,2,3,4,5].map(i => <Star key={i} fill="currentColor" size={24} />)}
                </div>

                <div className="bg-green-50 p-4 rounded-xl relative">
                  <span className="absolute top-0 left-2 text-4xl text-green-200 font-serif">"</span>
                  <p className="text-gray-700 italic relative z-10 text-sm md:text-base leading-relaxed">
                    "Sempre fui cética com chás, mas estava desesperada. Comecei a tomar sem muita fé, mas na primeira semana desinchei muito! O sono melhorou, a ansiedade diminuiu e as roupas começaram a folgar. Foram 9kg eliminados de forma natural, sem passar fome. Hoje me olho no espelho com orgulho!"
                  </p>
                  <span className="absolute bottom-0 right-2 text-4xl text-green-200 font-serif leading-3">"</span>
                </div>
             </div>

             <Button fullWidth onClick={nextStep}>Continuar</Button>
           </div>
        );

      case 17: // Current Weight
        return (
           <div className="space-y-6">
             <h2 className="text-xl font-bold text-center">Qual é o seu peso atual?</h2>
             <p className="text-center text-gray-600">Estamos quase lá! Vamos ajustar seu plano de acordo com seu corpo.</p>
             <div className="relative">
               <input 
                type="number" 
                placeholder="Ex: 75.5"
                max="200"
                className="w-full p-4 border-2 border-gray-300 rounded-xl focus:border-brand-green focus:outline-none text-2xl text-center font-bold"
                value={answers.currentWeight}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === '' || parseFloat(val) <= 200) {
                    updateAnswer('currentWeight', val);
                  }
                }}
               />
               <span className="absolute right-8 top-1/2 transform -translate-y-1/2 text-gray-400 font-bold">KG</span>
             </div>
             <Button fullWidth onClick={nextStep} disabled={!answers.currentWeight}>Continuar</Button>
             <p className="text-xs text-center text-gray-500">Baseado nisso, ajustaremos a dosagem ideal para os melhores resultados!</p>
           </div>
        );

      case 18: // Height
        return (
          <div className="space-y-6">
             <h2 className="text-xl font-bold text-center">Qual é a sua altura?</h2>
             <p className="text-center text-gray-600">Sua altura também influencia no metabolismo!</p>
             <div className="relative">
               <input 
                type="number" 
                placeholder="Ex: 165"
                max="200"
                className="w-full p-4 border-2 border-gray-300 rounded-xl focus:border-brand-green focus:outline-none text-2xl text-center font-bold"
                value={answers.height}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === '' || parseFloat(val) <= 200) {
                    updateAnswer('height', val);
                  }
                }}
               />
               <span className="absolute right-8 top-1/2 transform -translate-y-1/2 text-gray-400 font-bold">CM</span>
             </div>
             <Button fullWidth onClick={nextStep} disabled={!answers.height}>Continuar</Button>
             <p className="text-xs text-center text-gray-500">Isso nos ajudará a calcular a quantidade exata dos Chás Bariátricos para seu corpo.</p>
           </div>
        );

      case 19: // Desired Weight
        return (
           <div className="space-y-6">
             <h2 className="text-xl font-bold text-center">Qual é o seu peso desejado?</h2>
             <p className="text-center text-gray-600">Estamos quase lá! Vamos ajustar seu plano de acordo com seu corpo.</p>
             <div className="relative">
               <input 
                type="number" 
                placeholder="Ex: 48"
                max="200"
                className="w-full p-4 border-2 border-gray-300 rounded-xl focus:border-brand-green focus:outline-none text-2xl text-center font-bold"
                value={answers.desiredWeight}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === '' || parseFloat(val) <= 200) {
                    updateAnswer('desiredWeight', val);
                  }
                }}
               />
               <span className="absolute right-8 top-1/2 transform -translate-y-1/2 text-gray-400 font-bold">KG</span>
             </div>
             <Button fullWidth onClick={nextStep} disabled={!answers.desiredWeight}>Continuar</Button>
             <p className="text-xs text-center text-gray-500">Baseado nisso, ajustaremos a dosagem ideal para os melhores resultados!</p>
           </div>
        );

      case 20: // Warning / BMI / Graph
        const bmi = parseFloat(calculateBMI() as string);
        const bmiStatus = getBMIStatus(bmi);
        const startW = parseFloat(answers.currentWeight);
        // Graph data: Start, Week 1 (-5), Week 2 (-10), Week 3 (-15)
        const data = [
          { name: 'Início', weight: startW },
          { name: 'Semana 1', weight: startW - 5 },
          { name: 'Semana 2', weight: startW - 9 },
          { name: 'Semana 3', weight: startW - 15 },
        ];

        return (
          <div className="space-y-6">
            <div className="bg-red-50 border-2 border-red-500 p-4 rounded-xl text-center animate-pulse">
              <h3 className="text-red-600 font-extrabold text-lg uppercase flex items-center justify-center gap-2">
                <AlertTriangle /> ATENÇÃO, {answers.name} !
              </h3>
              <p className="text-red-800 font-medium mt-2">
                Pelas suas respostas, seu corpo tá no modo ACÚMULO DE GORDURA. Se não agir HOJE, essa situação tende a PIORAR.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 text-center">
              <p className="text-gray-500 uppercase text-xs font-bold tracking-wider">Índice de massa corporal (IMC)</p>
              <div className="text-5xl font-black text-brand-darkGreen my-2">{bmi}</div>
              <div className="inline-block px-4 py-1 bg-gray-100 rounded-full font-bold text-sm text-gray-700">{bmiStatus}</div>
              <p className="mt-4 text-sm text-red-500 font-semibold">
                {bmi > 25 ? "Seu IMC indica que você precisa de atenção imediata para evitar complicações metabólicas." : "Mesmo dentro da faixa, seus sintomas indicam acúmulo de toxinas."}
              </p>
            </div>

            <div className="space-y-4 text-gray-800">
              <h3 className="font-bold text-lg text-center">Seu metabolismo pode estar te sabotando sem que você perceba!</h3>
              <p className="text-sm">Mesmo estando no peso normal, seu corpo pode estar retendo toxinas e trabalhando de forma mais lenta, dificultando a queima de gordura e deixando você com menos energia.</p>
              
              <div className="bg-red-50 p-4 rounded-lg space-y-2">
                 <p className="font-bold text-red-700">🚨 Alguns sinais de alerta:</p>
                 <ul className="space-y-2 text-sm text-red-900">
                   <li className="flex items-start gap-2">❌ Metabolismo lento e dificuldade para emagrecer mesmo comendo pouco.</li>
                   <li className="flex items-start gap-2">❌ Cansaço constante e sensação de inchaço.</li>
                   <li className="flex items-start gap-2">❌ Acúmulo de gordura em áreas específicas do corpo, principalmente na barriga.</li>
                 </ul>
              </div>

              <div className="bg-green-50 p-4 rounded-lg space-y-2 border border-brand-green">
                 <p className="font-bold text-brand-darkGreen">💡 Com os chás bariátricos, seu corpo acelera a queima de gordura naturalmente!</p>
                 <p className="text-sm text-brand-green">A combinação ideal de ingredientes pode ativar seu metabolismo, reduzir a retenção de líquidos e aumentar sua disposição.</p>
              </div>

              <h3 className="font-bold text-lg text-center text-brand-darkGreen">🔽 Descubra agora como o Chá SECA BARRIGA 21D pode transformar seu corpo!</h3>
              <p className="text-center font-semibold">Você pode perder de 9KG a 15KG em 3 semanas com os Chás ideais!</p>

              {/* GRAPH */}
              <div className="h-64 w-full bg-white rounded-xl shadow-inner p-2 border border-gray-200">
                 <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" tick={{fontSize: 10}} />
                      <YAxis domain={['auto', 'auto']} />
                      <Tooltip />
                      <Area type="monotone" dataKey="weight" stroke="#4CAF50" fill="#E8F5E9" strokeWidth={3} />
                    </AreaChart>
                 </ResponsiveContainer>
              </div>
            </div>

            <Button fullWidth onClick={nextStep}>Continuar</Button>
          </div>
        );

      case 21: // Routine
        return (
          <div className="space-y-6">
             <h2 className="text-xl font-bold text-center">Como é a sua rotina diária?</h2>
             <p className="text-center text-gray-600">Vamos personalizar seu plano conforme sua Rotina diária</p>
             <div className="space-y-3">
              {[
                { emoji: "🤯", text: "Trabalho fora e tenho uma rotina agitada" },
                { emoji: "🤭", text: "Trabalho em casa e tenho uma rotina flexível" },
                { emoji: "👨‍👩‍👧", text: "Em casa cuidando da família" },
                { emoji: "😶", text: "Outro" }
              ].map(opt => (
                <Button key={opt.text} variant="outline" fullWidth onClick={() => handleSingleSelect('routine', opt.text)} className="justify-start text-left h-auto py-3">
                   <span className="mr-3 text-2xl">{opt.emoji}</span> <span className="text-sm">{opt.text}</span>
                </Button>
              ))}
            </div>
          </div>
        );

      case 22: // Sleep Hours
        return (
           <div className="space-y-6">
             <h2 className="text-xl font-bold text-center">Quantas horas de sono você costuma ter por noite?</h2>
             <p className="text-center text-gray-600">A qualidade do seu sono impacta diretamente no seu emagrecimento!</p>
             <div className="space-y-3">
              {["Menos de 5 horas", "Entre 5 e 7 horas", "Entre 7 e 9 horas", "Mais de 9 horas"].map(opt => (
                <Button key={opt} variant="outline" fullWidth onClick={() => handleSingleSelect('sleepHours', opt)} className="justify-start text-left h-auto py-3">
                   <span className="mr-3 text-xl">⏰</span> {opt}
                </Button>
              ))}
            </div>
          </div>
        );
      
      case 23: // Water
         return (
           <div className="space-y-6">
             <h2 className="text-xl font-bold text-center">Quantos copos de água você bebe por dia?</h2>
             <p className="text-center text-gray-600">Seu nível de hidratação também influencia na sua perda de peso.</p>
             <div className="space-y-3">
              {[
                { icon: "☕", text: "Apenas chá ou café" },
                { icon: "💧", text: "1-2 copos por dia" },
                { icon: "💧", text: "2-6 copos por dia" },
                { icon: "💧", text: "Mais de 6 copos" }
              ].map(opt => (
                <Button key={opt.text} variant="outline" fullWidth onClick={() => handleSingleSelect('waterIntake', opt.text)} className="justify-start text-left h-auto py-3">
                   <span className="mr-3 text-xl">{opt.icon}</span> {opt.text}
                </Button>
              ))}
            </div>
          </div>
        );

      case 24: // Fruits (Last Step)
         return (
           <div className="space-y-6">
             <h2 className="text-xl font-bold text-center">Qual dessas frutas você costuma preferir mais no seu dia a dia?</h2>
             <p className="text-center text-gray-600">Suas preferências alimentares também ajudam no processo!<br/>Escolha quantas quiser</p>
             <div className="grid grid-cols-2 gap-4">
              {[
                { name: "Melancia", icon: "🍉" },
                { name: "Uva", icon: "🍇" },
                { name: "Abacate", icon: "🥑" },
                { name: "Kiwi", icon: "🥝" },
                { name: "Pêssego", icon: "🍑" },
                { name: "Manga", icon: "🥭" }
              ].map(opt => (
                <div key={opt.name} 
                  onClick={() => handleMultiSelect('fruits', opt.name)}
                  className={`p-4 rounded-xl border-2 cursor-pointer flex flex-col items-center justify-center transition-all aspect-square shadow-sm ${answers.fruits.includes(opt.name) ? 'border-brand-green bg-green-50 font-bold text-brand-darkGreen' : 'border-gray-200 hover:border-brand-green'}`}
                >
                  <span className="text-6xl mb-2 drop-shadow-sm">{opt.icon}</span>
                  <span className="text-lg font-medium">{opt.name}</span>
                  {answers.fruits.includes(opt.name) && <Check size={20} className="mt-2 text-brand-green" />}
                </div>
              ))}
            </div>
            <Button fullWidth onClick={onComplete} disabled={answers.fruits.length === 0}>Continuar</Button>
          </div>
         );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen py-8 px-4 max-w-md mx-auto relative" ref={topRef}>
      <div className="flex justify-center mb-6">
        <img src="https://i.imgur.com/2VNjo2Q.png" alt="Logo" className="w-[100px] h-[100px] object-contain" />
      </div>

      {/* Progress Bar - Now Static/In-flow */}
      {step > 0 && step < 25 && (
        <div className="w-full bg-gray-200 h-2 rounded-full mb-8">
          <div 
            className="bg-brand-green h-2 rounded-full transition-all duration-300"
            style={{ width: `${(step / 24) * 100}%` }}
          />
        </div>
      )}

      <div className={`transition-opacity duration-500 ${step > 0 ? 'mt-4' : ''}`}>
        {renderStep()}
      </div>
    </div>
  );
};