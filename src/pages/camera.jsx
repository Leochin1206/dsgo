import React, { useState, useEffect, useRef } from 'react';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import DeleteIcon from '@mui/icons-material/Delete';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import arena from "../assets/arenaPokemon.png";
import { NavPages } from "../components/navPages"; 

export function Camera() {
  const [gallery, setGallery] = useState([]);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Carregar galeria
  useEffect(() => {
    try {
      const storedGallery = localStorage.getItem('cameraGallery');
      if (storedGallery) {
        setGallery(JSON.parse(storedGallery));
      }
    } catch (error) {
      console.error("Erro ao carregar galeria:", error);
    }
  }, []);

  // Iniciar Câmera
  useEffect(() => {
    let currentStream = null;
    const iniciarCamera = async () => {
      try {
        const streamObj = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: "user" } 
        });
        currentStream = streamObj;
        if (videoRef.current) {
          videoRef.current.srcObject = streamObj;
        }
      } catch (error) {
        console.error("Erro ao acessar câmera:", error);
      }
    };

    iniciarCamera();

    return () => {
      if (currentStream) {
        currentStream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Tirar Foto
  const tirarFoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas || video.readyState < 4) return;

    const ctx = canvas.getContext("2d");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Espelhar
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    const image = canvas.toDataURL("image/png");
    const novaGaleria = [image, ...gallery];

    setGallery(novaGaleria);
    try {
      localStorage.setItem('cameraGallery', JSON.stringify(novaGaleria));
    } catch (e) {
      alert("Limite de armazenamento atingido!");
    }
  };

  // Limpar Tudo
  const limparGaleria = () => {
    if(confirm("Tem certeza que deseja apagar todas as fotos?")) {
        setGallery([]);
        localStorage.removeItem('cameraGallery');
    }
  };

  // Excluir foto única
  const excluirFoto = (indexParaRemover) => {
    const novaGaleria = gallery.filter((_, index) => index !== indexParaRemover);
    setGallery(novaGaleria);
    localStorage.setItem('cameraGallery', JSON.stringify(novaGaleria));
  };

  return (
    <main className="relative min-h-screen bg-black flex flex-col items-center p-8 pt-24">
      <img 
        src={arena} 
        alt="plano de fundo de arena pokemon" 
        aria-hidden="true" 
        className="absolute inset-0 w-full h-full object-cover z-0 blur-sm" 
      />

      <section className="relative z-10 w-full max-w-6xl flex flex-col items-center">
        <h1 className="text-5xl font-bold text-center text-white mb-10" style={{ textShadow: '2px 2px 4px #000000' }}>
          Registro de Evidências
        </h1>

        <div className="flex flex-row gap-8 w-full items-start justify-center">
            
            {/* BLOCO DA ESQUERDA: CÂMERA */}
            <div className="w-1/2 flex flex-col gap-4">
                <div className="p-6 bg-gray-900 bg-opacity-70 rounded-lg border-2 border-yellow-500 shadow-xl">
                    <h2 className="text-2xl font-bold text-white mb-4 text-center drop-shadow-md">
                        Câmera
                    </h2>
                    
                    {/* Área do Vídeo */}
                    <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden border-2 border-gray-600 mb-6">
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            muted
                            className="w-full h-full object-cover transform -scale-x-100"
                        />
                        <div className="absolute top-4 right-4 flex items-center gap-2 bg-black/60 px-3 py-1 rounded-full border border-white/20">
                            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                            <span className="text-xs text-white font-mono font-bold">REC</span>
                        </div>
                    </div>

                    <button
                        onClick={tirarFoto}
                        className="bg-linear-to-b from-[#00B4D8] to-[#0096C7] text-white p-3 text-lg w-full flex items-center justify-center gap-2 rounded-md hover:shadow-xl transition-all duration-200 hover:to-[#00B4D8] hover:from-[#0096C7] active:scale-95"
                    >
                        <PhotoCameraIcon />
                        Capturar Foto
                    </button>
                </div>
            </div>

            {/* BLOCO DA DIREITA: GALERIA */}
            <div className="w-1/2 flex flex-col gap-4">
                <div className="p-6 bg-gray-900 bg-opacity-70 rounded-lg border-2 border-yellow-500 shadow-xl min-h-[400px]">
                    <div className="flex justify-between items-center mb-6 border-b border-gray-600 pb-2">
                        <h2 className="text-2xl font-bold text-white drop-shadow-md">
                            Galeria ({gallery.length})
                        </h2>
                        {gallery.length > 0 && (
                            <button 
                                onClick={limparGaleria}
                                className="text-red-400 hover:text-red-300 text-sm font-medium flex items-center gap-1 transition-colors"
                            >
                                <DeleteIcon fontSize="small"/> Limpar
                            </button>
                        )}
                    </div>

                    <div className="flex flex-wrap justify-center gap-4 max-h-[500px] overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-yellow-500 scrollbar-track-gray-800">
                        {gallery.length === 0 ? (
                             <p className="text-white text-xl text-center mt-10 opacity-80">
                                Sua galeria está vazia. <br/> Tire algumas fotos para começar!
                            </p>
                        ) : (
                            gallery.map((imgSrc, index) => (
                                <div key={index} className="group relative flex flex-col items-center justify-center bg-white w-40 h-40 rounded-xl shadow p-2 transition-transform duration-300 hover:scale-105">
                                    <img
                                        src={imgSrc}
                                        alt={`Foto ${index}`}
                                        className="w-full h-full object-cover rounded-lg border border-gray-200"
                                    />
                                    
                                    {/* Overlay de Ações */}
                                    <div className="absolute inset-0 bg-black/80 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                        <a href={imgSrc} download={`foto-${index}.png`} className="text-white hover:text-blue-400 transition-colors">
                                            <FileDownloadIcon />
                                        </a>
                                        <button 
                                            onClick={() => excluirFoto(index)}
                                            className="text-white hover:text-red-500 transition-colors"
                                        >
                                            <DeleteIcon />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

        </div>

        <div className="mt-50 w-full">
             <NavPages />
        </div>
      </section>

      <canvas ref={canvasRef} className="hidden" />
    </main>
  );
}