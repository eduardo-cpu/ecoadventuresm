import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import emailjs from '@emailjs/browser';
import firebaseStorageService from '../../services/firebaseStorageService';

const RegistrationForm = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successData, setSuccessData] = useState(null);
    const formRef = useRef();
    const pdfCompRef = useRef(null); // Ref para o elemento de comprovante PDF
    
    // Credenciais do EmailJS - definidas diretamente para resolver o problema
    const EMAIL_SERVICE_ID = 'service_iffpm2e';
    const EMAIL_TEMPLATE_ID = 'template_ku5znig';
    const EMAIL_PUBLIC_KEY = 'fGkXHgwAvq3hGzaFV';
    
    const [formData, setFormData] = useState({
        nomeCompleto: '',
        rg: '',
        cpf: '',
        cep: '',
        endereco: '',
        bairro: '',
        numero: '',
        cidade: '',
        estado: '',
        email: '',
        dataNascimento: '',
        telefone: '',
        whatsapp: '',
        facebook: '',
        instagram: '',
        localTrabalho: '',
        profissao: '',
        cidadeCurso: '',
        cursoAPH: false,
        cursoSBV: false,
        cursoAPHP: false,
        cursoRCU: false
    });

    // Inicializar EmailJS com a chave pública
    useEffect(() => {
        try {
            console.log("Inicializando EmailJS com chave pública:", EMAIL_PUBLIC_KEY);
            emailjs.init(EMAIL_PUBLIC_KEY);
            console.log("EmailJS inicializado com sucesso!");
            
            // Limpar registros antigos (mais de 30 dias)
            cleanOldRegistrations();
        } catch (error) {
            console.error("Erro ao inicializar EmailJS:", error);
        }
    }, []);

    // Função para limpar registros antigos do localStorage
    const cleanOldRegistrations = () => {
        try {
            const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000); // 30 dias em ms
            
            Object.keys(localStorage).forEach(key => {
                if (key.startsWith('registration_backup_')) {
                    try {
                        const data = JSON.parse(localStorage.getItem(key));
                        const submissionDate = new Date(data.dateSubmitted).getTime();
                        
                        if (submissionDate < thirtyDaysAgo) {
                            localStorage.removeItem(key);
                            console.log(`Registro antigo removido: ${key}`);
                        }
                    } catch (e) {
                        // Se não conseguir analisar, remove
                        localStorage.removeItem(key);
                    }
                }
            });
        } catch (error) {
            console.warn("Erro ao limpar registros antigos:", error);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    // Função para detectar se estamos em ambiente local ou produção
    const isLocalhost = () => {
        return window.location.hostname === "localhost" || 
               window.location.hostname === "127.0.0.1";
    };

    // Função para gerar URLs compatíveis com o ambiente (local ou produção)
    const generateCompatibleUrl = (path) => {
        // Em desenvolvimento local, use HTTP
        if (isLocalhost()) {
            return `http://${window.location.host}${path}`;
        }
        
        // Em produção, use HTTPS
        return `https://${window.location.host}${path}`;
    };

    // Função para formatar data no padrão brasileiro
    const formatDateToBrazilian = (dateString) => {
        if (!dateString) return '-';
        
        // Se já está no formato brasileiro (DD/MM/AAAA), retorna como está
        if (dateString.includes('/')) return dateString;
        
        // Converte do formato ISO (AAAA-MM-DD) para brasileiro (DD/MM/AAAA)
        const date = new Date(dateString + 'T00:00:00');
        if (isNaN(date.getTime())) return dateString; // Se não conseguir converter, retorna original
        
        return date.toLocaleDateString('pt-BR');
    };

    // Função para gerar o comprovante em PDF e fazer upload para Firebase
    const generateAndUploadPdf = async (data, registrationId) => {
        try {
            console.log("Gerando PDF e fazendo upload para Firebase...");
            
            // Gerar PDF como blob
            const pdfBlob = await firebaseStorageService.generatePdfBlob(data);
            
            // Nome do arquivo
            const fileName = `Comprovante_${data.nomeCompleto.replace(/\s/g, '_')}_${registrationId}.pdf`;
            
            // Fazer upload para Firebase Storage
            const downloadURL = await firebaseStorageService.uploadPdf(pdfBlob, fileName, registrationId);
            
            console.log("PDF gerado e enviado para Firebase com sucesso!");
            return {
                downloadURL,
                fileName,
                fileSize: pdfBlob.size
            };
        } catch (error) {
            console.error('Erro ao gerar e fazer upload do PDF:', error);
            throw error;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccessData(null);

        try {
            // Criar ID único para a inscrição
            const registrationId = Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
            
            // Gerar URLs compatíveis com ambiente local ou produção
            const viewUrl = generateCompatibleUrl(`/registro-sucesso?id=${registrationId}`);
            const printUrl = generateCompatibleUrl(`/registro-sucesso?print=true&id=${registrationId}`);
            
            // Gerar PDF e fazer upload para Firebase Storage
            let pdfInfo = null;
            try {
                console.log("🔍 Verificando disponibilidade do Firebase Storage...");
                const storageAvailable = firebaseStorageService.isAvailable();
                console.log("📋 Storage disponível:", storageAvailable);
                
                if (storageAvailable) {
                    console.log("✅ Gerando PDF e fazendo upload para Firebase...");
                    pdfInfo = await generateAndUploadPdf(formData, registrationId);
                    console.log("✅ PDF enviado para Firebase com sucesso:", pdfInfo);
                } else {
                    console.warn("❌ Firebase Storage não configurado - PDF não será salvo na nuvem");
                }
            } catch (pdfError) {
                console.warn("❌ Erro ao gerar/enviar PDF para Firebase:", pdfError);
                // Continue sem o PDF se houver erro
            }

            // Preparar parâmetros para o email - incluindo link do PDF no Firebase
            const templateParams = {
                nomeCompleto: formData.nomeCompleto,
                rg: formData.rg || '-',
                cpf: formData.cpf,
                cep: formData.cep,
                endereco: formData.endereco || '-',
                bairro: formData.bairro,
                numero: formData.numero,
                cidade: formData.cidade,
                estado: formData.estado,
                email: formData.email,
                dataNascimento: formData.dataNascimento,
                telefone: formData.telefone,
                whatsapp: formData.whatsapp || formData.telefone,
                facebook: formData.facebook || '-',
                instagram: formData.instagram || '-',
                localTrabalho: formData.localTrabalho,
                profissao: formData.profissao,
                cidadeCurso: formData.cidadeCurso,
                cursoAPH: formData.cursoAPH ? '✓ Verificado' : '- Não selecionado',
                cursoSBV: formData.cursoSBV ? '✓ Verificado' : '- Não selecionado',
                cursoAPHP: formData.cursoAPHP ? '✓ Verificado' : '- Não selecionado',
                cursoRCU: formData.cursoRCU ? '✓ Verificado' : '- Não selecionado',
                data_inscricao: new Date().toLocaleDateString('pt-BR'),
                
                // URLs adequadas para o ambiente atual
                // Se o PDF foi gerado no Firebase, usar o link do PDF
                // Caso contrário, usar links para a página web
                url_inscricao: pdfInfo ? pdfInfo.downloadURL : viewUrl,
                url_impressao: pdfInfo ? pdfInfo.downloadURL : printUrl,
                
                // URLs da página web sempre disponíveis como alternativa
                url_pagina_web: viewUrl,
                url_impressao_web: printUrl,
                
                // URLs como texto para cópia manual
                texto_url_comprovante: pdfInfo ? pdfInfo.downloadURL : viewUrl,
                texto_imprimir: pdfInfo ? pdfInfo.downloadURL : printUrl,
                
                // Instrução atualizada
                instrucao_manual: pdfInfo 
                    ? `Para baixar seu comprovante em PDF, clique no link ou copie e cole: ${pdfInfo.downloadURL}`
                    : `Se os links não funcionarem, por favor copie e cole este endereço no seu navegador: ${viewUrl}`,
                
                // Indicador de ambiente para ajustar o template
                ambiente: isLocalhost() ? 'local' : 'producao',
                
                // Informações do PDF (sempre incluídas se disponível)
                ...(pdfInfo && { 
                    pdf_download_url: pdfInfo.downloadURL,
                    pdf_filename: pdfInfo.fileName,
                    pdf_disponivel: true,
                    pdf_message: `Seu comprovante em PDF está pronto para download!`
                }),
                
                // Se não tem PDF, indicar que só tem versão web
                ...(!pdfInfo && {
                    pdf_disponivel: false,
                    pdf_message: `Comprovante disponível na versão online`
                })
            };

            // Salvar dados localmente (incluindo informações do PDF)
            try {
                const registrationData = {
                    ...formData,
                    registrationId,
                    dateSubmitted: new Date().toISOString(),
                    pdfInfo: pdfInfo || null
                };
                sessionStorage.setItem(`registration_${registrationId}`, JSON.stringify(registrationData));
                localStorage.setItem(`registration_backup_${registrationId}`, JSON.stringify(registrationData));
                console.log("Dados salvos com ID:", registrationId);
            } catch (storageErr) {
                console.warn('Erro ao salvar dados localmente:', storageErr);
            }

            // Enviar email
            let emailSuccess = false;
            
            console.log("Tentando enviar email via EmailJS");
            try {
                // Tentar enviar o email usando as credenciais definidas no início do componente
                const result = await emailjs.send(
                    EMAIL_SERVICE_ID,
                    EMAIL_TEMPLATE_ID,
                    templateParams
                );
                
                console.log('Email enviado com sucesso:', result);
                emailSuccess = true;
            } catch (emailErr) {
                console.error('Erro ao enviar email:', emailErr);
                console.error('Detalhes do erro:', emailErr.text || emailErr.message);
                
                let errorMessage = `Ocorreu um erro ao enviar o email: ${emailErr.text || emailErr.message}.`;
                if (pdfInfo) {
                    errorMessage += ` Porém, seu comprovante está disponível em: ${pdfInfo.downloadURL}`;
                }
                setError(errorMessage);
                emailSuccess = false;
            }

            // Salvar dados para uso na UI
            const successState = {
                userData: formData,
                emailSent: emailSuccess,
                registrationId,
                pdfInfo: pdfInfo || null
            };
            
            setSuccessData(successState);

            // Redirecionar para página de sucesso
            navigate('/registro-sucesso', { state: successState });

        } catch (err) {
            console.error('Erro ao processar formulário:', err);
            setError('Houve um erro ao processar seu formulário. Por favor, tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    // Ir para o comprovante quando os dados existem
    const goToReceipt = () => {
        if (successData) {
            navigate('/registro-sucesso', { state: successData });
        }
    };

    // Componente oculto para geração de PDF
    const HiddenPdfComponent = () => {
        if (!successData || !successData.userData) return null;
        const userData = successData.userData;
        
        return (
            <div ref={pdfCompRef} style={{ position: 'absolute', left: '-9999px' }}>
                <div style={{ padding: '20px', backgroundColor: 'white', width: '800px' }}>
                    <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                        <h3 style={{ fontSize: '20px', fontWeight: 'bold' }}>Comprovante de Inscrição</h3>
                    </div>
                    
                    {/* Dados do usuário para o PDF */}
                    <div>
                        <div><strong>Nome completo:</strong> {userData.nomeCompleto}</div>
                        <div><strong>CPF:</strong> {userData.cpf}</div>
                        <div><strong>RG:</strong> {userData.rg}</div>
                        <div><strong>CEP:</strong> {userData.cep}</div>
                        <div><strong>Endereço:</strong> {userData.endereco || '-'}</div>
                        <div><strong>Número:</strong> {userData.numero}</div>
                        <div><strong>Bairro:</strong> {userData.bairro}</div>
                        <div><strong>Cidade (Reside):</strong> {userData.cidade}</div>
                        <div><strong>Estado:</strong> {userData.estado}</div>
                        <div><strong>E-mail:</strong> {userData.email}</div>
                        <div><strong>Data Nascimento:</strong> {formatDateToBrazilian(userData.dataNascimento)}</div>
                        <div><strong>Telefone:</strong> {userData.telefone}</div>
                        <div><strong>WhatsApp:</strong> {userData.whatsapp || userData.telefone}</div>
                        <div><strong>Facebook:</strong> {userData.facebook || '-'}</div>
                        <div><strong>Instagram:</strong> {userData.instagram || '-'}</div>
                        <div><strong>Local onde trabalha:</strong> {userData.localTrabalho}</div>
                        <div><strong>Profissão:</strong> {userData.profissao}</div>
                        <div><strong>Cidade do curso:</strong> {userData.cidadeCurso}</div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="max-w-4xl mx-auto py-4 px-3 sm:py-8 sm:px-4">
            <div className="bg-white shadow-lg rounded-lg p-4 sm:p-6 mb-8">
                <h2 className="text-xl sm:text-2xl font-bold mb-6 text-center text-gray-800">Formulário de Inscrição</h2>
                
                {error && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
                        <p>{error}</p>
                    </div>
                )}

                {successData ? (
                    <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 mb-6">
                        <h3 className="font-bold mb-2">Inscrição realizada com sucesso!</h3>
                        <p>Seus dados foram registrados com sucesso.</p>
                        
                        {successData.pdfInfo && (
                            <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded">
                                <p className="text-blue-800 mb-2">
                                    <strong>📄 Comprovante PDF disponível:</strong>
                                </p>
                                <a 
                                    href={successData.pdfInfo.downloadURL} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:text-blue-800 underline break-all text-sm"
                                >
                                    {successData.pdfInfo.fileName}
                                </a>
                            </div>
                        )}
                        
                        <div className="mt-4 flex flex-wrap gap-3">
                            <button 
                                onClick={goToReceipt}
                                className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 flex items-center"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                                </svg>
                                Ver e Imprimir Comprovante
                            </button>
                            
                            {successData.pdfInfo && (
                                <a 
                                    href={successData.pdfInfo.downloadURL} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="px-4 py-2 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 flex items-center"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    Baixar PDF
                                </a>
                            )}
                        </div>
                    </div>
                ) : (
                    <form ref={formRef} onSubmit={handleSubmit}>
                        <div className="space-y-8">
                            <div className="border-b pb-6">
                                <h3 className="text-lg font-semibold mb-4 text-gray-700">Informações Pessoais</h3>
                                
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-gray-700 font-medium mb-2">Nome Completo</label>
                                        <input
                                            type="text"
                                            name="nomeCompleto"
                                            value={formData.nomeCompleto}
                                            onChange={handleChange}
                                            className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                    
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-gray-700 font-medium mb-2">RG</label>
                                            <input
                                                type="text"
                                                name="rg"
                                                value={formData.rg}
                                                onChange={handleChange}
                                                className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        
                                        <div>
                                            <label className="block text-gray-700 font-medium mb-2">CPF</label>
                                            <input
                                                type="text"
                                                name="cpf"
                                                value={formData.cpf}
                                                onChange={handleChange}
                                                className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                required
                                            />
                                        </div>
                                    </div>
                                    
                                    {/* Campos de endereço */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-gray-700 font-medium mb-2">CEP</label>
                                            <input
                                                type="text"
                                                name="cep"
                                                value={formData.cep}
                                                onChange={handleChange}
                                                className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                required
                                            />
                                        </div>
                                        
                                        <div>
                                            <label className="block text-gray-700 font-medium mb-2">Bairro</label>
                                            <input
                                                type="text"
                                                name="bairro"
                                                value={formData.bairro}
                                                onChange={handleChange}
                                                className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-gray-700 font-medium mb-2">Endereço (Rua)</label>
                                        <input
                                            type="text"
                                            name="endereco"
                                            value={formData.endereco}
                                            onChange={handleChange}
                                            className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                    
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-gray-700 font-medium mb-2">Número</label>
                                            <input
                                                type="text"
                                                name="numero"
                                                value={formData.numero}
                                                onChange={handleChange}
                                                className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                required
                                            />
                                        </div>
                                        
                                        <div>
                                            <label className="block text-gray-700 font-medium mb-2">Cidade (Reside)</label>
                                            <input
                                                type="text"
                                                name="cidade"
                                                value={formData.cidade}
                                                onChange={handleChange}
                                                className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                required
                                            />
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-gray-700 font-medium mb-2">Estado</label>
                                            <input
                                                type="text"
                                                name="estado"
                                                value={formData.estado}
                                                onChange={handleChange}
                                                className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                required
                                            />
                                        </div>
                                        
                                        <div>
                                            <label className="block text-gray-700 font-medium mb-2">E-mail</label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                required
                                            />
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <label className="block text-gray-700 font-medium mb-2">Data de Nascimento</label>
                                        <input
                                            type="date"
                                            name="dataNascimento"
                                            value={formData.dataNascimento}
                                            onChange={handleChange}
                                            className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                            
                            <div className="border-b pb-6">
                                <h3 className="text-lg font-semibold mb-4 text-gray-700">Contato</h3>
                                
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-gray-700 font-medium mb-2">Telefone</label>
                                            <input
                                                type="text"
                                                name="telefone"
                                                value={formData.telefone}
                                                onChange={handleChange}
                                                className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                required
                                            />
                                        </div>
                                        
                                        <div>
                                            <label className="block text-gray-700 font-medium mb-2">WhatsApp</label>
                                            <input
                                                type="text"
                                                name="whatsapp"
                                                value={formData.whatsapp}
                                                onChange={handleChange}
                                                className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-gray-700 font-medium mb-2">Facebook</label>
                                            <input
                                                type="text"
                                                name="facebook"
                                                value={formData.facebook}
                                                onChange={handleChange}
                                                className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        
                                        <div>
                                            <label className="block text-gray-700 font-medium mb-2">Instagram</label>
                                            <input
                                                type="text"
                                                name="instagram"
                                                value={formData.instagram}
                                                onChange={handleChange}
                                                className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="border-b pb-6">
                                <h3 className="text-lg font-semibold mb-4 text-gray-700">Informações Profissionais</h3>
                                
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-gray-700 font-medium mb-2">Local onde Trabalha</label>
                                            <input
                                                type="text"
                                                name="localTrabalho"
                                                value={formData.localTrabalho}
                                                onChange={handleChange}
                                                className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                required
                                            />
                                        </div>
                                        
                                        <div>
                                            <label className="block text-gray-700 font-medium mb-2">Profissão</label>
                                            <input
                                                type="text"
                                                name="profissao"
                                                value={formData.profissao}
                                                onChange={handleChange}
                                                className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                required
                                            />
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <label className="block text-gray-700 font-medium mb-2">Cidade do Curso</label>
                                        <input
                                            type="text"
                                            name="cidadeCurso"
                                            value={formData.cidadeCurso}
                                            onChange={handleChange}
                                            className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                            
                            <div>
                                <h3 className="text-lg font-semibold mb-4 text-gray-700">Cursos Selecionados</h3>
                                
                                <div className="space-y-5">
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id="cursoAPH"
                                            name="cursoAPH"
                                            checked={formData.cursoAPH}
                                            onChange={handleChange}
                                            className="h-5 w-5 text-blue-600"
                                        />
                                        <label htmlFor="cursoAPH" className="ml-3 text-gray-700 flex items-center">
                                            APH - Atendimento pré hospitalar
                                            {formData.cursoAPH && <span className="ml-2 text-green-600 font-bold">✓</span>}
                                        </label>
                                    </div>
                                    
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id="cursoSBV"
                                            name="cursoSBV"
                                            checked={formData.cursoSBV}
                                            onChange={handleChange}
                                            className="h-5 w-5 text-blue-600"
                                        />
                                        <label htmlFor="cursoSBV" className="ml-3 text-gray-700 flex items-center">
                                            SBV - Suporte Básico de Vida
                                            {formData.cursoSBV && <span className="ml-2 text-green-600 font-bold">✓</span>}
                                        </label>
                                    </div>

                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id="cursoAPHP"
                                            name="cursoAPHP"
                                            checked={formData.cursoAPHP}
                                            onChange={handleChange}
                                            className="h-5 w-5 text-blue-600"
                                        />
                                        <label htmlFor="cursoAPHP" className="ml-3 text-gray-700 flex items-center">
                                            APH-P - Atendimento Pré Hospitalar Pediátrico
                                            {formData.cursoAPHP && <span className="ml-2 text-green-600 font-bold">✓</span>}
                                        </label>
                                    </div>

                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id="cursoRCU"
                                            name="cursoRCU"
                                            checked={formData.cursoRCU}
                                            onChange={handleChange}
                                            className="h-5 w-5 text-blue-600"
                                        />
                                        <label htmlFor="cursoRCU" className="ml-3 text-gray-700 flex items-center">
                                            RCU - Resgate em Conflitos Urbanos
                                            {formData.cursoRCU && <span className="ml-2 text-green-600 font-bold">✓</span>}
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="mt-8 flex justify-center">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Enviando...' : 'Enviar Inscrição'}
                            </button>
                        </div>
                    </form>
                )}
                
                {/* Componente oculto para geração de PDF */}
                <HiddenPdfComponent />
            </div>
        </div>
    );
};

export default RegistrationForm;