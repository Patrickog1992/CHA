import React, { useEffect, useState } from 'react';
import { Star } from 'lucide-react';

interface LoadingProps {
  onFinished: () => void;
}

export const Loading: React.FC<LoadingProps> = ({ onFinished }) => {
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("Iniciando análise do seu perfil...");
  const [testimonialIndex, setTestimonialIndex] = useState(0);

  const messages = [
    "Analisando seu metabolismo...",
    "Calculando necessidades calóricas...",
    "Identificando bloqueios de emagrecimento...",
    "Selecionando a combinação ideal de chás...",
    "Personalizando seu Método CARNAVAL BARRIGA SECA...",
    "Finalizando seu plano exclusivo..."
  ];

  const testimonials = [
    { name: "Mariana Costa", text: "Não acreditava que chá pudesse fazer tanta diferença. Perdi 4kg na primeira semana!", stars: 5 },
    { name: "Patrícia Lima", text: "Meu inchaço sumiu em 3 dias. Recomendo muito!", stars: 5 },
    { name: "Fernanda Souza", text: "Finalmente algo natural que funciona de verdade. Estou amando.", stars: 5 }
  ];

  // Preload Sales Page images during loading
  useEffect(() => {
    const imagesToPreload = [
      "https://i.imgur.com/CJxusNE.jpg", // Sales page before
      "https://i.imgur.com/ZODa9px.jpg", // Sales page after
      "https://i.imgur.com/ipOh27y.jpg", // Carousel
      "https://i.imgur.com/AJCfcXk.jpg", // Carousel
      "https://i.imgur.com/TAUXKtX.jpg"  // Carousel
    ];
    imagesToPreload.forEach(src => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          onFinished();
          return 100;
        }
        return prev + 1;
      });
    }, 80); // Total time approx 8 seconds

    return () => clearInterval(interval);
  }, [onFinished]);

  useEffect(() => {
    // Update message based on progress chunks
    const msgIndex = Math.floor((progress / 100) * messages.length);
    if (messages[msgIndex]) setMessage(messages[msgIndex]);

    // Rotate testimonials every 30%
    if (progress % 33 === 0 && progress > 0) {
      setTestimonialIndex(prev => (prev + 1) % testimonials.length);
    }
  }, [progress]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-white max-w-md mx-auto text-center space-y-8 overflow-hidden">
      
      <div className="relative w-full max-w-[200px] aspect-square mx-auto">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 192 192">
          <circle
            cx="96"
            cy="96"
            r="88"
            stroke="currentColor"
            strokeWidth="12"
            fill="transparent"
            className="text-gray-100"
          />
          <circle
            cx="96"
            cy="96"
            r="88"
            stroke="currentColor"
            strokeWidth="12"
            fill="transparent"
            strokeDasharray={2 * Math.PI * 88}
            strokeDashoffset={2 * Math.PI * 88 * (1 - progress / 100)}
            className="text-brand-green transition-all duration-300"
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-4xl font-bold text-brand-darkGreen">{progress}%</span>
        </div>
      </div>

      <div className="space-y-2 px-2">
        <h2 className="text-xl font-bold text-gray-800 animate-pulse">{message}</h2>
        <p className="text-gray-500 text-sm">Por favor, não feche esta página.</p>
      </div>

      <div className="bg-green-50 p-6 rounded-2xl shadow-sm border border-brand-green/20 w-full animate-fade-in">
        <div className="flex justify-center text-brand-gold mb-3">
          {[...Array(testimonials[testimonialIndex].stars)].map((_, i) => (
            <Star key={i} fill="currentColor" size={20} />
          ))}
        </div>
        <p className="italic text-gray-700 text-lg mb-3">"{testimonials[testimonialIndex].text}"</p>
        <p className="font-bold text-brand-darkGreen text-sm uppercase">- {testimonials[testimonialIndex].name}</p>
      </div>

      <div className="text-xs text-gray-400 mt-8">
        Preparando sua oferta exclusiva...
      </div>
    </div>
  );
};