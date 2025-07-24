import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import emailjs from '@emailjs/browser';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

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
        } catch (error) {
            console.error("Erro ao inicializar EmailJS:", error);
        }
    }, []);

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

    // Função para gerar o comprovante em PDF como base64
    const generatePdfAsBase64 = async (data) => {
        // Criar um elemento temporário para renderizar o comprovante
        const tempElement = document.createElement('div');
        tempElement.style.width = '800px'; // Largura fixa para melhor qualidade
        tempElement.style.padding = '20px';
        tempElement.style.position = 'absolute';
        tempElement.style.left = '-9999px';
        tempElement.style.background = 'white';
        tempElement.id = 'temp-pdf-container';
        
        // Adicionar o elemento ao body
        document.body.appendChild(tempElement);
        
        // Renderizar o conteúdo do comprovante
        tempElement.innerHTML = `
            <div style="text-align: center; margin-bottom: 20px;">
                <h2 style="font-size: 24px; font-weight: bold; margin-bottom: 12px;">EcoAdventure</h2>
                <h3 style="font-size: 20px; font-weight: bold;">Comprovante de Inscrição</h3>
            </div>
            
            <div style="margin-bottom: 20px;">
                <div style="margin-bottom: 8px;"><strong>Nome completo:</strong> ${data.nomeCompleto}</div>
                <div style="margin-bottom: 8px;"><strong>RG:</strong> ${data.rg || '-'}</div>
                <div style="margin-bottom: 8px;"><strong>CPF:</strong> ${data.cpf}</div>
                <div style="margin-bottom: 8px;"><strong>CEP:</strong> ${data.cep}</div>
                <div style="margin-bottom: 8px;"><strong>Endereço:</strong> ${data.endereco || '-'}</div>
                <div style="margin-bottom: 8px;"><strong>Bairro:</strong> ${data.bairro}</div>
                <div style="margin-bottom: 8px;"><strong>Número:</strong> ${data.numero}</div>
                <div style="margin-bottom: 8px;"><strong>Cidade (Reside):</strong> ${data.cidade}</div>
                <div style="margin-bottom: 8px;"><strong>Estado:</strong> ${data.estado}</div>
                <div style="margin-bottom: 8px;"><strong>E-mail:</strong> ${data.email}</div>
                <div style="margin-bottom: 8px;"><strong>Data Nascimento:</strong> ${formatDateToBrazilian(data.dataNascimento)}</div>
                <div style="margin-bottom: 8px;"><strong>Telefone:</strong> ${data.telefone}</div>
                <div style="margin-bottom: 8px;"><strong>WhatsApp:</strong> ${data.whatsapp || data.telefone}</div>
                <div style="margin-bottom: 8px;"><strong>Facebook:</strong> ${data.facebook || '-'}</div>
                <div style="margin-bottom: 8px;"><strong>Instagram:</strong> ${data.instagram || '-'}</div>
                <div style="margin-bottom: 8px;"><strong>Local onde trabalha:</strong> ${data.localTrabalho}</div>
                <div style="margin-bottom: 8px;"><strong>Profissão:</strong> ${data.profissao}</div>
                <div style="margin-bottom: 8px;"><strong>Cidade do curso:</strong> ${data.cidadeCurso}</div>
                
                <h4 style="font-size: 18px; font-weight: bold; margin-top: 16px; margin-bottom: 12px;">Cursos Selecionados:</h4>
                
                <div style="margin-bottom: 8px;">
                    <strong>APH - Atendimento pré hospitalar:</strong> 
                    ${data.cursoAPH ? '✓ Selecionado' : '- Não selecionado'}
                </div>
                
                <div style="margin-bottom: 8px;">
                    <strong>SBV - Suporte Básico de Vida:</strong> 
                    ${data.cursoSBV ? '✓ Selecionado' : '- Não selecionado'}
                </div>
                
                <div style="margin-bottom: 8px;">
                    <strong>APH-P - Atendimento Pré Hospitalar Pediátrico:</strong> 
                    ${data.cursoAPHP ? '✓ Selecionado' : '- Não selecionado'}
                </div>
                
                <div style="margin-bottom: 8px;">
                    <strong>RCU - Resgate em Conflitos Urbanos:</strong> 
                    ${data.cursoRCU ? '✓ Selecionado' : '- Não selecionado'}
                </div>
            </div>
            
            <div style="margin-top: 30px; padding-top: 16px; border-top: 1px solid #ccc; text-align: center;">
                <div style="font-size: 14px; color: #666;">
                    <p>Formulário gerado em: ${new Date().toLocaleDateString('pt-BR')}</p>
                    <p style="margin-top: 4px;">EcoAdventure Cursos e Treinamentos - Desde 2005</p>
                </div>
                
                <div style="margin-top: 24px; padding-top: 16px; border-top: 1px dashed #ccc;">
                    <p style="font-size: 14px; font-weight: 500;">
                        Assinatura do responsável: _______________________________________
                    </p>
                </div>
            </div>
        `;
        
        try {
            // Capturar o elemento como imagem
            const canvas = await html2canvas(tempElement, {
                scale: 2, // Qualidade melhor
                logging: false,
                useCORS: true,
                allowTaint: true,
                backgroundColor: '#ffffff'
            });
            
            // Criar o PDF
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            });
            
            const imgWidth = 210; // A4 width
            const imgHeight = canvas.height * imgWidth / canvas.width;
            
            pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, imgWidth, imgHeight);
            
            // Obter o PDF como base64
            const pdfBase64 = pdf.output('datauristring');
            
            // Limpar o elemento temporário
            document.body.removeChild(tempElement);
            
            return pdfBase64;
        } catch (error) {
            console.error('Erro ao gerar PDF:', error);
            document.body.removeChild(tempElement);
            return null;
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
            
            // Preparar parâmetros para o email - sem incluir o PDF como anexo
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
                
                // URLs adequadas para o ambiente atual (local ou produção)
                url_inscricao: viewUrl,
                url_impressao: printUrl,
                
                // URLs como texto para cópia manual
                texto_url_comprovante: viewUrl,
                texto_imprimir: printUrl,
                
                // Instrução clara para ambiente local
                instrucao_manual: `Se os links não funcionarem, por favor copie e cole este endereço no seu navegador: ${viewUrl}`,
                
                // Indicador de ambiente para ajustar o template
                ambiente: isLocalhost() ? 'local' : 'producao',
            };

            // Salvar dados localmente
            try {
                const registrationData = {
                    ...formData,
                    registrationId,
                    dateSubmitted: new Date().toISOString()
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
                setError(`Ocorreu um erro ao enviar o email: ${emailErr.text || emailErr.message}. A inscrição foi salva, mas o email não foi enviado.`);
                emailSuccess = false;
            }

            // Salvar dados para uso na UI
            const successState = {
                userData: formData,
                emailSent: emailSuccess,
                registrationId
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
                        <div><strong>Bairro:</strong> {userData.bairro}</div>
                        <div><strong>Número:</strong> {userData.numero}</div>
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