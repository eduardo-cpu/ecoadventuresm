import React, { useRef, useEffect, useState } from 'react';
import { useLocation, useSearchParams, useNavigate } from 'react-router-dom';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const RegistroSucesso = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const printRef = useRef(null);
    const [isLoading, setIsLoading] = useState(true);
    const [loadedData, setLoadedData] = useState(null);
    const [savingPdf, setSavingPdf] = useState(false);
    const autoPrint = searchParams.get('print') === 'true';
    const registrationId = searchParams.get('id') || (location.state && location.state.registrationId);

    // Console log para depuração
    useEffect(() => {
        console.log("Página de Registro Sucesso carregada", { 
            hasState: !!location.state,
            hasUserData: !!(location.state && location.state.userData),
            registrationId,
            autoPrint
        });
    }, []);

    // Recuperar dados - prioriza dados da URL sobre os do state
    useEffect(() => {
        // Primeiro tentamos usar o state enviado pela navegação
        if (location.state && location.state.userData) {
            console.log("Dados encontrados no state da navegação:", location.state.userData);
            setLoadedData({
                userData: location.state.userData,
                emailSent: location.state.emailSent || false,
                registrationId: location.state.registrationId || registrationId
            });
            setIsLoading(false);
            return;
        }
        
        // Se não tem state, mas tem ID na URL, tentamos carregar do storage
        if (registrationId) {
            try {
                console.log("Tentando carregar dados do storage com ID:", registrationId);
                // Tente sessionStorage primeiro
                let storedData = sessionStorage.getItem(`registration_${registrationId}`);
                
                // Se não encontrar no sessionStorage, tente no localStorage
                if (!storedData) {
                    console.log("Dados não encontrados no sessionStorage, tentando localStorage");
                    storedData = localStorage.getItem(`registration_backup_${registrationId}`);
                }
                
                if (storedData) {
                    console.log("Dados encontrados no storage");
                    const parsedData = JSON.parse(storedData);
                    setLoadedData({
                        userData: parsedData,
                        emailSent: true, // Assume que veio do email
                        registrationId
                    });
                } else {
                    console.error("Não foi possível encontrar os dados de registro");
                }
            } catch (err) {
                console.error("Erro ao recuperar dados de registro:", err);
            }
        } else {
            console.warn("Nenhum ID de registro encontrado");
        }
        
        setIsLoading(false);
    }, [location.state, registrationId]);

    // Função melhorada para impressão direta
    const handlePrint = () => {
        console.log("Botão de impressão clicado");
        try {
            // Verificação dupla se os dados estão disponíveis
            if (!loadedData || !loadedData.userData) {
                console.error("Tentativa de impressão sem dados carregados");
                alert("Erro: Dados de inscrição não disponíveis para impressão");
                return;
            }
            
            if (!printRef.current) {
                console.error("Elemento de impressão não disponível");
                alert("Erro: Elemento de comprovante não disponível");
                return;
            }

            console.log("Executando impressão...");
            window.print();
            console.log("Comando de impressão enviado");
        } catch (error) {
            console.error("Erro ao tentar imprimir:", error);
            alert("Ocorreu um erro ao tentar imprimir. Por favor, tente novamente.");
        }
    };
    
    // Função para salvar como PDF
    const handleSavePDF = async () => {
        if (!printRef.current || !loadedData) {
            alert("Não foi possível gerar o PDF. Dados não disponíveis.");
            return;
        }

        setSavingPdf(true);

        try {
            const container = printRef.current;
            const canvas = await html2canvas(container, {
                scale: 2, // Melhor qualidade
                useCORS: true,
                logging: true,
                allowTaint: true
            });
            
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a5' // Alterado para A5
            });
            
            const imgWidth = 148; // A5 width in mm (148 x 210 mm)
            const imgHeight = canvas.height * imgWidth / canvas.width;
            
            pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
            
            const nomeArquivo = `Comprovante_${loadedData.userData.nomeCompleto.replace(/\s/g, '_')}_${new Date().toLocaleDateString().replace(/\//g, '-')}.pdf`;
            pdf.save(nomeArquivo);
            
            console.log("PDF salvo com sucesso");
        } catch (error) {
            console.error("Erro ao gerar PDF:", error);
            alert("Ocorreu um erro ao gerar o PDF. Por favor, tente novamente.");
        } finally {
            setSavingPdf(false);
        }
    };
    
    // Função para voltar à página inicial de forma segura
    const handleGoHome = () => {
        console.log("Botão de voltar clicado");
        try {
            navigate('/');
        } catch (error) {
            console.error("Erro ao navegar para home:", error);
            // Fallback para recarregar a página inicial
            window.location.href = '/';
        }
    };
    
    // Acionar impressão automática se solicitado via URL
    useEffect(() => {
        if (autoPrint && loadedData && !isLoading) {
            // Espera para garantir que o DOM está totalmente renderizado
            const timer = setTimeout(() => {
                console.log("Iniciando impressão automática...");
                handlePrint();
            }, 1500);
            
            return () => clearTimeout(timer);
        }
    }, [autoPrint, loadedData, isLoading]);

    // Estilo para impressão aplicado globalmente
    useEffect(() => {
        const style = document.createElement('style');
        style.innerHTML = `
            @media print {
                @page { 
                    size: 148mm 210mm; /* Tamanho A5 */
                    margin: 10mm;
                }
                body * {
                    visibility: hidden;
                }
                #print-container, #print-container * {
                    visibility: visible;
                }
                #print-container {
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 100%;
                    padding: 10mm;
                    max-width: 100%;
                    font-size: 10pt; /* Reduz o tamanho da fonte para A5 */
                }
                .no-print {
                    display: none !important;
                }
            }
        `;
        document.head.appendChild(style);
        
        return () => {
            document.head.removeChild(style);
        };
    }, []);

    // Carregando ou sem dados
    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                <p className="mt-4">Carregando dados...</p>
            </div>
        );
    }
    
    // Se não há dados do usuário
    if (!loadedData || !loadedData.userData) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
                <h2 className="text-2xl font-bold mb-4 text-red-600">Erro ao carregar dados</h2>
                <p className="mb-2">Não foi possível encontrar as informações do registro.</p>
                <p className="mb-8 text-gray-600">O link pode ter expirado ou os dados foram perdidos.</p>
                <button
                    onClick={handleGoHome}
                    className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700"
                >
                    Voltar para a página inicial
                </button>
            </div>
        );
    }

    const { userData, emailSent } = loadedData;

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-2xl">
                <div className="text-center mb-6 no-print">
                    <h2 className="text-2xl font-bold text-gray-800">Registro Concluído com Sucesso!</h2>
                    
                    {emailSent ? (
                        <p className="text-gray-600 mt-2">
                            Suas informações foram registradas e enviadas por e-mail.
                        </p>
                    ) : (
                        <div className="mt-2">
                            <p className="text-amber-600 font-medium">
                                Suas informações foram registradas, mas não foi possível enviar o e-mail.
                            </p>
                            <p className="text-gray-600 mt-1 text-sm">
                                Por favor, salve ou imprima esta página para guardar seus dados de inscrição.
                            </p>
                        </div>
                    )}
                </div>

                <div className="flex flex-wrap justify-center mb-6 gap-3 no-print">
                    <button
                        type="button"
                        onClick={handlePrint}
                        className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 flex items-center"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                        </svg>
                        Imprimir Comprovante
                    </button>

                    <button
                        type="button"
                        onClick={handleSavePDF}
                        disabled={savingPdf}
                        className="px-4 py-2 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 flex items-center disabled:bg-green-400"
                    >
                        {savingPdf ? (
                            <>
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                Salvando...
                            </>
                        ) : (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                                Salvar como PDF
                            </>
                        )}
                    </button>
                    
                    <button
                        type="button"
                        onClick={handleGoHome}
                        className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-100"
                    >
                        Voltar para a página inicial
                    </button>
                </div>

                {/* Área para impressão - Design aprimorado para garantir compatibilidade */}
                <div id="print-container" ref={printRef} className="border rounded-lg p-8 bg-white shadow-sm">
                    {/* Logo para documento impresso */}
                    <div className="text-center mb-6">
                        <img 
                            src="/image.png" 
                            alt="EcoAdventure Logo" 
                            className="h-16 mx-auto" 
                            crossOrigin="anonymous"
                        />
                        <h3 className="text-2xl font-bold mt-4">Comprovante de Inscrição</h3>
                    </div>
                    
                    <div className="space-y-2 text-left">
                        <div className="flex flex-wrap">
                            <span className="font-semibold w-48">Nome completo:</span>
                            <span className="text-green-700">{userData.nomeCompleto}</span>
                        </div>
                        
                        <div className="flex flex-wrap">
                            <span className="font-semibold w-48">RG:</span>
                            <span>{userData.rg || '-'}</span>
                        </div>
                        
                        <div className="flex flex-wrap">
                            <span className="font-semibold w-48">CPF:</span>
                            <span>{userData.cpf}</span>
                        </div>
                        
                        {/* Campos de endereço separados */}
                        <div className="flex flex-wrap">
                            <span className="font-semibold w-48">CEP:</span>
                            <span>{userData.cep}</span>
                        </div>
                        
                        <div className="flex flex-wrap">
                            <span className="font-semibold w-48">Bairro:</span>
                            <span>{userData.bairro}</span>
                        </div>
                        
                        <div className="flex flex-wrap">
                            <span className="font-semibold w-48">Número:</span>
                            <span>{userData.numero}</span>
                        </div>
                        
                        <div className="flex flex-wrap">
                            <span className="font-semibold w-48">Cidade (Reside):</span>
                            <span>{userData.cidade}</span>
                        </div>
                        
                        <div className="flex flex-wrap">
                            <span className="font-semibold w-48">Estado:</span>
                            <span>{userData.estado}</span>
                        </div>
                        
                        <div className="flex flex-wrap">
                            <span className="font-semibold w-48">E-mail:</span>
                            <span>{userData.email}</span>
                        </div>
                        
                        <div className="flex flex-wrap">
                            <span className="font-semibold w-48">Data Nascimento:</span>
                            <span>{userData.dataNascimento}</span>
                        </div>
                        
                        <div className="flex flex-wrap">
                            <span className="font-semibold w-48">Telefone:</span>
                            <span>{userData.telefone}</span>
                        </div>
                        
                        <div className="flex flex-wrap">
                            <span className="font-semibold w-48">WhatsApp:</span>
                            <span>{userData.whatsapp || userData.telefone}</span>
                        </div>
                        
                        <div className="flex flex-wrap">
                            <span className="font-semibold w-48">Facebook:</span>
                            <span>{userData.facebook || '-'}</span>
                        </div>
                        
                        <div className="flex flex-wrap">
                            <span className="font-semibold w-48">Instagram:</span>
                            <span>{userData.instagram || '-'}</span>
                        </div>
                        
                        <div className="flex flex-wrap">
                            <span className="font-semibold w-48">Local onde trabalha:</span>
                            <span>{userData.localTrabalho}</span>
                        </div>
                        
                        <div className="flex flex-wrap">
                            <span className="font-semibold w-48">Profissão:</span>
                            <span>{userData.profissao}</span>
                        </div>
                        
                        <div className="flex flex-wrap">
                            <span className="font-semibold w-48">Cidade do curso:</span>
                            <span className="text-green-700 font-medium">{userData.cidadeCurso}</span>
                        </div>
                        
                        <h4 className="font-semibold pt-4 pb-2 text-lg">Cursos Selecionados:</h4>
                        
                        {/* Mostra apenas os cursos selecionados */}
                        {userData.cursoAPH && (
                            <div className="flex flex-wrap">
                                <span className="font-semibold w-48">APH - Atendimento pré hospitalar:</span>
                                <span className="flex items-center">
                                    <span className="text-green-600 font-bold mr-1">✓</span> Selecionado
                                </span>
                            </div>
                        )}
                        
                        {userData.cursoSBV && (
                            <div className="flex flex-wrap">
                                <span className="font-semibold w-48">SBV - Suporte Básico de Vida:</span>
                                <span className="flex items-center">
                                    <span className="text-green-600 font-bold mr-1">✓</span> Selecionado
                                </span>
                            </div>
                        )}
                        
                        {userData.cursoAPHP && (
                            <div className="flex flex-wrap">
                                <span className="font-semibold w-48">APH-P - Atendimento Pré Hospitalar Pediátrico:</span>
                                <span className="flex items-center">
                                    <span className="text-green-600 font-bold mr-1">✓</span> Selecionado
                                </span>
                            </div>
                        )}
                        
                        {userData.cursoRCU && (
                            <div className="flex flex-wrap">
                                <span className="font-semibold w-48">RCU - Resgate em Conflitos Urbanos:</span>
                                <span className="flex items-center">
                                    <span className="text-green-600 font-bold mr-1">✓</span> Selecionado
                                </span>
                            </div>
                        )}
                    </div>
                    
                    <div className="mt-8 pt-4 border-t border-gray-200">
                        <div className="text-center text-sm text-gray-500">
                            <p>Formulário gerado em: {new Date().toLocaleDateString('pt-BR')}</p>
                            <p className="mt-1">EcoAdventure Cursos e Treinamentos - Desde 2005</p>
                        </div>
                        
                        {/* Assinatura do responsável removida para economizar espaço */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegistroSucesso;