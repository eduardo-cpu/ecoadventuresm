# Atualização do Template EmailJS

Para incluir o link do PDF do Firebase no email, você precisa atualizar o template no EmailJS.

## Acessando o EmailJS

1. Acesse [EmailJS Dashboard](https://dashboard.emailjs.com/)
2. Faça login na sua conta
3. Vá para "Email Templates"
4. Edite o template `template_ku5znig`

## Variáveis Disponíveis

O código agora envia estas novas variáveis para o template:

### Informações do PDF (se disponível)
- `{{pdf_download_url}}` - URL de download do PDF no Firebase
- `{{pdf_filename}}` - Nome do arquivo PDF
- `{{pdf_message}}` - Mensagem formatada com o link

### Variáveis Existentes (mantidas)
- `{{nomeCompleto}}`, `{{email}}`, `{{telefone}}`, etc.
- `{{url_inscricao}}` - Link para visualizar online
- `{{url_impressao}}` - Link para impressão
- `{{data_inscricao}}` - Data da inscrição

## Exemplo de Template Atualizado

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Confirmação de Inscrição - EcoAdventure</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        
        <!-- Cabeçalho -->
        <div style="text-align: center; margin-bottom: 30px; border-bottom: 3px solid #0066cc; padding-bottom: 20px;">
            <h1 style="color: #0066cc; margin: 0;">EcoAdventure</h1>
            <h2 style="color: #333; margin: 10px 0 0 0;">Confirmação de Inscrição</h2>
            <p style="color: #666; margin: 5px 0 0 0;">Cursos e Treinamentos - Desde 2005</p>
        </div>

        <!-- Saudação -->
        <p>Olá <strong>{{nomeCompleto}}</strong>,</p>
        
        <p>Sua inscrição foi recebida com sucesso em <strong>{{data_inscricao}}</strong>!</p>

        <!-- Link do PDF (novo) -->
        {{#pdf_download_url}}
        <div style="background: #f0f8ff; border: 1px solid #0066cc; border-radius: 5px; padding: 15px; margin: 20px 0;">
            <h3 style="color: #0066cc; margin-top: 0;">📄 Seu Comprovante PDF</h3>
            <p>Seu comprovante está disponível para download:</p>
            <p style="margin: 10px 0;">
                <a href="{{pdf_download_url}}" 
                   style="background: #0066cc; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
                    📥 Baixar {{pdf_filename}}
                </a>
            </p>
            <p style="font-size: 12px; color: #666;">
                Este link estará disponível permanentemente. Salve-o para suas referências.
            </p>
        </div>
        {{/pdf_download_url}}

        <!-- Links Tradicionais -->
        <div style="background: #f9f9f9; border-radius: 5px; padding: 15px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">🔗 Links Úteis</h3>
            
            <p><strong>Visualizar comprovante online:</strong></p>
            <p><a href="{{url_inscricao}}" style="color: #0066cc;">{{url_inscricao}}</a></p>
            
            <p><strong>Versão para impressão:</strong></p>
            <p><a href="{{url_impressao}}" style="color: #0066cc;">{{url_impressao}}</a></p>
        </div>

        <!-- Dados da Inscrição (resumo) -->
        <div style="border-top: 1px solid #ddd; padding-top: 20px; margin-top: 30px;">
            <h3 style="color: #333;">📋 Resumo da Inscrição</h3>
            
            <p><strong>Nome:</strong> {{nomeCompleto}}</p>
            <p><strong>Email:</strong> {{email}}</p>
            <p><strong>Telefone:</strong> {{telefone}}</p>
            <p><strong>Cidade do curso:</strong> {{cidadeCurso}}</p>
            
            <h4 style="color: #0066cc;">Cursos Selecionados:</h4>
            <ul>
                <li>APH - Atendimento pré hospitalar: {{cursoAPH}}</li>
                <li>SBV - Suporte Básico de Vida: {{cursoSBV}}</li>
                <li>APH-P - Atendimento Pré Hospitalar Pediátrico: {{cursoAPHP}}</li>
                <li>RCU - Resgate em Conflitos Urbanos: {{cursoRCU}}</li>
            </ul>
        </div>

        <!-- Instruções -->
        <div style="background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 5px; padding: 15px; margin: 20px 0;">
            <h3 style="color: #856404; margin-top: 0;">ℹ️ Próximos Passos</h3>
            <ol style="color: #856404;">
                <li>Guarde este email para suas referências</li>
                <li>Baixe e imprima seu comprovante</li>
                <li>Aguarde contato com informações sobre datas e locais</li>
                <li>Em caso de dúvidas, entre em contato conosco</li>
            </ol>
        </div>

        <!-- Rodapé -->
        <div style="border-top: 1px solid #ddd; padding-top: 20px; margin-top: 30px; text-align: center; color: #666; font-size: 14px;">
            <p><strong>EcoAdventure Cursos e Treinamentos</strong></p>
            <p>Desde 2005 formando profissionais qualificados</p>
            <p>Email enviado automaticamente em {{data_inscricao}}</p>
        </div>

    </div>
</body>
</html>
```

## Observações Importantes

### 1. Condicionais no EmailJS
- Use `{{#variavel}}...{{/variavel}}` para mostrar conteúdo apenas quando a variável existe
- Use `{{^variavel}}...{{/variavel}}` para mostrar quando a variável NÃO existe

### 2. Fallback para Firebase não configurado
Se quiser mostrar algo quando o PDF não estiver disponível:

```html
{{^pdf_download_url}}
<div style="background: #fff3cd; padding: 15px; margin: 20px 0;">
    <p><strong>Comprovante:</strong> Use os links abaixo para visualizar e imprimir seu comprovante</p>
</div>
{{/pdf_download_url}}
```

### 3. Testando o Template
1. Salve as alterações no EmailJS
2. Teste uma inscrição no sistema
3. Verifique se o email recebido está correto
4. Teste tanto com Firebase configurado quanto sem configurar

### 4. CSS Inline
- Use CSS inline para compatibilidade com todos os clientes de email
- Evite CSS externo ou `<style>` tags
- Teste em diferentes clientes (Gmail, Outlook, etc.)

## Backup do Template Atual

Antes de fazer alterações, copie o template atual do EmailJS e salve como backup. Assim você pode restaurar se algo der errado.
