import { storage } from './firebaseConfig';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

/**
 * Serviço para gerenciar arquivos no Firebase Storage
 */
class FirebaseStorageService {
    
    /**
     * Verifica se o Firebase Storage está disponível
     */
    isAvailable() {
        return storage !== null && storage !== undefined;
    }
    
    /**
     * Faz upload de um arquivo PDF para o Firebase Storage
     * @param {Blob} pdfBlob - Blob do arquivo PDF
     * @param {string} fileName - Nome do arquivo
     * @param {string} registrationId - ID da inscrição
     * @returns {Promise<string>} URL de download do arquivo
     */
    async uploadPdf(pdfBlob, fileName, registrationId) {
        if (!this.isAvailable()) {
            throw new Error('Firebase Storage não está configurado. Configure as variáveis de ambiente.');
        }
        
        try {
            // Criar referência do arquivo no Storage
            // Estrutura: registrations/YYYY/MM/registrationId/filename.pdf
            const currentDate = new Date();
            const year = currentDate.getFullYear();
            const month = String(currentDate.getMonth() + 1).padStart(2, '0');
            
            const storagePath = `registrations/${year}/${month}/${registrationId}/${fileName}`;
            const storageRef = ref(storage, storagePath);
            
            // Fazer upload do arquivo
            const snapshot = await uploadBytes(storageRef, pdfBlob, {
                contentType: 'application/pdf',
                customMetadata: {
                    'registrationId': registrationId,
                    'uploadDate': new Date().toISOString(),
                    'fileType': 'registration-receipt'
                }
            });
            
            // Obter URL de download
            const downloadURL = await getDownloadURL(snapshot.ref);
            
            return downloadURL;
        } catch (error) {
            console.error('Erro no upload do PDF:', error);
            throw new Error(`Falha no upload: ${error.message}`);
        }
    }
    
    /**
     * Deleta um arquivo do Firebase Storage
     * @param {string} downloadURL - URL de download do arquivo para deletar
     * @returns {Promise<boolean>} Sucesso da operação
     */
    async deleteFile(downloadURL) {
        try {
            // Extrair o path do arquivo da URL
            const url = new URL(downloadURL);
            const path = decodeURIComponent(url.pathname.split('/o/')[1].split('?')[0]);
            
            const fileRef = ref(storage, path);
            await deleteObject(fileRef);
            
            console.log('Arquivo deletado com sucesso:', path);
            return true;
        } catch (error) {
            console.warn('Erro ao deletar arquivo:', error);
            return false;
        }
    }
    
    /**
     * Gera um PDF blob a partir dos dados de inscrição com layout visual igual à página
     * @param {Object} formData - Dados do formulário
     * @returns {Promise<Blob>} Blob do PDF gerado
     */
    async generatePdfBlob(formData) {
        // Importar dinamicamente as bibliotecas
        const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
            import('html2canvas'),
            import('jspdf')
        ]);
        
        // Função para formatar data no padrão brasileiro
        const formatDateToBrazilian = (dateString) => {
            if (!dateString) return '-';
            if (dateString.includes('/')) return dateString;
            
            const date = new Date(dateString + 'T00:00:00');
            if (isNaN(date.getTime())) return dateString;
            
            return date.toLocaleDateString('pt-BR');
        };
        
        // Criar elemento temporário para renderizar o comprovante (otimizado para A5)
        const tempElement = document.createElement('div');
        tempElement.style.cssText = `
            width: 400px;
            padding: 15px;
            position: absolute;
            left: -9999px;
            background: white;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            line-height: 1.3;
            color: #333;
        `;
        
        // Renderizar o conteúdo do comprovante otimizado para A5
        tempElement.innerHTML = `
            <div style="background: white; padding: 12px; border-radius: 4px; border: 1px solid #e5e7eb;">
                
                <!-- Cabeçalho com logo e título -->
                <div style="text-align: center; margin-bottom: 12px; display: flex; flex-direction: column; align-items: center; justify-content: center;">
                    <img src="${window.location.origin}/image.png" alt="EcoAdventure Logo" style="height: 32px; margin-bottom: 4px; display: block; margin-left: auto; margin-right: auto;" crossorigin="anonymous">
                    <h3 style="color: #333; font-size: 14px; margin: 0; font-weight: bold; text-align: center;">Comprovante de Inscrição</h3>
                </div>

                <!-- Informações pessoais compactas -->
                <div style="margin-bottom: 12px;">
                    <div style="text-align: left; font-size: 11px; line-height: 1.3;">
                        
                        <div style="display: flex; margin-bottom: 2px;">
                            <span style="font-weight: 600; color: #333; width: 80px; display: inline-block;">Nome:</span>
                            <span style="color: #059669;">${formData.nomeCompleto}</span>
                        </div>
                        
                        <div style="display: flex; margin-bottom: 2px;">
                            <span style="font-weight: 600; color: #333; width: 80px; display: inline-block;">RG:</span>
                            <span>${formData.rg || '-'}</span>
                        </div>
                        
                        <div style="display: flex; margin-bottom: 2px;">
                            <span style="font-weight: 600; color: #333; width: 80px; display: inline-block;">CPF:</span>
                            <span>${formData.cpf}</span>
                        </div>
                        
                        <div style="display: flex; margin-bottom: 2px;">
                            <span style="font-weight: 600; color: #333; width: 80px; display: inline-block;">CEP:</span>
                            <span>${formData.cep}</span>
                        </div>
                        
                        <div style="display: flex; margin-bottom: 2px;">
                            <span style="font-weight: 600; color: #333; width: 80px; display: inline-block;">Endereço:</span>
                            <span>${formData.endereco || '-'}</span>
                        </div>

                        <div style="display: flex; margin-bottom: 2px;">
                            <span style="font-weight: 600; color: #333; width: 80px; display: inline-block;">Número:</span>
                            <span>${formData.numero}</span>
                        </div>

                        <div style="display: flex; margin-bottom: 2px;">
                            <span style="font-weight: 600; color: #333; width: 80px; display: inline-block;">Bairro:</span>
                            <span>${formData.bairro}</span>
                        </div>
                        
                        
                        
                        <div style="display: flex; margin-bottom: 2px;">
                            <span style="font-weight: 600; color: #333; width: 80px; display: inline-block;">Cidade:</span>
                            <span>${formData.cidade}</span>
                        </div>
                        
                        <div style="display: flex; margin-bottom: 2px;">
                            <span style="font-weight: 600; color: #333; width: 80px; display: inline-block;">Estado:</span>
                            <span>${formData.estado}</span>
                        </div>
                        
                        <div style="display: flex; margin-bottom: 2px;">
                            <span style="font-weight: 600; color: #333; width: 80px; display: inline-block;">Nascimento:</span>
                            <span>${formatDateToBrazilian(formData.dataNascimento)}</span>
                        </div>
                        
                        <div style="display: flex; margin-bottom: 2px;">
                            <span style="font-weight: 600; color: #333; width: 80px; display: inline-block;">E-mail:</span>
                            <span>${formData.email}</span>
                        </div>
                        
                        <div style="display: flex; margin-bottom: 2px;">
                            <span style="font-weight: 600; color: #333; width: 80px; display: inline-block;">Telefone:</span>
                            <span>${formData.telefone}</span>
                        </div>
                        
                        <div style="display: flex; margin-bottom: 2px;">
                            <span style="font-weight: 600; color: #333; width: 80px; display: inline-block;">WhatsApp:</span>
                            <span>${formData.whatsapp || '-'}</span>
                        </div>
                        
                        <div style="display: flex; margin-bottom: 2px;">
                            <span style="font-weight: 600; color: #333; width: 80px; display: inline-block;">Facebook:</span>
                            <span>${formData.facebook || '-'}</span>
                        </div>
                        
                        <div style="display: flex; margin-bottom: 2px;">
                            <span style="font-weight: 600; color: #333; width: 80px; display: inline-block;">Instagram:</span>
                            <span>${formData.instagram || '-'}</span>
                        </div>
                        
                        <div style="display: flex; margin-bottom: 2px;">
                            <span style="font-weight: 600; color: #333; width: 80px; display: inline-block;">Local trab.:</span>
                            <span>${formData.localTrabalho || '-'}</span>
                        </div>
                        
                        <div style="display: flex; margin-bottom: 2px;">
                            <span style="font-weight: 600; color: #333; width: 80px; display: inline-block;">Profissão:</span>
                            <span>${formData.profissao || '-'}</span>
                        </div>
                        
                        <div style="display: flex; margin-bottom: 2px;">
                            <span style="font-weight: 600; color: #333; width: 80px; display: inline-block;">Cid. curso:</span>
                            <span style="color: #059669;">${formData.cidadeCurso || '-'}</span>
                        </div>
                    </div>
                </div>
                
                <!-- Seção de Cursos -->
                <div style="margin-bottom: 10px; padding-top: 8px; border-top: 1px solid #e5e7eb;">
                    <h4 style="color: #333; font-size: 12px; margin: 0 0 4px 0; font-weight: 600;">Cursos:</h4>
                    
                    <div style="display: flex; margin-bottom: 2px;">
                        <span style="font-weight: 600; color: #333; width: 80px; display: inline-block; font-size: 11px;">APH:</span>
                        <span style="color: ${formData.cursoAPH ? '#059669' : '#666'}; font-size: 11px;">
                            ${formData.cursoAPH ? 'Sim' : 'Não'}
                        </span>
                    </div>
                    
                    <div style="display: flex; margin-bottom: 2px;">
                        <span style="font-weight: 600; color: #333; width: 80px; display: inline-block; font-size: 11px;">SBV:</span>
                        <span style="color: ${formData.cursoSBV ? '#059669' : '#666'}; font-size: 11px;">
                            ${formData.cursoSBV ? 'Sim' : 'Não'}
                        </span>
                    </div>
                    
                    <div style="display: flex; margin-bottom: 2px;">
                        <span style="font-weight: 600; color: #333; width: 80px; display: inline-block; font-size: 11px;">APH-P:</span>
                        <span style="color: ${formData.cursoAPHP ? '#059669' : '#666'}; font-size: 11px;">
                            ${formData.cursoAPHP ? 'Sim' : 'Não'}
                        </span>
                    </div>
                    
                    <div style="display: flex; margin-bottom: 2px;">
                        <span style="font-weight: 600; color: #333; width: 80px; display: inline-block; font-size: 11px;">RCU:</span>
                        <span style="color: ${formData.cursoRCU ? '#059669' : '#666'}; font-size: 11px;">
                            ${formData.cursoRCU ? 'Sim' : 'Não'}
                        </span>
                    </div>
                </div>
                
                <!-- Seções condicionais compactas -->
                ${formData.observacoes ? `
                <div style="margin-bottom: 8px; padding-top: 6px; border-top: 1px solid #e5e7eb;">
                    <h4 style="color: #333; font-size: 11px; margin: 0 0 3px 0; font-weight: 600;">Observações:</h4>
                    <p style="font-size: 10px; line-height: 1.3; margin: 0;">${formData.observacoes}</p>
                </div>
                ` : ''}
                
                ${formData.observacoesGerais ? `
                <div style="margin-bottom: 8px; padding-top: 6px; border-top: 1px solid #e5e7eb;">
                    <h4 style="color: #333; font-size: 11px; margin: 0 0 3px 0; font-weight: 600;">Observações Gerais:</h4>
                    <p style="font-size: 10px; line-height: 1.3; margin: 0;">${formData.observacoesGerais}</p>
                </div>
                ` : ''}
                
                <!-- Rodapé -->
                <div style="text-align: center; margin-top: 8px; padding-top: 4px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 10px;">
                    <p style="margin: 0;">
                        Gerado em: ${new Date().toLocaleDateString('pt-BR')}
                    </p>
                </div>
            </div>
        `;
        
        // Adicionar o elemento ao body
        document.body.appendChild(tempElement);
        
        try {
            // Capturar o elemento como imagem (configurado para A5)
            const canvas = await html2canvas(tempElement, {
                scale: 1.5,
                logging: false,
                useCORS: true,
                allowTaint: true,
                backgroundColor: '#ffffff',
                width: 400,
                height: tempElement.scrollHeight
            });
            
            // Criar o PDF em formato A5
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a5'
            });
            
            const imgWidth = 148; // A5 width (148mm)
            const imgHeight = canvas.height * imgWidth / canvas.width;
            
            // Verificar se precisa redimensionar para caber na altura A5 (210mm)
            const maxHeight = 210;
            if (imgHeight > maxHeight) {
                const scale = maxHeight / imgHeight;
                pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, imgWidth * scale, maxHeight);
            } else {
                pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, imgWidth, imgHeight);
            }
            
            // Converter para blob
            const pdfBlob = pdf.output('blob');
            
            // Limpar o elemento temporário
            document.body.removeChild(tempElement);
            
            return pdfBlob;
        } catch (error) {
            // Limpar o elemento temporário em caso de erro
            if (document.body.contains(tempElement)) {
                document.body.removeChild(tempElement);
            }
            throw error;
        }
    }
    
    /**
     * Limpa arquivos antigos automaticamente (30+ dias)
     * NOTA: Esta função seria melhor implementada como Cloud Function
     * @returns {Promise<number>} Número de arquivos removidos
     */
    async cleanOldFiles() {
        // Por questões de segurança e performance, a limpeza automática
        // deveria ser implementada como uma Cloud Function agendada
        // Esta é apenas uma implementação de exemplo
        console.log('Limpeza automática deve ser implementada como Cloud Function');
        return 0;
    }
}

const firebaseStorageService = new FirebaseStorageService();
export default firebaseStorageService;
