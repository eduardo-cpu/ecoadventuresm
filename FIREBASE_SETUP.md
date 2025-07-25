# Configuração do Firebase Storage

Este documento explica como configurar o Firebase Storage para armazenar os arquivos PDF dos comprovantes de inscrição.

## 1. Criando um Projeto no Firebase

1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Clique em "Criar projeto" ou use um projeto existente
3. Siga os passos de configuração do projeto

## 2. Habilitando o Firebase Storage

1. No painel do Firebase, vá para **Storage** no menu lateral
2. Clique em "Começar"
3. Escolha o modo de teste ou produção:

### Regras de Segurança (Modo Teste - para desenvolvimento)
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if true;
    }
  }
}
```

### Regras de Segurança (Modo Produção - recomendado)
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Permitir leitura de arquivos de registro
    match /registrations/{year}/{month}/{registrationId}/{fileName} {
      allow read: if true;
      allow write: if request.resource.size < 5 * 1024 * 1024 // 5MB max
                   && request.resource.contentType == 'application/pdf';
    }
  }
}
```

## 3. Obtendo as Credenciais

1. Vá para **Configurações do projeto** (ícone de engrenagem)
2. Na aba "Geral", role até "Seus apps"
3. Se não houver app web, clique em "</>" para criar um
4. Copie as configurações que aparecem no "Firebase SDK snippet"

## 4. Configurando no Projeto

1. Copie o arquivo `.env.example` para `.env`:
```bash
cp .env.example .env
```

2. Edite o arquivo `.env` e preencha com suas credenciais:
```bash
# Firebase Configuration
REACT_APP_FIREBASE_API_KEY=sua_api_key_aqui
REACT_APP_FIREBASE_AUTH_DOMAIN=seu_projeto.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=seu_projeto_id
REACT_APP_FIREBASE_STORAGE_BUCKET=seu_projeto.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
REACT_APP_FIREBASE_APP_ID=seu_app_id
```

## 5. Funcionalidades Implementadas

### Upload de PDF
- Os PDFs são organizados por data: `registrations/YYYY/MM/registrationId/arquivo.pdf`
- Cada arquivo tem metadados incluindo ID da inscrição e data de upload
- Links de download são gerados automaticamente

### Email com Link do PDF
- O EmailJS agora inclui o link do Firebase Storage no email
- Os usuários podem baixar o PDF diretamente do Firebase
- Fallback para visualização local se o Firebase não estiver configurado

### Limpeza Automática
- **Importante**: A limpeza de arquivos antigos deve ser implementada como Cloud Function
- O código atual apenas sugere esta implementação por questões de segurança

## 6. Exemplo de Cloud Function para Limpeza (Opcional)

Crie uma Cloud Function para limpar arquivos antigos:

```javascript
const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

exports.cleanOldRegistrations = functions.pubsub
  .schedule('0 2 * * 0') // Todo domingo às 2h
  .onRun(async (context) => {
    const bucket = admin.storage().bucket();
    const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
    
    const [files] = await bucket.getFiles({
      prefix: 'registrations/',
    });
    
    const deletePromises = files
      .filter(file => {
        const created = new Date(file.metadata.timeCreated);
        return created.getTime() < thirtyDaysAgo;
      })
      .map(file => file.delete());
    
    await Promise.all(deletePromises);
    console.log(`Removidos ${deletePromises.length} arquivos antigos`);
  });
```

## 7. Custos e Limites

### Firebase Storage (Plano Gratuito)
- **5 GB** de armazenamento
- **1 GB/dia** de transferência
- **20.000** operações por dia

### Estimativa para PDFs
- PDF médio: ~500KB
- Capacidade: ~10.000 PDFs
- Com limpeza automática de 30 dias: praticamente ilimitado para uso normal

## 8. Troubleshooting

### Erro: "Firebase Storage não configurado"
- Verifique se o arquivo `.env` existe e está preenchido
- Confirme que todas as variáveis `REACT_APP_FIREBASE_*` estão definidas

### Erro de permissão no upload
- Verifique as regras de segurança do Storage
- Confirme que o Storage está habilitado no projeto

### PDFs não aparecem no email
- Verifique o console do navegador para erros
- Confirme que o Firebase Storage está funcionando
- Teste o link gerado manualmente

## 9. Alternativas ao Firebase

Se não quiser usar Firebase, você pode:

1. **Usar outro provedor**: AWS S3, Google Cloud Storage, Azure Blob
2. **Servidor próprio**: Implementar endpoint para upload de arquivos
3. **Apenas email**: Voltar ao sistema de anexos do EmailJS (com limitações de tamanho)

## 10. Benefícios do Firebase Storage

✅ **Escalabilidade**: Cresce conforme necessário  
✅ **Segurança**: Regras granulares de acesso  
✅ **Integração**: Fácil integração com React  
✅ **CDN Global**: Entrega rápida em qualquer lugar  
✅ **Backup automático**: Google cuida da infraestrutura  
✅ **Sem limites de anexo**: Emails ficam leves  
✅ **Links permanentes**: URLs não expiram (configurável)  
